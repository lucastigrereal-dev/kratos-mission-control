# KRATOS Sprint B W07 — Worker Health Client Hook

**Date:** 2026-05-17
**Wave:** B07

## Changes
- `src/hooks/useServices.ts`: Added `useWorkerHealth()` hook consuming Sprint A `getWorkerHealth`
- `tests/stores/worker-health-hook.test.ts`: 5 tests

## Hook: `useWorkerHealth()`
Returns: `{ health: WorkerHealthData | null, isLoading, isError, error, refetch }`
- Auto-polls at 30s
- Status: ok | degraded | error
- Includes service check totals (healthy/degraded)
