# KRATOS — AI Agent Instructions

**Project:** KRATOS Mission Control
**Role:** Cockpit de observabilidade operacional local-first
**Owner:** Lucas Tigre (@lucastigrereal-dev)

---

## 1. Primeira Leitura Obrigatória

Antes de qualquer ação, leia nesta ordem:

1. `CLAUDE.md` — regras de ouro, arquitetura, convenções
2. `AGENTS.md` — este arquivo
3. `docs/project-os/governance-constitution.md` — a constituição do projeto
4. `docs/project-os/boundary-map.md` — o que cada sistema faz

---

## 2. O Que o KRATOS É (e Não É)

```
KRATOS vê.           → observabilidade, composição de estado, exibição
Aurora interpreta.    → voz mentor, análise de padrões, sugestões
OMNIS/HOMINIS age.    → execução de skills, crews, deploys, publicações
Akasha lembra.        → memória vetorial, documentos, insights históricos
Codex/Claude constrói.→ geração de código, relatórios, análise profunda
Lucas decide.         → juízo final, aprovação, direção estratégica
```

**KRATOS nunca cruza a linha de observar para executar.**

---

## 3. Agentes Disponíveis

| Agente | Chamar quando |
|--------|---------------|
| `kratos-architect` | Planejar arquitetura antes de iniciar qualquer frente |
| `kratos-ui-builder` | Construir UI de rotas — nunca editar routeTree.gen.ts |
| `kratos-api-builder` | Criar endpoints Hono — sempre validar com api-contract/ |
| `kratos-data-layer` | Definir schemas Zod, hooks, mock data |
| `kratos-qa-guard` | Revisar qualidade antes de commit/merge |

**Regra:** Todo agente segue as Regras de Ouro de `CLAUDE.md`.

---

## 4. Comandos Operacionais

| Comando | Ação |
|---------|------|
| `/audit` | Build + test + lint completo |
| `/preflight` | Checklist pré-commit |
| `/ship` | Verificação de release readiness |
| `/status` | Estado atual do projeto |

---

## 5. Regras de Segurança (NUNCA VIOLAR)

1. **Nunca deploy** sem autorização explícita do Lucas
2. **Nunca push** sem autorização explícita
3. **Nunca ler `.env`** ou expor secrets
4. **Nunca executar OMNIS** (sistema separado)
5. **Nunca `git add .`** — sempre staging seletivo
6. **Nunca editar `src/routeTree.gen.ts`** — é auto-gerado
7. **Nunca alterar componentes protegidos** sem autorização:
   - AppShell, Topbar, Sidebar, StatusBar, AuroraPanel
   - Design tokens em `src/styles.css`
   - Route tree em `src/routeTree.gen.ts`

---

## 6. Gates Obrigatórios Antes de Commit

- [ ] `bun run build` — zero erros (client + SSR)
- [ ] `bun run test` — todos passam
- [ ] Zero `any` no código novo
- [ ] Nenhum `style={{ color: "#..." }}` — usar tokens
- [ ] Dark mode + mobile 375px verificados
- [ ] `prefers-reduced-motion` testado
- [ ] Loading, Empty, Error states implementados

---

## 7. Estrutura de Diretórios Relevante

```
src/routes/           ← Páginas (file-based routing)
src/components/kratos/← Componentes de domínio (~40)
src/components/ui/    ← shadcn/ui (47 componentes)
src/hooks/            ← Custom hooks (useApi, useLiveKratos, ...)
src/lib/              ← Utilitários, helpers, types
api-contract/         ← Contratos de API (schemas Zod) — FONTE DA VERDADE
backend/              ← Lógica server-side
mock-data/            ← Dados de desenvolvimento
tests/                ← Testes (stores, contracts, e2e)
docs/project-os/      ← Governança do projeto
.claude/agents/       ← Definições de agentes
.claude/commands/     ← Comandos operacionais
.claude/state/        ← Estado do projeto (JSON)
.claude/hooks/        ← Hooks de segurança
```

---

## 8. Tom e Estilo

- Código: zero comentários desnecessários. Um comentário curto só quando o PORQUÊ não é óbvio.
- Respostas: curtas, diretas, operacionais.
- Foco: "O que gera progresso real agora?"
- TDAH-first: máximo 7±2 elementos de decisão por tela.
- Feito > Perfeito.

---

*Documento canônico. Sincronizado com CLAUDE.md e docs/project-os/governance-constitution.md.*
