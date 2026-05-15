# FRONT-KIMI-04 — HUD Assembly Polish

Este prompt orienta o ajuste fino da HUD (barra superior, lateral e dock inferior) com base nas especificações do Kimi.

## Prompt

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-04 — HUD ASSEMBLY POLISH

Contexto:
  - O KRATOS já possui `KratosTopBar`, `KratosSidebar`, `KratosRightRail` e `KratosBottomDock`.
  - O material Kimi sugere melhoria de tons, vidros, bordas e widgets.

Objetivo:
  - Ajustar os componentes HUD para usar tokens de glass, borda e sombra.
  - Adicionar indicadores de energia, nível e XP se estiverem ausentes.
  - Reformular a Sidebar para destacar a ilha ativa e usar a paleta correta.
  - Revisar o RightRail para garantir scroll interno e espaço para o painel da Aurora.
  - Atualizar o dock inferior (`MissionBar` ou `KratosBottomDock`) para conter missão, próxima ação e botão continuar.

Regras:
  - NÃO criar novos componentes; adaptar os existentes.
  - NÃO mover lógica de missão para o HUD (isso pertence ao useLiveKratos/Mission Lens).
  - NÃO instalar dependências novas.

Tarefas:
  1. Revisar `docs/kimi/KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md`.
  2. Localizar os componentes HUD no projeto (`src/components/kratos/hud` ou equivalente).
  3. Aplicar tokens de cor e glass (bg-kratos-hud-glass, border-kratos-hud-border, shadow-kratos-hud) nas barras e docks.
  4. Adicionar métricas de energia/nivel/XP utilizando `MetricBadge` se apropriado.
  5. Ajustar Sidebar para possuir borda colorida na ilha ativa e melhor tipografia.
  6. Garantir que o RightRail tenha `overflow-y-auto` e suporte widgets futuros.
  7. Validar que `SourceBadge` continua funcionando nos locais onde aparece.

Validação:
  - Build sem erros.
  - HUD deve se comportar como cockpit (sem colapsar, sem overlays quebrados).
  - Sidebar deve destacar a navegação corretamente.

Relatório final:
  - Salvar em `docs/kimi/KIMI_FRONT_KIMI_04_HUD_REPORT.md`.
```