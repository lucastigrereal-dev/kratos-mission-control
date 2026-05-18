import { test, expect } from "@playwright/test"

// Routes visible in the sidebar (Dashboard "/" is hidden)
const SIDEBAR_ROUTES = [
  { label: "Agora", path: "/agora" },
  { label: "Agenda", path: "/agenda" },
  { label: "Projetos", path: "/projetos" },
] as const

test.describe("Sidebar navigation", () => {
  test("navigates to each sidebar route by clicking", async ({ page }) => {
    await page.goto("/")

    // Wait for the shell to render
    await expect(page.locator("aside[aria-label='Navegação principal']")).toBeVisible()

    for (const { label, path } of SIDEBAR_ROUTES) {
      // Click the sidebar link by its accessible name
      const link = page.locator("aside[aria-label='Navegação principal']").getByRole("link", { name: label })
      await link.click()

      // Wait for navigation to settle
      await page.waitForURL(`**${path}`)
      await page.waitForLoadState("networkidle")

      // The URL should match
      expect(new URL(page.url()).pathname).toBe(path)

      // The sidebar link for the active route should have the active CSS class
      await expect(link).toHaveClass(/kratos-nav-item-active/)
    }
  })

  test("sidebar toggle collapses and expands", async ({ page }) => {
    await page.goto("/")

    const sidebar = page.locator("aside[aria-label='Navegação principal']")
    await expect(sidebar).toBeVisible()

    // The collapse button should be present
    const toggleBtn = sidebar.getByRole("button", { name: /Recolher sidebar|Expandir sidebar/i })

    // Initial state: expanded (label text visible)
    await expect(page.getByText("Operação")).toBeVisible()

    // Toggle to collapse
    await toggleBtn.click()
    // After collapse the section label should be hidden
    await expect(page.getByText("Operação")).not.toBeVisible()

    // Toggle to expand again
    await toggleBtn.click()
    await expect(page.getByText("Operação")).toBeVisible()
  })
})
