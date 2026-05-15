# FRONT-KIMI-02 — UI Primitives Seguras

Este prompt orienta a implementação de componentes pequenos (primitives) que ainda não existem no KRATOS.  Esses componentes são seguros para uso e reutilização.

## Prompt

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-02 — UI PRIMITIVES SEGURAS

Contexto:
  - A auditoria identificou que `EmptyState`, `ErrorState`, `ProgressRing` e `MetricBadge` não existem no repositório.
  - O material Kimi oferece código de referência para esses componentes em `docs/kimi/KIMI_CODE_RAW_PART_02_UI_PRIMITIVES.md`.

Objetivo:
  - Criar arquivos TSX para estes quatro componentes em `src/components/ui/` (ou caminho equivalente), adaptando o código do Kimi.
  - Manter compatibilidade com utilitários existentes (ex.: `cn`, `lucide-react`).

Regras:
  - NÃO duplicar componentes existentes; confirmar que não há `EmptyState.tsx` etc.
  - NÃO alterar hooks (`useLiveKratos`, `useCheckpointSuggestion`).
  - NÃO tocar em backend ou database.

Tarefas:
  1. Copiar código do Kimi para cada componente e salvar como `EmptyState.tsx`, `ErrorState.tsx`, `ProgressRing.tsx` e `MetricBadge.tsx`.
  2. Ajustar imports (`cn`, `lucide-react`) conforme o projeto.
  3. Adicionar documentação JSDoc simples no topo do arquivo.
  4. Exportar os componentes conforme padrão do projeto.
  5. Atualizar o mapa de componentes em `KIMI_COMPONENT_MAP.md` marcando cada um como “USADO”.

Validação:
  - Rodar `npm run build` para garantir compilação.
  - Rodar testes backend (`python -m pytest -q`) para garantir que nada quebrou.

Relatório final:
  - Salvar em `docs/kimi/KIMI_FRONT_KIMI_02_PRIMITIVES_REPORT.md`.
  - Listar arquivos criados, snippets adaptados e quaisquer considerações.
```