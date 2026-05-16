# KRATOS API Contract Audit

**Data:** 2026-05-16
**Commit:** `73dadc8`
**Tipo:** READ-ONLY audit

---

## 1. Resumo

KRATOS funcional usa **7 server functions** (`createServerFn` do TanStack Start), RPC-style, sem endpoints REST tradicionais. Os dados vêm de stores em `backend/` com padrão mock + fallback.

---

## 2. Server Functions (7)

| # | Server Function | InputValidator | Output Envelope | Store | Data Source |
|---|---|---|---|---|---|
| 1 | `getCheckpoints` | — | `{ data, error }` | `backend/checkpoints/store.ts` | Mock (Map) |
| 2 | `getProjects` | — | `{ data, error }` | `backend/projects/store.ts` | Mock (Map) |
| 3 | `getAppointments` | — | `{ data, error }` | `backend/appointments/store.ts` | Mock (Map) |
| 4 | `getServices` | — | `{ data, error }` | `backend/services/store.ts` | Mock (Map) |
| 5 | `getContexto` | — | `{ data, error }` | `backend/contexto/store.ts` | Mock (Map) |
| 6 | `getGithubRepo` | `z.object({ owner, repo })` | `{ data: GithubRepoStatus, error }` | `backend/github/store.ts` | **GitHub API + mock fallback** |
| 7 | `getTrackedRepos` | — | `{ data: string[], error }` | `backend/github/store.ts` | Mock (hardcoded list) |
| 8 | `fetchOmnisStatus` | — | `{ data: OmnisStatus, error }` | `backend/omnis/store.ts` | Mock |
| 9 | `fetchOmnisHealth` | — | `{ data, error }` | `backend/omnis/store.ts` | Mock |
| 10 | `fetchOmnisCrews` | — | `{ data, error }` | `backend/omnis/store.ts` | Mock |
| 11 | `fetchOmnisJobs` | `z.object({ limit })` | `{ data, error }` | `backend/omnis/store.ts` | Mock |

**Formato de envelope padronizado:**
```ts
{ data: T | null, error: string | null }
```

---

## 3. Hooks (10)

| Hook | Server Function | staleTime | Cache |
|---|---|---|---|
| `useCheckpoints()` | `getCheckpoints` | — | TanStack Query |
| `useProjects()` | `getProjects` | — | TanStack Query |
| `useAppointments()` | `getAppointments` | — | TanStack Query |
| `useServices()` | `getServices` | — | TanStack Query |
| `useContexto()` | `getContexto` | — | TanStack Query |
| `useDashboard()` | agrega 5 acima | — | TanStack Query |
| `useGithubRepo(owner, repo)` | `getGithubRepo` | 60s | TanStack Query |
| `useTrackedRepos()` | `getTrackedRepos` | 120s | TanStack Query |
| `useOmnisStatus()` | `fetchOmnisStatus` | 30s | TanStack Query |
| `useOmnisHealth()` | `fetchOmnisHealth` | 30s | TanStack Query |
| `useOmnisCrews()` | `fetchOmnisCrews` | 30s | TanStack Query |
| `useOmnisJobs(limit)` | `fetchOmnisJobs` | 30s | TanStack Query |

---

## 4. Stores (8)

| Store | Localização | Cache | Dados |
|---|---|---|---|
| Checkpoints | `backend/checkpoints/store.ts` | Map (memória) | Mock |
| Projects | `backend/projects/store.ts` | Map (memória) | Mock |
| Appointments | `backend/appointments/store.ts` | Map (memória) | Mock |
| Services | `backend/services/store.ts` | Map (memória) | Mock |
| Contexto | `backend/contexto/store.ts` | Map (memória) | Mock |
| GitHub | `backend/github/store.ts` | Map + 120s TTL | **Live API + Mock fallback** |
| OMNIS | `backend/omnis/store.ts` | Map + 30s TTL | Mock (8 services, 5 crews, 4 jobs) |
| Store Adapter | `backend/lib/store-adapter.ts` | — | `createMapRepository<T, C, U>` |

---

## 5. Endpoints externos

### GitHub REST API

| Endpoint | Uso |
|---|---|
| `GET https://api.github.com/repos/{owner}/{repo}` | Info do repo |
| `GET https://api.github.com/repos/{owner}/{repo}/pulls?state=open&per_page=5` | PRs abertos |
| `GET https://api.github.com/repos/{owner}/{repo}/commits?per_page=5` | Commits recentes |
| Timeout: 3000ms | Fallback: mock |

### OMNIS

| Endpoint | Status |
|---|---|
| Nenhum | **100% mock.** Bridge future: `/api/omnis/status`, `/api/omnis/health`, etc. |

---

## 6. Mocks vs Real

| Domínio | Status | Próximo passo |
|---|---|---|
| Checkpoints | Mock | Conectar Supabase/D1 |
| Projects | Mock | Conectar Supabase/D1 |
| Appointments | Mock | Conectar Google Calendar API |
| Services | Mock | Conectar health checks reais |
| Contexto | Mock | Conectar Supabase/D1 |
| GitHub | **Real + fallback** | ✅ |
| OMNIS | Mock | Conectar bridge HTTP real quando OMNIS tiver endpoint |
