# FRONT-KIMI-05 — Aurora Panel Polish

Este prompt guia a microfase de aprimoramento do painel da Aurora, incluindo orb holográfico, cartões de sinal e sugestões de checkpoint.

## Prompt

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-05 — AURORA PANEL POLISH

Contexto:
  - O painel da Aurora já existe, mas está simples.
  - O Kimi especifica orb holográfico, cards de sinal e checkpoint suggestions.

Objetivo:
  - Introduzir o `AuroraOrb` para dar personalidade visual ao assistente.
  - Adicionar `AuroraSignalCard` para exibir riscos e recomendações.
  - Incorporar `CheckpointSuggestionVisual` que recebe sugestões via hook.

Regras:
  - NÃO criar chat ou automações no painel; apenas UI.
  - NÃO alterar lógica de `useCheckpointSuggestion` — apenas consumir a sugestão.
  - NÃO alterar endpoints ou backend.

Tarefas:
  1. Revisar `docs/kimi/KIMI_CODE_RAW_PART_04_HUD_AURORA_DOCK.md`.
  2. Criar ou adaptar `AuroraPanel.tsx` para incluir orb, cards e sugestões.
  3. Criar `AuroraOrb.tsx`, `AuroraSignalCard.tsx` e `CheckpointSuggestionVisual.tsx` se não existirem.
  4. Adicionar placeholders de dados e exibir mensagens contextuais.
  5. Certificar‑se de que o painel seja rolável se a lista de cards crescer.

Validação:
  - `npm run build` deve compilar.
  - Nenhuma exportação ou importação quebrada.
  - O painel renderiza orb, cards e sugestão sem erros no console.

Relatório final:
  - Salvar em `docs/kimi/KIMI_FRONT_KIMI_05_AURORA_REPORT.md`.
```