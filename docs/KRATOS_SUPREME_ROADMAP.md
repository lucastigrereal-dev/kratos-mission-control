# KRATOS Supreme — Roadmap Mestre
**Gerado:** 2026-05-18  
**Estado atual:** 82% produto visual-operacional | 65% Supreme

---

## Visão canônica

KRATOS não é dashboard. É **sistema de continuidade cognitiva**:  
restaurar contexto mental → detectar drift → proteger hiperfoco → devolver o fio da missão.

```
Mundo real do Lucas
        ↓
Collectors / sensores
        ↓
Backend / normalização
        ↓
SQLite / contratos
        ↓
Mission Lens ← CÉREBRO CENTRAL
        ↓
Frontend / mundo 3D / HUD / Aurora
        ↓
Decisão do Lucas
        ↓
OMNIS/HOMINIS executa (com gate)
        ↓
Akasha registra
        ↓
KRATOS reobserva
```

---

## Estado atual por área

| Área | Status | Nota |
|---|---|---|
| Estrutura frontend | ✅ 95% | Shell, rotas, hooks, stores |
| Build client + SSR | ✅ | Zero erros |
| Mundo 3D CSS | ✅ | Sem WebGL, sem GPU hell |
| Mission Lens binding | ✅ | Fases 1-4 concluídas |
| SourceBadge system | ✅ | Injetado em todos os pontos |
| Rotas (9/9) | ✅ | HTTP 200 |
| Stores (270 pass) | ✅ | |
| AppShell duplicado | ✅ | Resolvido |
| Checkpoint CRUD | ✅ | Store + hook + UI |
| CheckpointResume | ✅ | DashboardView wired |
| Drift detection hook | ✅ | Existe, conectado |
| Mission Lens → cockpit | 🔄 70% | alerts/risks não exibidos no world |
| Aurora Command Dock | 🔄 40% | Dock existe, comandos reais pendentes |
| OMNIS gate | ❌ P5 | Bridge existe, execução controlada não |
| Akasha real | ❌ P7 | Placeholder |
| Testes frontend | ⚠️ | 39 fail pré-existentes (jsdom) |

---

## Sprints

### ✅ DONE — Mission Lens Binding (2026-05-18)
- `lastUpdatedAt` no hook
- `lensLastUpdatedAt` + `dashboardRefetch` no context
- SourceBadge em 6 componentes
- Timestamps reais (sem `new Date()` fake)
- AuroraChatDock wired com mentor_signals

---

### 🔥 P1 — Mission Lens Governa o Cockpit
**Objetivo:** Fazer Mission Lens mandar de verdade na home 3D.  
**Arquivos alvo:** `KratosWorldPage.tsx`, `StatusBarDock.tsx`, `CentralCastleMission.tsx`  
**Skills:** `kratos-world-map`, `kratos-hud`, `kratos-live-state-ui`

Tarefas:
- [ ] Exibir `lens.alerts` como AlertBadge no mundo (acima do castelo ou StatusBarDock)
- [ ] Exibir `lens.context.drift_risk` como cor/ícone no WorldCharacterMarker
- [ ] `WorldCharacterMarker.isActive` derivado de `connectionState === "live"` ← já feito? validar
- [ ] `StatusBarDock` exibir `nextAction` truncado com tooltip
- [ ] Validar que `CurrentMissionBar.missionTitle` vem de `lens.mission_lens.current_mission`
- [ ] `AuroraPanelV2Content` exibir `lens.context.focus_state` e `drift_risk`
- [ ] Testar 10-second cockpit: onde estou? o quê? risco? próxima ação? onde retomo?

---

### 🔥 P2 — Checkpoint Restore Save Game
**Objetivo:** Salvar e recuperar contexto como save game mental.  
**Arquivos alvo:** `KratosWorldPage.tsx`, `StatusBarDock.tsx`, `CheckpointResume`  
**Skills:** `kratos-checkpoints-screen`

Tarefas:
- [ ] Botão "Salvar Checkpoint" na StatusBarDock (next to Continuar)
- [ ] `createCheckpoint` mutation com contexto atual (mission, phase, nextAction)
- [ ] Exibir `pausedCheckpoints[0]` no mundo como CTA de retomada
- [ ] Restore com Aurora microcopy ("Você parou em X. Próxima ação: Y.")
- [ ] Badge no `WorldCharacterMarker` se tem checkpoint pausado

---

### 🔥 P3 — Drift Detection Real
**Objetivo:** Detectar quando Lucas saiu do eixo, avisar sem bronca.  
**Arquivos alvo:** `useDriftDetection.ts`, `DriftIndicator.tsx`, `KratosWorldPage.tsx`  
**Skills:** `kratos-live-state-ui`, `kratos-neuro-ux`

Tarefas:
- [ ] `DriftIndicator` aparecer no World quando drift ≠ "on-mission"
- [ ] `CentralCastleMission` mudar visual (cor, animação) com drift
- [ ] Mensagem Aurora no dock: "Você saiu da missão há X min. Quer voltar, atualizar ou salvar?"
- [ ] `ZombieBadge` com onRetryConnection ← já feito, validar
- [ ] Diferença visual clara: drift produtivo vs destrutivo

---

### P4 — Aurora Command Dock
**Objetivo:** Transformar dock vazio em comando real.  
**Arquivos alvo:** `AuroraChatDock.tsx`, `KratosWorldPage.tsx`  
**Skills:** `kratos-aurora-ui`

Tarefas:
- [ ] Comandos rápidos: `/retomar`, `/foco-agora`, `/salvar-checkpoint`, `/plano-20min`
- [ ] Input envia para `lensRefetch` + exibe resposta mock/real
- [ ] Sugestões contextuais baseadas em `mentor_signals`
- [ ] Estado vazio útil: "Pergunte à Aurora sobre sua missão"
- [ ] Modo: resumo / bronca útil / decisão / restore

---

### P5 — OMNIS Gate (requer backend)
Aprovação manual antes de qualquer execução OMNIS.  
→ Botão "Delegar para OMNIS" → tela aprovação → job queue → status → relatório

---

### P6 — QA Visual Anti-Carnaval
- Screenshot baseline
- Contraste, responsividade, reduced-motion
- Hierarquia: 1 próxima ação visualmente dominante
- Zero widget decorativo sem dado real

---

### P7 — Akasha Real (requer backend infra)
Memória semântica, busca por contexto, decisões canônicas.

---

## Skills a ativar por sprint

| Sprint | Skills |
|---|---|
| P1 | `kratos-world-map`, `kratos-hud`, `kratos-live-state-ui` |
| P2 | `kratos-checkpoints-screen` |
| P3 | `kratos-live-state-ui`, `kratos-neuro-ux` |
| P4 | `kratos-aurora-ui` |
| P6 | `kratos-visual-qa` |

---

## Teste dos 10 segundos (critério de done P1)

Abrir `/` e responder:
1. Onde estou? → `CurrentMissionBar`
2. O que estou fazendo? → `NextActionBlock` / `StatusBarDock`
3. Qual o risco? → `alerts` / drift_risk
4. Próxima ação? → `next_best_action`
5. Onde retomo? → `CheckpointResume`
6. O que NÃO abrir? → `do_not_do` / drift warning

**Se não responde 6/6 → P1 não está done.**
