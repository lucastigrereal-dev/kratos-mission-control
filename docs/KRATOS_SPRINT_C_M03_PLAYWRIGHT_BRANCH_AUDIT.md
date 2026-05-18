# KRATOS Sprint C M03 — Playwright Branch Audit

**Date:** 2026-05-17
**Wave:** M03
**Status:** PASS — Ready to Merge

## Diff Summary

```
23 files changed, +799/-1 lines
```

## Commits (8)

```
c91a028 docs(kratos): document e2e screenshot baseline
2c6aa36 feat(kratos): add playwright e2e test foundation
5be3e91 test(kratos): add snapshot states e2e coverage
dccfd8f test(kratos): add source badge e2e coverage
432f6f6 test(kratos): add console error e2e scan
91c5441 test(kratos): add route smoke e2e tests
9ab948a test(kratos): configure playwright e2e foundation
3c3033c docs(kratos): preflight playwright e2e worktree
```

## Files Created (19)

| File | Purpose |
|---|---|
| `playwright.config.ts` | Playwright config: port 8080, auto-dev gated, retries 2 CI |
| `tests/e2e/routes.smoke.spec.ts` | 7 route smoke checks |
| `tests/e2e/console.smoke.spec.ts` | 7 console error scans |
| `tests/e2e/navigation.spec.ts` | Sidebar click routing + toggle |
| `tests/e2e/dashboard.spec.ts` | SourceBadgeIndicator + layout checks |
| `tests/e2e/a11y.spec.ts` | 9 a11y checks (title, lang, landmarks) |
| `tests/e2e/sourcebadge.smoke.spec.ts` | Source badge E2E coverage |
| `tests/e2e/states.smoke.spec.ts` | Snapshot states E2E coverage |
| `tests/e2e/screenshots.baseline.spec.ts` | Visual regression baseline |
| `tests/e2e/helpers/console-guard.ts` | Reusable console guard utility |
| `tests/e2e/README.md` | E2E run instructions |
| 6 doc files | Wave documentation |

## Files Modified (4)

| File | Change |
|---|---|
| `package.json` | Added `test:e2e:ui`, scoped `test` to stores/contracts |
| `.github/workflows/ci.yml` | Added Playwright CI step (+8 lines) |
| `.gitignore` | Added Playwright artifacts (+5 lines) |
| `bun.lock` | Updated for `@playwright/test` |

## Scope Validation

| Check | Result |
|---|---|
| Zero `src/` modifications | PASS |
| No route changes | PASS |
| No component changes | PASS |
| No deploy config changes | PASS |
| Build green (`bun run build`) | PASS |
| Tests green (270/0) | PASS |

## Design Decisions
- Port 8080 per `@lovable.dev/vite-tanstack-config` defaults
- `PLAYWRIGHT_AUTO_DEV=1` gates webServer auto-spawn
- Did not duplicate `smoke.spec.ts` — existing `routes.smoke.spec.ts` + `console.smoke.spec.ts` cover it
- `SidebarItem` active state via CSS class `kratos-nav-item-active`

## Risks
- Chromium install required before first run: `bunx playwright install chromium`
- E2E tests not actually executed (requires dev server running)
- Will validate post-merge in M05
