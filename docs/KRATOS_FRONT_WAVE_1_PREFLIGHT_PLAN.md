# KRATOS FRONT WAVE 1 PREFLIGHT PLAN

**Data:** 2026-05-14 | **Branch:** `feature/kratos-1-visual-shell`

---

## 1. Estado Atual

- P1-A commitada (0577f35): 11 rgba → color-mix em chips + AuroraPanel
- P1-C commitada (ec3ddbd): 11 tokens novos + 42 substituições em index.css
- Build: 61 modules, 0 errors, 688ms
- Backend diff: VAZIO
- Working tree: clean (apenas recovery report untracked)

## 2. Componentes Existentes (17)

Todos em `frontend/src/components/` (flat):

| Categoria | Componentes |
|-----------|-------------|
| Shell | KratosVisualShell, KratosTopHud, KratosSidebar, KratosRightRail, KratosBottomDock, Layout |
| Mundo | KratosWorldMap, FloatingIsland, CentralCastleIsland, IslandBridge, WorldClouds, WorldOceanBackground |
| Info | AuroraPanel, MissionBar, CheckpointSuggestionBanner |
| UI base | LoadingSkeleton, SourceBadge |

**Nenhum componente em `ui/`. Nenhum barrel export.**

## 3. Tokens Existentes

183 tokens em `kratos-tokens.css` (172 base + 11 P1-C). Cobertura:
- Cores base (bg, text, border)
- Famílias de cor (azure, ocean, isle, arena, gold, aurora)
- Vidro/glass (blur, border, bg variants)
- Sombras (sm, md, lg, float, glow-blue/gold/aurora)
- Mundo (sky, ocean, earth, wood, castle, grass)
- Motion, spacing, z-index, radius, sizing

## 4. O Que P1-C Entregou

- 11 tokens de mundo/ambiente
- 42 substituições rgba/hex → var(--kr-*)/color-mix()
- Scrollbar, high-contrast, skip-link preservados (acessibilidade)

## 5. O Que Kimi Recomenda

Prioridade imediata (P1-D):
- EmptyState, ErrorState, ProgressRing, MetricBadge

Próximos (P2):
- IslandMiniCard, WorldMapLegend, shimmer no LoadingSkeleton

## 6. O Que NÃO Pode Ser Importado do Kimi

- Código com `any`, `motion.div`, `cn()`, `cva`, lucide-react
- Componentes que já existem (GlassPanel, FloatingIsland, etc.)
- Código que requer dependências não instaladas

**Regra:** Kimi = referência de API/props. Reescrever com tokens `--kr-*`.

## 7. Microfases Planejadas

| Fase | Descrição | Arquivos esperados |
|------|-----------|-------------------|
| P1-D | UI Primitives (4 componentes) | `ui/EmptyState`, `ui/ErrorState`, `ui/ProgressRing`, `ui/MetricBadge`, `ui/index.ts` |
| P2-A | Refino componentes existentes | LoadingSkeleton shimmer, SectionTitle action/subtitle, usar primitives |
| P2-B | Responsividade + Neuro UX | IslandMiniCard, WorldMapLegend, ajustes CSS |
| P2-C | Live data binding hardening | Guards, fallbacks, null-safe rendering |
| P3-A | World shell polish | CSS depth, shadows, spacing, labels |

## 8. Arquivos Prováveis

```
frontend/src/components/ui/EmptyState.tsx
frontend/src/components/ui/ErrorState.tsx
frontend/src/components/ui/ProgressRing.tsx
frontend/src/components/ui/MetricBadge.tsx
frontend/src/components/ui/index.ts
frontend/src/components/world/IslandMiniCard.tsx
frontend/src/components/world/WorldMapLegend.tsx
frontend/src/index.css (apenas acréscimos de classes)
```

## 9. Testes/Builds Planejados

- `npm run build` após cada microfase
- `git diff HEAD -- backend/` após cada microfase
- `git diff --stat` para verificar escopo

## 10. Riscos

| Risco | Nível | Mitigação |
|-------|-------|-----------|
| Dependência nova | BAIXO | Nenhuma necessária para P1-D |
| Duplicar componente existente | BAIXO | Auditoria já feita — não existem EmptyState, ErrorState, ProgressRing, MetricBadge |
| Quebrar build com import novo | BAIXO | Componentes novos, sem alterar existentes |
| color-mix() em SVG | BAIXO | ProgressRing usa SVG stroke-dasharray, cores via var(--kr-*) |

## 11. Critérios de Parada

- Build falhar → PARAR
- Backend diff não vazio → PARAR
- Arquivos inesperados no diff → PARAR
- Dependência nova necessária → PARAR e pedir autorização

## 12. Estratégia de Commits

1 commit por microfase, git add específico, nunca `git add .`.

```
P1-D: feat(kratos): p1-d add reusable ui primitives
P2-A: feat(kratos): p2-a refine frontend component states
P2-B: feat(kratos): p2-b improve responsive neuro ux components
P2-C: feat(kratos): p2-c harden live data visual states
P3-A: style(kratos): p3-a polish world shell visual hierarchy
Final: docs(kratos): add front wave 1 final report
```
