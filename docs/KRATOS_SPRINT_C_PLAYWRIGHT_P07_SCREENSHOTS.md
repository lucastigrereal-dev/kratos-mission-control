# KRATOS Sprint C — P07 Screenshot Baseline

**Data:** 2026-05-17

## Files Created

### `tests/e2e/screenshots.baseline.spec.ts`
- Opt-in screenshot capture for 3 key routes: `/`, `/contexto`, `/sistema`
- Controlled by env var `Kratos_SCREENSHOT_BASELINE=1`
- Writes `.png` files to `screenshots/` dir
- Spec is skipped by default (no effect on normal test runs)

### `.gitignore` updated
- `screenshots/` excluded

## Usage

```powershell
# Generate baseline screenshots
$env:Kratos_SCREENSHOT_BASELINE=1; bun run test:e2e -- tests/e2e/screenshots.baseline.spec.ts

# Open screenshots
explorer screenshots/
```

## Design decisions
- **No images committed** — screenshots are manual review artifacts, not CI assertions
- **Opt-in via env var** — zero overhead on normal runs
- **Viewport only** — no fullPage (keeps files small, ~200KB each)
- Existing `screenshot: "only-on-failure"` in config covers regression debugging

## Next
P08 — CI Playwright.
