# KRATOS Sprint C — V03 Dashboard Clarity

**Data:** 2026-05-17

## Changes

### DashboardView (`src/components/kratos/views/DashboardView.tsx`)

**Foco operacional:** Clareza visual sem redesign.

| Change | Before | After |
|--------|--------|-------|
| GitHub badge tokens | `var(--kr-color-*)` | `var(--kratos-*)` |
| Foco off state accent | `"none"` (no border) | `"off_focus"` (red-tinted border) |
| Foco off color | warn (amber) | critical (red) — calls attention |
| Foco off sub message | raw `focusStatus` string | "Volte para a próxima ação" — actionable |
| Foco on sub message | raw `focusStatus` string | "Mantenha o ritmo" — encouraging |
| Section labels | inline `style` with kratos-mono | `kratos-eyebrow` CSS class |
| Config badges | Fixed width, could clip | `flex-wrap` for responsive wrap |
| Degraded services badge | None | Shows when snapshot reports degraded |
| Empty data label | "Sem dados" | "Sem dados de contexto" — specific |

### Token drift fixes
- `var(--kr-color-text-muted)` → `var(--kratos-text-muted)` (2 instances)
- `var(--kr-color-amber)` → `var(--kratos-warn)` (2 instances)

## Verification

- [x] `bun run build` — PASS (2.26s)
- [x] `bun test tests/` — 270 pass / 0 fail
- [x] Sem novos raw hex
- [x] `kratos-eyebrow` class usado para section labels
