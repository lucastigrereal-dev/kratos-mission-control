# PACK 0 — Auditoria Read-Only do KRATOS Mission Control

**Data:** 2026-05-18
**Executor:** deepseek-v4-pro:cloud
**Método:** Read-only — nenhum arquivo modificado

---

## 1. Versao do Stack Detectada

| Componente | Versao | Notas |
|---|---|---|
| React | 19.2.0 | latest |
| React DOM | 19.2.0 | |
| Vite | 7.3.2 | via @lovable.dev/vite-tanstack-config |
| Tailwind CSS | 4.2.1 | @tailwindcss/vite plugin |
| TanStack Router | 1.168.25 | file-based routing |
| TanStack Start | 1.167.50 | SSR framework |
| TanStack Query | 5.83.0 | server state |
| Radix UI | ~30 packages | via shadcn/ui |
| shadcn/ui | latest | 47 componentes em src/components/ui/ |
| Lucide React | 0.575.0 | icones |
| Zod | 3.24.2 | schema validation |
| Bun | 1.3.10 | runtime + test runner |
| TypeScript | 5.8.3 | |
| Recharts | 2.15.4 | charts em Sistema |
| date-fns | 4.1.0 | date utilities |

---

## 2. Rotas e Seus Componentes

| Rota | Arquivo | Componente | Loader SSR |
|---|---|---|---|
| `/` | `src/routes/index.tsx` | `DashboardView` | SIM — agrega checkpoints, projects, appointments, contexto |
| `/agora` | `src/routes/agora.tsx` | `AgoraView` | NAO |
| `/agenda` | `src/routes/agenda.tsx` | `AgendaView` | NAO |
| `/checkpoints` | `src/routes/checkpoints.tsx` | `CheckpointsView` | NAO |
| `/contexto` | `src/routes/contexto.tsx` | `ContextoView` | NAO |
| `/projetos` | `src/routes/projetos.tsx` | `ProjetosView` | NAO |
| `/sistema` | `src/routes/sistema.tsx` | `SistemaView` | NAO |
| `__root` | `src/routes/__root.tsx` | `RootComponent` com `AppShell` | — |

Total: **8 rotas** (1 root + 7 paginas). Apenas `/` tem loader SSR.

---

## 3. Componentes em `src/components/kratos/` (69 arquivos TSX)

### Shell (9)
`AppShell.tsx`, `Sidebar.tsx`, `SidebarItem.tsx`, `Topbar.tsx`, `StatusBar.tsx`, `AuroraPanel.tsx`, `NextActionBlock.tsx`, `IslandCard.tsx`, `DriftIndicator.tsx`

### Views (8)
`DashboardView.tsx`, `AgoraView.tsx`, `AgendaView.tsx`, `CheckpointsView.tsx`, `ContextoView.tsx`, `ProjetosView.tsx`, `SistemaView.tsx`, `PlaceholderRoute.tsx`

### Base (12)
`EmptyState.tsx`, `ErrorState.tsx`, `LoadingState.tsx`, `LiveStatusIndicator.tsx`, `AlertBadge.tsx`, `SectionHeader.tsx`, `StatusCard.tsx`, `StatusDot.tsx`, `SystemCard.tsx`, `ProgressRing.tsx`, `SourceBadgeIndicator.tsx`, `ZombieBadge.tsx`

### Agora (8)
`FocusCard.tsx`, `NextActionCard.tsx`, `CriticalAlertCard.tsx`, `DeadlineCard.tsx`, `MiniAgenda.tsx`, `CheckpointCard.tsx`, `AuroraShortcutCard.tsx`, `SystemPulseStrip.tsx`

### Agenda (6)
`TodayExecutionPanel.tsx`, `OverduePanel.tsx`, `DeadlineRadar.tsx`, `DoNotDoPanel.tsx`, `FinishLinePanel.tsx`, `WeekDetailList.tsx`

### Checkpoints (6)
`CheckpointItemCard.tsx`, `CheckpointTimeline.tsx`, `CheckpointSummaryCard.tsx`, `CheckpointFilterBar.tsx`, `CheckpointResume.tsx`, `ResumeFromHereCard.tsx`

### Contexto (6)
`CurrentContextHero.tsx`, `FocusDriftCard.tsx`, `ActiveWindowCard.tsx`, `BrowserContextList.tsx`, `ContextReasonCard.tsx`, `ContextActionStrip.tsx`

### Mentor (3)
`ExecutionScoreCard.tsx`, `RiskProjectCard.tsx`, `MentorRecommendationCard.tsx`

### Aurora (4)
`AuroraInputMock.tsx`, `AuroraMessagePreview.tsx`, `AuroraQuickActions.tsx`, `AuroraPanelContent.tsx`

### Projetos (2)
`ProjectCard.tsx`, `ProjectFilterBar.tsx`

### Sistema (5)
`ServiceHealthCard.tsx`, `OmnisServiceStatusCard.tsx`, `OmnisCrewCard.tsx`, `GithubRepoCard.tsx`, `OmnisJobItem.tsx`

### Icons (1)
`KratosLogo.tsx`

---

## 4. Hooks em `src/hooks/` (15)

| Hook | Arquivo | Proposito |
|---|---|---|
| `useDashboard` | `useDashboard.ts` | Dados agregados do dashboard SSR |
| `useCheckpoints` | `useCheckpoints.ts` | CRUD de checkpoints |
| `useProjects` | `useProjects.ts` | CRUD de projetos |
| `useAppointments` | `useAppointments.ts` | CRUD de appointments |
| `useContexto` | `useContexto.ts` | Contexto snapshot |
| `useGithub` | `useGithub.ts` | GitHub repos/PRs |
| `useOmnis` | `useOmnis.ts` | Omnis agents/crews/jobs |
| `useServices` | `useServices.ts` | Service health status |
| `useLiveStatus` | `useLiveStatus.ts` | Conexao live/SSE |
| `useSystemPulse` | `useSystemPulse.ts` | Pulso do sistema |
| `useMissionLens` | `useMissionLens.ts` | Mission lens data |
| `useDriftDetection` | `useDriftDetection.ts` | Deteccao de drift |
| `useCheckpointSuggestion` | `useCheckpointSuggestion.ts` | Sugestao de checkpoint |
| `useSafeQuery` | `useSafeQuery.ts` | Query wrapper seguro |
| `useGlobalShortcuts` | `useGlobalShortcuts.ts` | Atalhos globais de teclado |

---

## 5. Resultado do Build

### Status: **PASS** (zero erros)

#### Client Bundle

| Chunk | Size | Gzip |
|---|---|---|
| `styles-Cehgf6O4.css` | 85.50 kB | 14.77 kB |
| `index-Ffk9krLM.js` (main) | 458.32 kB | 141.02 kB |
| `index-CXf5AjGa.js` (dashboard) | 23.39 kB | 6.50 kB |
| `agora-DEw-qBAg.js` | 21.36 kB | 6.13 kB |
| `agenda-I-uf6sOB.js` | 22.22 kB | 5.98 kB |
| `checkpoints-C-0oIr5c.js` | 14.80 kB | 3.95 kB |
| `contexto-1fGCP0B9.js` | 14.15 kB | 3.71 kB |
| `projetos-DsteqPQJ.js` | 7.78 kB | 2.59 kB |
| `sistema-D4sH_EqE.js` | 10.54 kB | 2.99 kB |
| **TOTAL client** | **~668 kB** | **~198 kB** |

#### SSR Bundle

| Chunk | Size |
|---|---|
| `server-CZ8iSq0h.js` | 730.14 kB |
| `router-Dy-N3QTO.js` | 260.15 kB |
| `types-0yb3DQpm.js` | 107.58 kB |
| **TOTAL SSR** | **~1.2 MB** |

Build time: **2.63s (client) + 2.48s (SSR)**

---

## 6. Status dos Testes

- **232 pass**, 0 fail, 681 expect() calls
- 25 arquivos de teste em `tests/stores/` e `tests/contracts/`
- Runner: Bun test

---

## 7. Gap Analysis: CODEX Component Map vs Implementacao Real

### Resumo Quantitativo

| Dominio CODEX | Spec | Existente | Faltando | % Completo |
|---|---|---|---|---|
| Layout | 9 | 4 | 5 | 44% |
| HUD | 6 | 2 | 4 | 33% |
| **Mundo/Ilhas** | **11** | **0** | **11** | **0%** |
| Aurora | 6 | 3 | 3 | 50% |
| Mission Lens | 9 | 7 | 2 | 78% |
| Widgets | 8 | 1 | 7 | 13% |
| Omnis Lab | 8 | 0 | 8 | 0% |
| Studio/Agencia | 9 | 0 | 9 | 0% |
| System Services | 7 | 2 | 5 | 29% |
| Base UI | 10 | 8 | 2 | 80% |
| **TOTAL** | **83** | **27** | **56** | **33%** |

### Por Dominio (Detalhado)

#### Layout (5 faltando dos 9)
- **Falta:** `OperatorWelcomeCard` — saudacao "Bom dia, Lucas" com avatar de tigre
- **Falta:** `RightRail` — coluna direita com Aurora, foco, progresso, agenda
- **Falta:** `BottomDock` — dock inferior com missao atual e proxima acao
- **Falta:** `PageFrame` — wrapper padrao para telas internas
- **Falta:** `IslandPageHeader` — header com "Voltar ao Castelo"
- **Existe:** `AppShell` (como KratosAppShell), `Topbar`, `Sidebar`, `SidebarItem` (NavItemButton)

#### Mundo/Ilhas (11 faltando dos 11) — MAIOR GAP
- **Falta:** `WorldMap`, `OceanBackdrop`, `CloudLayer`, `CentralCastle`, `FloatingIsland`, `IslandLabel`, `IslandStatusBadge`, `WoodenBridge`, `PortalGlow`, `WorldCharacterMarker`, `IslandTooltip`
- **Nota:** `IslandCard` existe mas eh um card estatico com 6 dominios operacionais — nao eh o mundo visual interativo de ilhas. `NextActionBlock`, `DriftIndicator` sao cockpit, nao mundo.

#### Widgets (7 faltando dos 8)
- **Falta:** `FocusTodayCard`, `DailyQuoteCard`, `AgendaTodayCard`, `SoundtrackPlayer`, `CurrentMissionBar`, `NextStepBar`, `SquadDock`
- **Existe:** `ProgressRing`

#### Omnis Lab (8 faltando dos 8)
- **Falta:** `OmnisLabWorld`, `OmnisCoreReactor`, `AutomationBoard`, `WorkflowPanel`, `ActiveAgentsList`, `RecentExecutionsList`, `RealtimeFlowStepper`, `OmnisSummaryCards`
- **Nota:** Cards parciais existem (`OmnisCrewCard`, `OmnisJobItem`, `OmnisServiceStatusCard`) mas nao como mundo visual

#### Studio/Agencia (9 faltando dos 9)
- **Falta:** `StudioWorld`, `CreativePanel`, `ProductionStage`, `ContentBoard`, `ContentPipeline`, `CampaignMainCard`, `StudioAutomationList`, `StudioSquads`, `AuroraMiniChat`

---

## 8. Gap Analysis: Design Tokens

### Tokens Existentes (KRATOS Design Tokens)

| Categoria | Tokens |
|---|---|
| Superficies | `--kratos-surface-0` a `-4` (#0c0c0e a #26262f) |
| Texto | `--kratos-text-primary/secondary/muted` |
| Status | `--kratos-ok (#22c55e)`, `--kratos-warn (#f59e0b)`, `--kratos-critical (#ef4444)`, `--kratos-info (#3b82f6)`, `--kratos-ghost (#6366f1)`, `--kratos-accent (#818cf8)` |
| Bordas | `--kratos-border`, `--kratos-border-on-focus`, `--kratos-border-off-focus`, `--kratos-border-live` |
| Fontes | `--kratos-font-sans (Inter)`, `--kratos-font-mono (JetBrains Mono)` |
| Duracao | `--kr-duration-fast (150ms)`, `--kr-duration-normal (250ms)`, `--kr-duration-slow (500ms)` |
| Easing | `--kr-ease-out`, `--kr-ease-in-out` |
| Glass | `--kratos-aurora-glass` (classe CSS, nao token), `--kratos-aurora-divider` |

### Tokens Faltantes (para CODEX UI Bible + Mundo 3D)

#### Cores CODEX que precisam de tokens
| Cor CODEX | Token sugerido | Valor |
|---|---|---|
| Azul KRATOS | `--kr-color-kratos` | `#1E90FF` |
| Azul profundo | `--kr-color-abyss` | `#0B1220` |
| Azul oceano | `--kr-color-ocean` | `#0EA5E9` |
| Ouro XP | `--kr-color-xp` | `#FFD700` |
| Roxo Aurora | `--kr-color-aurora` | `#8B5CF6` |

#### Cores de Mundo/Ilhas (faltam todas)
| Elemento | Token sugerido | Valor |
|---|---|---|
| Grama | `--kr-world-grass` | `#22C55E` |
| Terra | `--kr-world-earth` | `#92400E` |
| Madeira | `--kr-world-wood` | `#A16207` |
| Ceu | `--kr-world-sky` | `#60A5FA` |
| Nuvem | `--kr-world-cloud` | `#F8FAFC` |
| Agua profunda | `--kr-world-deep-water` | `#0EA5E9` |
| Agua rasa | `--kr-world-shallow-water` | `#38BDF8` |

#### Pseudo-3D / Profundidade (faltam todas)
| Proposito | Token sugerido |
|---|---|
| Sombra de ilha (elevacao 1) | `--kr-shadow-island-1` |
| Sombra de ilha (elevacao 2) | `--kr-shadow-island-2` |
| Sombra de castelo (hero) | `--kr-shadow-castle` |
| Brilho de portal | `--kr-glow-portal` |
| Profundidade de oceano (gradiente) | `--kr-ocean-gradient` |
| Perspectiva base | `--kr-world-perspective` |

#### Tipografia CODEX
| CODEX spec | Status atual |
|---|---|
| Poppins ExtraBold (Display) | NAO carregado — so Inter + JetBrains Mono |
| Poppins SemiBold (Titulos) | NAO carregado |

#### Neutros CODEX
| Token CODEX | Status |
|---|---|
| Base 950 `#020617` | Nao existe — surface-0 eh `#0c0c0e` |
| Base 900 `#0B1220` | Nao existe |
| Base 800 `#111827` | Proximo de surface-1 `#111114` |

---

## 9. Diagnostico Arquitetural

### O que funciona bem
1. **Build 100% limpo** — client + SSR sem erros
2. **232 testes passando** — cobertura solida de stores e contracts
3. **Stack moderna** — React 19, Vite 7, Tailwind 4, TanStack Start
4. **Base UI madura** — 80% dos componentes base CODEX implementados
5. **Mission Lens forte** — 78% implementado (foco, proxima acao, deadlines, checkpoints)
6. **Contratos de API definidos** — 10 schemas Zod em `api-contract/`
7. **SSR funcionando** — loader no dashboard agrega 4 fontes em paralelo
8. **Design tokens proprios** — sistema `--kratos-*` com superficies, texto, status

### O que esta faltando (priorizado por importancia visual)
1. **Mundo de Ilhas (0%)** — 11 componentes de world completamente ausentes. Este eh o coracao da UI CODEX.
2. **RightRail (0%)** — Estrutura de coluna direita nao existe. AuroraPanel atual eh toggle, nao coluna fixa.
3. **BottomDock (0%)** — Dock inferior nao existe. StatusBar atual eh minimalista (live state + build time).
4. **Widgets laterais (13%)** — Falta FocusTodayCard, AgendaTodayCard, SoundtrackPlayer, SquadDock.
5. **Omnis Lab (0%)** — Mundo visual do Omnis completamente ausente. So existem cards de dados.
6. **Studio/Agencia (0%)** — Nada do mundo visual de conteudo implementado.
7. **Tokens de mundo** — Nenhum token para cores de ilhas, profundidade oceano, sombras 3D.

### Divergencias de abordagem
1. **CODEX: mundo de ilhas interativo** vs **Real: dashboard de cards estaticos** — sao paradigmas diferentes. A migracao requer reconstrucao da area central.
2. **CODEX: Poppins** vs **Real: Inter** — CODEX pede Poppins ExtraBold para displays. Real so tem Inter.
3. **CODEX: glassmorphism com GlassPanel** vs **Real: glass so no AuroraPanel** — Falta componente GlassPanel reutilizavel.
4. **CODEX: layout com RightRail fixa** vs **Real: AuroraPanel como toggle** — Mudanca estrutural no grid.

---

## 10. Recomendacoes para Proximos Packs

### Prioridade 1 — Fundacao do Mundo (Pack 1)
Criar tokens de mundo + componentes base de ilha:
- `--kr-world-*` tokens (grass, earth, wood, sky, cloud, deep-water, shallow-water)
- `--kr-shadow-island-*` tokens de profundidade
- `OceanBackdrop` — fundo gradiente oceano/ceu
- `FloatingIsland` — componente base de ilha com posicionamento
- `IslandLabel` + `IslandStatusBadge` — labels e badges nas ilhas

### Prioridade 2 — Canvas do Mundo (Pack 2)
- `WorldMap` — canvas com posicionamento absoluto
- `CentralCastle` — castelo/ilha central com missao atual
- `CloudLayer` — camada decorativa de nuvens
- `WoodenBridge` — conexoes entre ilhas

### Prioridade 3 — RightRail + BottomDock (Pack 3)
- `RightRail` — coluna direita fixa 360px
- Reorganizar AuroraPanel para dentro da RightRail
- `FocusTodayCard`, `AgendaTodayCard` — widgets da rail
- `BottomDock` — dock inferior com missao atual, proxima acao, squads

### Prioridade 4 — Omnis Lab + Studio (Packs 4-5)
- Mundos internos de ilhas especificas
- Componentes de automacao, pipeline, agentes

---

## 11. Metricas da Auditoria

| Metrica | Valor |
|---|---|
| Tempo total de auditoria | ~15 min |
| Arquivos lidos | 14 |
| Arquivos scaneados | 69 componentes + 15 hooks + 8 rotas |
| Builds executados | 1 (client + SSR) |
| Testes executados | 232 |
| Componentes CODEX faltando | 56 de 83 (67%) |
| Tokens CODEX faltando | ~25 tokens novos necessarios |

---

**Conclusao:** O KRATOS tem uma base solida de infraestrutura (build, testes, contratos, hooks) e componentes de dominio operacional (Mission Lens a 78%). O gap principal esta no **mundo visual de ilhas** (0% implementado) que eh o coracao do CODEX UI Bible. A migracao de "dashboard de cards" para "mundo de ilhas interativo" exigira ~56 novos componentes, comecando pelos 11 componentes do dominio `world/` e ~25 novos design tokens.
