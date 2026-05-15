# KRATOS Phase 0.8C — Auto Checkpoint Suggestion + Drift Recovery

**Date:** 2026-05-09 | **Last Fix:** 2026-05-12
**Status:** APROVADO — LIVE CONFIRMADO

## Summary

Phase 0.8C adds intelligent checkpoint suggestion to the KRATOS drift engine. The system now answers: "Before you lose the thread, save this point." Suggestions follow cooldown rules — no spam, no nag on every tab switch.

## What 0.8B → 0.8C Changed

0.8B answered "Lucas left focus." 0.8C follows with "Save a checkpoint before you lose the thread."

## 1. Suggestion Rules

| Drift State | Severity | Suggests Checkpoint? | Suggestion Severity |
|---|---|---|---|
| `on_focus` | none | No | — |
| `off_focus` | low (<5min) | No — nudge only | — |
| `off_focus` | medium (5-15min) | Yes | medium |
| `off_focus` | high (15+min) | Yes | high |
| `related` | — | Only if no checkpoint in 45+ min | low |
| `unknown` | — | Only if no checkpoint exists | low |

## 2. Cooldown Logic

Prevents spam. After a checkpoint is saved, the system enforces a cooldown window before suggesting again.

| Drift Severity | Cooldown Window |
|---|---|
| `high` | 10 min |
| `medium` | 15 min |
| `low` / `none` | 20 min |

Cooldown is tracked via the last checkpoint's `created_at` timestamp — no extra state, no DB writes.

## 3. Response Contract

### `/context/current` — new `checkpoint_suggestion` field

```json
{
  "checkpoint_suggestion": {
    "should_suggest": true,
    "severity": "medium",
    "reason": "Drift detectado há 10min. Sugiro salvar checkpoint antes de continuar.",
    "trigger": {
      "type": "off_focus",
      "minutes_out_of_focus": 10
    },
    "suggested_checkpoint": {
      "project": "kratos-mission-control",
      "mission": "Fase 0.8C",
      "where_i_stopped": "App: Firefox.exe, Janela: YouTube — Videos",
      "next_action": "Retomar foco em kratos-mission-control",
      "resume_hint": "Voltar para kratos-mission-control: App: Firefox.exe, Janela: YouTube — Videos",
      "confidence": 0.75
    },
    "cooldown": {
      "active": false,
      "remaining_minutes": 0
    }
  }
}
```

### `/mission/lens` — `data.checkpoint_suggestion`

Same structure, embedded in the mission lens contract under `data.checkpoint_suggestion`.

### `/live/snapshot`

Picks up `checkpoint_suggestion` automatically via both `context` and `mission_lens` sections.

## 4. Existing Endpoint Used

`POST /context/checkpoint` already exists from Phase 0.8B. No new endpoint was needed — the suggestion feeds into the existing flow. When frontend shows a suggestion and user clicks to save, it calls this existing endpoint.

## 5. Files Changed

| File | Change |
|---|---|
| `app/services/checkpoint_suggestion_service.py` | **NEW** — Pure function engine (243 lines) |
| `app/services/__init__.py` | **MODIFIED** — `get_context_current()` includes `checkpoint_suggestion`, `source`, `collector_status` |
| `app/services/mission_intelligence_service.py` | **MODIFIED** — `build_mission_lens_contract()` includes `checkpoint_suggestion` in data block |
| `tests/test_checkpoint_suggestion.py` | **NEW** — 27 tests |
| `tests/test_mentor.py` | **FIXED** — `test_rule_repo_dirty_recent` hardcoded date → dynamic |

### NOT Touched
- Lovable sandbox
- OMNIS project
- Frontend code
- Existing drift/checkpoint services
- Routes (no new endpoints needed)

## 6. Test Results

### Full Suite (2026-05-12)
```
296/296 passed — 0 failures
```
Run time: 1111s (~18.5 min).

### New Tests (test_checkpoint_suggestion.py — 27 tests)
- 8x unit: suggestion decisions (on_focus, off_focus low/medium/high, related, unknown)
- 6x unit: cooldown logic (active blocks, expired allows, high_severity shorter, no cp, invalid date)
- 2x unit: suggested_checkpoint payload shape and next_action inference
- 1x unit: exception safety
- 3x endpoint: /context/current integration
- 2x endpoint: /mission/lens integration
- 2x endpoint: /live/snapshot integrity
- 1x security: no sensitive data in suggestion
- 2x regression: 0.8B backward compat (drift + compat fields)
- 1x: contract — `source` field present in /context/current
- 1x: contract — `collector_status` field present in /context/current
- 1x: contract — full 0.8C field checklist

### Frontend Build
```
63 modules, 0 TypeScript errors, 272ms
```

## 7. Architecture Decisions

### Pure Function Design
`build_checkpoint_suggestion()` takes explicit inputs — no DB access, no side effects. Cooldown is derived from `last_checkpoint.created_at` passed as parameter.

### No New Endpoint
The existing `POST /context/checkpoint` handles checkpoint creation. The suggestion service is read-only — it only decides *whether* to suggest and *what* to suggest. The frontend calls the existing endpoint to save.

### Cooldown is Read-Only
Cooldown is calculated from the last checkpoint timestamp. No Redis, no in-memory state, no extra writes. If the user saves a checkpoint via any path (`POST /context/checkpoint`, `POST /checkpoints`, git commit), the next request automatically enters cooldown.

## 8. Risks

| Risk | Mitigation |
|---|---|
| Cooldown bypassed if user saves checkpoint outside KRATOS | Acceptable — worst case is an extra suggestion, not data loss |
| `get_checkpoints()` fails → suggestion uses no-checkpoint path | Falls back gracefully — suggests checkpoint when unknown + no cp |
| Frontend hasn't consumed `checkpoint_suggestion` yet | Fields are additive — existing consumers ignore unknown keys |

## 9. Fix Session 2026-05-12 — `collector_status` Gap

### Root Cause
`get_context_current()` was missing `collector_status` in the return dict. The `source` field was present only in the AW-online code path but missing in the AW-offline path. The mock fallback (`context_current.json`) had none of the 4 new fields.

### Changes
- **AW-offline path (L226-251):** Added `"source"` and `"collector_status"` to the augmented mock return
- **AW-online path (L322-340):** Added `"collector_status"` field alongside existing `"source"`
- **test_mentor.py:** Fixed `test_rule_repo_dirty_recent` — replaced hardcoded date `"2026-05-07T00:00:00Z"` with `datetime.now(timezone.utc).isoformat()` (had aged past the 3-day critical threshold)
- **Test contract:** Added 3 new assertions covering `source`, `collector_status`, and full field checklist

### Live Validation
`/context/current` on port 5101 confirmed all 4 fields present:
- `source: "real"` | `collector_status: "ok"` | `drift: {state, severity, ...}` | `checkpoint_suggestion: {should_suggest, suggested_checkpoint, cooldown}`

### Known Issue
Port 5100 has a phantom socket (PID 58776, process killed but LISTEN state stuck in Windows TCP stack). Requires reboot to clear. Backend currently serving on port 5101.

## 10. Next Steps

- **Restart backend** on port 5100 after reboot (or accept 5101)
- **Frontend binding** — wire `/contexto` and `/agora` to show suggestion CTA when `should_suggest: true`
- **0.9** — Start `aw-watcher-web` for browser URL capture
- **1.0** — Full redesign over live telemetry
