# KRATOS Sprint A W21 — E2E Smoke Plan

**Date:** 2026-05-17
**Wave:** A21

## Smoke Test Matrix

| # | Route | Test | Assertion |
|---|---|---|---|
| 1 | `/` | Page loads without crash | Title contains "KRATOS" |
| 2 | `/` | Dashboard summary cards render | At least 4 cards visible |
| 3 | `/agora` | Focus card renders | "Em foco" or equivalent text present |
| 4 | `/agora` | Next action card renders | Action text not empty |
| 5 | `/agenda` | Today panel renders | Date section visible |
| 6 | `/agenda` | Overdue panel conditionally renders | Panel container exists |
| 7 | `/checkpoints` | Checkpoint list renders | At least 1 checkpoint item or empty state |
| 8 | `/projetos` | Project list renders | At least 1 project card or empty state |
| 9 | `/contexto` | Context hero renders | Project name or "Sem contexto" text |
| 10 | `/contexto` | Focus drift card renders | Drift indicator present |
| 11 | `/sistema` | Services health renders | Service count visible |
| 12 | `/sistema` | Worker health status renders | Status badge present ("ok", "degraded", or "error") |
| 13 | All | Sidebar navigation works | Click each link → URL matches |
| 14 | All | Dark mode renders correctly | `html` has `dark` class or equivalent |
| 15 | All | Mobile viewport 375px | No horizontal overflow, sidebar collapses |

## Implementation Pattern

```ts
// e2e/smoke.spec.ts
import { test, expect } from "@playwright/test";

test.describe("KRATOS Smoke", () => {
  test("/ loads without crash", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1, h2, [data-testid]").first()).toBeVisible();
  });

  test("/agora renders focus card", async ({ page }) => {
    await page.goto("/agora");
    await expect(page.locator("text=Em Foco, text=Agora")).toBeVisible({ timeout: 5000 });
  });
});
```

## Data Attributes
Recommend adding these to key components for reliable selectors:
- `data-testid="kratos-shell"`
- `data-testid="focus-card"`
- `data-testid="next-action-card"`
- `data-testid="services-health"`
- `data-testid="worker-health-status"`
- `data-testid="sidebar-nav"`
- `data-testid="checkpoint-list"`
- `data-testid="project-list"`
- `data-testid="context-hero"`
- `data-testid="empty-state"`
- `data-testid="error-state"`

## CI Integration
- Run smoke tests in CI after `bun test tests/` passes
- Use `bunx playwright test` with `--reporter=line`
- Upload screenshots on failure as artifacts
