import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["list"],
  ],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Dev server managed externally by default (`bun run dev` in separate terminal).
  // Set PLAYWRIGHT_AUTO_DEV=1 to let Playwright spawn the dev server automatically.
  ...(process.env.PLAYWRIGHT_AUTO_DEV
    ? {
        webServer: {
          command: "bun run dev",
          url: "http://localhost:8080",
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
        },
      }
    : {}),
})
