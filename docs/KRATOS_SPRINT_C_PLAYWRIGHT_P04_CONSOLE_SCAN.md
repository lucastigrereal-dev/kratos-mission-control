# KRATOS Sprint C — P04 Console Error Scan

**Data:** 2026-05-17

## Files Created

### `tests/e2e/helpers/console-guard.ts`
- `createConsoleGuard(page)` — attaches console listener, collects errors
- `isBlockedError(message)` — filters out allowed patterns
- Allowed: hydration warnings, HMR/WebSocket noise (dev-mode only)

### `tests/e2e/console.smoke.spec.ts`
- 7 tests — 1 per route
- Navigates, waits 2s for async chunks, asserts zero blocked errors
- Blocked = console.error NOT matching any allowed pattern

## Strategy
- Block: uncaught exceptions, unexpected console.error
- Allow: hydration diffs (dev), Vite HMR reconnect (dev)
- Expand allowlist as needed (each entry requires justification)

## Next
P05 — SourceBadge E2E coverage.
