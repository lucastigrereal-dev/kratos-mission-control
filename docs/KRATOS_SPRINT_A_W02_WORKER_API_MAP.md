# KRATOS Sprint A W02 — Worker API Map

**Date:** 2026-05-17
**Wave:** A02

---

## Current API Surface (7 server functions)

| Endpoint | Method | File | Params | Status |
|---|---|---|---|---|
| `getContextSnapshot` | GET | `contexto-server-fns.ts` | `{ refresh?: boolean }` | Mock only |
| `getGithubRepo` | GET | `github-server-fns.ts` | `{ owner, repo }` | Live + mock fallback |
| `getTrackedRepos` | GET | `github-server-fns.ts` | none | Mock list |
| `fetchOmnisStatus` | GET | `omnis-server-fns.ts` | none | Mock only |
| `fetchOmnisHealth` | GET | `omnis-server-fns.ts` | none | Mock only |
| `fetchOmnisCrews` | GET | `omnis-server-fns.ts` | none | Mock only |
| `fetchOmnisJobs` | GET | `omnis-server-fns.ts` | `{ limit? }` | Mock only |
| `getServicesHealth` | GET | `service-server-fns.ts` | none | Mock only |
| checkpoint CRUD | GET/POST | `checkpoint-server-fns.ts` | varies | Store |
| project CRUD | GET/POST | `project-server-fns.ts` | varies | Store |
| appointment CRUD | GET/POST | `appointment-server-fns.ts` | varies | Store |

## Gaps Identified

1. **No `/api/dashboard/snapshot`** — aggregated snapshot for dashboard
2. **No `/api/contexto/snapshot`** — current endpoint lacks source metadata envelope
3. **No `/api/health`** Worker-level health endpoint
4. **Source metadata** (`SourceBadgeMeta`) not used in existing responses
5. **Error taxonomy** exists in `api-contract/error-taxonomy.ts` but handlers use generic string errors
6. **No snapshot error standardization** across endpoints
7. **OMNIS store** is mock-only — no read-only bridge to real OMNIS

## Contracts Available (api-contract/)

- `checkpoint.schema.ts` ✅
- `project.schema.ts` ✅
- `appointment.schema.ts` ✅
- `contexto.schema.ts` ✅
- `service.schema.ts` ✅
- `github.schema.ts` ✅
- `omnis.schema.ts` ✅
- `source-badge.schema.ts` ✅
- `error-taxonomy.ts` ✅

## Architecture Note

KRATOS uses TanStack Start `createServerFn` — no separate Hono router. Server functions are the API. The `src/server.ts` is the Cloudflare Worker entry that delegates to TanStack's SSR handler.
