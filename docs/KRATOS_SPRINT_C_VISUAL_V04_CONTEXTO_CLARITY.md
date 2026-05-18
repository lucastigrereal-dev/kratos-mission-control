# KRATOS Sprint C — V04 Contexto Clarity

**Data:** 2026-05-17

## Changes

### ContextoView (`src/components/kratos/views/ContextoView.tsx`)

**Foco:** Deixar claro o que é dado real, o que é inferido com baixa confiança, e o que está desatualizado.

| Change | Before | After |
|--------|--------|-------|
| Low confidence badge | None | "Baixa confiança — verifique manualmente" quando confidence < 45% |
| Stale data badge | None | "Dados desatualizados — recarregue" quando meta.stale |
| Right placeholder card | Bare `EmptyState` | Wrapped in `StatusCard` for visual consistency |
| Badge container | Fixed width | `flex-wrap` for responsive safety |
| SourceBadge row | Single badge only | Badge + conditional warning chips |

### Microcopy additions

- **Baixa confiança:** Aparece quando `confidence < 45%` — alerta o operador que a inferência de contexto pode estar errada
- **Dados desatualizados:** Aparece quando `meta.stale === true` — sugere recarregar
- **EmptyState wrapper:** "Sem outros sinais agora" agora tem o mesmo card background dos outros painéis

## Verification

- [x] `bun run build` — PASS (3.58s)
- [x] `bun test tests/` — 270 pass / 0 fail
- [x] Tokens consistentes
- [x] Sem redesign — apenas adições informativas
