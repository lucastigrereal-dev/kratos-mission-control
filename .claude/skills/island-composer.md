---
name: island-composer
description: "Compõe e posiciona ilhas flutuantes no mundo 3D KRATOS usando CSS transforms (rotateX, perspective), sem Three.js."
metadata:
  type: skill
  tier: core
  project: kratos-mission-control
  scope: frontend
  protected_components:
    - KratosWorldMap.tsx
    - FloatingIsland.tsx
    - CentralCastleIsland.tsx
    - IslandBridge.tsx
    - WorldOceanBackground.tsx
    - WorldClouds.tsx
---

# island-composer

Compõe ilhas flutuantes no mundo pseudo-3D usando apenas CSS (perspective + rotateX + animações).

## Componentes existentes (NÃO recriar)

| Componente | Função |
|-----------|--------|
| `KratosWorldMap.tsx` | Orquestrador: 7 ilhas + castelo + 9 pontes SVG + nuvens + oceano |
| `FloatingIsland.tsx` | Ilha individual com topo orgânico, rotateX(55deg), float animation |
| `CentralCastleIsland.tsx` | Castelo central com 3 torres CSS, portal glow, banner missão |
| `IslandBridge.tsx` | Pontes SVG curvas (bezier) entre ilhas |
| `WorldOceanBackground.tsx` | Container com oceano gradiente + sol radial |
| `WorldClouds.tsx` | 3 nuvens com drift animation |

## Tokens de ilha
| Token | Uso |
|-------|-----|
| `--kr-island-central-size: 200px` | Tamanho castelo |
| `--kr-island-large-size: 140px` | Ilhas grandes (Tarefas, Projetos) |
| `--kr-island-medium-size: 110px` | Ilhas médias (Contexto, Sistema) |
| `--kr-island-small-size: 85px` | Ilhas pequenas (Checkpoints, OMNIS) |
| `--kr-isle-moss`, `--kr-isle-fern`, `--kr-isle-lime` | Cores do topo da ilha |
| `--kr-earth-top`, `--kr-earth-mid`, `--kr-earth-base`, `--kr-earth-rock` | Cores do corpo |
| `--kr-wood-bridge`, `--kr-wood-dark` | Cores das pontes |
| `--kr-z-world: 0`, `--kr-z-island: 10`, `--kr-z-bridge: 5`, `--kr-z-cloud: 3` | Z-index stack |

## Regras ao adicionar/editar ilhas
- NUNCA instalar Three.js ou React Three Fiber
- NUNCA usar `<canvas>` — é tudo CSS/HTML
- NUNCA remover `prefers-reduced-motion` (animações já são desligadas no seletor)
- SEMPRE usar `transform-style: preserve-3d` no container
- SEMPRE posicionar com `%` do container `.kr-world`, nunca px fixo
- Pontes são SVG no viewBox "0 0 100 100" com `preserveAspectRatio="none"`
- Cada ilha nova precisa de: posição (x%, y%), tamanho (sm/md/lg), rótulo, rota de navegação
