# W07 — Persistence W11 Foundation

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE

---

## Objetivo

Implementar Phase A do plano W06: schema D1, migrations SQL,
documentação KV, e preparar o wrangler.jsonc para bindings futuros.

---

## Mudanças

### 1. `wrangler.jsonc` — Documentação de bindings D1 + KV

Adicionado bloco comentado documentando a configuração futura:
- `KRATOS_DB` (D1) — database `kratos-mission-control`
- `KRATOS_KV` (KV) — namespace para ContextSnapshot

Bindings mantidos comentados porque:
- IDs reais precisam ser criados via `wrangler d1 create` ou Cloudflare Dashboard
- Build quebra com IDs vazios (validação do wrangler)
- Ativação requer deploy — fora do escopo atual

### 2. `backend/migrations/0001_initial.sql` — Schema D1 completo

4 tabelas com constraints e índices:
- `projects` — status ENUM, FK para checkpoints
- `checkpoints` — FK → projects, progresso 0-100
- `appointments` — data indexada, tipo ENUM
- `services` — health ENUM

Seed data idempotente (INSERT OR IGNORE):
- 3 projetos, 3 checkpoints, 2 appointments, 4 services

### 3. `backend/migrations/0002_contexto_kv.sql` — Documentação KV

Migration documental para o namespace KV:
- Chave: `contexto:snapshot:latest`
- TTL: 24h
- Schema: ContextSnapshot (api-contract/contexto.schema.ts)

---

## Próximos passos (W11 real)

Quando autorizado:
1. `wrangler d1 create kratos-mission-control` → obter database_id
2. `wrangler kv:namespace create KRATOS_KV` → obter KV id
3. Preencher IDs no wrangler.jsonc e descomentar bindings
4. `wrangler d1 execute KRATOS_DB --local --file=backend/migrations/0001_initial.sql`
5. Implementar stores D1/KV (backend/*/store-d1.ts)
6. Atualizar server-fns para usar novas stores
7. Testar com `wrangler dev --local`

---

## Arquivos criados/modificados

- `wrangler.jsonc` (modificado, +13 linhas comentadas)
- `backend/migrations/0001_initial.sql` (novo, 97 linhas)
- `backend/migrations/0002_contexto_kv.sql` (novo, 12 linhas)
