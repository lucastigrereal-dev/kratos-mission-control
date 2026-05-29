# HANDOFF W4.5 — Aurora Drawer Reality

**Branch:** `feature/kratos-1-frontend-visual`  
**Tag:** `ksw-w4.5-aurora-real`  
**Data:** 2026-05-29  
**Status:** ✅ COMPLETO

---

## Objetivo da Wave

Eliminar os últimos mocks visíveis do shell principal. `AuroraDrawer` era o
único componente montado em todas as rotas (via `AppShell`) que ainda exibia
dados hardcoded — `MOCK_TASKS`, `MOCK_AGENDA` e texto de contexto fixo.

---

## O que foi feito

### B1 — AuroraDrawer: tasks reais
`src/components/kratos/shell/AuroraDrawer.tsx`:
- `MOCK_TASKS` removido — usa `useTasksToday()` (query key `["tasks","today"]`)
- Exibe `tasks?.urgent.slice(0, 3)`: tarefas em andamento/alta prioridade
- Tarefas atrasadas (`overdue`) aparecem com ícone `AlertCircle` em cor critical
- `LoadingState compact` quando `tasksLoading`
- "Sem tarefas urgentes agora." quando lista vazia

### B2 — AuroraDrawer: agenda real
- `MOCK_AGENDA` removido — usa `useAppointments()` (query key `["appointments"]`)
- `deriveAuroraAgenda()`: filtra hoje, exclui `completed`, ordena por `horario`, máx 3
- Compromisso sem horário (`null`) vai pro final (fallback `"23:59"` na ordenação)
- Cor por tipo: `deep_work`→azul, `checkpoint`→verde, `admin`→âmbar, resto→azul
- "Sem compromissos hoje." quando vazio
- Botão "Ver agenda completa" → navega `/agenda`

### B3 — AuroraDrawer: widget de contexto real
- Texto hardcoded removido — usa `useMissionLens()` (query key `["mission-lens"]`)
- Exibe `lens.mission_lens?.current_mission` e `lens.context?.focus_state`
- `focusStateLabel()`: mapeia `on_focus`/`execution` → "em foco", `off_focus`/`standby` → "em standby"
- `nextAction` vem de `lens.next_best_action?.action` com fallback "Definir próxima ação"
- `LoadingState compact` quando `lensLoading`
- Texto "Contexto indisponível." quando `lens === null`

### B4 — Testes: aurora-drawer-reality.test.ts (novo)
`tests/stores/aurora-drawer-reality.test.ts` — 19 testes cobrindo:
- `deriveAuroraAgenda`: filter hoje, exclui completed, ordena por horário, máx 3, lista vazia, sem horário (6 testes)
- `focusStateLabel`: undefined, on_focus, execution, off_focus, standby, valor desconhecido (6 testes)
- `appointmentTypeColor`: deep_work, checkpoint, admin, meeting+review (4 testes)
- `deriveMissionContextText`: com missão, sem missão (—), missionName undefined (3 testes)

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ 13 erros pré-existentes inalterados |
| `bun run test` | ✅ 447 pass, 0 fail (+19 novos W4.5) |
| `bun run build` | ✅ clean (3.27s) |
| code-review | ✅ AppShell não tocado (PROTEGIDO), hooks deduplicados pelo TanStack Query |

---

## Arquivos modificados / criados

| Arquivo | Ação |
|---|---|
| `src/components/kratos/shell/AuroraDrawer.tsx` | Modificado — mocks eliminados, 3 hooks wired |
| `tests/stores/aurora-drawer-reality.test.ts` | Criado — 19 testes |
| `docs/auditoria/HANDOFF_W4.5.md` | Criado — este documento |

---

## Noção de Done

- [x] `MOCK_TASKS` removido — `useTasksToday()` fornece dados reais
- [x] `MOCK_AGENDA` removido — `useAppointments()` fornece agenda real
- [x] Texto de contexto hardcoded substituído por `useMissionLens()`
- [x] `focusStateLabel()` normaliza todos os estados do Python
- [x] Máx 3 itens por seção (TDAH limit)
- [x] LoadingState + empty states em todas as seções
- [x] AppShell não alterado (componente protegido)
- [x] 19 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Próxima Wave

**W5 — SSE Hardening** → **[MARCO P0]**

Ordem P0: W0 ✅ → W1 ✅ → W2 ✅ → W6 ✅ → W3 ✅ → W4 ✅ → W4.5 ✅ → **W5** → [MARCO P0]

---

_HANDOFF gerado automaticamente — Wave W4.5 concluída_
