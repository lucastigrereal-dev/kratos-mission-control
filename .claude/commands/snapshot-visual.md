# /snapshot-visual — Screenshot QA Automatizado

Captura screenshots de todas as rotas principais e gera relatório visual.

## Uso
```
/snapshot-visual
/snapshot-visual <rota-específica>
```

## O que faz

1. Garante que backend está rodando (porta 5100)
2. Garante que frontend está rodando (porta 5173)
3. Roda Playwright para capturar screenshots
4. Salva em `reports/visual/snapshot-<timestamp>/`
5. Compara com referência se disponível
6. Gera relatório de divergências

## Rotas capturadas (padrão)
- `/` — Dashboard / World Map
- `/agora` — Tela do agora
- `/agenda` — Agenda
- `/checkpoints` — Checkpoints
- `/projetos` — Projetos
- `/contexto` — Contexto
- `/sistema` — Sistema

## Verificações por screenshot
- Layout: não é `[240px | 1fr | 320px]` (sidebar quadrada)
- World map visível e ocupando espaço central
- Bottom dock presente
- Top HUD presente
- Aurora orb visível
- Sem scroll horizontal em 1440px
- Dark mode aplicado

## Output
```
SNAPSHOT VISUAL — <timestamp>
Rotas capturadas: <N>
Arquivos: reports/visual/snapshot-<timestamp>/
Divergências:
  /agora: sidebar quadrada detectada → fix: adaptive-hud
  /sistema: sem source badge em 3 componentes
────────
Status: CLEAN / <N> divergências
```

## Restrições
- NÃO altera código
- NÃO faz commit
- Apenas captura e reporta
