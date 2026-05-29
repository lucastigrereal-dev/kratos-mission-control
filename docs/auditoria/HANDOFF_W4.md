# HANDOFF W4 — Missions Reality

**Branch:** `feature/kratos-supreme-w0-w22`  
**Tag:** `ksw-w4-missions-real`  
**Data:** 2026-05-29  
**Status:** ✅ COMPLETO

---

## Objetivo da Wave

Surfaçar as missões ativas do OMNIS no Dashboard.
`useMissions` já lia `/missions/active` corretamente, mas não retornava `sourceType`
e o Dashboard não tinha visibilidade de missões.

---

## O que foi feito

### B1 — useMissions: sourceType exposto
`src/hooks/useMissions.ts`:
- `fetchMissions` agora retorna `{ missions, sourceType: DataSource }`
- source="live" → "live", parse fail → "partial", request fail → "error"
- Padrão W1/W2/W3 aplicado (sourceType explícito em vez de implícito)

### B2 — ActiveMissionsPanel (novo componente)
`src/components/kratos/omnis/ActiveMissionsPanel.tsx`:
- Exibe máximo 3 missões running/paused (TDAH limit)
- Status dot: running=cyan + animate-pulse, paused=amber
- Badges de guardrail: `budget_exceeded` (critical) e `approval_pending` (warn)
- `cumulative_cost_usd` mostrado quando > 0
- `current_step` + tempo relativo como detalhe
- SourceBadge via `SourceBadgeIndicator`
- LoadingState quando `isLoading`
- "Nenhuma missão em execução agora." quando lista vazia

### B3 — DashboardView: Row 4 OMNIS
`src/components/kratos/views/DashboardView.tsx`:
- `useMissions(5)` importado e chamado
- `ActiveMissionsPanel` importado
- Row 4 adicionado entre CheckpointResume row e GitHub repos
- Renderização condicional: só aparece quando `missionsLoading || missions.length > 0`
- GitHub repos promovido para Row 5

### B4 — Testes: missions-reality.test.ts (novo)
`tests/stores/missions-reality.test.ts` — 19 testes cobrindo:
- Schema validation (5 testes)
- Source mapping (2 testes)
- filterActive: running+paused incluídos, outros excluídos, máx 3 (4 testes)
- Guardrail alerts: budget, approval, ambos, multi-missão (5 testes)
- Dashboard visibility rule (3 testes)

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ 0 erros novos (13 pré-existentes inalterados) |
| `bun run test` | ✅ 428 pass, 0 fail (19 novos W4 testes) |
| `bun run build` | ✅ clean (3.19s SSR) |
| code-review | ✅ integrado inline — max 3 limit, conditional render, isLoading propagado |

---

## Arquivos modificados / criados

| Arquivo | Ação |
|---|---|
| `src/hooks/useMissions.ts` | Modificado — sourceType exposto |
| `src/components/kratos/omnis/ActiveMissionsPanel.tsx` | Criado — componente compacto |
| `src/components/kratos/views/DashboardView.tsx` | Modificado — Row 4 OMNIS |
| `tests/stores/missions-reality.test.ts` | Criado — 19 testes |
| `docs/auditoria/HANDOFF_W4.md` | Criado — este documento |

---

## Noção de Done

- [x] `useMissions` retorna `sourceType` (live/partial/error)
- [x] Dashboard Row 4 mostra missões ativas do OMNIS
- [x] Máx 3 missões (running/paused) — TDAH limit
- [x] Painel oculto quando sem missões e sem loading
- [x] Guardrail alerts (budget_exceeded, approval_pending) como badges
- [x] SourceBadge via hook real
- [x] 19 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Próxima Wave

**W4.5** (aguardando definição) → **W5 — SSE Hardening** → **[MARCO P0]**

Ordem P0: W0 ✅ → W1 ✅ → W2 ✅ → W6 ✅ → W3 ✅ → W4 ✅ → **W4.5** → W5 → [MARCO P0]

---

_HANDOFF gerado automaticamente — Wave W4 concluída_
