# KRATOS Sprint A W09 — Snapshot Error Taxonomy

**Date:** 2026-05-17
**Wave:** A09

---

## Changes to `api-contract/error-taxonomy.ts`

Added:

- `classifyError(error)` — maps JS exceptions to `ApiErrorCode`
  - Network patterns → `external_unavailable`
  - Rate limit patterns → `rate_limited`
  - Everything else → `internal_error`
- `toSnapshotError(code, message, detail?)` — wraps error with `stale` flag
  - `stale_data` + `external_unavailable` → stale: true
  - `missing_config` + `validation_error` → stale: false
- `SnapshotErrorResult` interface — `{ error: ApiError, stale: boolean }`

## Files Added/Modified

- `api-contract/error-taxonomy.ts` — classifyError, toSnapshotError
- `tests/stores/snapshot-error-taxonomy.test.ts` — 13 new tests

## Test Results

- 219 pass / 0 fail (+13)

## Build

✅ Green (2.94s SSR)
