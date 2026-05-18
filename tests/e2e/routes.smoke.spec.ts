import { test, expect } from "@playwright/test"

const ROUTES = [
  { path: "/", heading: "KRATOS" },
  { path: "/agora", heading: "Voce esta aqui." },
  { path: "/agenda", heading: "Plano do dia, prazos e decisoes" },
  { path: "/checkpoints", heading: "Seu save game mental para retomar sem se perder." },
  { path: "/projetos", heading: "Projetos conhecidos" },
  { path: "/contexto", heading: "Onde voce esta, onde se perdeu e como voltar." },
  { path: "/sistema", heading: "Saude dos servicos e referencia visual" },
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
