# W06 — Persistence W11 Plan

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Tipo:** Planejamento (read-only)

---

## Objetivo

Definir estratégia de persistência para substituir os Map<> stores in-memory.
Escolher entre Cloudflare D1, KV, Supabase ou Durable Objects.

---

## Modelos de dados atuais

| Entidade | Campos | Relacionamentos | Complexidade |
|---|---|---|---|
| Checkpoint | 8 campos | projetoId → Project | Média |
| Project | 8 campos | — | Baixa |
| Appointment | 9 campos | — | Baixa |
| ContextSnapshot | Objeto aninhado (BrowserTab[]) | — | Alta (JSON) |
| Service | 4 campos | — | Baixa |

Volume estimado: < 10K registros no total (uso pessoal, single-user).

---

## Opções avaliadas

### Cloudflare D1 (SQLite serverless)
- **Prós:** SQL completo, migrations built-in, mesmo runtime CF Workers, custo zero (free tier generoso)
- **Contras:** Latência ~5-15ms (não é edge-local), sem suporte a JSON nativo complexo
- **Adequação:** Ideal para entidades relacionais (Checkpoint, Project, Appointment)
- **ContextSnapshot:** Armazenar como JSON text column (SQLite suporta json functions)

### Cloudflare KV
- **Prós:** Latência sub-ms, edge-local, key-value simples
- **Contras:** Sem queries relacionais, sem filtros, consistência eventual
- **Adequação:** Bom para ContextSnapshot (1 chave = snapshot atual), ruim para CRUD relacional

### Supabase (PostgreSQL)
- **Prós:** PostgreSQL completo, pgvector já existe no ecossistema Lucas, row-level security
- **Contras:** Latência ~50-200ms (externo), dependência de serviço externo, custo potencial
- **Adequação:** Overkill para single-user < 10K rows

### Cloudflare Durable Objects
- **Prós:** Stateful, single-instance, forte consistência, edge-local
- **Contras:** Complexidade alta, modelo de programação diferente, custo por request
- **Adequação:** Overkill para CRUD simples, útil apenas se precisar de consistência forte transacional

---

## Recomendação: D1 + KV híbrido

| Camada | Tecnologia | Uso |
|---|---|---|
| **Entidades CRUD** | Cloudflare D1 | Checkpoint, Project, Appointment, Service |
| **Snapshot contextual** | Cloudflare KV | ContextSnapshot (último valor, TTL curto) |

### Justificativa:
1. **D1** é nativo do ecossistema Cloudflare Workers (já configurado no wrangler)
2. Custo zero no free tier para o volume do KRATOS
3. SQL completo resolve queries como "checkpoints por projeto", "appointments de hoje"
4. **KV** é ideal para ContextSnapshot — 1 chave, leitura frequente, sem query complexa
5. Sem dependência externa (vs Supabase) — KRATOS roda 100% na Cloudflare
6. Migrations versionadas no repositório

---

## Escopo W11 — Persistence Foundation

### Fase A: Schema D1
- [ ] Adicionar binding D1 no `wrangler.jsonc`
- [ ] Criar `migrations/0001_initial.sql` — tabelas: projects, checkpoints, appointments, services
- [ ] Criar `migrations/0002_contexto_kv.sql` — documentar namespace KV para contexto
- [ ] Script `scripts/migrate.ts` para aplicar migrations local/remote

### Fase B: Store rewrite
- [ ] `backend/projects/store-d1.ts` — rewrite com D1 (drizzle ou raw SQL)
- [ ] `backend/checkpoints/store-d1.ts`
- [ ] `backend/appointments/store-d1.ts`
- [ ] `backend/services/store-d1.ts`
- [ ] `backend/contexto/store-kv.ts` — adaptar para KV

### Fase C: Server-fn bridge
- [ ] Atualizar server-fns em `src/lib/*-server-fns.ts` para apontar para stores D1/KV
- [ ] Manter compatibilidade de tipos — mesma interface de input/output
- [ ] Hooks e UI não precisam de alterações (contrato estável)

### Fase D: Seed data
- [ ] Migrar seed data atual dos Map<> stores para migrations SQL
- [ ] Garantir idempotência (INSERT OR IGNORE)

### Fase E: Tests
- [ ] Testes de integração com D1 local
- [ ] Verificação de build + deploy dry-run (`wrangler deploy --dry-run`)

---

## O que NÃO fazer na W11

- NÃO deployar para produção (requer autorização explícita)
- NÃO alterar hooks ou UI components
- NÃO adicionar ORM pesado (Drizzle é leve, Prisma é overkill)
- NÃO implementar autenticação multi-user (KRATOS é single-tenant)

---

## Riscos

| Risco | Mitigação |
|---|---|
| D1 cold start (> 1s) | Primeira query pode ser lenta; cache no React Query mascara |
| ContextSnapshot > 128KB (limite KV) | Manter apenas último snapshot, TTL 24h |
| Migrations quebram dados existentes | Seed data é idempotente; ambiente dev-only |
