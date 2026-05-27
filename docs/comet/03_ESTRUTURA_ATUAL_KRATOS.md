# 03 — ESTRUTURA ATUAL DO KRATOS

**Uso:** arquivo de contexto para Perplexity Deep Research / Claude Code / AURORA_CONTROL  
**Projeto:** KRATOS Mission Control  
**Estado:** KRATOS 0.10 + Visual Shell 1.0A commitado  
**Caminho local:** `C:\Users\lucas\kratos-mission-control`

---

## 1. Definição canônica

O **KRATOS Mission Control** é um cockpit operacional local-first que transforma o caos do computador, projetos, containers, código, agenda e contexto em uma próxima ação clara.

Frase central:

> KRATOS devolve o fio da missão.

Ele não é um app de tarefas comum, não é dashboard genérico e não é executor.  
Ele é o sistema nervoso central de observação, contexto e decisão operacional.

---

## 2. Divisão de papéis no ecossistema

```txt
KRATOS vê.
Aurora interpreta.
OMNIS/HOMINIS executa.
Akasha lembra.
Claude Code constrói.
Lucas decide.
```

### KRATOS
- Observa o estado do computador e dos projetos.
- Coleta dados de System, Docker, Git, ActivityWatch, OMNIS, Outputs, Tasks, Projects, Deadlines e Checkpoints.
- Mostra contexto, riscos, próxima ação, drift, alertas e estado do sistema.
- Não executa workflows externos.

### Aurora
- Interpreta o estado observado.
- Traduz dados técnicos em orientação operacional.
- Conduz Lucas para a próxima ação.
- Não deve fingir que executou algo.

### OMNIS/HOMINIS
- É o braço executor.
- Executa skills, squads, automações, workflows, geração de conteúdo, rotinas técnicas e pipelines.
- Deve executar somente com autorização segura.

### Akasha
- Memória estrutural.
- Guarda decisões, histórico, relatórios, aprendizados, documentos, contexto e padrões.

### Claude Code
- Executor técnico de desenvolvimento.
- Edita arquivos, roda testes, build, auditorias e relatórios dentro de escopo definido.

---

## 3. Stack atual

### Backend
- **FastAPI + Uvicorn**
- **Python 3.12**
- **SQLite local em WAL mode**
- **Pydantic**
- **REST + SSE**
- Porta backend padrão: `5100`

### Frontend
- **React**
- **Vite**
- **TypeScript**
- **Tailwind / CSS tokens**
- Porta frontend padrão: `5173`

### Comunicação
- `GET /live/stream` — SSE, push periódico de estado vivo.
- `GET /live/snapshot` — fallback REST.
- `GET /mission/lens` — contrato canônico da missão.
- `GET /context/current` — contexto atual.

### Banco
- SQLite local.
- Tabelas principais: `projects`, `missions`, `checkpoints`, `tasks`, `alerts`, `calendar_events`, `execution_plans`, `daily_plans`, `weekly_plans`, `collector_snapshots`, `activity_windows`, `browser_contexts`, entre outras.

---

## 4. Estado técnico consolidado

### KRATOS 0.10
- Repo isolado em `C:\Users\lucas\kratos-mission-control`.
- `mock-data/` rastreado e seguro.
- `tasks` e `projects` migrados para SQLite.
- `SourceBadge` criado para transparência de origem dos dados.
- `alert_service` corrigido para payload real.
- Backend validado com `128/128` testes.
- Frontend buildando.
- Smoke tests passando.
- Git limpo.

### KRATOS 1.0A Visual Shell
- Visual Shell commitado no hash `05a4eaa`.
- Backend ficou fora do commit.
- Build passou.
- 128/128 testes passaram.
- Working tree limpo.
- Frontend com shell visual, ilhas pseudo-3D, HUD, Aurora, dock inferior, SourceBadge e integração com dados reais.
- Frontend visual deve ficar em chat separado. Este contexto é apenas para AURORA_CONTROL e ponte KRATOS ↔ OMNIS.

---

## 5. Arquitetura backend

### Coletores read-only
- `system_collector.py` — CPU, RAM, disco via psutil.
- `docker_collector.py` — containers via Docker CLI.
- `git_collector.py` — status/log de repositórios via Git CLI.
- `omnis_collector.py` — status OMNIS por filesystem scan/read-only.
- `activitywatch_collector.py` — janelas e atividade via ActivityWatch.
- `outputs_collector.py` — arquivos/output gerados.
- Context collectors/services — contexto, drift, checkpoint suggestion.

### Services principais
- `live_event_service.py` — compõe payload vivo.
- `live_cache_service.py` — cache TTL em memória.
- `snapshot_service.py` — persistência de snapshots.
- `alert_service.py` — regras e alertas.
- `calendar_service.py` — agenda/deadlines.
- `execution_plan_service.py` — plano do dia.
- `mentor_signal_service.py` — sinais do mentor.
- `mentor_decision_service.py` — Next Best Action.
- `mission_intelligence_service.py` — Mission Lens.
- `context_classifier_service.py` — classificação de contexto.
- `context_drift_service.py` — drift.
- `context_loss_service.py` — perda de contexto.
- `context_checkpoint_service.py` — checkpoints.
- `checkpoint_suggestion_service.py` — sugestão de checkpoint.
- `diff_service.py` — diffs entre snapshots.

---

## 6. Frontend atual

### Páginas base
- Agora / Visão Geral
- Contexto
- Checkpoints
- Agenda
- Deadlines
- Projetos
- Tarefas
- Sistema
- Finalizar
- OmnisSnapshot / OMNIS status

### Componentes importantes
- `useLiveKratos.ts`
- `MissionLensPanel`
- `NextBestActionCard`
- `LiveStatusIndicator`
- `ExecutionPlanCard`
- `FocusModeCard`
- `AlertList`
- `RiskBanner`
- `DeadlineCalendar`
- `CheckpointPanel`
- `AuroraPanel`
- `SourceBadge`
- Visual Shell 1.0A: shell, world map, ilhas, central castle, bridges, bottom dock, right rail.

---

## 7. Mission Lens v1

O Mission Lens é o contrato canônico que alimenta o cockpit.

### Fontes
- `/mission/lens`
- `/live/snapshot`
- `/live/stream`

### Blocos principais
- `current_mission`
- `next_action`
- `do_not_do`
- `risks`
- `deadlines`
- `checkpoint`
- `system_pulse`
- `mentor_summary`
- `collector_status`
- `checkpoint_suggestion`
- `generated_at`
- `stale_after_ms`
- `source`
- `contract_version`

### Regras
- Não alterar Mission Lens v1 sem decisão explícita.
- Não quebrar `/live/stream`.
- Não quebrar `/live/snapshot`.
- Não quebrar `useLiveKratos`.
- Nada de dado mock se vestindo de dado real.

---

## 8. As 9 perguntas que o KRATOS responde

1. Onde estou?
2. O que estou fazendo?
3. O que está rodando?
4. O que quebrou?
5. Onde parei?
6. O que está atrasado?
7. Qual projeto está em risco?
8. Qual é a próxima ação?
9. O que NÃO devo abrir agora?

Tudo no KRATOS deve servir para responder uma ou mais dessas perguntas.

---

## 9. Estados de dados

Todo dado exibido precisa ter origem clara:

| Estado | Significado |
|---|---|
| `live` | dado real atualizado agora |
| `cached` | dado real recente vindo de cache |
| `fallback` | dado alternativo usado após falha |
| `mock` | dado simulado/fixture |
| `unknown` | origem incerta |
| `error` | coleta falhou |

Regra:

> Dado mock não pode se vestir de dado real.

---

## 10. OMNIS dentro do KRATOS hoje

Estado atual antes da ponte real:

- KRATOS lê OMNIS via `omnis_collector.py`.
- O collector faz filesystem scan em `C:\Users\lucas\omnis-control`.
- Lê setores, skills, briefings, data files e logs.
- Não executa skills.
- Não dispara crews.
- Não aciona workflows.
- Não publica conteúdo.
- Não agenda posts.
- Status OMNIS atual é read-only e superficial.

Problema:

> Hoje a ponte KRATOS ↔ OMNIS ainda é binóculo, não ponte.

Primeira fase recomendada da ponte:

> OMNIS expor `/health` HTTP local/read-only na porta `5200`, depois KRATOS consumir esse health real.

---

## 11. Comandos de operação

### Start backend

```powershell
cd C:\Users\lucas\kratos-mission-control\backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 127.0.0.1 --port 5100 --reload
```

### Start frontend

```powershell
cd C:\Users\lucas\kratos-mission-control\frontend
npm run dev
```

### Testes backend

```powershell
cd C:\Users\lucas\kratos-mission-control\backend
python -m pytest -q
```

### Build frontend

```powershell
cd C:\Users\lucas\kratos-mission-control\frontend
npm run build
```

### Smoke tests

```powershell
curl http://127.0.0.1:5100/health
curl http://127.0.0.1:5100/live/snapshot
curl http://127.0.0.1:5100/mission/lens
curl http://127.0.0.1:5100/context/current
curl http://127.0.0.1:5100/tasks
curl http://127.0.0.1:5100/projects
```

---

## 12. Regras de segurança do KRATOS

- Nunca expor secrets.
- Sanitizar tokens, API keys, emails e private keys.
- Nunca acessar rede externa por padrão.
- Nunca escrever em projetos externos.
- Nunca modificar `.env` de outros projetos.
- Nunca fazer `git push` para remoto de produção sem autorização.
- Nunca expor porta `5100` para rede; bind apenas em `127.0.0.1`.
- CORS restrito a localhost.
- KRATOS observa. OMNIS executa.
- KRATOS não deve virar executor universal.

---

## 13. O que não fazer

- Não transformar KRATOS em OMNIS.
- Não transformar KRATOS em chatbot.
- Não transformar KRATOS em Notion/Todoist.
- Não criar auth/cloud/sync.
- Não mexer no backend durante trabalho visual.
- Não quebrar contratos vivos.
- Não executar OMNIS diretamente a partir do KRATOS.
- Não criar POST de execução antes de health/status read-only.
- Não implementar 1-click execution sem safety gate, kill switch e autorização explícita.