# KRATOS Sprint B W06 — Dashboard Snapshot Client Hook

**Date:** 2026-05-17
**Wave:** B06

## Changes
- `src/hooks/useDashboard.ts`: Added `useDashboardSnapshot()` hook consuming Sprint A `getDashboardSnapshot`
- `tests/stores/dashboard-snapshot-hook.test.ts`: 6 tests

## Hook: `useDashboardSnapshot()`
Returns: `{ data: DashboardSnapshotData | null, meta: SourceBadgeMeta | null, isLoading, isError, error }`
- Single aggregated query replacing 4 separate queries
- Query key: `["dashboard", "snapshot"]`
- Stale time: 15s
