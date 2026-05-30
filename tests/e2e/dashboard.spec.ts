import { test, expect } from "@playwright/test"

test.describe("Dashboard page", () => {
  test("renders dashboard shell without console errors", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })

    await page.goto("/")
    await page.waitForLoadState("networkidle")

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0)
  })

  test("KRATOS brand is visible in top HUD", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    await expect(page.getByText("KRATOS", { exact: true }).first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test("Sidebar is present on dashboard", async ({ page }) => {
    await page.goto("/")

    const sidebarNav = page.locator("nav[aria-label='Navegação principal']").first()
    await expect(sidebarNav).toBeVisible()

    // At least some sidebar actions should be present
    const navButtons = sidebarNav.getByRole("button")
    const count = await navButtons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("Topbar greeting is visible", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    await expect(page.getByText(/Bom dia/i).first()).toBeVisible()
  })
})
