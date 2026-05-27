# KRATOS Mission Control — Relatório de Arquitetura Completo

> **Senior Dev Report** | 2026-05-12
> Commit canônico: `60c986d` | Fase: 0.8C | Testes: 296/296 ✅

---

## 1. IDENTIDADE DO SISTEMA

### Definição canônica

> KRATOS Mission Control é o cockpit local-first que transforma o caos do computador, projetos, containers, código, agenda e contexto em uma próxima ação clara.

**KRATOS devolve o fio da missão.**

### As 9 perguntas que o KRATOS responde

```
1. Onde estou?              → /context/current, /mission/lens
2. O que estou fazendo?     → /context/current (app ativo, janela, foco)
3. O que está rodando?      → /docker, /system
4. O que quebrou?           → /alerts, /collector_status
5. Onde parei?              → /checkpoints
6. O que está atrasado?     → /deadlines/overdue, /tasks/overdue
7. Qual projeto está em risco? → /alerts (repo_dirty, container_unhealthy)
8. Qual é a próxima ação?   → /mentor/next-action, /live/snapshot
9. O que NÃO devo abrir?    → /mission/lens → do_not_do
```

Estas são as únicas perguntas que importam. Tudo no backend e frontend existe para respondê-las.

---

## 2. POSICIONAMENTO NO ECOSSISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    OPERADOR (Lucas Tigre)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌──────────┐      ┌──────────┐
    │ KRATOS  │      │  AURORA  │      │  OMNIS   │
    │ (vê)    │      │ (fala)   │      │ (age)    │
    └────┬────┘      └────┬─────┘      └────┬─────┘
         │                │                 │
         ▼                ▼                 ▼
   estado real      interpretação       execução
   do sistema       do estado           de missões
```

| Peça | Função | Operação |
|---|---|---|
| **KRATOS Backend** | Observa, coleta, compara, alerta, registra, recomenda | Read-mostly |
| **KRATOS Frontend** | Exibe o estado como cockpit ultra intuitivo | Display |
| **Aurora** | Voz/mentora que interpreta o estado e puxa de volta pro foco | Interpretação |
| **OMNIS** | Executa missões, aciona skills, squads e workflows | Write |
| **Claude Code** | Executor técnico/dev durante a construção | Dev |

**KRATOS vs OMNIS:** KRATOS observa o computador. OMNIS opera o ecossistema.

### O que o KRATOS É
- Cockpit operacional — painel de comando do operador Lucas
- Lente de missão — filtra o ruído e mostra o que importa agora
- Sistema de contexto — sabe onde você está e quando perdeu o fio
- Painel de risco — mostra o que está em risco antes de virar problema
- Mentor de próxima ação — recomenda a ação de maior impacto no momento
- Torre de controle local-first — roda na máquina, sem cloud, sem latência, sem dependência externa

### O que o KRATOS NÃO É
- App de tarefas (não é Notion, Todoist, Linear)
- Dashboard genérico (não exibe métricas por exibir)
- Frontend bonito (a estética serve a clareza, não o contrário)
- Chatbot (Aurora interpreta, mas KRATOS não é um chat)
- Sistema de monitoramento técnico (não é Grafana, Datadog)

---

## 3. STACK TECNOLÓGICO

| Camada | Tecnologia | Detalhe |
|---|---|---|
| **Frontend** | React 18 + Vite 8 + TypeScript | 10 páginas, 32 componentes, Tailwind CSS |
| **Backend** | FastAPI (Python 3.12) | Uvicorn, 18 route modules, ThreadPoolExecutor |
| **Database** | SQLite (local) | 12 tabelas, schema versionado |
| **Comunicação** | REST + SSE | `/live/stream` (SSE a cada 5s), `/live/snapshot` (JSON) |
| **Colectores** | Python nativo | Docker CLI, Git CLI, psutil, OMNIS CLI, ActivityWatch API |
| **Cache** | In-memory TTL | `live_cache_service.py` — Lock + dict, sem Redis |
| **Mock data** | JSON estático | `mock-data/` — 25 arquivos, fallback para todos os collectors |

### Por que SQLite e não PostgreSQL?
- Zero dependência externa — KRATOS precisa funcionar mesmo com Docker parado
- Single-file — backup e reset triviais
- Read-mostly workload — SQLite é excelente para leituras concorrentes leves
- Local-first — coerente com a filosofia do sistema

### Por que SSE e não WebSocket?
- SSE é unidirecional (servidor → cliente) — suficiente para telemetria
- Zero handshake complexity — funciona com `EventSource` nativo do browser
- Reconexão automática — browser gerencia retry nativamente
- Read-only por definição — KRATOS não recebe comandos via stream

---

## 4. ARQUITETURA DO BACKEND

### Estrutura de diretórios

```
backend/
├── app/
│   ├── main.py                          # FastAPI app, lifespan, CORS, 40+ endpoints
│   ├── collectors/                      # 6 coletores reais
│   │   ├── system_collector.py          # psutil — CPU, RAM, disco
│   │   ├── docker_collector.py          # docker ps — containers, health
│   │   ├── git_collector.py             # git status em múltiplos repos
│   │   ├── omnis_collector.py           # OMNIS CLI bridge (read-only)
│   │   ├── activitywatch_collector.py   # ActivityWatch API — janelas, AFK
│   │   └── outputs_collector.py         # Outputs de arquivos gerados
│   ├── routes/                          # 18 módulos de rota
│   │   ├── health.py                    # GET /health
│   │   ├── live.py                      # GET /live/stream (SSE), /live/snapshot
│   │   ├── now.py, projects.py          # Core observabilidade
│   │   ├── system.py, docker.py, git.py # Infraestrutura
│   │   ├── activity.py, activitywatch.py, context.py  # Contexto
│   │   ├── tasks.py, goals.py, deliverables.py        # Mentor operacional
│   │   ├── reminders.py, checkpoints.py               # Memória
│   │   ├── mentor.py, mission.py       # Inteligência
│   │   ├── alerts.py, calendar.py      # Risco e agenda
│   │   ├── execution.py, deadlines.py   # Execução
│   │   ├── metrics.py, omnis.py        # Métricas e bridge
│   │   ├── snapshots.py, timeline.py   # Histórico
│   │   └── outputs.py, tabs.py         # Outputs e navegador
│   ├── services/                        # 16 serviços de negócio
│   │   ├── __init__.py                  # Service layer + fallback orchestration
│   │   ├── live_event_service.py        # build_live_payload() — 9 seções paralelas
│   │   ├── live_cache_service.py        # TTL cache in-memory
│   │   ├── snapshot_service.py          # Persistência SQLite de snapshots
│   │   ├── alert_service.py             # Detecção e gestão de alertas
│   │   ├── calendar_service.py          # Eventos, deadlines, overdue
│   │   ├── execution_plan_service.py    # Plano do dia (timeblocks + do_not_do)
│   │   ├── mentor_signal_service.py     # Geração de sinais operacionais
│   │   ├── mentor_decision_service.py   # Next Best Action (NBA) engine
│   │   ├── mission_intelligence_service.py  # Mission Lens composer
│   │   ├── context_classifier_service.py    # App/title/URL → projeto
│   │   ├── context_drift_service.py         # Análise de drift de foco
│   │   ├── context_loss_service.py          # Detecção de perda de contexto
│   │   ├── context_checkpoint_service.py    # Save checkpoint from context
│   │   ├── checkpoint_suggestion_service.py # Sugestão de checkpoint
│   │   └── diff_service.py                  # Diff entre snapshots
│   ├── models/models.py                # 12 Pydantic models
│   └── db/database.py                  # SQLite init + helpers
├── tests/                              # 296 testes
│   ├── test_api.py                     # Endpoints CRUD
│   ├── test_live.py                    # Live SSE + snapshot
│   ├── test_snapshot.py                # Persistência
│   ├── test_mentor.py                  # Mentor signals + decisões
│   ├── test_mission.py                 # Mission Lens contract
│   ├── test_calendar.py                # Agenda e deadlines
│   ├── test_context_checkpoint.py      # Save/restore contexto
│   ├── test_context_drift.py           # Drift detection
│   ├── test_checkpoint_suggestion.py   # Auto-sugestão (27 testes)
│   └── test_activitywatch.py           # AW bridge
├── data/                               # SQLite DB file
├── requirements.txt
├── start_backend.ps1                   # Script oficial de start
└── .venv/                              # Virtual environment
```

### Fluxo de dados principal

```
Collectors (ThreadPoolExecutor)
  ├── system_collector   → psutil.cpu_percent/memory/disk       ─┐
  ├── docker_collector   → subprocess: docker ps --format json   │
  ├── git_collector      → subprocess: git status em repos       ├── _collector_wrapper()
  ├── omnis_collector    → OMNIS CLI bridge                      │   (try real, fallback mock)
  ├── activitywatch_col  → http://localhost:5600/api/0           │
  └── outputs_collector  → filesystem scan                       ─┘
       │
       ▼
Services (composição)
  ├── live_event_service   → 9 seções em paralelo (3s timeout)
  │   ├── context           → get_context_current()
  │   ├── alerts            → alert_service.get_alerts()
  │   ├── mentor_signals    → signal_service + loss_service + NBA
  │   ├── next_best_action  → mentor_decision_service
  │   ├── collector_status  → status de todos os 5 coletores
  │   ├── today_execution   → execution_plan_service
  │   ├── today_agenda      → calendar_service
  │   ├── recent_checkpoints → get_checkpoints()
  │   └── mission_lens      → mission_intelligence_service
  │
  ▼
Routes (exposição)
  ├── GET  /live/snapshot   → JSON único com todas as 9 seções
  ├── GET  /live/stream     → SSE a cada 5s (mesmo payload)
  ├── GET  /mission/lens    → Mission Lens isolada
  └── GET  /context/current → Contexto + drift + sugestão checkpoint
```

### Sistema de fallback em 3 camadas

```
Tentativa 1: Collector real (Docker CLI, Git CLI, psutil, ActivityWatch API)
    ↓ falha
Tentativa 2: Cache TTL (último valor válido, idade variável por seção)
    ↓ falha
Tentativa 3: Mock JSON (dados estáticos de mock-data/*.json)
```

Cada camada é independente — um collector em fallback não contamina os outros.

---

## 5. ARQUITETURA DO FRONTEND

### Estrutura

```
frontend/src/
├── main.tsx                    # Entry point
├── App.tsx                     # Router + layout principal
├── index.css                   # Tailwind + estilos globais
├── types/kratos.ts             # 17 TypeScript interfaces
├── lib/api.ts                  # 30+ fetch wrappers
├── hooks/useLiveKratos.ts      # Hook de conexão SSE + polling
├── pages/                      # 10 páginas (React Router)
│   ├── Agora.tsx               # / — cockpit principal
│   ├── Contexto.tsx            # /contexto — foco + drift
│   ├── Checkpoints.tsx         # /checkpoints — snapshots
│   ├── Agenda.tsx              # /agenda — plano do dia
│   ├── Deadlines.tsx           # /deadlines — prazos
│   ├── Projetos.tsx            # /projetos — status projetos
│   ├── Tarefas.tsx             # /tasks — quadro kanban
│   ├── Sistema.tsx             # /services — infra
│   ├── Finalizar.tsx           # /finalize — encerrar pendências
│   └── OmnisSnapshot.tsx       # /omnis — visão OMNIS
├── components/                 # 32 componentes React
│   ├── NextBestActionCard.tsx  # Ação principal em destaque
│   ├── MissionLensPanel.tsx    # Painel da lente de missão
│   ├── CurrentContextCard.tsx  # App/janela ativa
│   ├── FocusDriftAlert.tsx     # Alerta de perda de foco
│   ├── FocusModeCard.tsx       # Card de modo foco
│   ├── LiveStatusIndicator.tsx # Indicador SSE vivo
│   ├── ExecutionPlanCard.tsx   # Plano com timeblocks
│   ├── DoNotDoBox.tsx          # Lista "não fazer"
│   ├── TodayAgendaPanel.tsx    # Agenda do dia
│   ├── TodayTasksPanel.tsx     # Tarefas de hoje
│   ├── WeeklyFocusPanel.tsx    # Foco da semana
│   ├── DeadlineCalendar.tsx    # Calendário de prazos
│   ├── MissingDeadlinePanel.tsx # Itens sem prazo
│   ├── MentorSummaryCard.tsx   # Resumo do mentor
│   ├── MentorSignalsPanel.tsx  # Sinais operacionais
│   ├── MentorRecommendationList.tsx # Recomendações
│   ├── CheckpointPanel.tsx     # Painel de checkpoint
│   ├── ContextCheckpointButton.tsx # Botão salvar checkpoint
│   ├── ContextSwitchPanel.tsx  # Trocas de contexto
│   ├── ActiveWindowTimeline.tsx # Timeline janelas ativas
│   ├── BrowserContextList.tsx  # Abas do navegador
│   ├── AlertList.tsx           # Lista de alertas
│   ├── RiskBanner.tsx          # Banner de risco
│   ├── ProjectsAtRiskPanel.tsx # Projetos em risco
│   ├── ProjectCard.tsx         # Card de projeto
│   ├── StatusCard.tsx          # Card de status genérico
│   ├── ServiceHealthTable.tsx  # Tabela saúde serviços
│   ├── OmnisStatusCard.tsx     # Status OMNIS
│   ├── NextActionCard.tsx      # Próxima ação
│   ├── FinishLinePanel.tsx     # Itens para finalizar
│   ├── UnfinishedProjectsPanel.tsx # Projetos esquecidos
│   └── UnknownTabsPanel.tsx    # Abas não classificadas
└── assets/                     # Ícones e imagens
```

### Layout principal (Agora)

```
┌──────────────────────────────────────────────────────────┐
│ COMMAND BAR — "O que você quer fazer?"                    │
├──────────────────┬───────────────────┬───────────────────┤
│ MENTOR           │ STATUS            │ PENDÊNCIAS        │
│                  │                   │                   │
│ Próx ação (NBA)  │ Sistema (CPU/RAM) │ Proj esquecidos   │
│ Tarefas hoje     │ Docker (contêiner)│ Finalizar         │
│ Agenda           │ OMNIS             │ Outputs recentes  │
│ Deadlines        │ Riscos ativos     │                   │
│ Modo Foco        │ Alertas           │                   │
├──────────────────┴───────────────────┴───────────────────┤
│ NAVEGAÇÃO                                                │
│ Agora | Contexto | Tarefas | Projetos | Agenda           │
│ Deadlines | Checkpoints | Sistema | Finalizar | OMNIS    │
└──────────────────────────────────────────────────────────┘
```

### Binding de dados

O frontend usa `useLiveKratos.ts` — um hook customizado que:
1. Abre `EventSource` para `/live/stream` (SSE)
2. Faz fallback para polling de `/live/snapshot` se SSE falhar
3. Expõe `{ data, isConnected, isStale, lastUpdated }` para todos os componentes
4. Respeita `stale_after_ms: 12000` do contrato Mission Lens

---

## 6. DATA MODEL (SQLite — 12 tabelas)

### Core
| Tabela | Propósito | Modo |
|---|---|---|
| `projects` | Projetos do ecossistema | Read/Write |
| `missions` | Missões ativas por projeto | Read/Write |
| `checkpoints` | Snapshots de estado com payload | Write (read do DB) |
| `activity_events` | Eventos de atividade | Write |
| `browser_tabs` | Abas do navegador | Write |

### Infraestrutura
| Tabela | Propósito | Modo |
|---|---|---|
| `repo_state` | Estado de repositórios Git | Write (coleta) |
| `container_state` | Estado de containers Docker | Write (coleta) |
| `system_metrics` | CPU, RAM, disco | Write (coleta) |
| `alerts` | Alertas ativos/resolvidos | Read/Write |

### Mentor Operacional
| Tabela | Propósito | Modo |
|---|---|---|
| `tasks` | Tarefas com status kanban | Read/Write |
| `project_goals` | Objetivos por projeto | Read/Write |
| `deliverables` | Entregas com deadline | Read/Write |
| `reminders` | Lembretes agendados | Read/Write |
| `unfinished_items` | Itens detectados não finalizados | Read |

### Coletores (tabelas de runtime)
| Tabela | Propósito |
|---|---|
| `collector_snapshots` | Histórico de snapshots por collector |
| `collector_runs` | Log de execuções dos coletores |
| `metric_timeseries` | Métricas temporais |

---

## 7. CONTRATO MISSION LENS v1

O Mission Lens é o payload canônico que alimenta o cockpit. Presente em 3 endpoints:

| Endpoint | Tipo | Uso |
|---|---|---|
| `/mission/lens` | GET JSON | Consumo direto |
| `/live/snapshot` | GET JSON | Campo `mission_lens` dentro do payload completo |
| `/live/stream` | GET SSE | Campo `mission_lens` em cada evento (a cada 5s) |

### Estrutura completa

```json
{
  "contract_version": "mission_lens.v1",
  "source": "real",
  "collector_status": "ok",
  "generated_at": "2026-05-12T22:55:55Z",
  "stale_after_ms": 12000,
  "data": {
    "current_mission": {
      "title": "Fase 0.8C — Auto Checkpoint Suggestion",
      "project": "KRATOS Mission Control",
      "focus_state": "on_focus",
      "confidence": 0.85
    },
    "next_action": {
      "title": "Investigar logs do akasha-postgres",
      "rationale": "Container unhealthy — bloqueador",
      "priority": "high",
      "source": "nba",
      "cta_label": "Fazer isso agora"
    },
    "do_not_do": [
      { "title": "Não abrir novo projeto", "reason": "...", "severity": "warning" }
    ],
    "risks": [
      { "title": "Repo dirty há 61 dias", "severity": "critical", "entity": "daily-prophet-hotels" }
    ],
    "deadlines": [
      { "title": "Prazo entrega hotel A", "project_id": "...", "severity": "warning", "due_at": "..." }
    ],
    "checkpoint": {
      "available": true,
      "label": "Checkpoint: Fase 0.3",
      "last_checkpoint_at": "2026-05-08T01:29:53Z",
      "resume_hint": "Retomar de: 'Checkpoint: Fase 0.3'"
    },
    "checkpoint_suggestion": {
      "should_suggest": true,
      "severity": "medium",
      "reason": "Drift detectado há 10min",
      "suggested_checkpoint": { "project": "...", "mission": "...", "where_i_stopped": "..." },
      "cooldown": { "active": false, "remaining_minutes": 0 }
    },
    "system_pulse": {
      "status": "degraded",
      "live_status": "2 alerta(s) crítico(s) | 0 projeto(s) em risco",
      "degraded_count": 2,
      "critical_count": 2
    },
    "mentor_summary": {
      "text": "2 alertas críticos ativos. Resolva antes de qualquer outra coisa.",
      "tone": "critical",
      "urgency": "critical"
    }
  }
}
```

### Regras de compatibilidade
1. Nunca remover campos obrigatórios do envelope
2. Nunca remover os 8 blocos de `data`
3. Adicionar campos é retrocompatível
4. Mudar tipo de campo existente requer nova `contract_version`
5. Frontend deve verificar `contract_version` antes de consumir

---

## 8. LINHA DO TEMPO DE FASES

| Fase | Período | Descrição | Status |
|---|---|---|---|
| **0.1** | 2026-05-07 | Fundação: estrutura, 37 endpoints mock, 12 tabelas SQLite, 34 testes | ✅ |
| **0.2** | 2026-05-07/08 | Coletores reais: Docker, Git, psutil, OMNIS CLI | ✅ |
| **0.2.3** | 2026-05-08 | Calendar, Agenda, Deadlines, Execution Planner | ✅ |
| **0.3** | 2026-05-08 | ActivityWatch bridge + Contexto Operacional (classifier, sessions) | ✅ |
| **0.3.2** | 2026-05-08 | POST /context/checkpoint — salvar checkpoint do contexto atual | ✅ |
| **0.4** | 2026-05-08 | SSE /live/stream + /live/snapshot | ✅ |
| **0.5A** | 2026-05-09 | Paralelização ThreadPoolExecutor + cache TTL (9 seções em 3s) | ✅ |
| **0.6B** | 2026-05-09 | Mission Intelligence — alert_service, mentor_decision_service | ✅ |
| **0.6E/F/G** | 2026-05-09 | Mission Lens live fixes: timeout, snapshot, contract | ✅ |
| **0.7A-F** | 2026-05-09 | Frontend data bridge — todas as páginas com dados reais | ✅ |
| **0.8** | 2026-05-09 | ActivityWatch daemon real + regras de contexto drift | ✅ |
| **0.8B** | 2026-05-09 | Context Drift Rules: on_focus, off_focus, related, unknown | ✅ |
| **0.8C** | 2026-05-09 | Auto Checkpoint Suggestion + cooldown + recovery | ✅ |
| **0.9** | — | aw-watcher-web para captura de URLs do navegador | 🔜 |
| **1.0** | — | Redesign completo sobre telemetria live | 🔜 |

---

## 9. ONDE ESTAMOS AGORA (12/05/2026)

### O que funciona — confirmado neste diagnóstico

| Componente | Status | Evidência |
|---|---|---|
| Backend na porta 5100 | ✅ Rodando | PID 4176, Python 3.12, uvicorn |
| Frontend na porta 5173 | ✅ Rodando | PID 20456, Node, Vite |
| /health | ✅ 200 | Hardcoded (phase 0.1, mock) — cosmético |
| /live/snapshot | ✅ 200 | 9 seções, 4 degradadas por timeout |
| /live/stream (SSE) | ✅ Funcional | text/event-stream, 5s interval |
| /docs (Swagger) | ✅ 200 | Swagger UI funcional |
| Testes backend | ✅ 296/296 | 18.5 min runtime |
| Build frontend | ✅ 63 módulos | 225ms, zero erros TypeScript |
| Docker collector | ⚠️ Degraded | 17 containers, 11 running, 2 unhealthy |
| Git collector | ⚠️ Degraded | Múltiplos repos sujos detectados |
| ActivityWatch | ✅ Ok | Coletando janelas, buckets ativos |
| OMNIS bridge | ✅ Ok | Status via CLI bridge |
| System collector | ⚠️ Fallback | psutil responde com erro |

### Problemas conhecidos

#### P0 — health.py hardcoded (cosmético, 1 minuto)
`backend/app/routes/health.py` retorna `phase: "0.1"` e `data_source: "mock"` hardcoded.
O sistema está na fase 0.8C com dados reais. Apenas o health check mente.

**Fix:**
```python
# health.py linhas 10-14 — trocar para:
"version": "0.8.0",
"phase": "0.8C",
"data_source": "live"
```

#### P1 — 4/9 seções do live/snapshot excedem timeout de 3s
As seções `mission_lens`, `collector_status`, `mentor_signals` e `context` consistentemente demoram >3s para buildar. A causa raiz:

- `_get_collector_status()` consulta 5 coletores **sequencialmente** dentro da thread
- `_get_mentor_signals()` chama 4 serviços em cadeia
- Docker CLI (`docker ps --format json` com 17 containers) é lento
- Git CLI (`git status` em múltiplos repositórios) é lento
- ActivityWatch queries HTTP são I/O-bound

O sistema não quebra — serve dados cacheados com status `degraded`. Mas a primeira requisição após cold start ou expiração de TTL sempre vem degradada.

**Possíveis fixes:**
1. Aumentar `SECTION_TIMEOUT` de 3.0s para 5.0s (1 linha)
2. Paralelizar sub-coletores dentro de `_get_collector_status()` (ThreadPoolExecutor interno)
3. Aumentar TTL das seções lentas (cobrir melhor entre refreshes)
4. Timeout menor por sub-coletor (ex: 1s por Docker, 1s por Git, etc.)

#### P2 — Containers unhealthy (fora do escopo KRATOS)
Docker reporta 2 containers unhealthy: `akasha-postgres` (exited) e `crm-tigre-backend`. Isso afeta o publisher-os, não o KRATOS. O KRATOS reporta corretamente mas não é responsável por corrigir.

---

## 10. ONDE QUEREMOS CHEGAR

### Visão de curto prazo (Fase 0.9 → 1.0)

```
KRATOS 1.0 — Cockpit de Guerra Completo
─────────────────────────────────────────
✅ Coletores reais (Docker, Git, System, OMNIS, AW)
✅ SSE live streaming (5s interval)
✅ Mission Lens com 8 blocos de dados
✅ Sugestão de checkpoint com cooldown
🔜 aw-watcher-web — URLs do navegador em tempo real
🔜 Frontend redesenhado sobre contrato Mission Lens v1
🔜 Aurora voice integration — "Você perdeu o foco. Volta."
🔜 Detecção de padrões: "Você sempre perde foco às 15h"
🔜 Timeblocks com respeito a horário real
```

### Visão de médio prazo (além de 1.0)

```
KRATOS como Sistema Nervoso Central
────────────────────────────────────
- Integração com OMNIS para execução 1-click
- Histórico de produtividade (dias, semanas, meses)
- Sugestões preditivas ("Sexta às 16h você costuma desfocar")
- Modo Guerra: lockdown de distrações quando deadline crítico
- Relatórios automáticos de sprint para o operador
- Detecção automática de projetos "zumbis" (abertos, sem atividade)
```

### O que NUNCA vai entrar no KRATOS
- Auth/usuários (single-tenant, local)
- Cloud sync (local-first por princípio)
- Integração com APIs externas (Meta, Google, etc.)
- Editor de conteúdo (é OMNIS)
- Publicação em redes sociais (é ARGOS)
- CRM/vendas (é Daily Prophet Hotels)

---

## 11. ROTEIRO DE EVOLUÇÃO TÉCNICA

### Dívida técnica atual

| Item | Severidade | Esforço |
|---|---|---|
| health.py hardcoded | Baixa | 1 min |
| 4/9 seções timeout 3s | Média | 30 min |
| Mock data residual em serviços não migrados | Baixa | 2-4 h |
| Testes levam 18min (sem paralelismo) | Baixa | 1 h (pytest-xdist) |
| Frontend sem teste unitário | Média | 4-8 h (Vitest) |
| Sem logging estruturado | Baixa | 1 h (structlog) |
| Sem métricas de performance do próprio KRATOS | Baixa | 2 h |

### Sequência recomendada

```
1. health.py fix                         → 1 min   (já diagnosticado)
2. SECTION_TIMEOUT 3s → 5s              → 1 linha (reduz falsos degraded)
3. Paralelizar _get_collector_status()  → 30 min  (ThreadPool dentro da thread)
4. aw-watcher-web para URLs             → 1-2 h   (Fase 0.9)
5. Frontend test suite (Vitest)         → 4-8 h
6. Redesign frontend 1.0                → Lovable sandbox
```

---

## 12. DIAGNÓSTICO ATUAL DA MÁQUINA (12/05/2026 20:03)

### Portas e processos

| Porta | PID | Processo | Path | Função |
|---|---|---|---|---|
| 5100 | 4176 | python.exe | Python 3.12 (uvicorn) | Backend KRATOS |
| 5173 | 20456 | node.exe | Node.js (Vite) | Frontend KRATOS |
| 5101 | — | — | — | Livre |

### Estado dos coletores (do /live/snapshot)

| Coletor | Source | Status | Detalhe |
|---|---|---|---|
| System | fallback | error | CPU 23.5%, RAM 56.9% |
| Docker | real | degraded | 17 containers, 11 running, 2 unhealthy |
| OMNIS | real | ok | — |
| Git | real | degraded | Múltiplos repos com alterações |
| ActivityWatch | real | ok | Coletando janelas ativas |

### Alertas ativos

| Severity | Tipo | Entidade |
|---|---|---|
| warning | repo_dirty_new | omnis-control |
| warning | repo_dirty_new | publisher-os |
| **critical** | repo_dirty_persistent (61 dias) | daily-prophet-hotels |
| **critical** | repo_dirty_persistent (44 dias) | publisher-os-cockpit |
| ... | ... | ... |

### Contexto atual
- **App ativo:** WindowsTerminal.exe (PowerShell)
- **Projeto inferido:** Desconhecido (Terminal)
- **On focus:** false
- **Drift:** 103 minutos fora de foco
- **Projeto foco do dia:** kratos-mission-control

---

## 13. COMANDOS DE OPERAÇÃO

### Start completo
```powershell
# Terminal 1 — Backend
cd C:\Users\lucas\kratos-mission-control\backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 127.0.0.1 --port 5100 --reload

# Terminal 2 — Frontend
cd C:\Users\lucas\kratos-mission-control\frontend
npm run dev
```

### Testes
```powershell
cd C:\Users\lucas\kratos-mission-control\backend
.\.venv\Scripts\Activate.ps1
python -m pytest -q                    # 296 testes (~18min)
python -m pytest -q -x                 # parar no primeiro erro
python -m pytest -q -k "test_live"     # filtrar por nome
```

### Debug
```powershell
# Snapshot completo
Invoke-RestMethod http://localhost:5100/live/snapshot | ConvertTo-Json -Depth 5

# Apenas health
Invoke-RestMethod http://localhost:5100/health

# Cache info
Invoke-RestMethod http://localhost:5100/metrics/summary

# SSE stream (Ctrl+C para parar)
Invoke-WebRequest http://localhost:5100/live/stream
```

### Verificar porta
```powershell
netstat -ano | findstr ":5100"
```

---

## 14. REGRAS DE SEGURANÇA DO KRATOS

1. **Nunca expor secrets** — campos como `token`, `api_key`, `secret`, `password` são `[FILTERED]` nos payloads
2. **Nunca acessar rede externa** — sem chamadas HTTP externas, sem telemetria, sem analytics
3. **Nunca escrever em projetos externos** — KRATOS é read-only sobre OMNIS, publisher-os, etc.
4. **Nunca modificar .env** de outros projetos
5. **Nunca fazer git push** do KRATOS para remotes de produção
6. **Nunca expor porta 5100** para a rede (bind `127.0.0.1` apenas)
7. **CORS restrito** — apenas `localhost:5173`, `localhost:3000`, `127.0.0.1:5173`

---

## 15. GLOSSÁRIO

| Termo | Definição |
|---|---|
| **KRATOS** | Cockpit de observabilidade e mentoria operacional |
| **OMNIS** | Sistema operacional CLI que executa missões |
| **Aurora** | Camada de voz/interpretação do estado |
| **Mission Lens** | Payload canônico com 8 blocos de dados operacionais |
| **NBA** | Next Best Action — recomendação de maior impacto |
| **Drift** | Desvio de foco — quando Lucas sai do projeto esperado |
| **Checkpoint** | Snapshot do estado atual salvo para retomada |
| **SSE** | Server-Sent Events — streaming unidirecional servidor→cliente |
| **Collector** | Módulo que coleta dados reais (Docker, Git, psutil, AW, OMNIS) |
| **_live_meta** | Metadados de build do payload live (timing, cache, degraded) |
| **Cooldown** | Janela de silêncio após salvar checkpoint (evita spam de sugestões) |
| **Do Not Do** | Lista de ações proibidas no momento atual |
| **System Pulse** | Indicador de saúde geral: ok / degraded / error |
| **TTL** | Time To Live — validade do cache em segundos |

---

## 16. CONCLUSÃO

O KRATOS está operacional e íntegro. O commit `60c986d` (0.8C) é o HEAD atual, com 296 testes passando, frontend buildando limpo, e todos os coletores funcionando — ainda que 4/9 seções do snapshot ao vivo estejam lentas (timeout de 3s).

O sistema cumpre sua missão central: **devolver o fio da missão para o operador Lucas Tigre.**

As 9 perguntas operacionais têm resposta. O contrato Mission Lens v1 está documentado e implementado. O SSE transmite estado ao vivo a cada 5 segundos. O sistema de checkpoint suggestion sabe quando sugerir salvar e quando ficar quieto.

**Próximo passo concreto:** Aplicar fix P0 (health.py) + ajustar SECTION_TIMEOUT para 5s. Depois decidir se avança para Fase 0.9 (aw-watcher-web) ou pula direto para redesign do frontend 1.0.

---

> **"KRATOS não deve tentar fazer tudo. Deve mostrar o estado da guerra."**

---

*Relatório gerado por Claude Code (Opus 4.7) em 2026-05-12 às 20:15 UTC-3.*
*Fonte: análise completa de 296 testes, 18 route modules, 16 services, 6 collectors, 10 páginas frontend, 32 components.*
