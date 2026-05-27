# KRATOS — Capability Map
**Gerado:** 2026-05-27 | **Wave:** W9-B2

---

## Componentes (por domínio)

Total: **146 componentes** em 16 subdomínios.

### shell/
| Componente | Propósito |
|---|---|
| AppShell.tsx | Layout grid central da aplicação — PROTEGIDO |
| Topbar.tsx | Barra superior com greeting e status — PROTEGIDO |
| TopBarV2.tsx | Versão evoluída do TopBar com HUD items |
| Sidebar.tsx | Navegação principal com rotas — PROTEGIDO |
| SidebarV2.tsx | Variante de sidebar com ícones expandidos |
| SidebarItem.tsx | Item individual da sidebar |
| StatusBar.tsx | Barra de status inferior — PROTEGIDO |
| AuroraPanel.tsx | Painel de inteligência Aurora — PROTEGIDO |
| AuroraDrawer.tsx | Gaveta Aurora para mobile/overlay |
| AuroraOrb.tsx | Orbe animado da Aurora (shell variant) |
| BottomDockV2.tsx | Dock inferior com LiveClock + missão atual |
| DriftIndicator.tsx | Barra visual de drift de missão |
| IslandCard.tsx | Card de acesso a ilha no dashboard |
| NextActionBlock.tsx | Bloco de próxima ação no cockpit |
| OfflineBanner.tsx | Banner de modo offline (W6) |
| PWAInstallPrompt.tsx | Prompt de instalação PWA (W6) |
| RightRailV2.tsx | Rail direito com notificações e Aurora |

### aurora/
| Componente | Propósito |
|---|---|
| AuroraChatDock.tsx | Dock de chat Aurora |
| AuroraCommandPalette.tsx | Paleta de comandos da Aurora |
| AuroraInputMock.tsx | Input mock para comandos Aurora |
| AuroraInsightCard.tsx | Card de insight gerado pelo OMNIS via Ollama |
| AuroraMessagePreview.tsx | Preview de mensagem da Aurora |
| AuroraOrb.tsx | Orbe holográfico animado (aurora variant) |
| AuroraPanelContent.tsx | Conteúdo interno do painel Aurora — PROTEGIDO |
| AuroraPanelV2.tsx | Painel Aurora v2 com estado expandido |
| AuroraQuickActions.tsx | Ações rápidas do painel Aurora |
| AuroraSignalList.tsx | Lista de sinais/eventos da Aurora |
| FioMentalPanel.tsx | Painel do fio mental — contexto atual via state.json |

### base/
| Componente | Propósito |
|---|---|
| AlertBadge.tsx | Badge de alerta com severidade |
| EmptyState.tsx | Estado vazio padronizado |
| ErrorState.tsx | Estado de erro padronizado |
| LiveStatusIndicator.tsx | Indicador de status live/mock/cache |
| LoadingState.tsx | Estado de carregamento padronizado |
| ProgressRing.tsx | Anel de progresso SVG animado |
| ReducedMotionProvider.tsx | Provider que desativa animações para prefers-reduced-motion |
| SectionHeader.tsx | Cabeçalho de seção padronizado |
| SourceBadgeIndicator.tsx | Badge mostrando origem do dado (live/mock/cache) |
| StatusCard.tsx | Card de status operacional |
| StatusDot.tsx | Ponto de status (ok/warn/critical/muted) |
| SystemCard.tsx | Card de sistema com health |
| ZombieBadge.tsx | Badge de estado zombie (drift extremo) |

### agora/
| Componente | Propósito |
|---|---|
| AuroraShortcutCard.tsx | Card de atalho para a Aurora |
| CheckpointCard.tsx | Card de checkpoint rápido no Agora |
| CriticalAlertCard.tsx | Card de alerta crítico |
| DeadlineCard.tsx | Card de prazo iminente |
| FocusCard.tsx | Card de foco atual com drift awareness |
| MiniAgenda.tsx | Mini agenda do dia na tela Agora |
| NextActionCard.tsx | Card de próxima ação recomendada |
| SystemPulseStrip.tsx | Strip de pulso do sistema com dados SSE |

### agenda/
| Componente | Propósito |
|---|---|
| DeadlineRadar.tsx | Radar visual de prazos próximos |
| DoNotDoPanel.tsx | Painel de itens a NÃO fazer |
| FinishLinePanel.tsx | Painel de linha de chegada do dia |
| OverduePanel.tsx | Painel de itens atrasados |
| TodayExecutionPanel.tsx | Painel de execução do dia atual |
| WeekDetailList.tsx | Lista detalhada da semana |

### checkpoints/
| Componente | Propósito |
|---|---|
| CheckpointFilterBar.tsx | Barra de filtro por status/tag |
| CheckpointItemCard.tsx | Card individual de checkpoint |
| CheckpointResume.tsx | Card de retomada 1-clique de checkpoint |
| CheckpointSummaryCard.tsx | Card de resumo de checkpoints |
| CheckpointTimeline.tsx | Timeline visual de checkpoints |
| ResumeFromHereCard.tsx | Card CTA de "retomar daqui" |

### contexto/
| Componente | Propósito |
|---|---|
| ActiveWindowCard.tsx | Card da janela/aba ativa atual |
| BrowserContextList.tsx | Lista de contexto de abas do browser |
| ContextActionStrip.tsx | Strip de ações contextuais |
| ContextReasonCard.tsx | Card explicando razão do contexto |
| CurrentContextHero.tsx | Hero card do contexto atual |
| FocusDriftCard.tsx | Card de drift de foco |

### mentor/
| Componente | Propósito |
|---|---|
| ExecutionScoreCard.tsx | Card de score de execução |
| MentorRecommendationCard.tsx | Card de recomendação do mentor operacional |
| RiskProjectCard.tsx | Card de projeto em risco |

### views/
| Componente | Propósito |
|---|---|
| AgendaView.tsx | View completa da tela /agenda |
| AgoraView.tsx | View completa da tela /agora |
| CheckpointsView.tsx | View completa da tela /checkpoints |
| ContextoView.tsx | View completa da tela /contexto |
| DashboardView.tsx | View completa do dashboard / |
| PlaceholderRoute.tsx | Placeholder para rotas em construção |
| ProjetosView.tsx | View completa da tela /projetos |
| SistemaView.tsx | View completa da tela /sistema |

### hud/
| Componente | Propósito |
|---|---|
| AgendaTodayCard.tsx | Card de agenda do dia no HUD |
| AudioPlayer.tsx | Player de áudio operacional |
| BottomDock.tsx | Dock inferior do HUD |
| CurrentMissionBar.tsx | Barra da missão atual |
| DailyQuoteCard.tsx | Card de citação diária |
| FocusTodayCard.tsx | Card de foco de hoje |
| KratosRightRail.tsx | Rail direito do HUD |
| KratosSidebar.tsx | Sidebar do HUD |
| KratosTopBar.tsx | TopBar do HUD |
| MissionStep.tsx | Step individual de missão |
| OperatorWelcomeCard.tsx | Card de boas-vindas ao operador |
| SquadDock.tsx | Dock de squad/agentes |
| StatusBarDock.tsx | Barra de status do HUD |
| WorldNavDock.tsx | Dock de navegação do mundo |

### islands/ (telas das ilhas)
| Componente | Propósito |
|---|---|
| AgenciaScreen.tsx | Tela da ilha Agência/Estúdio (conteúdo) |
| AkashaScreen.tsx | Tela da ilha Akasha (memória vetorial) |
| ArenaScreen.tsx | Tela da ilha Arena (métricas de audiência) |
| FilosofiaScreen.tsx | Tela da ilha Filosofia (conhecimento) |
| ForjaScreen.tsx | Tela da ilha Forja (desenvolvimento) |
| MissionsScreen.tsx | Tela de missões do OMNIS |
| NimbusScreen.tsx | Tela da ilha Nimbus (cloud/infra) |
| ObservatorioScreen.tsx | Tela do Observatório (analytics) |
| OmnisLabScreen.tsx | Tela do laboratório OMNIS |
| TesouroScreen.tsx | Tela do Tesouro (financeiro) |
| VilaScreen.tsx | Tela da Vila (comunidade/CRM) |
| shared/IslandDetailStage.tsx | Primitivo de stage de detalhe de ilha |
| shared/IslandDockContext.tsx | Context de dock para ilhas |
| shared/IslandGlassCard.tsx | Card glass primitivo para ilhas |
| shared/IslandPageFrame.tsx | Frame de página de ilha |
| shared/IslandPageHeader.tsx | Cabeçalho de página de ilha |

### omnis/
| Componente | Propósito |
|---|---|
| ContentDraftsCard.tsx | Card de rascunhos de conteúdo do OMNIS |
| CostSummaryCard.tsx | Card de resumo de custos LLM |
| GuardrailAlertCard.tsx | Card de alerta de guardrails |
| HealthScoreCard.tsx | Card de health score do OMNIS |
| MissionEventLogCard.tsx | Card de log de eventos de missão (read-only) |
| MissionGraphCard.tsx | Card do grafo de missões ativas |
| MissionRunsCard.tsx | Card de runs de missão (mission_logger) |

### projects/
| Componente | Propósito |
|---|---|
| ProjectCard.tsx | Card individual de projeto |
| ProjectFilterBar.tsx | Barra de filtro de projetos |

### world/
| Componente | Propósito |
|---|---|
| BridgeSystem.tsx | Sistema de pontes entre ilhas |
| CentralCastleMission.tsx | Castelo central com banner de missão |
| CloudLayer.tsx | Camada de nuvens do mundo 3D |
| FloatingIsland.tsx | Ilha flutuante genérica |
| IslandLabel.tsx | Label de ilha no mapa |
| KratosContext.tsx | Context provider do mundo KRATOS |
| KratosWorldMap.tsx | Mapa mundo principal |
| KratosWorldPage.tsx | Página completa do mundo (rota /) |
| MissionBanner.tsx | Banner de missão ativa |
| OceanBackdrop.tsx | Fundo oceano do mundo |
| SkyLayer.tsx | Camada de céu do mundo |
| StatusBarDock.tsx | Barra de status do mundo |
| WorldBottomDock.tsx | Dock inferior do mundo |
| WorldCharacterMarker.tsx | Marcador do operador no mapa |
| WorldRightPanel.tsx | Painel direito do mundo com agenda |
| WorldSidebar.tsx | Sidebar do mundo |
| WorldTopHud.tsx | HUD superior do mundo |

### icons/
| Componente | Propósito |
|---|---|
| KratosLogo.tsx | Logo SVG do KRATOS |

### ui-primitives/
| Componente | Propósito |
|---|---|
| EmptyState.tsx | Empty state para ilhas |
| ErrorState.tsx | Error state para ilhas |
| GlassPanel.tsx | Painel glassmorphism base |
| IconTile.tsx | Tile de ícone com label |
| IslandMiniCard.tsx | Card mini para ilhas |
| KratosCard.tsx | Card base KRATOS com tokens |
| LoadingSkeleton.tsx | Skeleton de carregamento |
| MetricBadge.tsx | Badge de métrica numérica |
| ProgressRing.tsx | Anel de progresso (variante ilhas) |
| SectionTitle.tsx | Título de seção |
| StatusChip.tsx | Chip de status colorido |

---

## Hooks (27)

| Hook | Propósito | Deps Principais |
|---|---|---|
| use-mobile.tsx | Detecta breakpoint mobile (<768px) via matchMedia | React |
| useAgenciaQueue.ts | Busca resumo da fila de conteúdo do OMNIS | agencia.schema, TanStack Query |
| useAkasha.ts | Status da Akasha (memória vetorial pgvector) | akasha-server-fns, TanStack Query |
| useAppointments.ts | CRUD completo de compromissos | appointment.schema, appointment-server-fns |
| useApprovalQueue.ts | Fila de rascunhos de conteúdo aguardando revisão | content-drafts.schema, TanStack Query |
| useAuroraInsight.ts | Insight atual da Aurora gerado pelo OMNIS/Ollama | aurora.schema, apiGet |
| useCheckpoints.ts | CRUD completo de checkpoints (save game mental) | checkpoint.schema, checkpoint-server-fns |
| useCheckpointSuggestion.ts | Deriva sugestão de checkpoint/risco a partir de dados live | useCheckpoints, useProjects |
| useContexto.ts | Snapshot de contexto atual com polling 30s | contexto.schema, contexto-server-fns |
| useDashboard.ts | Agregador de dados do dashboard (checkpoints+projetos+agenda+contexto) | Múltiplos server-fns |
| useDriftDetection.ts | Detecta desvio de missão (on-mission/drifting/lost/zombie) | apiGet, Zod inline |
| useGithub.ts | Status de repos GitHub (PRs, commits, health) | github.schema, github-server-fns |
| useGlobalShortcuts.ts | Atalhos de teclado globais (1-7 → rotas) | TanStack Router |
| useLiveStatus.ts | Estado live agregado (SSE + serviços + OMNIS) | useServices, useOmnis |
| useMissionEvents.ts | Log de eventos de missão específica | missions.schema, apiGet |
| useMissionLens.ts | Lente de missão atual + agenda do dia | source-badge.schema, apiGet |
| useMissions.ts | Lista de missões ativas do OMNIS | missions.schema, apiGet |
| useOffline.ts | Detecta estado offline/online do browser | window events |
| useOmnis.ts | Status/health/crews/jobs do OMNIS | omnis.schema, omnis-server-fns |
| useOmnisHealthScore.ts | Score de saúde do OMNIS (0-100) | omnis-health.schema, apiGet |
| useOmnisRuns.ts | Lista de runs de missão recentes | omnis-runs.schema, apiGet |
| useProjects.ts | CRUD completo de projetos | project.schema, project-server-fns |
| usePWAInstall.ts | Captura beforeinstallprompt, threshold 3 visitas | localStorage, window events |
| useSafeQuery.ts | Wrapper de useQuery com timeout e fallback | TanStack Query |
| useServices.ts | Saúde de todos os serviços externos | service.schema, service-server-fns |
| useSSEToasts.ts | Dispara toasts sonner para eventos críticos do OMNIS (read-only) | useMissions, sonner |
| useSystemPulse.ts | Pulso do sistema via /live/snapshot (Docker, collectors) | Zod inline, apiGet |

---

## Rotas (9)

| Rota | Componente Principal | Fonte de Dados |
|---|---|---|
| `/` (index) | KratosWorldPage | Loader: checkpoint-server-fns + project-server-fns + appointment-server-fns + contexto-server-fns |
| `/agora` | AgoraView | Hooks: useLiveStatus, useMissionLens, useCheckpoints, useDriftDetection |
| `/agenda` | AgendaView | Hooks: useAppointments, useMissions, useCheckpoints |
| `/checkpoints` | CheckpointsView | Hooks: useCheckpoints, useCheckpointSuggestion |
| `/projetos` | ProjetosView | Hooks: useProjects, useGithub |
| `/contexto` | ContextoView | Hooks: useContexto, useDriftDetection, useMissionLens |
| `/sistema` | SistemaView | Hooks: useServices, useOmnis, useSystemPulse, useOmnisHealthScore |
| `/ilhas/$islandId` | IslandPageFrame + lazy screen | IslandDockContext + screen-specific hooks |
| `__root` | AppShell + ReducedMotionProvider | QueryClientProvider, Toaster global, IslandDockProvider |

---

## Schemas Zod (api-contract/)

| Schema | Contrato OMNIS / Propósito |
|---|---|
| agencia.schema.ts | Fila de conteúdo do OMNIS content_queue — AgenciaQueueSummary, próximos slots |
| appointment.schema.ts | Compromissos CRUD — tipos: deep_work, meeting, review, admin, checkpoint |
| aurora.schema.ts | Insight Aurora gerado por OMNIS/Ollama — fonte, confiança, recomendação |
| checkpoint.schema.ts | Checkpoints (save game mental) — status: pending/in_progress/completed/blocked |
| collector-envelope.schema.json | Envelope JSON dos collectors (SSE/snapshot) |
| content-drafts.schema.ts | Rascunhos de caption para aprovação — status: draft/needs_review/approved/rejected |
| contexto.schema.ts | Snapshot de contexto — foco, drift, abas browser, janela ativa |
| dashboard.schema.ts | Snapshot agregado do dashboard — summary cards, health de serviços |
| error-taxonomy.ts | Taxonomia de erros de API — missing_config, external_unavailable, stale_data |
| github.schema.ts | Status de repos GitHub — PRs, commits, health, last_push |
| kratos-hud.schema.ts | Contrato do HUD ABA 6 — 10 Zod schemas operacionais |
| live.snapshot.schema.json | Schema JSON do /live/snapshot (Docker, collectors, CPU/mem) |
| live.stream.schema.md | Documentação do protocolo SSE /live/stream |
| missions.schema.ts | Missões do OMNIS — status: draft/running/paused/completed/failed, retries |
| omnis.schema.ts | Status do OMNIS — services, crews, jobs, memory stats |
| omnis-health.schema.ts | Health score do OMNIS — checks por categoria (0-100) |
| omnis-runs.schema.ts | Runs de missão (mission_logger) — command, module, status, duration |
| project.schema.ts | Projetos — status: active/paused/completed/archived |
| service.schema.ts | Serviços externos — health: live/degraded/offline/unknown |
| source-badge.schema.ts | Metadado de origem de dados — live/mock/cache, staleness |
| KRATOS_API_CONTRACT_V1.md | Documentação textual do contrato de API v1 |

---

## Skills CODEX (.claude/skills/)

### Skills em diretório (com SKILL.md + run.py)
| Skill | Propósito |
|---|---|
| bug-hunter | Caça e diagnostica bugs sistematicamente |
| code-review-strict | Revisão rigorosa de código antes de commit |
| deploy-automation | Prepara e documenta releases (nunca executa deploy) |
| design-system-guardian | QA visual do design system antes de commit |
| feature-planner | Planeja features antes de implementar |
| integration-architect | Arquiteta novas integrações externas |
| kratos-accessibility | Audita e corrige acessibilidade (a11y) |
| kratos-agenda-screen | Constrói/refina a tela /agenda |
| kratos-agora-screen | Constrói/refina a tela /agora |
| kratos-arena-screen | Constrói/refina a ilha Arena |
| kratos-aurora-ui | Constrói/refina a UI da Aurora |
| kratos-checkpoints-screen | Constrói/refina a tela /checkpoints |
| kratos-context-screen | Constrói/refina a tela /contexto |
| kratos-design-system | Gerencia o design system KRATOS |
| kratos-foundation | Operações de fundação do repo |
| kratos-frontend-guardrails | Guarda limites do frontend (leitura, não escrita) |
| kratos-future-3d | Evolução do mapa mundo 3D |
| kratos-hud | Constrói/refina o HUD cockpit |
| kratos-island-wiring | Conecta ilhas a dados reais |
| kratos-live-state-ui | UI de estado live (SSE, pulse, status) |
| kratos-mentor-screen | Constrói/refina tela do mentor operacional |
| kratos-neuro-ux | Valida UX TDAH-first |
| kratos-planning | Planejamento de sprints e waves |
| kratos-reporting | Relatórios e auditoria |
| kratos-shell | Gerencia o shell da aplicação |
| kratos-sse-performance | Otimização de performance SSE |
| kratos-system-screen | Constrói/refina a tela /sistema |
| kratos-visual-qa | QA visual pós-implementação |
| kratos-world-map | Constrói/refina o mapa mundo |
| lovable-ui-builder | Constrói UI lovable/visual-first |
| prompt-engineering-swe | Templates de prompt para engenharia de software |
| repo-onboarding | Onboarding no repo ao início de sessão |
| shadcn-page-builder | Constrói novas rotas/telas com shadcn/ui |

### Skills .md standalone
| Skill | Propósito |
|---|---|
| akasha-vault-builder.md | Interface do Akasha Vault (busca de memória vetorial) |
| api-contract-sync.md | Mantém consistência entre schemas Zod servidor/cliente |
| glass-panel-builder.md | Cria painéis glassmorphism com tokens KRATOS |
| hud-assembler.md | Monta shell HUD (top bar, sidebar, right rail, bottom dock) |
| island-composer.md | Compõe ilhas flutuantes no mundo 3D com CSS transforms |
| kimi-to-code.md | Converte specs visuais Kimi em código TypeScript/React |
| motion-guardian.md | Garante prefers-reduced-motion em todas as animações |
| neuro-ux-checker.md | Valida UX para TDAH (Miller 7±2, hierarquia, carga cognitiva) |
| omnis-lab-builder.md | Interface do laboratório OMNIS |
| token-enforcer.md | Enforça uso exclusivo de var(--kr-*), zero hex inline |
| visual-qa-kimi.md | Checklist de QA visual pós-implementação |

---

## Agents (.claude/agents/)

| Agent | Papel |
|---|---|
| kratos-architect.md | Planejamento e arquitetura — não escreve código de produto |
| kratos-api-builder.md | Constrói endpoints Hono em src/server.ts + backend/ |
| kratos-data-layer.md | Define schemas Zod, tipos TS, mock data e hooks TanStack Query |
| kratos-qa-guard.md | Revisão de qualidade antes de qualquer merge |
| kratos-ui-builder.md | Constrói UI de rotas — dark mode + mobile 375px obrigatórios |
