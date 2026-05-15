# FRONT-KIMI-03 — World Map Polish

Este prompt orienta a segunda etapa de melhoria do mapa de ilhas.  Ele foca em adaptar elementos do mapa sem reconstruí‑lo totalmente.

## Prompt

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-03 — WORLD MAP POLISH

Contexto:
  - O `KratosWorldMap` já existe no projeto com ilhas básicas.
  - O material Kimi fornece código para fundo, nuvens, pontes e um castelo central.

Objetivo:
  - Incorporar `OceanBackdrop`, `CloudLayer`, `IslandBridge`, e realizar pequenos ajustes nas ilhas existentes.
  - Adicionar ou adaptar o componente `CentralCastleMission` para exibir a missão atual no centro do mapa.

Regras:
  - NÃO recriar o mapa do zero.
  - NÃO alterar lógica de posicionamento de ilhas (x/y) se ela já for dinâmica.
  - NÃO adicionar framer-motion se o projeto não tiver.
  - Respeitar as classes de pseudo‑3D definidas nos tokens.

Tarefas:
  1. Revisar `docs/kimi/KIMI_CODE_RAW_PART_03_WORLD_MAP.md` e identificar trechos de código útil.
  2. Adicionar `OceanBackdrop.tsx` e `CloudLayer.tsx` ao diretório `src/components/kratos/world/` se ainda não estiverem.
  3. Adaptar `FloatingIsland` existente para usar classes de profundidade e glow se apropriado.
  4. Introduzir `IslandBridge` para desenhar conexões entre as ilhas e o castelo; determinar pontos de conexão.
  5. Incorporar `CentralCastleMission` para exibir a missão atual (badge, título, subtítulo).
  6. Atualizar o mapa apenas via CSS/HTML, sem modificar a lista de ilhas.

Validação:
  - Build (`npm run build`) deve passar sem erros.
  - O mapa deve carregar com oceano, nuvens e castelo central visíveis.
  - As ilhas devem permanecer interativas.

Relatório final:
  - Salvar em `docs/kimi/KIMI_FRONT_KIMI_03_WORLD_POLISH_REPORT.md`.
```