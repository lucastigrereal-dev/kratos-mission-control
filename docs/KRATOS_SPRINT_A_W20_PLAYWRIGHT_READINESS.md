# KRATOS Sprint A W20 — Playwright Installation Readiness

**Date:** 2026-05-17
**Wave:** A20

## Current State
- Playwright NOT installed
- No E2E test files exist
- No `playwright.config.ts`
- Bun 1.3.10

## Installation Plan (Not Executed)

### Package
```bash
bun add -d @playwright/test
bunx playwright install chromium
```

### Configuration
Expected `playwright.config.ts`:
```ts
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  webServer: { command: "bun run dev", port: 3000, reuseExistingServer: true },
  use: { baseURL: "http://localhost:3000" },
});
```

### Bun Compatibility
- Playwright works with Bun via `bunx playwright`
- Browser binaries install independently (not Bun-dependent)
- `@playwright/test` package is Node-compatible, works with Bun test runner via adapter or standalone

### Test Scope
- E2E dir: `e2e/` (separate from `tests/` which is unit/contract)
- Target browsers: Chromium only (fast, covers 95% of issues)
- Routes to smoke test: `/`, `/agora`, `/agenda`, `/checkpoints`, `/projetos`, `/contexto`, `/sistema`

## Prerequisites
- [x] Bun 1.3.10 installed
- [x] Project builds clean (`bun run build`)
- [x] Dev server works (`bun run dev`)
- [ ] Playwright package installed
- [ ] Chromium browser binary downloaded

## Risks
- Windows-specific EPERM issues possible with browser binaries
- Vite dev server port conflicts with other running services
- TanStack Start SSR rendering may need hydration wait patterns in tests
