# KRATOS KR30 W14 — Services Health Observability

**Date:** 2026-05-17  
**Wave:** K14  
**Tests added:** 10  
**Suite total:** 134 pass / 0 fail

## Changes

- `backend/services/store.ts`: Added `getServicesHealthSummary()` and `_reset()`
- `tests/stores/services-health.test.ts`: 10 new tests

## Summary Coverage

`getServicesHealthSummary()` returns:
- total, live, degraded, offline, unknown counts
- stale flag (false for mock, true when real data is old)
- checked_at ISO timestamp

Tests verify: count arithmetic, schema validation, ISO timestamps, stale flag.
