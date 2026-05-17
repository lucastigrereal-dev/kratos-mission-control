# KRATOS KR30 W09 — Contexto Snapshot Tests

**Date:** 2026-05-17  
**Wave:** K09  
**Tests added:** 16  
**Suite total:** 110 pass / 0 fail

## Coverage

`tests/stores/contexto-snapshot.test.ts` — 16 tests:
- Success path: schema validation, project/focusStatus/confidence/drift fields
- ISO datetime validity
- Shape integrity: reasons, browserTabs, activeWindowApp
- Stale detection: capturedAt recency, refresh updates timestamp
- No secrets in output
- Error resilience: getLatest/refresh never throw
