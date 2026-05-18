# KRATOS Sprint B W09 — OMNIS Readonly Client Hook

**Date:** 2026-05-17
**Wave:** B09

## Changes
- `src/hooks/useOmnis.ts`: Added `useOmnisConfig()` + `useOmnisReadOnlyGuard()` hooks
- `tests/stores/provider-config-hooks.test.ts`: 6 tests (shared with B08)

## Hook: `useOmnisConfig()`
Returns: `UseQueryResult<{ configured: boolean, baseUrlEnvName: string, checkedAt: string }>`

## Hook: `useOmnisReadOnlyGuard()`
Returns: `{ readOnly: true, boundary: "KRATOS observes OMNIS — never executes jobs" }`
- Static guard, no server call
- Documents OMNIS boundary at runtime level
