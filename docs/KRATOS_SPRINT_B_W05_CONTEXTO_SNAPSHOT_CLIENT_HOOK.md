# KRATOS Sprint B W05 — Contexto Snapshot Client Hook

**Date:** 2026-05-17
**Wave:** B05

## Changes
- `src/hooks/useContexto.ts`: Added `useContextoMissionSnapshot()` hook that consumes `getContextoSnapshot` from Sprint A
- `tests/stores/contexto-mission-snapshot.test.ts`: 10 tests covering schema validation, modes, confidence range, SourceBadgeMeta

## New Hook: `useContextoMissionSnapshot(opts?)`
Returns: `{ data: ContextoSnapshotData | null, meta: SourceBadgeMeta | null, isLoading, isError, error, refetch }`
- Uses `["contexto", "mission-snapshot"]` query key
- Auto-polls at 30s
- Supports `refresh: true` to force re-seed

## Existing Hook Preserved
`useContextSnapshot()` remains untouched — still returns desktop telemetry `ContextSnapshot`.

## Tests: 10 pass / 0 fail
