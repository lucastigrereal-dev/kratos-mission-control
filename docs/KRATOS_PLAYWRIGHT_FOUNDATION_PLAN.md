# KRATOS — Playwright Foundation Plan

**Date:** 2026-05-17  
**Wave:** K15  
**Status:** PLAN ONLY — not installed this sprint

---

## I. AUDIT RESULT

**Playwright is NOT installed.**
- No `playwright` in `package.json` dependencies
- No `playwright.config.*` file
- No `e2e/` directory
- No `tests/e2e/` directory

**Decision:** Do not install Playwright in this sprint. Document the plan instead.

---

## II. WHY DEFER PLAYWRIGHT

1. **No dev server in CI** — Playwright requires the app running at a URL
2. **No CI configured yet** — being done in K17
3. **Install requires explicit Lucas authorization** (new dependency)
4. **Bun test suite (134 tests) covers all logic** — Playwright adds visual/route smoke
5. **FrontendGuard active** — UI changes are frozen this sprint

---

## III. WHEN TO INSTALL

Install Playwright when:
- CI workflow is in place (K17)
- `bun run dev` can be called in CI environment
- Frontend sprint opens (FrontendGuard lifted)
- Lucas authorizes: `bunx playwright install --with-deps`

---

## IV. PROPOSED E2E SMOKE SUITE

Once installed, create `tests/e2e/smoke.spec.ts`:

```typescript
// tests/e2e/smoke.spec.ts
import { test, expect } from "@playwright/test";

const ROUTES = ["/", "/agora", "/agenda", "/checkpoints", "/projetos", "/contexto", "/sistema"];

for (const route of ROUTES) {
  test(`smoke: ${route} loads without error`, async ({ page }) => {
    await page.goto(route);
    await expect(page).not.toHaveTitle(/error/i);
    await expect(page.locator("body")).not.toContainText("500");
    await expect(page.locator("body")).not.toContainText("Cannot read");
    // Check no React crash overlay
    await expect(page.locator("[data-reactroot]")).toBeVisible();
  });
}
```

---

## V. PROPOSED PLAYWRIGHT CONFIG

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

---

## VI. PACKAGE.JSON ADDITIONS (future)

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0"
  }
}
```

---

## VII. CI INTEGRATION (future, K17)

```yaml
# .github/workflows/ci.yml addition
- name: Install Playwright
  run: bunx playwright install --with-deps chromium

- name: Run E2E Smoke Tests
  run: bun test:e2e
```

---

## SUMMARY

✅ Playwright audit complete — NOT installed  
✅ Installation plan documented  
✅ Smoke suite designed (7 routes)  
✅ Config template ready  
⏳ Installation — requires CI ready (K17) + Lucas authorization  
