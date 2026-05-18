import { test, expect } from "@playwright/test"
import { createConsoleGuard } from "./helpers/console-guard.js"

const ROUTES = [
  "/",
  "/agora",
  "/agenda",
  "/checkpoints",
  "/projetos",
  "/contexto",
  "/sistema",
]

test.describe("console error scan", () => {
  for (const path of ROUTES) {
    test(`${path} — no unexpected console errors`, async ({ page }) => {
      const guard = createConsoleGuard(page)

      await page.goto(path, { waitUntil: "domcontentloaded" })
      // Let the page settle so async chunks can fire
      await page.waitForTimeout(2000)

      const blocked = guard.collect()
      expect(blocked, `console.errors on ${path}:\n${blocked.join("\n")}`).toEqual([])
    })
  }
})
