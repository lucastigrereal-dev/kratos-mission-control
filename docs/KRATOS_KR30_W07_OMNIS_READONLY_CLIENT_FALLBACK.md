# KRATOS KR30 W07 — OMNIS Read-Only Client Fallback

**Date:** 2026-05-17  
**Wave:** K07  
**Tests added:** 13  
**Suite total:** 94 pass / 0 fail

---

## Audit Result

Current OMNIS implementation is already read-only and safe:
- `backend/omnis/store.ts` — GET-only, mock-backed, no execution
- `src/lib/omnis-server-fns.ts` — GET methods only via `createServerFn`
- No `OMNIS_BASE_URL` required currently (fully mock)

## Tests Added

`tests/stores/omnis-readonly-fallback.test.ts` — 13 tests covering:
- Store exports only read functions (no execute/trigger)
- Every function has guaranteed non-throwing fallback
- Health counts sum correctly
- Crew status values are valid enum members
- Job limit parameter respected
- No execution patterns in mock data

## No Code Changes Required

Store boundary is already correct. Tests formalize the contract.
