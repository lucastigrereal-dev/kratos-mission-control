# KRATOS Sprint B W08 — GitHub Status Client Hook

**Date:** 2026-05-17
**Wave:** B08

## Changes
- `src/hooks/useGithub.ts`: Added `useGithubConfig()` hook consuming Sprint A `checkGithubConfig`
- `tests/stores/provider-config-hooks.test.ts`: 6 tests (shared with B09)

## Hook: `useGithubConfig()`
Returns: `UseQueryResult<{ configured: boolean, tokenEnvName: string, checkedAt: string }>`
- 120s stale time
- Safe to call without token — returns `configured: false`
