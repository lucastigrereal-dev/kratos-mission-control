# KIMI COMPONENT TO KRATOS MAP

**Date:** 2026-05-15 | **Phase:** P1.5 | **Map version:** 2.0

---

## Current KRATOS Components → Kimi Reference Mapping

### Shell Components

| KRATOS Component | Path | Kimi Reference | Classification | Action |
|---|---|---|---|---|
| `KratosVisualShell` | `components/KratosVisualShell.tsx` | `05_HUD_COMPONENTS/` (HUD system) | EXISTING | **KEEP** — Kimi for polish only |
| `KratosTopHud` | `components/KratosTopHud.tsx` | `05_HUD_COMPONENTS/KratosTopHud.tsx` | EXISTING | KEEP — already polished in WD wave |
| `KratosSidebar` | `components/KratosSidebar.tsx` | `05_HUD_COMPONENTS/KratosSidebar.tsx` | EXISTING | KEEP — already polished |
| `KratosBottomDock` | `components/KratosBottomDock.tsx` | `05_HUD_COMPONENTS/KratosBottomDock.tsx` | EXISTING | KEEP — already polished |
| `KratosRightRail` | `components/KratosRightRail.tsx` | `06_AURORA_COMPONENTS/` | EXISTING | KEEP — already polished in WC wave |
| `Layout` | `components/Layout.tsx` | `VISUAL_BIBLE.md` (shell arch) | EXISTING | KEEP — 5-zone shell layout applied |

### World Map

| KRATOS Component | Path | Kimi Reference | Classification | Action |
|---|---|---|---|---|
| `KratosWorldMap` | `components/KratosWorldMap.tsx` | `ISLAND_CONFIG.ts` + `04_WORLD_MAP/` | EXISTING | KEEP — 7 islands + castle + 9 bridges applied |
| `FloatingIsland` | `components/FloatingIsland.tsx` | `04_WORLD_MAP_COMPONENTS/FloatingIsland` | EXISTING | KEEP — organic geometry applied in WB |
| `CentralCastleIsland` | `components/CentralCastleIsland.tsx` | `Palco Central` spec in VISUAL_BIBLE | EXISTING | KEEP — portal presence applied in WB |
| `IslandBridge` | `components/IslandBridge.tsx` | `04_WORLD_MAP_COMPONENTS/IslandBridge` | EXISTING | KEEP — wood/wood-dim variants applied |
| `WorldClouds` | `components/WorldClouds.tsx` | `CloudLayer` spec | EXISTING | KEEP — 40s animation applied |
| `WorldOceanBackground` | `components/WorldOceanBackground.tsx` | `OceanBackdrop` spec | EXISTING | KEEP — 5-layer ocean + mist applied |

### World Mini-Components

| KRATOS Component | Path | Kimi Reference | Classification | Action |
|---|---|---|---|---|
| `IslandMiniCard` | `components/world/IslandMiniCard.tsx` | `ISLAND_CONFIG.ts` | EXISTING | KEEP |
| `WorldMapLegend` | `components/world/WorldMapLegend.tsx` | `ISLAND_CONFIG.ts` (status system) | EXISTING | KEEP |

### Aurora / Mission

| KRATOS Component | Path | Kimi Reference | Classification | Action |
|---|---|---|---|---|
| `AuroraPanel` | `components/AuroraPanel.tsx` | `06_AURORA_COMPONENTS/AuroraPanel.tsx` | EXISTING | KEEP — orb, decision cards, signals applied |
| `MissionBar` | `components/MissionBar.tsx` | `05_HUD_COMPONENTS/MissionBar.tsx` | EXISTING | KEEP — live telemetry bound |
| `CheckpointSuggestionBanner` | `components/CheckpointSuggestionBanner.tsx` | `06_AURORA_COMPONENTS/CheckpointSuggestionVisual.tsx` | EXISTING | KEEP — already adapted |
| `SourceBadge` | `components/SourceBadge.tsx` | — | EXISTING | KEEP — no Kimi analog |

### UI Primitives

| KRATOS Component | Path | Kimi Reference | Classification | Action |
|---|---|---|---|---|
| `EmptyState` | `components/ui/EmptyState.tsx` | `03_SAFE_PRIMITIVES/EmptyState.tsx` | EXISTS (basic) | **ENHANCE in P3** — Kimi has richer variant |
| `ErrorState` | `components/ui/ErrorState.tsx` | `03_SAFE_PRIMITIVES/ErrorState.tsx` | EXISTS (basic) | **ENHANCE in P3** — add retry callback |
| `ProgressRing` | `components/ui/ProgressRing.tsx` | `03_SAFE_PRIMITIVES/ProgressRing.tsx` | EXISTS (basic) | **ENHANCE in P3** — Kimi has multi-size |
| `MetricBadge` | `components/ui/MetricBadge.tsx` | `03_SAFE_PRIMITIVES/MetricBadge.tsx` | EXISTS (basic) | **ENHANCE in P3** — Kimi has trend variants |
| `SectionTitle` | `components/ui/SectionTitle.tsx` | — | EXISTING | KEEP |
| `LoadingSkeleton` | `components/LoadingSkeleton.tsx` | — | EXISTS (basic) | **ENHANCE in P3** — Kimi has shimmer variant |

### Pages

| KRATOS Page | Path | Kimi Reference | Classification | Action |
|---|---|---|---|---|
| `VisaoGeralPage` | `pages/VisaoGeralPage.tsx` | — | EXISTS (basic) | **REBUILD in P8** — Mission Control Home |
| `MissionLensPage` | `pages/MissionLensPage.tsx` | — | EXISTING | KEEP |
| `ContextoPage` | `pages/ContextoPage.tsx` | — | EXISTS (basic) | **ENHANCE in P10** — continuity memory |
| `SistemaPage` | `pages/SistemaPage.tsx` | — | EXISTING | KEEP |
| `ProjetosPage` | `pages/ProjetosPage.tsx` | — | EXISTING | KEEP |
| `TarefasPage` | `pages/TarefasPage.tsx` | — | EXISTING | KEEP |
| `CheckpointsPage` | `pages/CheckpointsPage.tsx` | — | EXISTS (basic) | **REBUILD in P11** — timeline view |
| `OmnisPage` | `pages/OmnisPage.tsx` | `03_component_reference/island_pages/OmnisLabPage.md` | EXISTS (basic) | **REBUILD in P6** — operational panel |

---

## Kimi Code Components NOT in KRATOS (future candidates)

| Kimi Component | Kimi Source | Candidates For | Phase |
|---|---|---|---|
| `AuroraOrb.tsx` | `06_AURORA_COMPONENTS/` | AuroraPanel enhancement | P9 |
| `AuroraSignalCard.tsx` | `06_AURORA_COMPONENTS/` | AuroraPanel enhancement | P9 |
| `AuroraHUDSystem.tsx` | `06_AURORA_COMPONENTS/` | Full Aurora UI | P9 |
| `StatusBarDock.tsx` | `05_HUD_COMPONENTS/` | BottomDock enhancement | P8 |
| `SquadDock.tsx` | `05_HUD_COMPONENTS/` | BottomDock enhancement | P8 |
| `StatusChip.tsx` | `03_SAFE_PRIMITIVES/` | UI primitives enhancement | P3 |
| `GlassPanel.tsx` | `03_SAFE_PRIMITIVES/` | Already applied in CSS | DONE |
| `ArenaComercialPage.tsx` | `07_ISLAND_PAGES/` | Future island pages | Post-P14 |
| `ObservatorioPage.tsx` | `07_ISLAND_PAGES/` | Future island pages | Post-P14 |
| `AkashaVaultPage.tsx` | `07_ISLAND_PAGES/` | Future island pages | Post-P14 |
| `AgenciaStudioPage.tsx` | `07_ISLAND_PAGES/` | Future island pages | Post-P14 |
| `ForjaCorpoPage.tsx` | `07_ISLAND_PAGES/` | Future island pages | Post-P14 |

---

## Decision Rules

1. **Component exists in KRATOS → patch, don't recreate**
2. **Component is basic in KRATOS → enhance with Kimi spec, don't replace**
3. **Component doesn't exist → create adapted version using Kimi as reference**
4. **Kimi uses Framer Motion → convert to CSS transitions**
5. **Kimi uses CVA → simplify to plain React + CSS classes**
6. **Kimi has duplicate technical/visual variants → use visual as primary, technical as supplement**
