# KRATOS Sprint B W20 — Playwright Smoke Foundation

**Date:** 2026-05-17
**Wave:** B20

## Status
Playwright is **NOT installed** in this project.

Per Sprint A W20 (`KRATOS_SPRINT_A_W20_PLAYWRIGHT_READINESS.md`):
- `@playwright/test` not in `devDependencies`
- No `playwright.config.ts` exists
- Chromium browser binary not downloaded
- No E2E test files exist in `e2e/`

## Recommendation
**Defer Playwright installation to Sprint C (Visual Polish).**

Sprint B wiring is verified by:
- Build gate (TypeScript compilation catches hook mismatches)
- 270 unit/contract tests (schema validation)
- Manual review of hooks-to-views wiring

## Installation Command (for Sprint C)
```bash
bun add -d @playwright/test
bunx playwright install chromium
```
