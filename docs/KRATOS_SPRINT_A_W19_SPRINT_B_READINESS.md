# KRATOS Sprint A W19 — Sprint B Readiness Assessment

**Date:** 2026-05-17
**Wave:** A19

## What Sprint A Delivered (Backend)
- 5 new server functions (contexto snapshot, dashboard snapshot, worker health, github provider, omnis provider)
- 5 API contracts updated/extended
- 8 new test files (85 tests)
- Standardized error taxonomy across all new endpoints
- SourceBadgeMeta envelope pattern on all snapshots
- CI coverage for all 243 tests (21 files)

## Sprint B Gaps (No Frontend Yet)

### Hooks Not Wired to New Snapshots
- `useDashboard.ts` fetches 4 individual queries (`getCheckpoints`, `getProjects`, `getAppointments`, `getContextSnapshot`) instead of the aggregated `getDashboardSnapshot`
- `getContextoSnapshot` (new high-level snapshot) not consumed by any hook
- `getWorkerHealth` not consumed by any hook
- No hook consumes the new provider functions directly (they're internal to `dashboard-server-fns.ts`)

### Routes
- 8 routes exist (`/`, `/agora`, `/agenda`, `/checkpoints`, `/projetos`, `/contexto`, `/sistema`)
- All routes have view components in `src/components/kratos/views/`
- No route consumes the new Sprint A snapshot functions yet
- `/sistema` could consume `getWorkerHealth` for live service status

### Testing
- 0 E2E tests (Playwright not installed — A20)
- 243 unit/contract tests all pass

### Deploy
- `wrangler.jsonc` configured but deploy never executed
- Requires explicit Lucas authorization

## Sprint B Recommended Scope
1. Wire `useDashboard` to `getDashboardSnapshot` (single query → aggregated)
2. Wire `/sistema` route to `getWorkerHealth`
3. Wire `/contexto` route to `getContextoSnapshot`
4. Add loading/error/empty states for new snapshot consumers
5. Playwright E2E smoke tests (A20-A21)
6. CI hardening (A22)

## Blockers
- None. Sprint B can start immediately.
- FrontendGuard (`frontend/`) is NOT a blocker — main app code is in `src/`
