# FRONT-KIMI-01 — Tokens e Consistência de Glass

Use este prompt para limpar e consolidar tokens de cor, glass e sombra no projeto.  Não implemente componentes novos nesta fase; apenas remova hex inlines e aplique os tokens definidos.

## Prompt

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-01 — TOKENS E GLASS CONSISTENCY

Contexto:
  - O projeto KRATOS já possui tokens base em `src/styles/kratos-tokens.css`.
  - O Kimi definiu tokens adicionais em docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md.

Objetivo:
  - Remover cores e sombras hardcoded no frontend.
  - Atualizar ou adicionar tokens no arquivo de estilos global.
  - Ajustar classes de components para usar tokens, especialmente para glass, bordas e sombras.

Regras:
  - NÃO criar componentes novos.
  - NÃO alterar backend.
  - NÃO instalar dependências.
  - NÃO alterar useLiveKratos ou SSE.
  - Usar somente tokens definidos ou adicionar novos em `src/styles/kratos-tokens.css`.

Tarefas:
  1. Abrir `docs/kimi/KIMI_CODE_RAW_PART_01_TOKENS.md` e copiar tokens de cor, sombras e glass.
  2. Mergir tokens no arquivo `src/styles/kratos-tokens.css`, respeitando o formato existente.
  3. Procurar por hex code hardcoded em `src/components` com `grep -R "#[A-Fa-f0-9]{3,6}"`.
  4. Substituir as ocorrências por classes utilitárias ou variáveis CSS definidas nos tokens.
  5. Ajustar `SourceBadge` e `KratosBottomDock` para usar tokens de opacidade (por exemplo, `color-mix(...)` em vez de `${color}1a`).

Validação:
  - Executar `npm run build` para garantir que não haja erros.
  - Executar `python -m pytest -q` no backend para confirmar que nada quebrou.
  - Listar mudanças no relatório de microfase.

Relatório final:
  - Salvar em `docs/kimi/KIMI_FRONT_KIMI_01_TOKENS_REPORT.md`.
  - Descrever tokens adicionados, arquivos alterados e risco residual.
```