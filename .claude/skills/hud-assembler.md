---
name: hud-assembler
description: "Monta o shell HUD do cockpit KRATOS: top bar, sidebar, right rail, bottom dock. Grid CSS 5 áreas."
metadata:
  type: skill
  tier: core
  project: kratos-mission-control
  scope: frontend
  protected_components:
    - KratosVisualShell.tsx
    - KratosTopHud.tsx
    - KratosSidebar.tsx
    - KratosRightRail.tsx
    - KratosBottomDock.tsx
    - Layout.tsx
---

# hud-assembler

Monta o shell do cockpit KRATOS: grid CSS de 5 áreas com componentes HUD.

## Arquitetura do shell

```
┌──────────────────────────────────────────────────┐
│ TOP HUD (44px) — greeting · brand · status · hora│
├──────────┬───────────────────────┬───────────────┤
│ SIDEBAR  │ MAIN (children)       │ RIGHT RAIL    │
│ 220px    │ 1fr                   │ 260px         │
│ nav · 8  │ páginas React Router  │ Aurora · risks│
│ itens    │                       │ checkpoint    │
├──────────┴───────────────────────┴───────────────┤
│ BOTTOM DOCK (64px) — mission · next action · bar │
└──────────────────────────────────────────────────┘
```

## Componentes (NÃO recriar)

| Componente | Grid Area | Função |
|-----------|-----------|--------|
| `KratosVisualShell.tsx` | Container | Grid CSS `grid-template-areas` + `grid-template-columns: 220px 1fr 260px` + `grid-template-rows: 44px 1fr 64px` |
| `KratosTopHud.tsx` | top-hud | Greeting, brand label, connection dot, SourceBadge, relógio BRT |
| `KratosSidebar.tsx` | sidebar | 8 NavLinks (7 top + 1 bottom OMNIS), collapsed prop |
| `KratosRightRail.tsx` | right-rail | AuroraPanel + riscos + botão checkpoint |
| `KratosBottomDock.tsx` | bottom-dock | MissionBar + squad chips + botão Continuar |
| `Layout.tsx` | Orquestrador | KratosContext, fetches, deriva dados, monta shell |

## Regras
- NUNCA recriar KratosVisualShell — o grid CSS está estável
- NUNCA mexer em Layout.tsx sem passar pela auditoria de dados (ele orquestra useLiveKratos + useApi)
- Para adicionar item de nav: editar arrays `TOP_NAV` ou `BOTTOM_NAV` em KratosSidebar.tsx
- Para adicionar squad: editar `SQUAD_COLORS` e `SQUAD_BG` maps em KratosBottomDock.tsx
- Z-index stack: world=0, hud=100, sidebar=200, rail=200, overlay=400
