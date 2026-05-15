# FRONT-KIMI-06 — Internal Islands

Este prompt engloba várias microfases subsequentes dedicadas às páginas internas das ilhas.  Cada ilha deve ser desenvolvida em uma microfase separada para evitar escopo excessivo.

## Prompt

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-06 — INTERNAL ISLAND PAGE

Contexto:
  - Algumas páginas de ilha já existem como placeholders (`OmnisLabPage`, `AkashaVaultPage`, etc.).
  - O material Kimi fornece sugestões visuais e componentes para cada ilha.

Objetivo:
  - Escolher uma ilha (Omnis, Akasha, Agência, Arena, Forja, Observatório, Vila, Tesouro) para aprimorar.
  - Adicionar cabeçalhos, seções, placeholders e métricas específicas dessa ilha.
  - Integrar primitives (`StatusChip`, `MetricBadge`, `ProgressRing`) conforme apropriado.

Regras:
  - **Uma ilha por microfase**.  Não implementar várias páginas de uma vez.
  - Não criar lógica de execução; por exemplo, Omnis Lab deve exibir status, mas não executar jobs.
  - Não trazer dados externos sem integração backend prévia.
  - Garantir que a navegação até a página ainda funcione (página exportada corretamente em `src/pages`).

Tarefas (exemplo para Omnis Lab):
  1. Abrir `src/pages/OmnisLabPage.tsx` e analisar o placeholder.
  2. Consultar `docs/kimi/KIMI_CODE_RAW_PART_05_INTERNAL_ISLANDS.md` para referências visuais.
  3. Adicionar cards de status (jobs running, skills disponíveis) usando `MetricBadge` e `StatusChip`.
  4. Criar seções para fila de jobs, logs recentes e skills cadastradas.
  5. Certificar‑se de que a página não execute nada e apenas exiba dados mock.

Validação:
  - Build deve passar.
  - A navegação para a página deve funcionar.
  - O layout deve seguir tokens e princípios de UI definidos.

Relatório final:
  - Salvar em `docs/kimi/KIMI_FRONT_KIMI_06_ISLAND_{{ILHA}}_REPORT.md`.
```