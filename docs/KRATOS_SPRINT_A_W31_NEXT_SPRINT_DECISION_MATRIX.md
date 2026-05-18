# KRATOS Sprint A W31 — Next Sprint Decision Matrix

**Date:** 2026-05-17
**Wave:** A31

## Options

| Option | Effort | Impact | Risk | Recommendation |
|---|---|---|---|---|
| **Sprint B: Wire Frontend** | Medium | High — real data in cockpit | Low | START NOW |
| Sprint C: D1/KV Bindings | High | Medium — persistence | Medium — needs Cloudflare setup | After B |
| Sprint D: Deploy to Staging | Low | High — live environment | High — requires Lucas auth | When ready |
| Sprint E: E2E Tests | Medium | Medium — regression safety | Low | Alongside B |

## Decision
- **Sprint B next** — wire hooks to snapshot endpoints (documented in A19 gaps)
- **E2E in parallel** — Playwright smoke tests (A20-A21 ready)
- **No deploy yet** — wait for Lucas to set Worker secrets + authorize

## Sprint B Scope (from A19)
1. Wire `useDashboard` to `getDashboardSnapshot`
2. Wire `/sistema` to `getWorkerHealth`
3. Wire `/contexto` to `getContextoSnapshot`
4. Loading/error/empty states for new consumers
5. Playwright E2E smoke (15 tests from A21)
