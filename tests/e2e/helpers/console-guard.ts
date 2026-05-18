import type { Page } from "@playwright/test"

/**
 * Known console patterns we tolerate. Add entries as discovered.
 * Keep this list small — every entry needs a justification.
 */
const ALLOWED_CONSOLE_ERRORS: RegExp[] = [
  // TanStack Start dev-mode hydration notes (not errors in prod)
  /hydration/i,
  // Vite HMR websocket reconnect noise in dev
  /hmr/i,
  /websocket/i,
  // Vite dev server lifecycle (not errors)
  /^\[vite\]/,
  // React DevTools download suggestion (dev only)
  /React DevTools/,
  // React CatchBoundary warnings in dev mode (expected when mock data is empty)
  /CatchBoundaryImpl/,
  /route match/,
]

export function isBlockedError(message: string): boolean {
  return !ALLOWED_CONSOLE_ERRORS.some((pattern) => pattern.test(message))
}

/**
 * Attach a console.error listener to `page` that collects blocked errors.
 * Call `collect()` at the end of the test to assert no unexpected errors occurred.
 */
export function createConsoleGuard(page: Page) {
  const blockedErrors: string[] = []

  const handler = (msg: { text: () => string }) => {
    const text = msg.text()
    if (isBlockedError(text)) {
      blockedErrors.push(text)
    }
  }

  page.on("console", handler)

  return {
    collect() {
      page.off("console", handler)
      return [...blockedErrors]
    },
  }
}
