# KRATOS Sprint C -- Playwright E2E Test Foundation -- Final Report

**Date:** 2026-05-17
**Branch:** `parallel/kratos-c-playwright`
**Worktree:** `.claude/worktrees/kratos-c-playwright`

---

## Summary

Playwright E2E test foundation deployed for KRATOS Mission Control. Four test specs cover smoke, navigation, dashboard, and accessibility across all 7 routes. No source changes to `src/`. Build and existing 270 store tests remain green.

---

## Deliverables

### 1. Playwright installed
- `@playwright/test ^1.60.0` already present in `devDependencies`
- `bunx playwright install chromium` available (browser install required before first run)

### 2. `playwright.config.ts` (repo root)
- Base URL: `http://localhost:8080` (KRATOS dev server via `@lovable.dev/vite-tanstack-config`)
- `testDir: tests/e2e`
- `fullyParallel: true`
- `forbidOnly: true` in CI
- Retries: 0 dev / 2 CI
- Timeout: 30000ms
- webServer gated behind `PLAYWRIGHT_AUTO_DEV=1` env var (user-controlled)

### 3. Test specs (`tests/e2e/`)

| Spec | Tests | Coverage |
|---|---|---|
| `smoke.spec.ts` | 7 | Each route returns 200, no console errors, sidebar visible |
| `navigation.spec.ts` | 2 | Sidebar click navigates correctly, toggle collapse/expand |
| `dashboard.spec.ts` | 4 | SourceBadgeIndicator, sidebar, topbar visibility, no errors |
| `a11y.spec.ts` | 9 | Page title, lang attribute, color-scheme meta, nav landmark, main visible |

**Total: 22 E2E tests**

### 4. `package.json` scripts added

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:report": "playwright show-report"
```

### 5. CI workflow (`.github/workflows/ci.yml`)
Added Playwright step after store tests:
- `bunx playwright install chromium --with-deps`
- `bun run test:e2e` with `PLAYWRIGHT_AUTO_DEV=1`

### 6. `tests/e2e/README.md`
Run instructions, script table, auto-dev setup.

### 7. Regression verification

| Check | Result |
|---|---|
| `bun run build` | Clean (client + SSR) |
| `bun test tests/` | 270 pass, 0 fail |

---

## Architecture Notes

- The Sidebar renders `<Link>` from TanStack Router (not native `<a>`). Active state is CSS class `kratos-nav-item-active`, not `data-status`.
- Topbar uses `<header>` element with breadcrumb navigation.
- Main content area: `<main id="kratos-main-content">`.
- SourceBadgeIndicator renders an inline `<span>` with `title` attribute beginning with `Fonte:`.
- Dashboard ("/") is not visible in sidebar by design -- only `/agora`, `/agenda`, `/projetos`, `/contexto`, `/checkpoints`, `/sistema`.

---

## How to Run

```bash
# Terminal 1: Start dev server
bun run dev

# Terminal 2: Run E2E tests
bun run test:e2e

# Or auto-start both:
# PowerShell
$env:PLAYWRIGHT_AUTO_DEV=1; bun run test:e2e
```

---

## Blockers / Risks

- **None.** All files are test-only; zero `src/` modifications.
- Browser install required before first E2E run: `bunx playwright install chromium`.
- If the lovable config port changes from 8080, update `playwright.config.ts` `baseURL` and `webServer.url`.
