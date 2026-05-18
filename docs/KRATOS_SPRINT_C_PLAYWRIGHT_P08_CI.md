# KRATOS Sprint C — P08 CI Playwright

**Data:** 2026-05-17

## Status: Already configured ✅

The existing `.github/workflows/ci.yml` (job `build-and-test`) already includes Playwright E2E:

### Steps (lines 47-53)
1. `bunx playwright install chromium --with-deps` — installs Chromium browser
2. `bun run test:e2e` — runs all E2E specs
3. `PLAYWRIGHT_AUTO_DEV: "1"` — tells playwright.config.ts to auto-start `bun run dev`

## What's covered
- **Triggered on:** push to main, feat/**, fix/**, docs/**, test/**, ci/** + PRs to main
- **Timeout:** 10 min total (build + test + e2e)
- **Concurrency:** cancel-in-progress on same ref
- **No secrets:** zero env secrets needed (GITHUB_TOKEN is Worker-level, not CI)
- **No deploy:** deploy step explicitly absent (requires Lucas authorization)

## Architecture note
Playwright runs in the SAME job as build/test (not a separate job). This is simpler for a solo project:
- No artifact passing between jobs
- Faster overall (build happens once)
- Simpler to debug failures

## Risks / Mitigations
| Risk | Mitigation |
|---|---|
| Dev server doesn't start in CI | `PLAYWRIGHT_AUTO_DEV=1` with 30s timeout |
| Chromium install fails | `--with-deps` includes system libs |
| Flaky tests | retries: 2 in CI, forbidOnly: true |
| Test artifacts lost | HTML reporter writes to `playwright-report/` (not uploaded as CI artifact yet — could add if needed) |

## Next
P09 — Final validation.
