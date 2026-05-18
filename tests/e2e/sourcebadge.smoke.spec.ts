import { test, expect } from "@playwright/test"

const ROUTES_WITH_SOURCEBADGE = ["/", "/contexto", "/sistema"]

test.describe("source badge indicator", () => {
  for (const path of ROUTES_WITH_SOURCEBADGE) {
    test(`${path} shows a source badge`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" })
      // Let async data resolve
      await page.waitForTimeout(2000)

      // The badge renders one of the known labels if meta is present
      const badge = page.locator("span").filter({ hasText: /Ao vivo|Simulado|Parcial|Desatualizado/ }).first()
      await expect(badge).toBeVisible({ timeout: 10_000 })

      // The title attribute carries machine-readable metadata
      const title = await badge.getAttribute("title")
      expect(title).toBeTruthy()
      expect(title).toMatch(/Fonte:/)
    })
  }
})
