# KRATOS Phase 2 — Progress Report

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE (client + SSR)

---

## Objetivo

Avançar a camada de dados do KRATOS corrigindo inconsistências críticas e preparando a infraestrutura para persistência real (D1 + KV).

---

## P0 — Critical Fixes

### P0-1: D1 Migration Fix
- **Arquivo:** `backend/migrations/0001_initial.sql`
- `appointments.completed INTEGER` → `status TEXT CHECK(IN ('pending','in_progress','completed','blocked'))`
- Seed INSERTs atualizados com valores string (`'pending'` no lugar de `0`)
- Migration agora consistente com `api-contract/appointment.schema.ts`

### P0-2: Return Shape Standardization
- **Arquivos:** `src/lib/checkpoint-server-fns.ts`, `project-server-fns.ts`, `appointment-server-fns.ts`
- Todos os 15 handlers (5 por entidade × 3 entidades) agora retornam `{ data: T | null, error: string | null }`
- Try/catch em cada handler com mensagens de erro em português
- CRUD agora consistente com contexto-server-fns e service-server-fns

### P0-3: Hook Envelope Unwrapping
- **Arquivos:** `src/hooks/useCheckpoints.ts`, `useProjects.ts`, `useAppointments.ts`
- queryFn: desempacota `result.data`, lança erro se `result.error`
- mutationFn: desempacota envelope, lança em caso de erro
- Views: ZERO mudanças (backward compat total)
- `useDashboard.ts`: acesso `.data?.data ?? []` agora CORRETO (era bug latente)

---

## P1 — Test Hardening

### P1-1: Test Script
- `package.json`: adicionado `"test": "bun test"`

### P1-2: TSConfig
- `tsconfig.json`: adicionado `"tests/**/*.ts"` ao array `include`

### P1-3: Novos Testes
- `tests/stores/project-store.test.ts` — 14 testes (10 CRUD + 4 data integrity)
- `tests/stores/appointment-store.test.ts` — 13 testes (9 CRUD + 4 data integrity)
- Padrão: inline types + `createStore()` factory isolada, igual checkpoint-store

---

## P2 — Storage Abstraction

### P2-1: Shared Types
- **Arquivo:** `backend/lib/types.ts`
- `ApiEnvelope<T>` — envelope padronizado
- `success<T>(data)` / `failure(error)` — factories
- `Repository<T, C, U>` — interface de storage (getAll, getById, create, update, remove)

### P2-2: Map Adapter
- **Arquivo:** `backend/lib/store-adapter.ts`
- `createMapRepository(seedItems, buildEntity)` — factory que encapsula Map com interface Repository
- Infra paralela — stores existentes não alterados
- Futuro: D1 adapter implementa mesma interface, swap transparente

---

## P3 — Documentation

### P3-1: CLAUDE.md
- Nova seção "Testes" com convenções, padrões e regras

### P3-2: Este Relatório
- Documenta todas as mudanças da Phase 2

---

## Quality Dashboard

| Métrica | Antes | Depois |
|---|---|---|
| Build | VERDE | VERDE |
| Testes passando | 14 | **41** |
| Schemas Zod | 5 | 5 |
| Server functions com envelope | 2/6 | **6/6** |
| D1 migration consistente | NÃO | **SIM** |
| Hook envelope bug (useDashboard) | Bug latente | **Corrigido** |
| `package.json` test script | Ausente | **`bun test`** |
| tsconfig tests/ | Não incluso | **Incluso** |

---

## Files Changed

| Action | Count | Files |
|---|---|---|
| Modified | 9 | `0001_initial.sql`, 3 server-fns, 3 hooks, `package.json`, `tsconfig.json`, `CLAUDE.md` |
| Created | 5 | 2 test files, `types.ts`, `store-adapter.ts`, este relatório |
| **Total** | **14** | |

---

## Next Steps (Phase 3)

1. **D1/KV Activation**: Preencher IDs reais no `wrangler.jsonc`, instalar `@libsql/client` para dev local
2. **D1 Adapter**: Implementar `Repository<T,C,U>` para D1 com snake_case↔camelCase mapping
3. **Store Migration**: Refatorar stores existentes para usar `createMapRepository()`
4. **GitHub Integration**: API de status de repositórios
5. **OMNIS Webhook**: Bridge readonly KRATOS→OMNIS
