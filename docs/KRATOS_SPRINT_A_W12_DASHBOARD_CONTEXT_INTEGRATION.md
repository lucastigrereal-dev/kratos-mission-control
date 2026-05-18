# KRATOS Sprint A W12 — Dashboard Context Integration (No Frontend)

**Date:** 2026-05-17
**Wave:** A12

---

## Status

Client-side hooks exist and consume snapshot server functions:
- `src/hooks/useOmnis.ts` → `fetchOmnisStatus` / `fetchOmnisCrews` / etc.
- `src/hooks/useGithub.ts` → `getGithubRepo` / `getTrackedRepos`
- `src/hooks/useCheckpoints.ts` → checkpoint CRUD
- `src/hooks/useProjects.ts` → project CRUD
- `src/hooks/useAppointments.ts` → appointment CRUD
- `src/hooks/useApi.ts` → generic API hook

## Snapshot Coverage Gap

New snapshot server functions need corresponding hooks:
- `getContextoSnapshot` (A04) → no dedicated hook yet
- `getDashboardSnapshot` (A06) → no dedicated hook yet

These hooks would live in `src/hooks/` and follow the existing `useApi<T>()` pattern.

## FrontendBoundary

- `frontend/` directory is READ-ONLY (FrontendGuard active)
- No visual integration can be done until FrontendGuard is lifted
- Hooks can be created in `src/hooks/` without touching `frontend/`

## Recommendation

Create `useContextSnapshot()` and `useDashboardSnapshot()` in `src/hooks/` when ready.
These are pure data hooks — no visual impact until FrontendGuard is lifted.
