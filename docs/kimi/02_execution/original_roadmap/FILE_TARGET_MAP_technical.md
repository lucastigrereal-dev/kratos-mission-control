# Mapa de Arquivos de Destino

Este mapa relaciona microfases, componentes Kimi e os arquivos de destino no repositório KRATOS.  Use-o para encontrar o local correto para adicionar ou ajustar código durante cada microfase.

| Microfase | Componente Kimi/Spec | Arquivo destino real (KRATOS) | Observação |
|---|---|---|---|
| FRONT-KIMI-01 | EmptyState, ErrorState, ProgressRing, MetricBadge | `src/components/ui/` | Se não existirem, criar arquivos TSX correspondentes |
| FRONT-KIMI-02 | Tokens e Glass | `src/styles/kratos-tokens.css`, `tailwind.config.ts` | Ajustar tokens sem quebrar classes existentes |
| FRONT-KIMI-03 | OceanBackdrop, CloudLayer, IslandBridge, FloatingIsland adjustments | `src/components/kratos/world/` | Verificar se `KratosWorldMap.tsx` já existe e adaptar |
| FRONT-KIMI-04 | KratosTopHud, Sidebar, RightRail, BottomDock, MissionBar | `src/components/kratos/hud/` | Preferir adaptar componentes existentes |
| FRONT-KIMI-05 | AuroraPanel, AuroraOrb, CheckpointSuggestionVisual | `src/components/kratos/aurora/` | Melhorar o painel sem adicionar chat completo |
| FRONT-KIMI-06+ | Island Pages (Omnis Lab, Akasha, Agência, etc.) | `src/pages/` ou `src/pages/islands/` | Criar uma página por ilha, usando primitives e HUD |
| FRONT-KIMI-08 | QA Prompts | `docs/` ou `docs/kimi/` | As listas de QA e prompts ficam em arquivos markdown |

Se um arquivo real não existir, crie com o caminho sugerido.  Se ele já existir, abra e adapte as partes necessárias.  Nunca renomeie ou mova arquivos sem atualizar importações.