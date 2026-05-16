# KRATOS — Playbook das 5 Frentes Paralelas

⚠️ LEIA ANTES DE EXECUTAR QUALQUER COISA:
1. Audite o pacote primeiro (docs/KRATOS_PACK_AUDIT_REPORT.md)
2. Instale seletivamente — nunca sobrescreva .claude às cegas
3. Valide lint/build antes de abrir frentes paralelas
4. Abra frentes NA ORDEM: data-layer → ui/agora → api → auth → deploy
5. Deploy NUNCA sem autorização explícita

---

## Estrutura de Worktrees (só após auditoria)

```bash
git worktree add ../kratos-ui      -b feat/ui-pages
git worktree add ../kratos-api     -b feat/api-routes
git worktree add ../kratos-data    -b feat/data-layer
git worktree add ../kratos-auth    -b feat/auth
git worktree add ../kratos-deploy  -b feat/deploy-config
git worktree list
```

---

## Frente 1 — UI das Telas (kratos-ui)

**Dono de arquivos:** `src/routes/`, `src/components/`
**NÃO TOCAR:** `src/server.ts`, `api-contract/`, `src/routeTree.gen.ts`

**Prompt de início:**
```
Você está desenvolvendo o Kratos Mission Control.
Stack: React 19, TanStack Router file-based, TanStack Query, Tailwind v4, Radix UI, shadcn/ui, lucide-react.
Leia o CLAUDE.md na raiz para convenções.
Sua missão: implementar a UI real da rota /agora (src/routes/agora.tsx).
Use mock-data/ para os dados por enquanto.
A UI deve ter UMA ação primária clara, dark mode funcional, mobile 375px.
Referência: Linear + Vercel Dashboard.
NÃO edite routeTree.gen.ts. NÃO faça deploy. NÃO faça push.
```

---

## Frente 2 — API Routes (kratos-api)

**Dono de arquivos:** `src/server.ts`, `backend/`
**NÃO TOCAR:** `src/routes/`, `src/components/`

**Prompt de início:**
```
Você está desenvolvendo o backend do Kratos Mission Control.
Stack: Hono rodando em Cloudflare Worker (src/server.ts).
Leia o CLAUDE.md para convenções e api-contract/ para schemas.
Sua missão: criar endpoints CRUD para Checkpoint em src/server.ts.
Validar entrada com Zod. Resposta padrão: { data, error }.
Dados em memória por agora.
NÃO faça deploy. NÃO faça push. NÃO leia .env.
```

---

## Frente 3 — Camada de Dados (kratos-data)

**Dono de arquivos:** `api-contract/`, `src/lib/`, `src/hooks/`, `mock-data/`
**NÃO TOCAR:** `src/routes/`, `src/server.ts`

**Prompt de início:**
```
Você está definindo a camada de dados do Kratos Mission Control.
Stack: Zod para schemas, TanStack Query para estado servidor.
Leia CLAUDE.md para convenções.
Sua missão: criar schema Zod para Checkpoint em api-contract/checkpoint.schema.ts
e o hook useCheckpoints em src/hooks/useCheckpoints.ts.
NÃO faça deploy. NÃO faça push. NÃO leia .env.
```

---

## Frente 4 — Auth (kratos-auth)

**Prompt de início:**
```
Você está implementando autenticação no Kratos Mission Control.
Kratos é uso pessoal — autenticação simples por senha + cookie HTTPOnly.
Leia CLAUDE.md para convenções.
Crie: src/routes/login.tsx, src/lib/auth.ts, backend/auth/handler.ts.
NÃO faça deploy. NÃO faça push. NÃO leia .env ou secrets.
```

---

## Frente 5 — Deploy Config (kratos-deploy)

⚠️ ESTA FRENTE SÓ ABRE COM AUTORIZAÇÃO EXPLÍCITA DO LUCAS.
NÃO rodar `wrangler deploy` sem confirmação.

**Prompt de início:**
```
Você está configurando o pipeline de deploy do Kratos.
Stack: Cloudflare Workers via Wrangler, Vite 7, Bun.
Leia CLAUDE.md e wrangler.jsonc para contexto.
Sua missão: revisar wrangler.jsonc e criar script de deploy em package.json.
NÃO execute deploy. NÃO leia .env ou secrets. NÃO faça push.
Apenas prepare e documente — execução requer aprovação do Lucas.
```

---

## Merge Order (só após lint/build limpos)

```
feat/data-layer → feat/api-routes → feat/ui-pages → feat/auth → main
feat/deploy-config: merge independente, com autorização
```
