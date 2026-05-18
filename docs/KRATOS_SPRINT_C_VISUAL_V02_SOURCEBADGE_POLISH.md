# KRATOS Sprint C — V02 SourceBadge Polish

**Data:** 2026-05-17

## Changes

### SourceBadgeIndicator (`src/components/kratos/base/SourceBadgeIndicator.tsx`)

**Before:** Dots coloridos + label + timeAgo + "!" se stale. Sem aria-label, sem origin, sem contagem de erros.

**After:**

| Feature | Before | After |
|---------|--------|-------|
| aria-label | title attribute only | `role="status"` + `aria-label` com todos os campos |
| Origin display | None | Mostra `origin` em mono quando disponível (ex: "akasha", "github") |
| Error count | None | Badge numérico circular com fundo critical |
| Stale indicator | "!" inlinetext | Círculo sólido "!" com fundo critical |
| Cache source | Fallthrough para raw string | Label "Cache" + cor info (azul) |
| Token drift | `var(--kr-color-*)` | `var(--kratos-*)` consistente |
| Labels | Inline ternary | Mapa `SOURCE_LABEL` / `SOURCE_SEVERITY` |
| Label contrast | text-secondary | text-primary + font-medium para o label principal |

### Estados visuais do SourceBadge

| Source | Cor | Label |
|--------|-----|-------|
| live | verde (ok) | Ao vivo |
| mock | ambar (warn) | Simulado |
| cache | azul (info) | Cache |
| partial | ambar (warn) | Parcial |
| stale | vermelho (critical) | Desatualizado |
| +stale flag | — | Círculo "!" sólido |
| +errors[] | — | Badge numérico |

## Verification

- [x] `bun run build` — PASS (3.06s)
- [x] `bun test tests/` — 270 pass / 0 fail
- [x] Tokens consistentes (`--kratos-*`, não `--kr-color-*`)
- [x] aria-label funcional com screen reader
- [x] Nenhum novo raw hex (exceto #fff nos badges que precisam de contraste absoluto)
