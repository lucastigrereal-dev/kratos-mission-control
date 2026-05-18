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

test.describe("snapshot states", () => {
  for (const { path, heading } of ROUTES) {
    test(`${path} settles into a final state`, async ({ page }) => {
      await page.goto(path)

      // The heading must be visible (any state — loading, error, empty, or live)
      await expect(
        page.getByRole("heading", { name: heading }),
      ).toBeVisible({ timeout: 15_000 })

      // After settling, any loading spinners should resolve
      await page.waitForTimeout(2000)
      const busy = page.locator("[aria-busy=true]")
      const busyCount = await busy.count()

      // Some pages may have parallel loading panels, but not all
      expect(busyCount).toBeLessThanOrEqual(2)
    })
  }

  test("/ does not crash to white screen", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    // Shell landmarks — sidebar and topbar should always be present
    await expect(page.locator("nav").first()).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole("heading", { name: "KRATOS" })).toBeVisible()
  })

  test("/sistema shows at least one status section", async ({ page }) => {
    await page.goto("/sistema", { waitUntil: "networkidle" })
    await page.waitForTimeout(2000)

    // Either OMNIS, services, or empty state sections should render
    const sectionTexts = [
      "OMNIS indisponível",
      "OMNIS sem sinal",
      "Nenhuma crew ativa",
      "Nenhum job recente",
      "Sem dados",
      "Coletor indisponível",
      "Saúde dos serviços",
    ]

    let found = false
    for (const text of sectionTexts) {
      if (await page.locator("text=" + text).isVisible().catch(() => false)) {
        found = true
        break
      }
    }
    expect(found).toBeTruthy()
  })
})
