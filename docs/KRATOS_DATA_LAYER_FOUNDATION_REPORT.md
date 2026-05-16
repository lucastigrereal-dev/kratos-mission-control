# KRATOS — Data Layer Foundation Report
**Phase:** 0.3 | **Date:** 2026-05-16 | **Agents:** kratos-data-layer + kratos-qa-guard

---

## Summary

Created the 3-file data layer foundation: centralized `useApi` fetch hook, Zod schemas for Checkpoint entity, and TanStack Query hooks for CRUD operations. All 3 files compile cleanly. Zero UI changes. Zero route changes. Zero new dependencies.

---

## Files Created

### 1. `src/hooks/useApi.ts` — Centralized fetch

**Exports:**
- `apiFetch<T>(path, options?)` — async function returning `ApiEnvelope<T>` for use in loaders and `queryFn`
- `useApi<T>(path, options?)` — hook for simple fetch cases (lightweight, useState-based)
- `ApiEnvelope<T>` — typed interface matching the API contract standard

**API surface:**
```ts
interface ApiEnvelope<T> {
  data: T | null;
  error: string | null;
  meta: {
    latency_ms: number;
    source: "live" | "cached" | "fallback" | "mock" | "error";
    cached_at: string | null;
  };
}

async function apiFetch<T>(path: string, options?: ApiOptions): Promise<ApiEnvelope<T>>
function useApi<T>(path: string | null, options?: ApiOptions): UseApiState<T> & { refetch: () => Promise<void> }
```

**Features:**
- AbortController per request — cancels stale in-flight requests automatically
- Envelope detection — if API already returns `{ source, data }`, preserves it; otherwise wraps raw JSON
- Error normalization — HTTP errors, network errors, and AbortErrors all produce `{ data: null, error: "..." }`
- `mountedRef` guard — no state updates after unmount
- Named exports only — no default exports, matching project conventions

### 2. `api-contract/checkpoint.schema.ts` — Zod schemas

**Schemas:**
| Schema | Purpose | Fields |
|---|---|---|
| `CheckpointStatusSchema` | Status enum | `pending \| in_progress \| completed \| blocked \| cancelled` |
| `CheckpointSchema` | Full entity | id, projetoId, titulo, descricao, progresso, status, deadline, criadoEm, atualizadoEm |
| `CreateCheckpointSchema` | POST body | titulo (required), descricao, projetoId, deadline |
| `UpdateCheckpointSchema` | PATCH body | All fields optional (partial update) |

**Inferred types exported:**
`CheckpointStatus`, `Checkpoint`, `CreateCheckpoint`, `UpdateCheckpoint`

**Validations:**
- `titulo`: 1–200 chars, required on create
- `descricao`: max 2000 chars, optional
- `progresso`: 0–100 integer
- `projetoId`: UUID or null
- `deadline`: ISO 8601 datetime or null
- All timestamps (`criadoEm`, `atualizadoEm`): ISO 8601 datetime
- `id`: UUID format

### 3. `src/hooks/useCheckpoints.ts` — TanStack Query hooks

**5 hooks — full CRUD:**

| Hook | Method | Query/Mutation | Endpoint |
|---|---|---|---|
| `useCheckpoints()` | GET | `useQuery` | `/api/checkpoints` |
| `useCheckpoint(id)` | GET | `useQuery` (enabled only when id present) | `/api/checkpoints/:id` |
| `useCreateCheckpoint()` | POST | `useMutation` | `/api/checkpoints` |
| `useUpdateCheckpoint()` | PATCH | `useMutation` | `/api/checkpoints/:id` |
| `useDeleteCheckpoint()` | DELETE | `useMutation` | `/api/checkpoints/:id` |

**Cache behavior:**
- `staleTime: 30s` on queries
- Mutations auto-invalidate `["checkpoints"]` list
- Update invalidates both list + detail
- Delete removes detail from cache after invalidation
- Query keys follow `["checkpoints"]` and `["checkpoints", id]` convention

**Return type:** All hooks return `ApiEnvelope<T>` via TanStack Query, giving consumers access to `data.data` (payload), `data.error` (API error), `data.meta.source` (data freshness), `data.meta.latency_ms` (performance).

---

## Build Result

```
bun run build → PASS
  Client: 1966 modules transformed, built in 2.41s
  SSR:    2014 modules transformed, built in 2.61s
  Zero errors. Zero warnings from new code.
```

---

## Git Status

```
?? api-contract/checkpoint.schema.ts
?? src/hooks/useApi.ts
?? src/hooks/useCheckpoints.ts
```

3 untracked files — no modifications to existing files.

---

## What Was NOT Done

- No UI components created or modified
- No routes edited — `routeTree.gen.ts` untouched
- No API endpoints created in `src/server.ts`
- No mock data generated (endpoints are in-memory for now)
- No new dependencies installed — using existing `zod` and `@tanstack/react-query`
- No deploy, no push, no worktree, no merge

---

## Limitations

1. **`useApi` hook does not cache** — it fetches on every mount. Components needing caching/deduplication should use `useCheckpoints`-style TanStack Query hooks instead.
2. **No mock data fallback** — hooks currently target real `/api/checkpoints` endpoints. The endpoints don't exist yet in `src/server.ts` (Phase 0.4+).
3. **`useApi` hook re-fetches on every option change** — `options` object identity triggers `useEffect`. Pass stable references.
4. **No optimistic updates** on mutations — can be added when UI integration begins.
5. **Only Checkpoint entity covered** — remaining entities (Projeto, Compromisso, Contexto, SessaoAgora) follow the same pattern.

---

## Next Step

**Phase 0.4 — API Routes Foundation** (kratos-api-builder):
- Create `/api/checkpoints` CRUD endpoints in `src/server.ts`
- Validate with `checkpoint.schema.ts` Zod schemas
- In-memory store for dev
- Return standard `{ source, data, meta }` envelope

Or, if preferred: create schemas + hooks for remaining 4 entities first (Projeto, Compromisso, Contexto, SessaoAgora) before wiring up any backend.
