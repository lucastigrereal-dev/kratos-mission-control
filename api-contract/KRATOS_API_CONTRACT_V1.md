# KRATOS API CONTRACT V1

**Version:** 1.0 | **Date:** 2026-05-15 | **Base URL:** `http://localhost:5100`

---

## Envelope Pattern

All endpoints return the standard collector envelope:

```json
{
  "source": "real" | "fallback" | "cached" | "mock" | "error",
  "data": { ... },
  "meta": {
    "collector": "<name>",
    "latency_ms": 12,
    "cached_at": "ISO8601" | null
  }
}
```

## Collector Status Model

Each collector reports:
```json
{
  "collector": "<name>",
  "status": "healthy" | "degraded" | "offline" | "error",
  "source": "live" | "cached" | "fallback",
  "last_check": "ISO8601",
  "error": null | "message"
}
```

---

## Endpoints

### System & Health

| Field | Value |
|---|---|
| **Endpoint** | `GET /health` |
| **Objective** | System health check |
| **Frontend Consumer** | KratosTopHud (status dot), SourceBadge |
| **Schema** | `{"status":"ok","version":"0.8.0","phase":"0.8C","mode":"local-first","data_source":"live"}` |
| **Envelope** | Standard |
| **Fallback** | N/A (always available) |
| **Source** | live |
| **Collector** | health |
| **Error** | 500 if DB connection lost |
| **Test** | test_api.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /` |
| **Objective** | API index — lists all 55+ endpoints |
| **Frontend Consumer** | Dev/debug only |
| **Schema** | `{"name":"KRATOS Mission Control","version":"0.8.0","endpoints":[...]}` |
| **Envelope** | Raw (not wrapped) |
| **Fallback** | N/A |
| **Source** | live |
| **Test** | test_api.py |

---

### Live Telemetry

| Field | Value |
|---|---|
| **Endpoint** | `GET /live/snapshot` |
| **Objective** | Single aggregated operational snapshot (9 sections) |
| **Frontend Consumer** | Layout, AuroraPanel, MissionBar, KratosTopHud |
| **Schema** | `live.snapshot.schema.json` |
| **Envelope** | Standard, with caching header |
| **Fallback** | Cached snapshot if collectors fail |
| **Source** | live (collectors aggregated) |
| **Collector** | live_event_service |
| **Risk** | MEDIUM — depends on 6+ collectors |
| **Test** | test_live.py (~30 tests) |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /live/stream` |
| **Objective** | SSE stream of live events |
| **Frontend Consumer** | useLiveKratos hook |
| **Schema** | `live.stream.schema.md` |
| **Envelope** | SSE event stream (text/event-stream) |
| **Fallback** | Polling fallback to /live/snapshot |
| **Source** | live (async event bus) |
| **Collector** | live_event_service |
| **Risk** | MEDIUM — SSE connection can drop |
| **Test** | test_live.py |

---

### Mission & Context

| Field | Value |
|---|---|
| **Endpoint** | `GET /mission/current` |
| **Objective** | Current mission summary |
| **Frontend Consumer** | MissionBar, KratosTopHud |
| **Schema** | `{"current_project":"KRATOS Mission Control","phase":"0.10","status":"active"}` |
| **Envelope** | Standard |
| **Fallback** | Mock data from mock-data/ |
| **Test** | test_api.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /mission/lens` |
| **Objective** | Full mission lens: agenda, checkpoints, signals, alerts, context, next action |
| **Frontend Consumer** | AuroraPanel, MissionLensPage |
| **Schema** | 9 sections: mission_lens, today_agenda, recent_checkpoints, mentor_signals, alerts, context, next_best_action, today_execution, collector_status |
| **Envelope** | Standard |
| **Fallback** | Partial — sections degrade individually |
| **Risk** | MEDIUM — 9-section aggregation |
| **Test** | test_mentor.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /context/current` |
| **Objective** | Current operational context |
| **Frontend Consumer** | ContextoPage, AuroraPanel |
| **Schema** | Context object with project, focus, drift risk |
| **Fallback** | "Contexto indisponível" when ActivityWatch offline |
| **Collector** | activitywatch_collector |
| **Risk** | MEDIUM — depends on ActivityWatch |
| **Test** | test_api.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `POST /context/checkpoint` |
| **Objective** | Create a context checkpoint |
| **Frontend Consumer** | CheckpointSuggestionBanner |
| **Schema** | Request body with checkpoint data |
| **Envelope** | Standard |
| **Test** | test_checkpoint_suggestion.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /context/lost` |
| **Objective** | Detect context loss events |
| **Frontend Consumer** | ContextoPage |
| **Schema** | Array of context loss events |
| **Test** | test_api.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /context/project-guess` |
| **Objective** | Guess current project from context signals |
| **Frontend Consumer** | ContextoPage |
| **Schema** | `{"project":"<name>","confidence":0.85}` |
| **Test** | test_api.py |

---

### Mentor

| Field | Value |
|---|---|
| **Endpoint** | `GET /mentor/summary` |
| **Objective** | Mentor summary with signals |
| **Frontend Consumer** | AuroraPanel |
| **Envelope** | Standard |
| **Risk** | LOW |
| **Test** | test_mentor.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /mentor/next-action` |
| **Objective** | Recommended next action |
| **Frontend Consumer** | MissionBar, NextBestActionCard (P8) |
| **Envelope** | Standard |
| **Test** | test_mentor.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /mentor/signals` |
| **Objective** | Mentor signals (critical/warning/info/neutral) |
| **Frontend Consumer** | AuroraPanel (signal cards) |
| **Envelope** | Standard |
| **Test** | test_mentor.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /mentor/focus` |
| **Objective** | Focus state analysis |
| **Frontend Consumer** | AuroraPanel (focus indicator) |
| **Envelope** | Standard |
| **Test** | test_mentor.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /mentor/mission-brief` |
| **Objective** | Full mission briefing |
| **Frontend Consumer** | MissionLensPage |
| **Envelope** | Standard |
| **Test** | test_mentor.py |

---

### Tasks & Projects

| Field | Value |
|---|---|
| **Endpoint** | `GET /tasks`, `GET /tasks/today`, `GET /tasks/overdue`, `GET /tasks/doing`, `GET /tasks/unfinished` |
| **Objective** | Task CRUD with filtered views |
| **Frontend Consumer** | TarefasPage, MissionBar (progress) |
| **Method** | GET (list), POST (create), PATCH /{task_id} (update) |
| **Fallback** | Empty arrays |
| **Test** | test_api.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /projects`, `GET /projects/{project_id}` |
| **Objective** | Project listing and detail |
| **Frontend Consumer** | ProjetosPage |
| **Fallback** | mock-data/projects.json |
| **Test** | test_api.py |

---

### Alerts & Checkpoints

| Field | Value |
|---|---|
| **Endpoint** | `GET /alerts/active`, `GET /alerts/history`, `PATCH /alerts/{alert_id}` |
| **Objective** | Active alerts and alert history |
| **Frontend Consumer** | KratosTopHud (alert badge), SistemaPage |
| **Test** | test_api.py |

---

| Field | Value |
|---|---|
| **Endpoint** | `GET /checkpoints`, `POST /checkpoints` |
| **Objective** | Operational checkpoints (26 total) |
| **Frontend Consumer** | CheckpointsPage, CheckpointSuggestionBanner |
| **Test** | test_checkpoint_suggestion.py |

---

### OMNIS Bridge

| Field | Value |
|---|---|
| **Endpoint** | `GET /omnis/status`, `GET /omnis/summary` |
| **Objective** | OMNIS bridge health and summary |
| **Frontend Consumer** | OmnisPage |
| **Schema** | `collector-envelope.schema.json` |
| **Fallback** | Filesystem fallback via omnis_collector |
| **Collector** | omnis_collector (HTTP → filesystem) |
| **Risk** | LOW — dual-mode with fallback |
| **Test** | test_omnis_collector.py (12/12) |

---

### System Collectors

| Endpoint | Collector | Test | Notes |
|---|---|---|---|
| `GET /system` | system_collector | test_api.py | CPU, RAM, Disk live |
| `GET /docker` | docker_collector | test_api.py | Container status. OFFLINE without Docker. |
| `GET /git` | git_collector | test_api.py | Branch, commits, status |
| `GET /outputs` | outputs_collector | test_api.py | Output files listing |
| `GET /snapshots`, `GET /snapshots/{collector}` | snapshot_service | test_api.py | Collector snapshots |
| `GET /activity`, `/activity/windows`, `/activity/browser`, `/activity/sessions`, `/activity/context-switches` | activitywatch_collector | test_api.py | Activity tracking. OFFLINE without ActivityWatch. |

---

### Calendar & Timeline

| Endpoint | Method | Notes |
|---|---|---|
| `/calendar/today`, `/calendar/week`, `/calendar/month`, `/calendar/overdue`, `/calendar/upcoming` | GET | Calendar views |
| `/timeline` | GET | Execution timeline |
| `/execution/today`, `/execution/week` | GET | Execution plans |
| `/deadlines`, `/deadlines/overdue`, `/deadlines/upcoming`, `/deadlines/missing` | GET | Deadline tracking |
| `/deliverables`, `/deliverables/overdue` | GET | Deliverable tracking |

---

### Misc

| Endpoint | Notes |
|---|---|
| `GET /now` | Current moment snapshot |
| `GET /tabs`, `GET /activity/tabs` | Browser tab management |
| `GET /goals` | Goal tracking |
| `GET /reminders`, `GET /reminders/today` | Reminders |
| `GET /metrics/timeseries`, `GET /metrics/summary` | Time-series metrics |
| `GET /activitywatch/status`, `GET /activitywatch/buckets` | ActivityWatch raw data |

---

## Collector Health Summary

| Collector | Status | Dependency |
|---|---|---|
| health | healthy | None (built-in) |
| system | healthy | psutil |
| git | healthy | git CLI |
| omnis | healthy (HTTP) / degraded (fallback) | OMNIS backend or filesystem |
| docker | degraded | Docker Desktop |
| activitywatch | offline | ActivityWatch service |
| outputs | healthy | File system |

---

## Error Handling Convention

1. Collector unavailable → source: "fallback" with cached data
2. Catastrophic failure → source: "error" with null data
3. Timeout (5s) → source: "fallback" with stale data
4. Invalid response → source: "error" with validation error message
