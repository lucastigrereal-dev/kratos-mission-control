# KRATOS KR30 W22 — Data Layer Small Fixes

**Date:** 2026-05-17  
**Wave:** K22  
**Tests added:** 16  
**Suite total:** 176 pass / 0 fail

## Fix: Health Utils Extraction

**Problem:** `serviceHealthToSeverity` and `deriveLiveState` were inline in `useLiveStatus.ts` (React hook) — untestable in Bun without jsdom.

**Fix:** Extracted to `backend/lib/health-utils.ts` as pure functions.

**Tests:** `tests/stores/health-utils.test.ts` — 16 tests covering all severity mappings and LiveState derivation logic.

## No Other Changes

The matrix (K21) identified no other low-risk fixable gaps:
- No `_reset()` needed for checkpoints/projects/appointments (they use seeding)
- `live.snapshot.schema.json` migration deferred (not blocking)
- `dashboard.schema.ts` deferred to next phase
