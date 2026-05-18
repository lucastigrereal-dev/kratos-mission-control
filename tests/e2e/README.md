# KRATOS E2E Tests

Playwright end-to-end test suite for KRATOS Mission Control.

## Prerequisites

- Bun 1.3+
- Chromium browser (installed via `bunx playwright install chromium`)

## Quick start

```bash
# 1. Install Playwright browsers (one-time)
bunx playwright install chromium

# 2. Start the dev server in a separate terminal
bun run dev

# 3. Run the E2E tests (in another terminal)
bun run test:e2e
```

## Scripts

| Command | Description |
|---|---|
| `bun run test:e2e` | Run all E2E tests headless |
| `bun run test:e2e:ui` | Open Playwright UI mode |
| `bun run test:e2e:report` | Open the HTML report |

## Auto-starting the dev server

Set `PLAYWRIGHT_AUTO_DEV=1` to let Playwright spawn `bun run dev` automatically:

```bash
# PowerShell
$env:PLAYWRIGHT_AUTO_DEV=1; bun run test:e2e

# Bash
PLAYWRIGHT_AUTO_DEV=1 bun run test:e2e
```

## Test files

| Spec | What it covers |
|---|---|
| `smoke.spec.ts` | All 7 routes return 200, no console errors |
| `navigation.spec.ts` | Sidebar click navigates, toggle collapse/expand |
| `dashboard.spec.ts` | SourceBadgeIndicator, sidebar, Topbar visibility |
| `a11y.spec.ts` | Page title, landmarks, lang attr, color-scheme meta |

## Configuration

- `playwright.config.ts` at repo root
- Base URL: `http://localhost:8080` (KRATOS dev server)
- CI: retries=2, parallel=2 workers
- Dev: retries=0, unlimited workers
