import { test, expect } from "@playwright/test"

const ROUTES = [
  { path: "/", heading: "KRATOS" },
  { path: "/agora", heading: "Você está aqui." },
  { path: "/agenda", heading: "Plano do dia, prazos e decisões" },
  { path: "/checkpoints", heading: "Seu save game mental para retomar sem se perder." },
  { path: "/projetos", heading: "Projetos conhecidos" },
  { path: "/contexto", heading: "Onde você está, onde se perdeu e como voltar." },
  { path: "/sistema", heading: "Saúde dos serviços e referência visual" },
]

test.describe("route smoke", () => {
  for (const { path, heading } of ROUTES) {
    test(`${path} loads without fatal error`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.ok()).toBeTruthy()

      await expect(
        page.getByRole("heading", { name: heading }),
      ).toBeVisible({ timeout: 15_000 })
    })
  }
})
