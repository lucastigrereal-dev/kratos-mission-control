# FRONT-KIMI-00 — Auditoria Inicial

Este prompt ajuda o Claude Code a iniciar a auditoria inicial do material do Kimi antes de qualquer implementação.  Ele deve ser executado no repositório KRATOS para mapear o estado atual e organizar os códigos brutos.

## Prompt

```
AUTORIZAÇÃO EXPLÍCITA: EXECUTE UMA MICROFASE

FRONT-KIMI-00 — AUDITORIA INICIAL

Contexto:
  - Este é o repositório do KRATOS Mission Control.
  - Recebemos códigos e especificações do Kimi que estão salvos em docs/kimi/KIMI_CODE_RAW_PART_XX.md.

Objetivo:
  - Mapear o estado atual do frontend.
  - Identificar quais componentes do Kimi já existem no código.
  - Criar/atualizar a pasta docs/kimi com os arquivos brutos se necessário.

Regras:
  - NÃO alterar backend.
  - NÃO alterar endpoints.
  - NÃO instalar dependências.
  - NÃO usar git add .

Tarefas:
  1. Executar `git status --short` para verificar alterações pendentes.
  2. Ler `docs/kimi/KIMI_CODE_RAW_INDEX.md` e anotar os arquivos brutos.
  3. Listar componentes no diretório `src/components` e comparar com os nomes do Kimi.
  4. Atualizar `KIMI_COMPONENT_MAP.md` com a coluna “Status” marcada como "Já existe" ou "Ausente".
  5. Registrar as descobertas em um relatório.

Validação:
  - Nenhum arquivo em `src/components` deve ser alterado nesta fase.
  - Um relatório deve ser salvo em `docs/kimi/KIMI_AUDIT_REPORT.md`.

Veredito final:
  - O que existe e o que falta?
  - Qual microfase deve ser executada em seguida?
```