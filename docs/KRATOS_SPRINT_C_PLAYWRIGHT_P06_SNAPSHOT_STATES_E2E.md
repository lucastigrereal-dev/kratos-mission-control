# KRATOS Sprint C — P06 Snapshot States E2E

**Data:** 2026-05-17

## Tests Created
`tests/e2e/states.smoke.spec.ts` — 9 tests.

## Coverage

### Per-route settle tests (7)
Each route checks:
- Heading `<h2>` is visible (page didn't crash)
- After 2s settle, at most 2 `[aria-busy=true]` elements remain
- This tolerates parallel async panels while catching infinite loading

### Shell integrity (1)
- `/` → `networkidle` → `<nav>` sidebar visible + "KRATOS" heading

### Sistema section presence (1)
- `/sistema` → at least one of OMNIS, Akasha, GitHub sections renders
- Accepts empty/error/loading states as valid (any label match)

## State tolerance
- Does NOT require live/mock data — only that the page renders something meaningful
- EmptyState, ErrorState, and LoadingState are all valid settled states
- White screen = the only true failure

## Next
P07 — Screenshot baseline.
