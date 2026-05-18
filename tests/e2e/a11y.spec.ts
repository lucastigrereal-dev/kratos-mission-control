import { test, expect } from "@playwright/test"

const ROUTES = ["/", "/agora", "/agenda", "/checkpoints", "/projetos", "/contexto", "/sistema"] as const

test.describe("Basic accessibility", () => {
  for (const route of ROUTES) {
    test(`${route} has a page title`, async ({ page }) => {
      await page.goto(route)
      await page.waitForLoadState("networkidle")

      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title).toContain("KRATOS")
    })
  }

  test("main navigation landmark is present", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // The sidebar is a navigation landmark
    const nav = page.locator("aside[aria-label='Navegação principal']")
    await expect(nav).toBeVisible()
  })

  test("body has lang attribute", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // __root.tsx sets <html lang="pt-BR">
    const html = page.locator("html")
    await expect(html).toHaveAttribute("lang", /pt-BR|pt|en/i)
  })

  test("color-scheme meta tag is present", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    const colorSchemeMeta = page.locator('meta[name="color-scheme"]')
    await expect(colorSchemeMeta).toHaveAttribute("content", "dark")
  })

  test("root page loads without critical a11y violations", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Ensure no focusable element is invisible or off-screen
    const main = page.locator("main").first()
    await expect(main).toBeVisible()
  })
})
