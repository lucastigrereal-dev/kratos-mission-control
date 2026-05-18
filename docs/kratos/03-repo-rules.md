# KRATOS Repo Rules — Component Map + Sensitive Files + Reuse

> **Para Manus/Kimi:** Antes de criar qualquer arquivo, verifique se já existe. Antes de editar, verifique se é protegido.

---

## 1. Full Component Map (~110 componentes)

### 1.1 Shell (PROTEGIDOS)
| Componente | Arquivo | PROTEÇÃO |
|---|---|---|
| AppShell | `shell/AppShell.tsx` | 🔒 NUNCA alterar sem autorização |
| Topbar | `shell/Topbar.tsx` | 🔒 NUNCA alterar sem autorização |
| Sidebar | `shell/Sidebar.tsx` | 🔒 NUNCA alterar sem autorização |
| SidebarItem | `shell/SidebarItem.tsx` | Livre |
| StatusBar | `shell/StatusBar.tsx` | 🔒 NUNCA alterar sem autorização |
| AuroraPanel | `shell/AuroraPanel.tsx` | 🔒 NUNCA alterar sem autorização |

### 1.2 World (mundo 3D)
| Componente | Arquivo | Função |
|---|---|---|
| KratosWorldPage | `world/KratosWorldPage.tsx` | Master cockpit page |
| KratosWorldMap | `world/KratosWorldMap.tsx` | Composição do mundo 3D |
| KratosContext | `world/KratosContext.tsx` | Provider de dados live |
| CentralCastleMission | `world/CentralCastleMission.tsx` | Castelo CSS central |
| FloatingIsland | `world/FloatingIsland.tsx` | Ilha flutuante |
| BridgeSystem | `world/BridgeSystem.tsx` | Pontes SVG entre ilhas |
| OceanBackdrop | `world/OceanBackdrop.tsx` | Fundo oceano/céu |
| SkyLayer | `world/SkyLayer.tsx` | Camada de céu com sol |
| CloudLayer | `world/CloudLayer.tsx` | Nuvens animadas |
| IslandLabel | `world/IslandLabel.tsx` | Label flutuante da ilha |
| MissionBanner | `world/MissionBanner.tsx` | Banner de missão atual |
| WorldCharacterMarker | `world/WorldCharacterMarker.tsx` | Marcador do operador |
| StatusBarDock | `world/StatusBarDock.tsx` | Dock inferior do cockpit |

### 1.3 HUD (glass overlays)
| Componente | Arquivo | Função |
|---|---|---|
| CurrentMissionBar | `hud/CurrentMissionBar.tsx` | Barra de missão atual |
| OperatorWelcomeCard | `hud/OperatorWelcomeCard.tsx` | Saudação do operador |
| FocusTodayCard | `hud/FocusTodayCard.tsx` | Foco do dia |
| AgendaTodayCard | `hud/AgendaTodayCard.tsx` | Timeline do dia |
| DailyQuoteCard | `hud/DailyQuoteCard.tsx` | Citação diária |
| KratosTopBar | `hud/KratosTopBar.tsx` | Topbar alternativa |
| KratosSidebar | `hud/KratosSidebar.tsx` | Sidebar alternativa |
| KratosRightRail | `hud/KratosRightRail.tsx` | Right rail |
| BottomDock | `hud/BottomDock.tsx` | Dock inferior |
| MissionStep | `hud/MissionStep.tsx` | Passo de missão |
| SquadDock | `hud/SquadDock.tsx` | Squad selector |
| WorldNavDock | `hud/WorldNavDock.tsx` | Navegação do mundo |
| AudioPlayer | `hud/AudioPlayer.tsx` | Player de áudio |

### 1.4 Aurora (mentor AI)
| Componente | Arquivo | Função |
|---|---|---|
| AuroraChatDock | `aurora/AuroraChatDock.tsx` | Chat dock com quick commands |
| AuroraPanelV2 | `aurora/AuroraPanelV2.tsx` | Painel completo |
| AuroraPanelContent | `aurora/AuroraPanelContent.tsx` | Conteúdo do painel |
| AuroraOrb | `aurora/AuroraOrb.tsx` | Orbe holográfico CSS |
| AuroraSignalList | `aurora/AuroraSignalList.tsx` | Lista de sinais |
| AuroraQuickActions | `aurora/AuroraQuickActions.tsx` | Ações rápidas |
| AuroraCommandPalette | `aurora/AuroraCommandPalette.tsx` | Cmd+K modal |
| AuroraMessagePreview | `aurora/AuroraMessagePreview.tsx` | Preview de mensagem |
| AuroraInputMock | `aurora/AuroraInputMock.tsx` | Input mock |

### 1.5 UI Primitives (SEMPRE reusar)
| Componente | Arquivo |
|---|---|
| GlassPanel | `ui-primitives/GlassPanel.tsx` |
| KratosCard | `ui-primitives/KratosCard.tsx` |
| LoadingSkeleton | `ui-primitives/LoadingSkeleton.tsx` |
| EmptyState | `ui-primitives/EmptyState.tsx` |
| ErrorState | `ui-primitives/ErrorState.tsx` |
| ProgressRing | `ui-primitives/ProgressRing.tsx` |
| MetricBadge | `ui-primitives/MetricBadge.tsx` |
| SectionTitle | `ui-primitives/SectionTitle.tsx` |
| StatusChip | `ui-primitives/StatusChip.tsx` |
| IconTile | `ui-primitives/IconTile.tsx` |
| IslandMiniCard | `ui-primitives/IslandMiniCard.tsx` |

### 1.6 Base (estados e badges)
| Componente | Arquivo | Função |
|---|---|---|
| LoadingState | `base/LoadingState.tsx` | Shimmer placeholder |
| EmptyState | `base/EmptyState.tsx` | Estado vazio |
| ErrorState | `base/ErrorState.tsx` | Estado de erro |
| ZombieBadge | `base/ZombieBadge.tsx` | Badge modo zumbi |
| StatusDot | `base/StatusDot.tsx` | Ponto de status |
| AlertBadge | `base/AlertBadge.tsx` | Badge de alerta |
| StatusCard | `base/StatusCard.tsx` | Card de status |
| SystemCard | `base/SystemCard.tsx` | Card de sistema |
| SectionHeader | `base/SectionHeader.tsx` | Cabeçalho de seção |
| SourceBadgeIndicator | `base/SourceBadgeIndicator.tsx` | Indicador de fonte |
| LiveStatusIndicator | `base/LiveStatusIndicator.tsx` | Status ao vivo |
| ReducedMotionProvider | `base/ReducedMotionProvider.tsx` | Context reduced motion |
| ProgressRing | `base/ProgressRing.tsx` | Anel de progresso |

### 1.7 Views (telas)
| View | Arquivo | Rota |
|---|---|---|
| DashboardView | `views/DashboardView.tsx` | `/` (fallback) |
| AgoraView | `views/AgoraView.tsx` | `/agora` |
| AgendaView | `views/AgendaView.tsx` | `/agenda` |
| CheckpointsView | `views/CheckpointsView.tsx` | `/checkpoints` |
| ProjetosView | `views/ProjetosView.tsx` | `/projetos` |
| ContextoView | `views/ContextoView.tsx` | `/contexto` |
| SistemaView | `views/SistemaView.tsx` | `/sistema` |

### 1.8 Island Screens (10 ilhas)
| Ilha | Arquivo | Rota |
|---|---|---|
| OmnisLab | `islands/OmnisLabScreen.tsx` | `/ilhas/omnis-lab` |
| Agencia | `islands/AgenciaScreen.tsx` | `/ilhas/agencia` |
| Akasha | `islands/AkashaScreen.tsx` | `/ilhas/akasha` |
| Nimbus | `islands/NimbusScreen.tsx` | `/ilhas/nimbus` |
| Arena | `islands/ArenaScreen.tsx` | `/ilhas/arena` |
| Vila | `islands/VilaScreen.tsx` | `/ilhas/vila` |
| Forja | `islands/ForjaScreen.tsx` | `/ilhas/forja` |
| Observatorio | `islands/ObservatorioScreen.tsx` | `/ilhas/observatorio` |
| Filosofia | `islands/FilosofiaScreen.tsx` | `/ilhas/filosofia` |
| Tesouro | `islands/TesouroScreen.tsx` | `/ilhas/tesouro` |

### 1.9 Shared Island Components
| Componente | Arquivo |
|---|---|
| IslandPageFrame | `islands/shared/IslandPageFrame.tsx` |
| IslandPageHeader | `islands/shared/IslandPageHeader.tsx` |

### 1.10 Domain Components
| Domínio | Componentes |
|---|---|
| `agora/` | FocusCard, NextActionCard, CriticalAlertCard, DeadlineCard, CheckpointCard, MiniAgenda, SystemPulseStrip, AuroraShortcutCard |
| `agenda/` | TodayExecutionPanel, OverduePanel, DeadlineRadar, DoNotDoPanel, FinishLinePanel, WeekDetailList |
| `checkpoints/` | CheckpointItemCard, CheckpointTimeline, CheckpointResume, CheckpointSummaryCard, CheckpointFilterBar, ResumeFromHereCard |
| `contexto/` | CurrentContextHero, FocusDriftCard, ActiveWindowCard, BrowserContextList, ContextReasonCard, ContextActionStrip |
| `mentor/` | ExecutionScoreCard, MentorRecommendationCard, RiskProjectCard |
| `projetos/` | ProjectCard, ProjectFilterBar |
| `sistema/` | GithubRepoCard, ServiceHealthCard, OmnisCrewCard, OmnisJobItem, OmnisServiceStatusCard |

---

## 2. Componentes Protegidos (🔒)

**NUNCA recriar ou alterar sem autorização explícita:**

| Componente | Arquivo | Motivo |
|---|---|---|
| Shell da aplicação | `shell/AppShell.tsx` | Layout grid central |
| Topbar HUD | `shell/Topbar.tsx` | Barra superior |
| Sidebar | `shell/Sidebar.tsx` | Navegação principal |
| StatusBar | `shell/StatusBar.tsx` | Barra de status inferior |
| AuroraPanel | `shell/AuroraPanel.tsx` | Painel de inteligência |
| Design tokens | `src/styles.css` | Sistema de design |
| Design tokens 3D | `src/styles/kratos-tokens.css` | Tokens do mundo 3D |
| Route tree | `src/routeTree.gen.ts` | **AUTO-GERADO — NUNCA EDITAR** |

---

## 3. Regras de Criação de Arquivos

### Nova rota:
1. Criar `src/routes/nome.tsx` com `createFileRoute`
2. Criar view em `src/components/kratos/views/NomeView.tsx`
3. `routeTree.gen.ts` é **regenerado automaticamente** pelo Vite

### Novo componente:
1. Colocar em `src/components/kratos/<dominio>/NomeComponente.tsx`
2. Interface de props obrigatória
3. Named export (nunca `export default`)
4. Adicionar ao `index.ts` barrel do domínio
5. Tokens CSS, zero hex inline

### Novo hook:
1. Colocar em `src/hooks/useNome.ts`
2. Usar `useApi<T>()` ou `@tanstack/react-query`
3. Nunca `fetch()` raw + `useEffect`

### Nova ilha:
1. Criar `src/components/kratos/islands/NomeScreen.tsx`
2. Usar `IslandPageFrame` + `IslandPageHeader`
3. Seguir template do documento `02-visual-system.md`
4. Registrar em `src/routes/ilhas.$islandId.tsx` (React.lazy)
5. Adicionar ao barrel `islands/index.ts`

---

## 4. Arquivos Sensíveis (NUNCA commitar)

- `.env` / `.env.local` / `.env.production`
- `*.pem` / `*.key` / certificates
- `node_modules/`
- `dist/`
- `.wrangler-dry/`
- `backend/.venv/`
- `.pytest_cache/`

---

## 5. Regras de Reaproveitamento

| Se precisa de... | Use |
|---|---|
| Container com blur | `GlassPanel` |
| Card funcional | `KratosCard` |
| Loading | `LoadingState` ou `LoadingSkeleton` |
| Vazio | `EmptyState` |
| Erro | `ErrorState` |
| Progresso circular | `ProgressRing` |
| Métrica com delta | `MetricBadge` |
| Título de seção | `SectionTitle` |
| Status liga/desliga | `StatusChip` / `StatusDot` |
| Badge de fonte | `SourceBadgeIndicator` |
| Preview de ilha | `IslandMiniCard` |

---

## 6. Convenções de Código

```tsx
// ✅ CERTO
interface MeuComponenteProps { titulo: string; onAction: () => void }
export function MeuComponente({ titulo, onAction }: MeuComponenteProps) { ... }

// ❌ ERRADO
export default function MeuComponente(props: any) { ... }

// ✅ CERTO — tokens CSS + cn()
style={{ color: "var(--kr-text-primary)" }}
className={cn("base-class", isActive && "active-class")}

// ❌ ERRADO — hex inline
style={{ color: "#E5E7EB" }}

// ✅ CERTO — useApi hook
const { data, isLoading } = useApi<MeuTipo>("/api/endpoint");

// ❌ ERRADO — fetch raw
useEffect(() => { fetch("/api/endpoint").then(...) }, []);
```

---

## 7. Regras Backend

- `backend/` contém stores SQLite (better-sqlite3)
- **NUNCA criar endpoint novo** sem contrato em `api-contract/` primeiro
- **NUNCA alterar `backend/app/main.py`** sem necessidade comprovada
- KRATOS é frontend/cockpit — **não é backend agêntico**
- OMNIS e Akasha são sistemas separados com contratos próprios
