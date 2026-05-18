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

  test("SourceBadgeIndicator is visible", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // SourceBadgeIndicator renders an inline indicator with a rounded-full border.
    // It may show "Simulado" (mock), "Ao vivo" (live), "Parcial" (partial), etc.
    const badge = page.locator("span[title*='Fonte:']")
    await expect(badge.first()).toBeVisible({ timeout: 10_000 })
  })

  test("Sidebar is present on dashboard", async ({ page }) => {
    await page.goto("/")

    const sidebar = page.locator("aside[aria-label='Navegação principal']")
    await expect(sidebar).toBeVisible()

    // At least some sidebar links should be present
    const navLinks = sidebar.getByRole("link")
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test("Topbar greeting is visible", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // The Topbar typically shows a greeting
    const topbar = page.locator("header").first()
    await expect(topbar).toBeVisible()
  })
})
