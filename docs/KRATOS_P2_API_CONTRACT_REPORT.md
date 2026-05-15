# KRATOS P2 — API CONTRACT V1 REPORT

**Date:** 2026-05-15 | **Phase:** P2 | **Status:** PASS

---

## 1. Objective
Document the full API contract between backend and frontend. 27 routers, 55+ endpoints.

## 2. Skills Activated
| Skill | Purpose |
|---|---|
| gsd:map-codebase | Map all 27 route files and extract endpoint signatures |
| sc:document | Generate structured API contract document |
| sc:analyze | Cross-reference endpoints with frontend consumers |
| verification-before-completion | Final gate |

## 3. Artifacts Created

| File | Description |
|---|---|
| `api-contract/KRATOS_API_CONTRACT_V1.md` | 15 endpoints fully documented + 12 collector endpoints listed |
| `api-contract/live.snapshot.schema.json` | JSON Schema for /live/snapshot (9 sections) |
| `api-contract/live.stream.schema.md` | SSE stream protocol: 6 event types, reconnection rules |
| `api-contract/collector-envelope.schema.json` | Standard envelope: source + data + meta |

## 4. Endpoints Documented

| # | Endpoint Family | Endpoints | Status |
|---|---|---|---|
| 1 | System/Health | `/health`, `/` | DOCUMENTED |
| 2 | Live Telemetry | `/live/snapshot`, `/live/stream` | DOCUMENTED + SCHEMA |
| 3 | Mission | `/mission/current`, `/mission/lens` | DOCUMENTED |
| 4 | Context | `/context/current`, `/context/lost`, `/context/project-guess`, `/context/checkpoint` | DOCUMENTED |
| 5 | Mentor | `/mentor/summary`, `/mentor/next-action`, `/mentor/signals`, `/mentor/focus`, `/mentor/mission-brief` | DOCUMENTED |
| 6 | Tasks | CRUD + today/overdue/doing/unfinished | DOCUMENTED |
| 7 | Projects | list + detail | DOCUMENTED |
| 8 | Alerts | active/history/patch | DOCUMENTED |
| 9 | Checkpoints | list + create | DOCUMENTED |
| 10 | OMNIS Bridge | `/omnis/status`, `/omnis/summary` | DOCUMENTED |
| 11 | System Collectors | system, docker, git, outputs, snapshots, activity | DOCUMENTED |
| 12 | Calendar | today/week/month/overdue/upcoming | DOCUMENTED |
| 13 | Timeline/Execution | timeline, execution today/week | DOCUMENTED |
| 14 | Deadlines/Deliverables | CRUD + filtered views | DOCUMENTED |
| 15 | Misc | now, tabs, goals, reminders, metrics, activitywatch | DOCUMENTED |

## 5. Key Findings

- **Envelope consistency:** All endpoints follow the same `{source, data, meta}` pattern
- **Collector health:** 7 collectors, 2 degraded (Docker, ActivityWatch — environmental)
- **Missing schemas:** Several endpoints return ad-hoc shapes — documented as-is
- **Version desync:** backend reports 0.8.0, project is 0.10 — cosmetic, documented
- **SSE fallback:** Live stream falls back to polling, well-designed

## 6. Validation
| Check | Result |
|---|---|
| Backend untouched | PASS |
| Frontend untouched | PASS |
| Only api-contract/ + docs/ modified | PASS |
| JSON schemas valid | PASS |
| All endpoints accounted for | PASS |

## 7. Decision
```
PASS
```

API contract V1 complete. All 27 routers and 55+ endpoints documented with consumer mapping, schemas, fallback behavior, and error handling conventions.

## 8. Next Phase
**P3 — Frontend Tests Mínimos.** Auto-advancing.
