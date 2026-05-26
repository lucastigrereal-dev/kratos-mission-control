# KRATOS Mission Control - Phase 2 Engineering Dossier

Generated: 2026-05-19  
Scope: documentation-only forensic dossier  
Repository: `C:\Users\lucas\kratos-mission-control`  
Git branch observed: `main...origin/main [ahead 2]`  
Authorization boundary: report files only; no source code changes

## 1. Executive Verdict

KRATOS is no longer only a visual prototype. The repository contains a real local-first backend, a substantial frontend, API contracts, tests, governance documents, Claude agents, skills, and operational scripts for Akasha/Obsidian synchronization. The system is clearly converging toward a personal Mission Control cockpit whose central design rule is: KRATOS observes, Lucas decides, OMNIS executes, Akasha remembers, Aurora interprets.

The brutally honest status is mixed:

- The architectural intent is strong and unusually explicit.
- The backend has real FastAPI routers, collectors, services, SQLite persistence, SSE, and operational truth checks.
- The frontend exists in two parallel surfaces: `src/` TanStack-style shell and `frontend/` standalone Vite app. This duality is a major architecture risk.
- The documentation still contains historical contradictions: older docs describe Hono/Cloudflare as the backend authority, while the real backend currently mounted in `backend/app/main.py` is FastAPI on port 5100.
- Some frontend hooks call FastAPI directly via `http://localhost:5100` or `http://127.0.0.1:5100`, while other files still carry `/api/*` patterns and Cloudflare Worker assumptions.
- Akasha integration exists as scripts and architecture, but KRATOS UI remains mostly read/status/placeholder for Akasha rather than a fully integrated semantic memory cockpit.
- Governance is mature for a personal system, but enforcement is still partly documentary. The repo has rules, manifests, and safety docs; the next maturity step is automated verification gates.

## 2. Evidence Base

This dossier was generated from real files read in the repository, including:

- `CLAUDE.md`
- `AGENTS.md`
- `package.json`
- `backend/app/main.py`
- `backend/app/db/__init__.py`
- `backend/migrations/0001_initial.sql`
- `backend/migrations/0002_contexto_kv.sql`
- `api-contract/KRATOS_API_CONTRACT_V1.md`
- `api-contract/live.snapshot.schema.json`
- `api-contract/collector-envelope.schema.json`
- `docs/project-os/governance-constitution.md`
- `docs/project-os/boundary-map.md`
- `docs/project-os/agent-manifest.md`
- `docs/project-os/skill-manifest.md`
- `docs/architecture/KRATOS_OPERATING_MODEL.md`
- `docs/KRATOS_AKASHA_STATUS_HONESTO.md`
- `docs/KRATOS_OMNIS_BASE_URL_READONLY_CONTRACT.md`
- `scripts/ingest_obsidian_to_akasha.py`
- `scripts/build_obsidian_vault.py`
- `scripts/sync_orchestrator.py`
- `scripts/rag_pitch_generator.py`
- selected frontend hooks and runtime files under `src/` and `frontend/src/`

No `.env` or secret file was read.

## 3. System Identity

KRATOS is an operational cockpit, not an execution engine.

Canonical separation from project docs:

| Entity | Role | Boundary |
|---|---|---|
| KRATOS | Observes and composes operational state | Must not execute external actions |
| Aurora | Interprets, mentors, suggests | Should not pretend to execute |
| OMNIS/HOMINIS | Executes skills, crews, deploys, publishing | KRATOS reads it, never commands it |
| Akasha | Long-term memory, vector/document store | KRATOS can display status; scripts sync data |
| Codex/Claude | Builds and documents | Must obey repo governance |
| Lucas | Decides | Final human authority |

The architecture is valuable precisely because it does not try to collapse all roles into one universal agent. The main risk is that implementation drift can violate this separation silently.

## 4. Repository Shape

Primary directories:

| Path | Role | Status |
|---|---|---|
| `backend/app` | FastAPI app, routers, services, collectors | Real runtime layer |
| `backend/app/routes` | HTTP endpoint modules | Broad coverage |
| `backend/app/services` | Business logic, aggregation, mentor, continuity, live state | Real but still evolving |
| `backend/app/collectors` | System, git, docker, ActivityWatch, OMNIS, outputs collectors | Real/fallback hybrid |
| `backend/app/db` | SQLite connection and inline schema | Real persistence path |
| `backend/migrations` | D1/SQLite-style migration docs | Partially divergent from inline schema |
| `api-contract` | JSON schemas, TS schemas, API contract docs | Intended source of truth |
| `src` | Main KRATOS frontend shell/routes/components/hooks | Current primary frontend surface |
| `frontend` | Secondary standalone Vite frontend | Parallel surface; architectural risk |
| `.claude/agents` | Agent definitions | Governance-aware role split |
| `.claude/skills` | Skill definitions | Broad and partially duplicated |
| `docs/project-os` | Governance constitution, boundary, manifests | Canonical docs |
| `scripts` | Akasha/Obsidian/Notion/RAG orchestration | Real operational scripts |
| `tests` | Contract, store, e2e tests | Existing verification foundation |

## 5. Runtime Architecture

The effective local runtime has three major planes:

1. Frontend UI plane
   - React + TypeScript.
   - TanStack Router/Query in `src/`.
   - Standalone Vite app under `frontend/`.
   - Design tokens and KRATOS-specific components.

2. Backend observability plane
   - FastAPI application in `backend/app/main.py`.
   - Routers mounted for health, tasks, projects, alerts, checkpoints, live, calendar, context, mentor, mission, system, docker, git, OMNIS, outputs, ActivityWatch, deadlines, deliverables, reminders, metrics, snapshots, execution, approvals, continuity and operational truth.
   - CORS allows local frontend origins.

3. Memory/knowledge orchestration plane
   - Akasha PostgreSQL container expected as `akasha-postgres`.
   - Obsidian vault expected at `%USERPROFILE%\Documents\Obsidian`.
   - Ollama embeddings expected at `http://localhost:11434/api/embeddings`.
   - Notion sync is described but currently manual/config-dependent.

## 6. Backend Map

`backend/app/main.py` mounts a broad API:

- `/health`
- `/now`
- `/projects`
- `/system`
- `/docker`
- `/git`
- `/activity`
- `/tabs`
- `/checkpoints`
- `/timeline`
- `/outputs`
- `/alerts`
- `/omnis/status`
- `/omnis/summary`
- `/tasks`
- `/projects/{id}/goals`
- `/deliverables`
- `/reminders`
- `/mentor/*`
- `/snapshots`
- `/metrics/*`
- `/calendar/*`
- `/execution/*`
- `/deadlines/*`
- `/activitywatch/*`
- `/context/*`
- `/operational-truth`
- `/live/snapshot`
- `/live/stream`
- `/mission/current`
- `/mission/lens`

The backend is not minimal. It is already a local operations API.

### Backend Strengths

- Clear router modularization.
- Explicit collector/service split.
- SQLite WAL mode with `foreign_keys=ON`.
- Real CORS configuration for local dev ports.
- SSE endpoint exists.
- Operational truth verifier exists.
- Collector envelope convention is documented.

### Backend Weaknesses

- Inline schema in `backend/app/db/__init__.py` diverges from `backend/migrations/0001_initial.sql`.
- Some schema naming is English (`projects.name`) in inline schema and Portuguese (`projects.nome`) in migration.
- This is not just cosmetic. It implies at least two mental models for persistence.
- The root endpoint advertises version `0.11.0`, while API contract docs still mention older versions in places.
- The contract envelope is documented, but not every endpoint is guaranteed by inspection to return the same envelope shape.

## 7. Database Analysis

The inline SQLite schema in `backend/app/db/__init__.py` defines an operational persistence model around:

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

This is a real local operational database, not a placeholder.

### Database Contradictions

`backend/migrations/0001_initial.sql` defines a smaller schema with Portuguese columns:

- `projects.nome`
- `projects.descricao`
- `projects.repo`
- `checkpoints.titulo`
- `checkpoints.descricao`
- `appointments.titulo`

The inline schema defines English columns:

- `projects.name`
- `projects.description`
- `projects.repo_path`
- `checkpoints.name`
- `checkpoints.description`

This is the largest database risk in the repo. Any code path using migration-created DB files may not match code expecting inline schema names. The project needs one canonical migration path.

### Persistence Risk

Risk level: high.

Reason:

- Schema drift is present.
- SQLite can silently persist old shape locally.
- Tests can pass against seeded or mocked data while production/local DB breaks.
- Cross-language naming (`nome` vs `name`) increases accidental mapper complexity.

Recommended action:

- Produce a single DB schema authority.
- Generate migrations from it or declare migrations authoritative and delete/retire inline schema generation after migration bootstrap is stable.
- Add a schema contract test that opens a real test SQLite DB and asserts required columns.

## 8. Frontend Map

There are two frontend surfaces:

### `src/`

This appears to be the main current KRATOS shell:

- `src/routes/*` uses `createFileRoute`.
- `src/components/kratos/*` contains domain components.
- `src/hooks/*` includes domain hooks and live-state hooks.
- `src/lib/*` includes server functions/providers/fallback handling.
- `src/styles.css` and `src/styles/kratos-tokens.css` contain design tokens.

### `frontend/`

This appears to be a secondary Vite app:

- `frontend/src/pages/*`
- `frontend/src/components/*`
- `frontend/src/hooks/useApi.ts`
- `frontend/src/hooks/useLiveKratos.ts`
- `frontend/src/styles/*`

It directly calls `http://127.0.0.1:5100`.

### Frontend Risk

Risk level: high.

Reason:

- Two frontend trees can drift visually and behaviorally.
- Some docs describe TanStack Start/Cloudflare, some files use Vite standalone, and the backend is FastAPI.
- Hooks exist in both `src/hooks` and `frontend/src/hooks`.
- The same domains exist in multiple places: shell, HUD, world map, pages, views, island screens.

Recommended action:

- Decide which frontend tree is canonical.
- Mark the other as archived, experimental, or migration-only.
- Add a `docs/architecture/FRONTEND_AUTHORITY.md` stating which app is run, built, deployed, and tested.

## 9. API Contract Analysis

The API contract documentation is strong:

- Standard collector envelope.
- `source` provenance categories: real, fallback, cached, mock, error.
- Collector status model.
- Live snapshot schema.
- Collector envelope schema.
- Route-by-route intent.

The implementation reality is partially aligned:

- FastAPI routes exist for the documented domains.
- Live snapshot and SSE exist.
- Collectors exist.
- Tests exist.

Gaps:

- The contract still references older versions in places.
- Some docs claim Hono/Cloudflare patterns as canonical.
- The actual backend is FastAPI.
- Frontend may call raw backend endpoints instead of a Worker `/api` facade.

The contract needs a synchronization pass after the current FastAPI architecture is accepted as real.

## 10. Data Flow

Primary operational flow:

1. Collectors read local/system/external state.
2. Services normalize, classify, aggregate, and cache.
3. FastAPI routes expose endpoints.
4. Frontend hooks call endpoints or subscribe to SSE.
5. Components render operational state with source/fallback badges.
6. Lucas acts manually.

Important fallback pattern:

- System collector failure should degrade to fallback/cached/error state.
- OMNIS is read-only and should return offline/mock/fallback state, never execute.
- ActivityWatch may be offline and should not break context UI.

## 11. Akasha/Obsidian Architecture

Akasha/Obsidian scripts are significant:

- `ingest_obsidian_to_akasha.py`
  - scans Obsidian markdown files
  - parses frontmatter
  - chunks text
  - calls Ollama `nomic-embed-text`
  - writes documents/chunks/embeddings to PostgreSQL in Docker

- `build_obsidian_vault.py`
  - exports Akasha data back to Obsidian
  - organizes content by domain/PARA mapping
  - creates dashboards and templates

- `sync_orchestrator.py`
  - checks Akasha, Obsidian, Notion, Ollama health
  - defines sync direction
  - can run Obsidian-to-Akasha and Akasha-to-Obsidian cycle

- `rag_pitch_generator.py`
  - searches Akasha via SQL keyword matching
  - searches Obsidian markdown
  - builds a structured RAG prompt for pitch/presentation generation

This is not a toy memory architecture. It is a real personal knowledge pipeline, but it is currently script-operated and not fully absorbed into KRATOS UI/runtime.

### Akasha Risk

Risk level: medium-high.

Reasons:

- SQL is constructed with string interpolation in scripts.
- Scripts depend on Docker container naming.
- Embedding model and dimensions are hard-coded (`nomic-embed-text`, 768).
- The pipeline assumes local service availability.
- There is no obvious central schema migration for Akasha tables in this repository.

## 12. AI Orchestration and Agents

The `.claude/agents` model is clean:

- `kratos-architect`
- `kratos-api-builder`
- `kratos-data-layer`
- `kratos-ui-builder`
- `kratos-qa-guard`

The project manifest defines the intended execution order:

`kratos-architect -> kratos-data-layer -> kratos-api-builder -> kratos-ui-builder -> kratos-qa-guard`

This is a healthy split. It reduces role confusion and matches the KRATOS boundary model.

Weakness:

- Enforcement appears mostly procedural/documentary.
- Agent definitions can guide behavior, but the repo should add machine-verifiable checks for protected paths, contract drift, generated files, and forbidden execution patterns.

## 13. Skills System

The skill manifest defines tiers:

- Core: API contract sync, token enforcement, visual QA, neuro UX, motion guard.
- Builder: glass panel, HUD, island composition.
- Integration: Akasha vault, OMNIS lab.
- Meta: KIMI-to-code.

This is a good taxonomy. It mirrors the system shape.

Risks:

- Skills can become mythology if not connected to CI/check scripts.
- There are many skills and historical docs; the project needs a current registry verification file generated from actual `.claude/skills`.
- Placeholder skills and legacy copies should be kept quarantined or explicitly marked.

## 14. Governance Analysis

The governance layer is unusually explicit:

- Constitution.
- Boundary map.
- Agent manifest.
- Skill manifest.
- Protected components.
- Safety directives.
- Definition of Done.

This is good because Lucas has many parallel systems and the biggest risk is context collapse.

Governance gaps:

- Some docs contradict current implementation.
- Safety rules are documented but not all enforced by hooks/CI.
- The boundary map says KRATOS never writes Akasha, while scripts in the repo do write Akasha. The precise distinction should be: KRATOS runtime does not write Akasha; offline sync scripts can write Akasha when explicitly invoked.
- "KRATOS sees, Aurora interprets" is conceptually clean, but backend services named mentor/mission intelligence already perform interpretation. The project should define whether those are KRATOS-owned deterministic heuristics or Aurora-owned intelligence.

## 15. Technical Debt

Most important debt, ordered:

1. Dual frontend surfaces (`src` and `frontend`).
2. Backend architecture contradiction: docs mention Hono/Cloudflare while runtime is FastAPI.
3. Database schema drift between inline SQLite schema and migration SQL.
4. API envelope consistency not guaranteed across all endpoints.
5. Akasha scripts use raw SQL string interpolation.
6. Some docs are stale relative to implementation phase.
7. OMNIS/Akasha status boundaries are partially implemented but still easy to misread.
8. Large historical docs tree makes current truth hard to find.
9. Source badges and fallback states exist conceptually but need contract-level enforcement.
10. CI/build/test status was not executed in this documentation-only phase.

## 16. Roadmap

### Phase A - Truth Lock

- Declare current backend authority: FastAPI or Worker.
- Declare current frontend authority: `src` or `frontend`.
- Document accepted local ports and run commands.
- Freeze API envelope contract.
- Add schema drift test for SQLite.

### Phase B - Contract Hardening

- Update `api-contract/KRATOS_API_CONTRACT_V1.md` to current backend version.
- Add automated route inventory check.
- Add endpoint envelope tests for all routers.
- Add source badge contract tests for frontend consumers.

### Phase C - Data Layer Consolidation

- Choose one DB schema source.
- Convert migrations into the canonical bootstrap path.
- Add a DB compatibility test.
- Add a data freshness contract for collectors.

### Phase D - Frontend Consolidation

- Mark one frontend as canonical.
- Move/retire duplicated hooks.
- Remove stale `/api` assumptions or implement the facade intentionally.
- Add visual regression for canonical routes only.

### Phase E - Akasha/Obsidian Operationalization

- Document Akasha DB schema.
- Parameterize container/model names.
- Replace raw SQL interpolation with parameterized or safer command path.
- Add dry-run mode to every script that writes externally.
- Expose read-only Akasha status in KRATOS with honest source badges.

### Phase F - Governance Automation

- Add protected path checks.
- Add no-secrets/no-env-read checks.
- Add no-OMNIS-execution pattern checks.
- Add report-only audit command for agents.

## 17. Final Engineering Position

KRATOS has a serious architecture. The main failure mode is not lack of code; it is too many parallel truths. The fastest path to stability is not more feature work. It is to lock the runtime authorities:

- one frontend
- one backend story
- one DB schema authority
- one API contract version
- one current-state index

After that, the system can grow safely.

