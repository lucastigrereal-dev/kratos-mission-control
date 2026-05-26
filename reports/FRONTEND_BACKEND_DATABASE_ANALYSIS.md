# KRATOS Frontend / Backend / Database Analysis

Generated: 2026-05-19

## 1. Frontend State

### Primary frontend candidates

| Path | Evidence | Interpretation |
|---|---|---|
| `src/` | TanStack routes, KRATOS shell, domain hooks, contract imports | Main current product frontend |
| `frontend/` | standalone Vite app, pages, hooks calling FastAPI directly | Secondary/legacy/parallel frontend |

The project needs an explicit authority decision.

## 2. Frontend Runtime Patterns

Observed patterns:

- `src/routes/*` uses `createFileRoute`.
- `src/hooks/*` uses React Query and contract types.
- `frontend/src/hooks/useApi.ts` uses `useState/useEffect` and direct fetch to `http://127.0.0.1:5100`.
- `frontend/src/hooks/useLiveKratos.ts` uses SSE and polling fallback.
- `src/hooks/useLiveStatus.ts` uses SSE to invalidate React Query.
- Some UI still references mock/placeholder states honestly.

## 3. Backend State

`backend/app/main.py` is the actual API mount point.

Backend facts:

- FastAPI application title: `KRATOS Mission Control`.
- Version observed: `0.11.0`.
- Phase observed: `0.11 - Operational Truth Verifier`.
- CORS allows local frontend ports `5173` and `8083`.
- Router count is broad enough to represent a real operational backend.

## 4. API Surface Categories

| Category | Endpoints |
|---|---|
| Core | `/`, `/health`, `/now` |
| Projects/tasks | `/projects`, `/projects/{id}`, `/tasks`, `/tasks/today`, `/tasks/overdue`, `/tasks/doing`, `/tasks/unfinished` |
| Checkpoints/context | `/checkpoints`, `/context/current`, `/context/lost`, `/context/project-guess`, `/context/checkpoint` |
| Live/mission | `/live/snapshot`, `/live/stream`, `/mission/current`, `/mission/lens` |
| Mentor | `/mentor/summary`, `/mentor/next-action`, `/mentor/signals`, `/mentor/focus`, `/mentor/mission-brief`, `/mentor/recommendations` |
| System | `/system`, `/docker`, `/git`, `/outputs`, `/snapshots` |
| Activity | `/activity`, `/tabs`, `/activitywatch/status`, `/activitywatch/buckets`, `/activity/windows`, `/activity/browser`, `/activity/sessions`, `/activity/context-switches` |
| Calendar/execution | `/calendar/*`, `/timeline`, `/execution/*`, `/deadlines/*`, `/deliverables/*`, `/reminders/*`, `/metrics/*` |
| Governance/safety | `/approvals`, `/continuity`, `/operational-truth` |
| External status | `/omnis/status`, `/omnis/summary` |

## 5. Database State

The runtime DB path:

```text
KRATOS_DB_PATH environment variable
  or
backend/data/kratos.db
```

Runtime DB settings:

- SQLite.
- WAL journal mode.
- foreign keys enabled.

Tables in inline runtime schema:

- projects
- missions
- checkpoints
- activity_events
- alerts
- tasks
- project_goals
- deliverables
- reminders
- unfinished_items
- omnis_snapshot
- collector_snapshots
- collector_runs
- alert_events
- metric_timeseries
- mentor_recommendations
- calendar_events
- execution_plans
- daily_plans
- weekly_plans
- deadline_rules
- activity_windows
- activity_sessions
- browser_contexts
- context_switches

## 6. Database Drift Matrix

| Area | Inline schema | Migration schema | Risk |
|---|---|---|---|
| projects name | `name` | `nome` | High |
| project description | `description` | `descricao` | High |
| repo field | `repo_path` | `repo` | Medium |
| checkpoint title | `name` | `titulo` | High |
| checkpoint progress | not same model | `progresso` | Medium |
| appointments | inline schema not shown in same form | migration defines table | Medium |
| services | migration defines | inline observed service health via other modules | Medium |

This must be fixed before persistence becomes the system backbone.

## 7. Frontend/Backend Contract Drift

| Topic | Current evidence | Risk |
|---|---|---|
| API base | direct `localhost:5100`, `127.0.0.1:5100`, `/api` | High |
| Backend type | docs mention Hono/Worker; code uses FastAPI | High |
| Envelope | documented but likely uneven | Medium |
| Source badges | concept implemented in types/UI | Medium |
| Mock fallback | present and sometimes honest | Low/medium |

## 8. Testing Inventory

Observed test categories:

- Backend tests under `backend/tests`.
- Contract tests under `tests/contracts`.
- Store tests under `tests/stores`.
- E2E tests under `tests/e2e`.

Important: tests were not executed in this documentation-only phase.

## 9. Recommended Contract Tests

Add or maintain tests for:

- Every FastAPI route returns valid envelope where required.
- Every collector error degrades without 500.
- `/live/snapshot` validates against `live.snapshot.schema.json`.
- `/omnis/*` has no mutation endpoints.
- SQLite bootstrap creates columns expected by services.
- Frontend source badges show `mock`, `fallback`, `cached`, `error`, and `real` distinctly.

