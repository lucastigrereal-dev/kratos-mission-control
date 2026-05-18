# KRATOS Agent Manifest

**Status:** Canonical | **Version:** 2.0 | **Date:** 2026-05-18

---

## Active Agents

| Agent | Tier | Scope | Trigger |
|-------|------|-------|---------|
| `kratos-architect` | core | Arquitetura de frentes de desenvolvimento | Antes de iniciar qualquer feature multi-arquivo |
| `kratos-api-builder` | core | Endpoints Hono + contratos api-contract | Criar/alterar rotas de API |
| `kratos-data-layer` | core | Schemas Zod, hooks, mock data, stores | Definir contratos de dados |
| `kratos-ui-builder` | core | Componentes de rota e views | Construir UI de páginas |
| `kratos-qa-guard` | core | Revisão de qualidade pré-commit | Antes de qualquer commit |

---

## Agent Specifications

### kratos-architect
- **Arquivo:** `.claude/agents/kratos-architect.md`
- **Entrada:** Descrição da feature ou problema
- **Saída:** Plano de arquitetura com files tocados, dependências, ordem de implementação
- **Regra:** Nunca escreve código. Apenas planeja.

### kratos-api-builder
- **Arquivo:** `.claude/agents/kratos-api-builder.md`
- **Entrada:** Spec de endpoint (método, path, input schema, output schema)
- **Saída:** Endpoint implementado em `src/server.ts` ou server-fns, schema em `api-contract/`
- **Regra:** Todo endpoint tem `.inputValidator()` do Zod. Nunca `process.env`.

### kratos-data-layer
- **Arquivo:** `.claude/agents/kratos-data-layer.md`
- **Entrada:** Domínio de dados (ex: "checkpoints", "projetos")
- **Saída:** Schemas Zod, stores, hooks `useApi<T>()`, mock data
- **Regra:** api-contract/ é a fonte da verdade. Schemas antes de implementação.

### kratos-ui-builder
- **Arquivo:** `.claude/agents/kratos-ui-builder.md`
- **Entrada:** Spec de rota ou componente visual
- **Saída:** Componentes em `src/components/kratos/<dominio>/`, rota conectada
- **Regra:** Nunca editar `src/routeTree.gen.ts`. Tokens CSS sempre. Estados Loading/Empty/Error obrigatórios.

### kratos-qa-guard
- **Arquivo:** `.claude/agents/kratos-qa-guard.md`
- **Entrada:** Diff ou descrição das mudanças
- **Saída:** PASS/BLOCK/FLAG com issues priorizados
- **Regra:** Só reporta issues de alta confiança. Zero falsos positivos.

---

## Agent Invocation Rules

1. **Ordem canônica para novas features:**
   `kratos-architect` → `kratos-data-layer` → `kratos-api-builder` → `kratos-ui-builder` → `kratos-qa-guard`

2. **Nunca invocar 2 agentes que tocam o mesmo arquivo simultaneamente**
3. **Agentes NUNCA fazem commit** — apenas preparam e reportam
4. **Agentes NUNCA executam deploy, push, ou ações destrutivas**

---

## Quarantine Log

Agentes que foram removidos ou desativados:

| Agente | Data | Motivo |
|--------|------|--------|
| (none) | — | — |

---

*Manifesto canônico. Atualizado quando agentes são adicionados, removidos ou modificados.*
