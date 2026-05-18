/**
 * Lightweight screenshot baseline.
 *
 * This spec only runs when Kratos_SCREENSHOT_BASELINE=1 is set.
 * It captures one viewport screenshot per key route and writes to
 * `screenshots/` for manual visual review.
 *
 * Screenshots are NOT committed (screenshots/ is gitignored).
 *
 * Usage:
 *   $env:Kratos_SCREENSHOT_BASELINE=1; bun run test:e2e -- tests/e2e/screenshots.baseline.spec.ts
 */

import { test } from "@playwright/test"
import path from "node:path"
import fs from "node:fs"

const KEY_ROUTES = [
  { path: "/", label: "dashboard" },
  { path: "/contexto", label: "contexto" },
  { path: "/sistema", label: "sistema" },
]

const run = process.env.Kratos_SCREENSHOT_BASELINE === "1"

test.describe("screenshot baseline", () => {
  test.skip(!run, "Set Kratos_SCREENSHOT_BASELINE=1 to generate baseline screenshots")

  for (const { path: route, label } of KEY_ROUTES) {
    test(`${label} (${route})`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" })
      await page.waitForTimeout(1000)

      const dir = path.resolve("screenshots")
      fs.mkdirSync(dir, { recursive: true })

      await page.screenshot({
        path: path.join(dir, `${label}.png`),
        fullPage: false,
      })
    })
  }
})
