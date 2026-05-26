# KRATOS Architecture Dependency Map

Generated: 2026-05-19

## 1. Layered Dependency Model

```text
Lucas
  -> KRATOS frontend
    -> frontend hooks / route loaders / server functions
      -> FastAPI backend endpoints
        -> services
          -> collectors
            -> local OS / Git / Docker / ActivityWatch / filesystem / OMNIS
          -> SQLite
        -> SSE live stream
      -> api-contract schemas and types
  -> documentation and governance
    -> agents
    -> skills
    -> safety rules

Akasha/Obsidian scripts
  -> Obsidian vault
  -> Docker container akasha-postgres
  -> Ollama embeddings
  -> Notion ingestion state
```

## 2. Package Dependency Classes

Frontend runtime dependencies from `package.json`:

| Class | Packages | Role |
|---|---|---|
| React runtime | `react`, `react-dom` | UI foundation |
| Routing/start | `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin` | App routing and start integration |
| Server state | `@tanstack/react-query` | Query/cache layer |
| UI primitives | `@radix-ui/*`, `cmdk`, `vaul`, `embla-carousel-react`, `react-day-picker`, `recharts` | Interactive UI primitives |
| Forms/validation | `react-hook-form`, `@hookform/resolvers`, `zod` | Form and schema validation |
| Styling | `tailwindcss`, `@tailwindcss/vite`, `tailwind-merge`, `tw-animate-css`, `class-variance-authority`, `clsx` | Design system |
| Icons | `lucide-react` | Iconography |
| Build/dev | `vite`, `typescript`, `eslint`, `prettier`, `playwright` | Build and verification |
| Deploy tooling | `@cloudflare/vite-plugin`, `wrangler.jsonc` | Worker deployment path, currently contradicted by FastAPI backend reality |

## 3. Backend Dependency Classes

Backend runtime is inferred from Python files:

| Class | Evidence | Role |
|---|---|---|
| HTTP API | `FastAPI`, `APIRouter`, CORS middleware | Local backend |
| Persistence | `sqlite3`, WAL, FK pragma | Local-first DB |
| Concurrency | live event service uses parallel fetch patterns | Aggregated snapshot composition |
| System integration | Docker/Git/System/ActivityWatch collectors | Local observability |
| SSE | `/live/stream` route | Push live updates |

## 4. Cross-System Boundaries

| Boundary | Direction | Current implementation | Risk |
|---|---|---|---|
| KRATOS -> OMNIS | Read-only | `/omnis/status`, `/omnis/summary`, provider comments forbid execution | Medium |
| KRATOS -> Akasha | Display/status intended | UI placeholder/status; scripts write outside runtime | Medium |
| KRATOS -> ActivityWatch | Read-only | collector endpoints | Medium because service can be offline |
| KRATOS -> Git | Read-only | git collector | Low/medium |
| KRATOS -> Docker | Read-only | docker collector | Medium because Docker Desktop may be offline |
| Scripts -> Akasha | Write | ingestion/export scripts | High if run without dry-run/governance |
| Scripts -> Obsidian | Write | vault builder/deduper | High if execute mode is used |

## 5. High-Value Dependency Principles

1. `api-contract/` should be the type/shape authority.
2. `backend/app/routes` should be thin and delegate to services.
3. `backend/app/services` should own aggregation and persistence logic.
4. `backend/app/collectors` should be read-only and fail gracefully.
5. `src/hooks` should hide endpoint/fallback details from components.
6. Components should render state, not decide system truth.
7. Scripts that write Akasha/Obsidian need dry-run and clear operator confirmation.

## 6. Known Dependency Smells

| Smell | Evidence | Why it matters |
|---|---|---|
| Dual frontend | `src/` and `frontend/` both have app code | UI behavior can split |
| Mixed API base conventions | `localhost:5100`, `127.0.0.1:5100`, `/api/*` | Local/dev/deploy mismatch risk |
| Backend story conflict | FastAPI code vs Hono/Worker docs | Confuses agents and future work |
| DB schema drift | inline schema vs migration SQL | Runtime data breakage risk |
| Historical docs volume | many phase reports | Current truth can be buried |

## 7. Dependency Map by Domain

| Domain | Frontend | Backend | Contract | Storage | External |
|---|---|---|---|---|---|
| Health/System | `useServices`, `useSystemPulse`, Sistema views | `system.py`, `health.py`, `system_collector.py` | `service.schema.ts` | SQLite snapshots | OS |
| Live | `useLiveStatus`, `useMissionLens`, `useLiveKratos` | `live.py`, `live_event_service.py`, `live_cache_service.py` | `live.snapshot.schema.json` | cache + snapshots | SSE |
| Context | `useContexto`, Contexto views | `context.py`, context services, ActivityWatch collector | `contexto.schema.ts` | SQLite context tables | ActivityWatch |
| Projects | `useProjects`, Projetos views | `projects.py`, service helpers | `project.schema.ts` | SQLite projects | Git optionally |
| Checkpoints | `useCheckpoints`, Checkpoints views | `checkpoints.py`, checkpoint suggestion service | `checkpoint.schema.ts` | SQLite checkpoints | none |
| OMNIS | `useOmnis`, Sistema/Omnis UI | `omnis.py`, `omnis_collector.py` | `omnis.schema.ts` | snapshot/fallback | OMNIS HTTP/filesystem |
| GitHub | `useGithub`, Github cards | provider/server fns | `github.schema.ts` | fallback/mock | GitHub API if configured |
| Akasha | Akasha island/status | not fully runtime-integrated | not centralized here | PostgreSQL external | Docker/Ollama/Obsidian |

