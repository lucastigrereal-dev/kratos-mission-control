# KRATOS WA2 — KIMI COMPONENT MAP CONSOLIDATED

**Date:** 2026-05-15 | **Block:** A2 | **Status:** COMPLETE

---

## Skills ativadas neste bloco

| Skill | Motivo | Modo | Risco | Resultado |
|---|---|---|---|---|
| sc:analyze | Mapeamento Kimi → KRATOS | read-only | LOW | OK |
| design-system | Verificação de consistência de tokens | read-only | LOW | OK |
| jarvis-brain | Cruzamento multi-fonte | read-only | LOW | OK |
| review | Validação do mapa | read-only | LOW | OK |
| writing-plans | Preparação para blocos de implementação | dry-run | LOW | OK |
| ui-ux-pro-max | Avaliação de qualidade visual | read-only | LOW | OK |
| verification-before-completion | Verificação de completude | dry-run | LOW | OK |

## Mapa completo Kimi → KRATOS Real

### Shell & Layout

| Kimi Reference | KRATOS Real | Status | Ação |
|---|---|---|---|
| TopBar (64px, glass, z-100) | KratosTopHud.tsx | EXISTS | Polish apenas |
| Sidebar (220px, fixed, z-100) | KratosSidebar.tsx | EXISTS | Polish apenas |
| RightRail (340px, z-100) | KratosRightRail.tsx (260px) | EXISTS | Ajustar largura + conteúdo |
| BottomDock (80px, z-90) | KratosBottomDock.tsx (64px) | EXISTS | Polish + altura |
| VisualShell Grid | KratosVisualShell.tsx + Layout.tsx | EXISTS | OK |

### Mundo & Ilhas

| Kimi Reference | KRATOS Real | Status | Ação |
|---|---|---|---|
| OceanBackdrop | WorldOceanBackground.tsx | EXISTS | Melhorar layers |
| FloatingIsland | FloatingIsland.tsx | EXISTS | Refinar geometria |
| CentralCastleMission | CentralCastleIsland.tsx | EXISTS | Melhorar presença |
| IslandBridge | IslandBridge.tsx | EXISTS | OK |
| CloudLayer | WorldClouds.tsx | EXISTS | OK |
| Island Labels | Inline em FloatingIsland | EXISTS | Melhorar readability |
| Ghost Islands | NÃO EXISTE | MISSING | Wave B — criar |
| WorldMapLegend | WorldMapLegend.tsx | EXISTS | OK |

### UI Primitives

| Kimi Reference | KRATOS Real | Status | Ação |
|---|---|---|---|
| EmptyState | EmptyState.tsx | EXISTS | OK |
| ErrorState | ErrorState.tsx | EXISTS | OK |
| ProgressRing | ProgressRing.tsx | EXISTS | OK |
| MetricBadge | MetricBadge.tsx | EXISTS | OK |
| SectionTitle | SectionTitle.tsx | EXISTS | OK |
| LoadingSkeleton | LoadingSkeleton.tsx | EXISTS | OK |
| GlassPanel | NÃO EXISTE standalone | MISSING | Criar se necessário |
| StatusChip | NÃO EXISTE standalone | MISSING | Pode usar CSS class |

### Aurora & Missão

| Kimi Reference | KRATOS Real | Status | Ação |
|---|---|---|---|
| AuroraPanel | AuroraPanel.tsx | EXISTS | Melhorar presença |
| AuroraOrb | CSS em AuroraPanel | EXISTS | Refinar animação |
| AuroraDecisionCards | AuroraPanel.tsx | EXISTS | OK |
| MissionBar | MissionBar.tsx | EXISTS | OK |
| CheckpointSuggestion | CheckpointSuggestionBanner.tsx | EXISTS | OK |
| NextAction priority | AuroraPanel + BottomDock | EXISTS | OK |
| Risk Radar | NÃO EXISTE | MISSING | Wave C — criar |

### Páginas de Ilha

| Kimi Reference | KRATOS Real | Status | Ação |
|---|---|---|---|
| OMNIS Lab page | OmnisPage.tsx (510B — placeholder) | MINIMAL | Expandir Wave C |
| Tarefas/Ações | TarefasPage.tsx | EXISTS | OK |
| Projetos/Iniciativas | ProjetosPage.tsx | EXISTS | OK |
| Contexto | ContextoPage.tsx | EXISTS | OK |
| Sistema | SistemaPage.tsx | EXISTS | OK |
| Checkpoints | CheckpointsPage.tsx | EXISTS | OK |
| Mission Lens | MissionLensPage.tsx | EXISTS | OK |
| Visão Geral | VisaoGeralPage.tsx | EXISTS | OK |

## Resumo de gaps

| Prioridade | Gap | Wave alvo |
|---|---|---|
| ALTA | Ghost islands decorativas | B |
| ALTA | Risk radar no RightRail | C |
| MÉDIA | RightRail 260→340px | B |
| MÉDIA | BottomDock 64→80px | B |
| MÉDIA | 11 ilhas canônicas no mapa | B |
| MÉDIA | GlassPanel standalone primitive | B |
| BAIXA | StatusChip standalone | C |
| BAIXA | OmnisPage expansão | C |

## Próximo bloco

A3 — Visual Bible Rules Extraction
