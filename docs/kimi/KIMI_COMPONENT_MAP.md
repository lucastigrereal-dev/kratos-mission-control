# KIMI_COMPONENT_MAP.md — Mapa Kimi → KRATOS Real

| Componente/Material | Decisão | Motivo |
|---|---|---|
| GlassPanel | JÁ EXISTE / NÃO RECRIAR | Kimi tem versões em safe_primitives; usar só para comparar tokens. Risco: CVA/duplicação. |
| ProgressRing | USAR EM P1-D ADAPTADO | Componente novo útil. Remover Framer/CVA se houver. SVG puro com tokens. |
| MetricBadge | USAR EM P1-D ADAPTADO | Componente novo útil para painéis. Tipar props. |
| EmptyState | USAR EM P1-D ADAPTADO | Novo primitive seguro. Usar unicode/icon fallback. |
| ErrorState | USAR EM P1-D ADAPTADO | Novo primitive seguro. Retry opcional. |
| StatusChip | ADAPTAR SOMENTE SE NÃO DUPLICAR | Pode colidir com chips existentes em CSS. |
| KratosWorldMap | NÃO USAR DIRETO | Já existe no repo. Patch mínimo apenas. |
| FloatingIsland | NÃO RECRIAR | Já existe. Usar Kimi só como referência visual. |
| CentralCastleMission | NÃO RECRIAR | Já existe CentralCastleIsland/Castle. Usar visual como inspiração. |
| OceanBackdrop | NÃO RECRIAR | Já existe WorldOceanBackground/OceanBackground. |
| CloudLayer | NÃO RECRIAR | Já existe WorldClouds/Clouds. |
| IslandBridge | NÃO RECRIAR | Já existe. Só polish depois. |
| KratosTopHud | NÃO RECRIAR | Já existe. Só polish P4. |
| KratosSidebar | NÃO RECRIAR | Já existe. Só polish P4. |
| KratosBottomDock | NÃO RECRIAR | Já existe. Só polish P4. |
| MissionBar | NÃO RECRIAR | Já existe e vinculado live telemetry. |
| SquadDock | ADAPTAR DEPOIS | Pode virar refinamento do bottom dock. |
| AuroraPanel | NÃO RECRIAR | Já existe. Kimi só referência para polish. |
| AuroraOrb | P3/P4 ADAPTAR | Visual extra opcional. |
| AuroraSignalCard | P3/P4 ADAPTAR | Pode melhorar painel direito. |
| CheckpointSuggestionVisual | ADAPTAR COM CUIDADO | Já existe CheckpointSuggestionBanner + hook. |
| Island Pages | P3 | Usar como spec conceitual, não como import direto. |
| motionVariants.ts | NÃO USAR AGORA | Framer Motion não está liberado. Usar CSS fallback. |

## Regra

Se um componente já existir no KRATOS, **não recriar**. Fazer patch pequeno, com build e diff controlado.
