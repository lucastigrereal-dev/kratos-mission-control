# KRATOS Sprint C — V05 Sistema Clarity

**Data:** 2026-05-17

## Changes

### SistemaView (`src/components/kratos/views/SistemaView.tsx`)

**Foco:** Clareza nos estados de saúde, missing_config e separação visual.

| Change | Before | After |
|--------|--------|-------|
| Section labels (×7) | Inline `style` with kratos-mono tracking | `kratos-eyebrow` CSS class |
| Reference card labels (×3) | Inline `style` with kratos-mono tracking | `kratos-eyebrow` CSS class |
| Token consistency | Mixed `var(--kratos-*)` / `var(--kr-color-*)` | All `var(--kratos-*)` |

### Section labels migrated to `kratos-eyebrow`:
- KRATOS — Serviços monitorados
- OMNIS — Serviços
- OMNIS — Crews
- OMNIS — Jobs recentes
- Referência — 9 estados de live status
- Referência — estados de painel
- Reference card labels: empty, loading, error

### Already good (linter pre-cleaned):
- Worker health badge with `aria-label` + `role="status"`
- Config badges using correct `var(--kratos-*)` tokens
- Full loading/error/empty handling per section
- Reference gallery with all 9 live states

## Verification

- [x] `bun run build` — PASS (3.71s)
- [x] `bun test tests/` — 270 pass / 0 fail
- [x] Zero remaining inline mono+tracking labels in SistemaView
- [x] `kratos-eyebrow` used consistently for all section headers
