# CAPABILITY EVIDENCE POLICY

**Date:** 2026-05-20
**Evidence Level:** CONFIRMED

## Evidence Levels

| Level | Meaning | Can Be Active? | Requires |
|-------|---------|----------------|----------|
| `CONFIRMED` | Verified by test, health check, or runtime audit | YES | At least one of: test file, health endpoint, verification command, audit report |
| `HYPOTHESIS` | Believed to exist but not yet verified | NO — candidate only | Description of expected behavior + planned verification path |
| `DOC_ONLY` | Documented but not yet implemented | NO — planned or candidate only | Source document reference |
| `UNKNOWN` | Existence uncertain | NO — must not be used in runtime | Nothing — this is the default for unscanned capabilities |

## Rules

1. **No capability with evidence level below CONFIRMED can be `active`.**
2. **Capability `candidate` with DOC_ONLY must have a verification plan.**
3. **Capability `planned` can be HYPOTHESIS — it's aspirational.**
4. **UNKNOWN capabilities must not appear in `depends_on` of any `active` capability.**
5. **CONFIRMED requires at least one concrete pointer:** file path, test, health endpoint, command, or report.
6. **Evidence decays:** CONFIRMED capabilities that haven't been re-verified in 90 days drop to HYPOTHESIS.

## Evidence Sources (Priority Order)

| Priority | Source | Example | Strength |
|----------|--------|---------|----------|
| 1 | Passing test | `tests/test_live.py` | Strongest — automated verification |
| 2 | Health endpoint | `/health/live` returns 200 | Strong — runtime confirmation |
| 3 | Verification command | `bun run test -- --grep live` | Strong — manual but reproducible |
| 4 | Audit report | `KRATOS_SPRINT_B_W29_FULL_REGRESSION_AUDIT.md` | Medium — human-verified snapshot |
| 5 | Source file | `backend/app/routes/live.py` | Weak — proves code exists, not that it works |
| 6 | Documentation | `docs/architecture/live-stream.md` | Weakest — words, not facts |

## Verification Cadence

| Capability Type | Re-verify Every | Rationale |
|-----------------|----------------|-----------|
| `route`, `service` | 30 days | Runtime surface changes frequently |
| `collector`, `adapter` | 30 days | External dependency risk |
| `agent`, `skill` | 60 days | Logic changes less frequently |
| `schema`, `command` | 90 days | Stable by nature |
| `memory_source`, `external` | 90 days | Slow-changing infrastructure |
| `script`, `repo_lego` | On use | Verifies when invoked |

## Evidence Labels in Capability Records

Every capability record MUST have `evidence.level` set. Every claim in capability descriptions SHOULD carry an evidence label inline:

```yaml
description: "Stream SSE de snapshots live para o KRATOS."  # CONFIRMED — test: tests/test_live.py
routes: ["/live/stream"]  # CONFIRMED — health: /health/live
events: ["live.snapshot"]  # CONFIRMED — source: backend/app/services/live_event_service.py
```
