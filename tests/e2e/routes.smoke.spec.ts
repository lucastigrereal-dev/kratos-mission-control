import { test, expect } from "@playwright/test"

const ROUTES = [
  { path: "/", shellLabel: "KRATOS Mission Control" },
  { path: "/agora", heading: "Você está aqui." },
  { path: "/agenda", heading: "Plano do dia, prazos e decisões" },
  { path: "/checkpoints", heading: "Seu save game mental para retomar sem se perder." },
  { path: "/projetos", heading: "Projetos conhecidos" },
  { path: "/contexto", heading: "Onde você está, onde se perdeu e como voltar." },
  { path: "/sistema", heading: "Saúde dos serviços e referência visual" },
] as const

test.describe("route smoke", () => {
  for (const route of ROUTES) {
    test(`${route.path} loads without fatal error`, async ({ page }) => {
      const { path } = route
      const res = await page.goto(path)
      expect(res?.ok()).toBeTruthy()

      if ("heading" in route) {
        await expect(
          page.getByRole("heading", { name: route.heading }),
        ).toBeVisible({ timeout: 15_000 })
      } else {
        await expect(
          page.locator(`[aria-label='${route.shellLabel}']`),
        ).toBeVisible({ timeout: 15_000 })
      }
    })
  }
})
