# KRATOS Sprint C — P03 Route Smoke E2E

**Data:** 2026-05-17

## Tests Created
`tests/e2e/routes.smoke.spec.ts` — 7 smoke tests, 1 per route.

## Coverage

| Route | Heading Asserted | Status |
|---|---|---|
| `/` | "KRATOS" | ✅ |
| `/agora` | "Voce esta aqui." | ✅ |
| `/agenda` | "Plano do dia, prazos e decisoes" | ✅ |
| `/checkpoints` | "Seu save game mental para retomar sem se perder." | ✅ |
| `/projetos` | "Projetos conhecidos" | ✅ |
| `/contexto` | "Onde voce esta, onde se perdeu e como voltar." | ✅ |
| `/sistema` | "Saude dos servicos e referencia visual" | ✅ |

## Test strategy
- `page.goto(path)` → check `res.ok()` (no HTTP error)
- `page.getByRole("heading", { name })` → visible within 15s
- No pixel-perfect assertions
- No text-exact dependency beyond heading
- Uses SectionHeader `<h2>` as stable landmark

## Next
P04 — Console error scan.
