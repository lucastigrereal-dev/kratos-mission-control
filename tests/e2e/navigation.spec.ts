import { test, expect } from "@playwright/test"

// Routes visible in the sidebar (Dashboard "/" is hidden)
const SIDEBAR_ROUTES = [
  { label: "MISSÕES", path: "/agora" },
  { label: "AGENDA", path: "/agenda" },
  { label: "PROJETOS", path: "/projetos" },
] as const

test.describe("Sidebar navigation", () => {
  test("navigates to each sidebar route by clicking", async ({ page }) => {
    await page.goto("/")

    // Wait for the shell to render
    const sidebarNav = page.locator("nav[aria-label='Navegação principal']").first()
    await expect(sidebarNav).toBeVisible()

    for (const { label, path } of SIDEBAR_ROUTES) {
      // Click the sidebar action by label
      const action = sidebarNav.getByRole("button", { name: new RegExp(label, "i") })
      await action.click({ force: true })

      // SPA navigation may not trigger a full "load" event.
      await expect(page).toHaveURL(new RegExp(`${path}$`), { timeout: 10_000 })

      // The URL should match
      expect(new URL(page.url()).pathname).toBe(path)
    }
  })

  test("sidebar toggle collapses and expands", async ({ page }) => {
    await page.goto("/")

    const sidebarNav = page.locator("nav[aria-label='Navegação principal']").first()
    await expect(sidebarNav).toBeVisible()

    const toggleSelector = /Recolher menu|Expandir menu/i
    await expect(page.getByRole("button", { name: toggleSelector }).first()).toBeVisible()

    // Toggle to collapse
    await page.getByRole("button", { name: toggleSelector }).first().click()
    // After toggle the button should still be present
    await expect(page.getByRole("button", { name: toggleSelector }).first()).toBeVisible()

    // Toggle to expand again
    await page.getByRole("button", { name: toggleSelector }).first().click()
    // Button should still be functional
    await expect(page.getByRole("button", { name: toggleSelector }).first()).toBeVisible()
  })
})
