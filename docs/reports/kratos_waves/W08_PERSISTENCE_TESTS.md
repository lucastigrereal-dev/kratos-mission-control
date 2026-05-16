# W08 — Persistence Tests

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE (sem alterações de build)

---

## Objetivo

Criar testes unitários para a lógica de store que será portada para D1.
Validar CRUD e integridade de dados no modelo Checkpoint (representativo).

---

## Resultados

```
tests/stores/checkpoint-store.test.ts:
  Checkpoint Store — CRUD:
    PASS  starts empty
    PASS  creates a checkpoint with correct defaults
    PASS  creates a checkpoint with optional fields
    PASS  retrieves by id
    PASS  returns undefined for missing id
    PASS  lists all sorted by atualizadoEm desc
    PASS  updates fields
    PASS  returns undefined when updating nonexistent
    PASS  deletes a checkpoint
    PASS  returns false when deleting nonexistent

  Checkpoint Store — Data integrity:
    PASS  generates unique IDs for each checkpoint
    PASS  new checkpoints always start as pending with 0 progress
    PASS  can transition through valid statuses
    PASS  preserves id and criadoEm on update

14/14 PASS — 0 fail
```

---

## Testes criados

`tests/stores/checkpoint-store.test.ts` — 14 testes, 2 describes:

### CRUD (10 testes)
- Store vazia no início
- Criação com defaults corretos (status=pending, progresso=0)
- Criação com campos opcionais (descricao, projetoId, deadline)
- Leitura por ID (hit e miss)
- Listagem ordenada por atualizadoEm DESC
- Update de campos + preservação de id/criadoEm
- Update em ID inexistente → undefined
- Delete (hit e miss)

### Data integrity (4 testes)
- 100 checkpoints → 100 IDs únicos
- Todo checkpoint novo é pending + progresso 0
- Transições de status válidas (pending → in_progress → blocked → completed)
- id e criadoEm imutáveis em updates

---

## Notas

- Testes implementam store em isolation (sem side-effects de seed data)
- Bun-native: zero dependências de jsdom ou React
- Mesmo contrato de tipos que o store real (api-contract/checkpoint.schema.ts)
- Quando D1 for implementado, mesmos testes servem como contrato de regressão

---

## Arquivos criados

- `tests/stores/checkpoint-store.test.ts` (novo, 192 linhas)
