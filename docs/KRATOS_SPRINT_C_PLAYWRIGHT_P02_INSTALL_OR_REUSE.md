# KRATOS Sprint C — P02 Install or Reuse Playwright

**Data:** 2026-05-17

## Decision
Playwright was NOT found → full install executed.

## Actions

### 1. Package installed
- `@playwright/test@1.60.0` added to devDependencies

### 2. Browser installed
- Chromium 148.0.7778.96 (playwright chromium v1223)

### 3. Config created
- `playwright.config.ts`
  - Test dir: `tests/e2e`
  - Base URL: `http://localhost:5173`
  - Auto-starts dev server via `webServer`
  - Reporter: html + list
  - Trace on first retry
  - Screenshot on failure

### 4. Scripts added
- `test:e2e` → `playwright test`
- `test:e2e:headed` → `playwright test --headed`
- `test:e2e:report` → `playwright show-report`

### 5. Gitignore updated
- `playwright-report/` and `test-results/` excluded

## Next
P03 — Route smoke E2E tests for all 7 routes.
