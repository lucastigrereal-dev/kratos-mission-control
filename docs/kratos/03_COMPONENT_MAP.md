# KRATOS Component Map — Mapa Canônico de Todos os Componentes

> **Para MANUS:** Antes de criar qualquer componente, verifique se já existe aqui. Antes de editar, verifique se é protegido.

---

## 1. Componentes Protegidos (🔒 NUNCA alterar sem autorização)

| Componente | Arquivo | Motivo |
|---|---|---|
| AppShell | `src/components/kratos/shell/AppShell.tsx` | Layout grid central |
| Topbar | `src/components/kratos/shell/Topbar.tsx` | Barra superior HUD |
| Sidebar | `src/components/kratos/shell/Sidebar.tsx` | Navegação principal |
| StatusBar | `src/components/kratos/shell/StatusBar.tsx` | Barra de status inferior |
| AuroraPanel | `src/components/kratos/shell/AuroraPanel.tsx` | Painel de inteligência |
| Design tokens | `src/styles.css` | Sistema de design |
| Design tokens 3D | `src/styles/kratos-tokens.css` | Tokens do mundo 3D |
| Route tree | `src/routeTree.gen.ts` | **AUTO-GERADO — NUNCA EDITAR** |

---

## 2. Shell Components

| Componente | Arquivo | Função | Proteção |
|---|---|---|---|
| AppShell | `shell/AppShell.tsx` | Layout grid: sidebar + main + right-rail | 🔒 |
| Topbar | `shell/Topbar.tsx` | Barra superior com breadcrumb | 🔒 |
| Sidebar | `shell/Sidebar.tsx` | Navegação lateral com itens | 🔒 |
| SidebarItem | `shell/SidebarItem.tsx` | Item individual da sidebar | Livre |
| StatusBar | `shell/StatusBar.tsx` | Barra de status inferior | 🔒 |
| AuroraPanel | `shell/AuroraPanel.tsx` | Container do painel direito Aurora | 🔒 |
| DriftIndicator | `shell/DriftIndicator.tsx` | Indicador de deriva de foco | Livre |
| NextActionBlock | `shell/NextActionBlock.tsx` | Bloco de próxima ação | Livre |
| IslandCard | `shell/IslandCard.tsx` | Card de status de ilha | Livre |

---

## 3. World Components (mundo 3D CSS)

| Componente | Arquivo | Função |
|---|---|---|
| KratosWorldPage | `world/KratosWorldPage.tsx` | Master cockpit page — composição total |
| KratosWorldMap | `world/KratosWorldMap.tsx` | Composição do mundo 3D (ilhas + pontes + castelo) |
| KratosContext | `world/KratosContext.tsx` | Provider central de dados live |
| CentralCastleMission | `world/CentralCastleMission.tsx` | Castelo CSS central |
| FloatingIsland | `world/FloatingIsland.tsx` | Ilha flutuante individual |
| BridgeSystem | `world/BridgeSystem.tsx` | Pontes SVG entre ilhas |
| OceanBackdrop | `world/OceanBackdrop.tsx` | Fundo oceano-céu gradiente |
| SkyLayer | `world/SkyLayer.tsx` | Camada de céu com sol radial |
| CloudLayer | `world/CloudLayer.tsx` | Nuvens animadas (4 clouds, 120s drift) |
| IslandLabel | `world/IslandLabel.tsx` | Label flutuante sobre ilha |
| MissionBanner | `world/MissionBanner.tsx` | Banner de missão atual |
| WorldCharacterMarker | `world/WorldCharacterMarker.tsx` | Marcador pulsante do operador no castelo |
| StatusBarDock | `world/StatusBarDock.tsx` | Dock inferior do cockpit |

---

## 4. HUD Components (glass overlays)

| Componente | Arquivo | Função |
|---|---|---|
| CurrentMissionBar | `hud/CurrentMissionBar.tsx` | Barra de missão atual com progresso |
| OperatorWelcomeCard | `hud/OperatorWelcomeCard.tsx` | Card de saudação (avatar + nome + motto) |
| FocusTodayCard | `hud/FocusTodayCard.tsx` | Card de foco do dia |
| AgendaTodayCard | `hud/AgendaTodayCard.tsx` | Timeline de compromissos do dia |
| DailyQuoteCard | `hud/DailyQuoteCard.tsx` | Citação diária motivacional |
| KratosTopBar | `hud/KratosTopBar.tsx` | Topbar alternativa |
| KratosSidebar | `hud/KratosSidebar.tsx` | Sidebar alternativa |
| KratosRightRail | `hud/KratosRightRail.tsx` | Rail direito |
| BottomDock | `hud/BottomDock.tsx` | Dock inferior |
| MissionStep | `hud/MissionStep.tsx` | Passo individual de missão |
| SquadDock | `hud/SquadDock.tsx` | Squad selector |
| WorldNavDock | `hud/WorldNavDock.tsx` | Navegação do mundo 3D |
| AudioPlayer | `hud/AudioPlayer.tsx` | Player de áudio ambiente |
| StatusBarDock | `hud/StatusBarDock.tsx` | Variante HUD do dock inferior |

---

## 5. Aurora Components (mentor AI)

| Componente | Arquivo | Função |
|---|---|---|
| AuroraChatDock | `aurora/AuroraChatDock.tsx` | Chat dock com quick commands |
| AuroraPanelV2 | `aurora/AuroraPanelV2.tsx` | Painel completo Aurora |
| AuroraPanelContent | `aurora/AuroraPanelContent.tsx` | Conteúdo do painel Aurora |
| AuroraOrb | `aurora/AuroraOrb.tsx` | Orbe holográfico CSS (48px) |
| AuroraSignalList | `aurora/AuroraSignalList.tsx` | Lista de sinais do mentor |
| AuroraQuickActions | `aurora/AuroraQuickActions.tsx` | Ações rápidas |
| AuroraCommandPalette | `aurora/AuroraCommandPalette.tsx` | Modal Cmd+K |
| AuroraMessagePreview | `aurora/AuroraMessagePreview.tsx` | Preview de mensagem |
| AuroraInputMock | `aurora/AuroraInputMock.tsx` | Input mock |

---

## 6. UI Primitives (SEMPRE reusar — nunca criar card/panel novo)

| Componente | Arquivo | Props principais |
|---|---|---|
| GlassPanel | `ui-primitives/GlassPanel.tsx` | `children`, `className?`, `variant?` |
| KratosCard | `ui-primitives/KratosCard.tsx` | `header?`, `footer?`, `children`, `className?` |
| LoadingSkeleton | `ui-primitives/LoadingSkeleton.tsx` | `lines?`, `className?` |
| EmptyState | `ui-primitives/EmptyState.tsx` | `title`, `description?`, `icon?`, `action?` |
| ErrorState | `ui-primitives/ErrorState.tsx` | `title`, `description?`, `onRetry?` |
| ProgressRing | `ui-primitives/ProgressRing.tsx` | `value`, `max?`, `size?`, `className?` |
| MetricBadge | `ui-primitives/MetricBadge.tsx` | `value`, `label?`, `delta?`, `trend?` |
| SectionTitle | `ui-primitives/SectionTitle.tsx` | `title`, `icon?`, `eyebrow?` |
| StatusChip | `ui-primitives/StatusChip.tsx` | `status`, `label?` |
| IconTile | `ui-primitives/IconTile.tsx` | `icon`, `color?`, `label?` |
| IslandMiniCard | `ui-primitives/IslandMiniCard.tsx` | `island`, `status?`, `onClick?` |

---

## 7. Base Components (estados e badges)

| Componente | Arquivo | Função |
|---|---|---|
| LoadingState | `base/LoadingState.tsx` | Shimmer placeholder (N linhas) |
| EmptyState | `base/EmptyState.tsx` | Estado vazio com CTA opcional |
| ErrorState | `base/ErrorState.tsx` | Estado de erro com retry |
| ZombieBadge | `base/ZombieBadge.tsx` | Badge modo offline/zumbi |
| StatusDot | `base/StatusDot.tsx` | Ponto de status (live/degraded/offline) |
| AlertBadge | `base/AlertBadge.tsx` | Badge de alerta com contador |
| StatusCard | `base/StatusCard.tsx` | Card de status do sistema |
| SystemCard | `base/SystemCard.tsx` | Card de sistema |
| SectionHeader | `base/SectionHeader.tsx` | Cabeçalho de seção com eyebrow |
| SourceBadgeIndicator | `base/SourceBadgeIndicator.tsx` | Indicador de fonte (live/cache/mock/error) |
| LiveStatusIndicator | `base/LiveStatusIndicator.tsx` | Indicador de conexão ao vivo |
| ReducedMotionProvider | `base/ReducedMotionProvider.tsx` | Context provider reduced motion |
| ProgressRing | `base/ProgressRing.tsx` | Anel de progresso SVG |

---

## 8. Views (telas principais)

| View | Arquivo | Rota | Hooks usados |
|---|---|---|---|
| DashboardView | `views/DashboardView.tsx` | `/` (fallback) | useDashboard, useMissionLens, useGithub, useCheckpoints |
| AgoraView | `views/AgoraView.tsx` | `/agora` | useCheckpoints, useAppointments, useLiveStatus, useMissionLens, useDriftDetection |
| AgendaView | `views/AgendaView.tsx` | `/agenda` | useAppointments, useCheckpoints |
| CheckpointsView | `views/CheckpointsView.tsx` | `/checkpoints` | useCheckpoints, useCreateCheckpoint, useUpdateCheckpoint |
| ProjetosView | `views/ProjetosView.tsx` | `/projetos` | useProjects |
| ContextoView | `views/ContextoView.tsx` | `/contexto` | useContexto |
| SistemaView | `views/SistemaView.tsx` | `/sistema` | useServices, useOmnis, useGithub |

---

## 9. Island Screens (10 ilhas)

| Ilha | Arquivo | Rota | Tema |
|---|---|---|---|
| OmnisLab | `islands/OmnisLabScreen.tsx` | `/ilhas/omnis-lab` | `--kr-island-omnis` (#7C3AED) |
| Agencia | `islands/AgenciaScreen.tsx` | `/ilhas/agencia` | `--kr-island-agencia` (#F97316) |
| Akasha | `islands/AkashaScreen.tsx` | `/ilhas/akasha` | `--kr-island-akasha` (#059669) |
| Nimbus | `islands/NimbusScreen.tsx` | `/ilhas/nimbus` | `--kr-island-nimbus` (#0EA5E9) |
| Arena | `islands/ArenaScreen.tsx` | `/ilhas/arena` | `--kr-island-arena` (#E11D48) |
| Vila | `islands/VilaScreen.tsx` | `/ilhas/vila` | `--kr-island-vila` (#16A34A) |
| Forja | `islands/ForjaScreen.tsx` | `/ilhas/forja` | `--kr-island-forja` (#DC2626) |
| Observatorio | `islands/ObservatorioScreen.tsx` | `/ilhas/observatorio` | `--kr-island-observatorio` (#4F46E5) |
| Filosofia | `islands/FilosofiaScreen.tsx` | `/ilhas/filosofia` | `--kr-island-filosofia` (#D97706) |
| Tesouro | `islands/TesouroScreen.tsx` | `/ilhas/tesouro` | `--kr-island-financas` (#CA8A04) |

### Shared Island Components

| Componente | Arquivo | Função |
|---|---|---|
| IslandPageFrame | `islands/shared/IslandPageFrame.tsx` | Wrapper com top border colorido + radial gradient |
| IslandPageHeader | `islands/shared/IslandPageHeader.tsx` | Header com back button + accent bar + título |

### Template de Ilha

```tsx
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";

interface NomeScreenProps {
  isLoading?: boolean;
  error?: { message: string } | null;
  isEmpty?: boolean;
}

export function NomeScreen({
  isLoading = false,
  error = null,
  isEmpty = false,
}: NomeScreenProps) {
  if (isLoading) return <LoadingState lines={5} />;
  if (error) return <ErrorState title="..." onRetry={() => {}} />;
  if (isEmpty) return <EmptyState title="..." />;

  return (
    <IslandPageFrame theme="indigo">
      <IslandPageHeader
        title="Nome da Ilha"
        description="Descrição"
        icon="🎯"
        onBack={() => window.history.back()}
      />
      {/* conteúdo */}
    </IslandPageFrame>
  );
}
```

---

## 10. Domain Components

### agora/
| Componente | Arquivo | Função |
|---|---|---|
| FocusCard | `agora/FocusCard.tsx` | Card de foco principal |
| NextActionCard | `agora/NextActionCard.tsx` | Próxima ação concreta |
| CriticalAlertCard | `agora/CriticalAlertCard.tsx` | Alerta crítico |
| DeadlineCard | `agora/DeadlineCard.tsx` | Prazo próximo |
| CheckpointCard | `agora/CheckpointCard.tsx` | Checkpoint ativo |
| MiniAgenda | `agora/MiniAgenda.tsx` | Mini timeline do dia |
| SystemPulseStrip | `agora/SystemPulseStrip.tsx` | Status dos sistemas |
| AuroraShortcutCard | `agora/AuroraShortcutCard.tsx` | Atalho para Aurora |

### agenda/
| Componente | Arquivo | Função |
|---|---|---|
| TodayExecutionPanel | `agenda/TodayExecutionPanel.tsx` | Painel de execução do dia |
| OverduePanel | `agenda/OverduePanel.tsx` | Itens atrasados |
| DeadlineRadar | `agenda/DeadlineRadar.tsx` | Radar de prazos |
| DoNotDoPanel | `agenda/DoNotDoPanel.tsx` | Não-fazer hoje |
| FinishLinePanel | `agenda/FinishLinePanel.tsx` | Linha de chegada |
| WeekDetailList | `agenda/WeekDetailList.tsx` | Detalhe da semana |

### checkpoints/
| Componente | Arquivo | Função |
|---|---|---|
| CheckpointItemCard | `checkpoints/CheckpointItemCard.tsx` | Card de checkpoint |
| CheckpointTimeline | `checkpoints/CheckpointTimeline.tsx` | Timeline visual |
| CheckpointResume | `checkpoints/CheckpointResume.tsx` | Card de retomada |
| CheckpointSummaryCard | `checkpoints/CheckpointSummaryCard.tsx` | Sumário de progresso |
| CheckpointFilterBar | `checkpoints/CheckpointFilterBar.tsx` | Filtros (status, projeto) |
| ResumeFromHereCard | `checkpoints/ResumeFromHereCard.tsx` | Call-to-action retomar |

### contexto/
| Componente | Arquivo | Função |
|---|---|---|
| CurrentContextHero | `contexto/CurrentContextHero.tsx` | Hero do contexto atual |
| FocusDriftCard | `contexto/FocusDriftCard.tsx` | Detecção de deriva |
| ActiveWindowCard | `contexto/ActiveWindowCard.tsx` | Janela ativa |
| BrowserContextList | `contexto/BrowserContextList.tsx` | Lista de contexto |
| ContextReasonCard | `contexto/ContextReasonCard.tsx` | Razão do contexto |
| ContextActionStrip | `contexto/ContextActionStrip.tsx` | Ações de contexto |

### mentor/
| Componente | Arquivo | Função |
|---|---|---|
| ExecutionScoreCard | `mentor/ExecutionScoreCard.tsx` | Score de execução |
| MentorRecommendationCard | `mentor/MentorRecommendationCard.tsx` | Recomendação do mentor |
| RiskProjectCard | `mentor/RiskProjectCard.tsx` | Projeto em risco |

### projetos/
| Componente | Arquivo | Função |
|---|---|---|
| ProjectCard | `projetos/ProjectCard.tsx` | Card de projeto |
| ProjectFilterBar | `projetos/ProjectFilterBar.tsx` | Filtro de projetos |

### sistema/
| Componente | Arquivo | Função |
|---|---|---|
| GithubRepoCard | `sistema/GithubRepoCard.tsx` | Card de repo GitHub |
| ServiceHealthCard | `sistema/ServiceHealthCard.tsx` | Saúde de serviço |
| OmnisCrewCard | `sistema/OmnisCrewCard.tsx` | Card de crew OMNIS |
| OmnisJobItem | `sistema/OmnisJobItem.tsx` | Job OMNIS individual |
| OmnisServiceStatusCard | `sistema/OmnisServiceStatusCard.tsx` | Status serviço OMNIS |

---

## 11. Regras de Reaproveitamento

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
| Ícone | `lucide-react` |
| Merge de classes | `cn()` de `src/lib/utils.ts` |

---

## 12. Contagem Total: ~110 componentes
