# KRATOS CCOS INSTALL REPORT

**Data:** 2026-05-16
**Operação:** Instalação seletiva do pacote `kratos-claude-pack.zip` auditado
**Agentes atuantes:** kratos-qa-guard + kratos-architect
**Branch:** `main`

---

## 1. Arquivos Copiados (9 arquivos)

### 1.1 Agentes — `.claude/agents/` (5 arquivos) ✅

| Arquivo | Tamanho | Propósito |
|---|---|---|
| `kratos-architect.md` | 529 B | Planejamento e arquitetura |
| `kratos-ui-builder.md` | 731 B | Construção de UI (Tailwind v4, shadcn) |
| `kratos-api-builder.md` | 609 B | Endpoints Hono em `src/server.ts` |
| `kratos-data-layer.md` | 549 B | Schemas Zod, tipos, hooks, mocks |
| `kratos-qa-guard.md` | 604 B | Revisor de qualidade pré-merge |

**Status:** Pasta `.claude/agents/` não existia. Criada sem conflitos.
**Segurança:** ✅ Todos os agentes incluem guardrails: "NUNCA fazer deploy", "NUNCA fazer push", "NUNCA ler .env".

### 1.2 Skill — `.claude/skills/api-contract-sync.md` (1 arquivo) ✅

| Arquivo | Tamanho | Propósito |
|---|---|---|
| `api-contract-sync.md` | 1.181 B | Sincronizar schemas Zod server↔cliente |

**Status:** Skill renomeada de `api-contract-sync/SKILL.md` (subpasta) para `api-contract-sync.md` (flat) para manter consistência com a estrutura atual de skills.
**Segurança:** ✅ Nome não conflita com nenhuma das 10 skills existentes.

### 1.3 Documentos de Referência — `docs/` (3 arquivos) ✅

| Arquivo | Tamanho | Propósito |
|---|---|---|
| `KRATOS-ROADMAP.md` | 2.637 B | Roadmap de fases do produto |
| `PLAYBOOK-5-FRENTES.md` | 3.749 B | Playbook de paralelização (5 worktrees) |
| `TERMINAL-COMMANDS.md` | 2.254 B | Referência de comandos do terminal |

**Status:** Nenhum conflito com docs existentes (verificação confirmada).
**Segurança:** ✅ Documentos de referência, não executáveis.

---

## 2. Arquivos NÃO Copiados

| Arquivo | Motivo |
|---|---|
| `CLAUDE.md` | **BLOQUEADO.** Não pode ser copiado cego — falta contexto real do projeto (ilhas 3D, tokens, neuro-UX). Merge plan criado em `docs/KRATOS_CLAUDE_MERGE_PLAN.md`. |
| `.claude/skills/bug-triage/SKILL.md` | Não copiado. Skill útil mas a estrutura de subpasta conflita com a estrutura flat atual. Pode ser adicionado depois como `bug-triage.md`. |
| `.claude/skills/component-scaffolder/SKILL.md` | Não copiado. Template CVA genérico. Projeto real tem componentes muito mais complexos (40+ componentes com glass panels, tokens). |
| `.claude/skills/refactor-guardian/SKILL.md` | Não copiado. Lista de arquivos críticos do pacote não inclui os protected components reais (KratosVisualShell, KratosWorldMap, Layout.tsx). |
| `.claude/skills/repo-architect/SKILL.md` | Não copiado. Stack documentada é genérica — falta contexto das 10 skills existentes e da estrutura dual de frontend. |
| `.claude/skills/route-builder/SKILL.md` | Não copiado. Template simples de `createFileRoute` não reflete a complexidade real das rotas (que usam views ricas com 6-8 componentes cada). |
| `.claude/skills/ship-checklist/SKILL.md` | Não copiado. Checklist útil mas falta verificações específicas (tokens, glass panels, prefers-reduced-motion, SourceBadge). |

**Total não copiado:** 1 CLAUDE.md + 6 skills (7 arquivos)

---

## 3. Totalização

| Categoria | Copiado | Não Copiado | Total no Pacote |
|---|---|---|---|
| CLAUDE.md | 0 | 1 | 1 |
| Agentes | 5 | 0 | 5 |
| Skills | 1 | 6 | 7 |
| Docs raiz | 3 | 0 | 3 |
| **Total** | **9** | **7** | **16** |

---

## 4. Estrutura Final do `.claude/`

```
.claude/
├── agents/                        ← NOVO (instalado)
│   ├── kratos-api-builder.md
│   ├── kratos-architect.md
│   ├── kratos-data-layer.md
│   ├── kratos-qa-guard.md
│   └── kratos-ui-builder.md
└── skills/                        ← Expandido (10 originais + 1 nova)
    ├── akasha-vault-builder.md    (original)
    ├── api-contract-sync.md       ← NOVO (instalado)
    ├── glass-panel-builder.md     (original)
    ├── hud-assembler.md           (original)
    ├── island-composer.md         (original)
    ├── kimi-to-code.md            (original)
    ├── motion-guardian.md         (original)
    ├── neuro-ux-checker.md        (original)
    ├── omnis-lab-builder.md       (original)
    ├── token-enforcer.md          (original)
    └── visual-qa-kimi.md          (original)
```

---

## 5. Riscos Restantes

| Risco | Nível | Mitigação |
|---|---|---|
| **Agentes desconhecem protected components** | ⚠️ MÉDIO | Os 5 agentes não listam `KratosVisualShell.tsx`, `KratosWorldMap.tsx`, `Layout.tsx` como protegidos. Se um agente UI builder for acionado, pode tentar recriar o shell. Mitigação: sempre incluir "NÃO recriar componentes protegidos" no prompt. |
| **Agentes desconhecem tokens KRATOS** | ⚠️ MÉDIO | Agentes não sabem que cores devem usar `var(--kr-*)`. Mitigação: adicionar "usar tokens CSS do projeto" no prompt de cada agente. |
| **PLAYBOOK-5-FRENTES.md propõe 5 worktrees** | ⚠️ MÉDIO | O playbook documenta 5 worktrees simultâneos. Regra atual: não abrir 5 worktrees ainda. Mitigação: o playbook condiciona a "só após auditoria", mas o texto existe. |
| **api-contract-sync não tem frontmatter YAML** | 🟡 BAIXO | As 10 skills originais têm frontmatter YAML com metadata (name, tier, project, scope). A skill nova não tem. Mitigação: adicionar frontmatter depois. |
| **Estrutura dual de frontend não documentada** | 🟡 BAIXO | Nenhum arquivo instalado menciona que o projeto tem `src/` (TanStack Start) + `frontend/` (Vite standalone). |

---

## 6. Próximos Passos Seguros (em ordem)

### Imediato ✅
1. ~~Copiar agentes~~ → FEITO
2. ~~Copiar api-contract-sync~~ → FEITO
3. ~~Copiar docs de referência~~ → FEITO
4. ~~Rodar `bun run lint`~~ → FEITO (erros pré-existentes, zero nos arquivos instalados)
5. ~~Rodar `bun run build`~~ → FEITO (PASSOU limpo: client + SSR)

### Curto prazo (requer aprovação)
6. Aprovar `docs/KRATOS_CLAUDE_MERGE_PLAN.md`
7. Escrever `CLAUDE.md` final com merge do pacote + contexto real
8. Adicionar frontmatter YAML em `api-contract-sync.md`

### Médio prazo (requer lint/build limpos)
9. Avaliar skills restantes do pacote (bug-triage, component-scaffolder, etc.) para adoção adaptada
10. Atualizar agentes com lista de protected components do projeto real

### Bloqueado (NÃO fazer agora)
11. ❌ Abrir worktrees
12. ❌ Executar Frente 5 (deploy)
13. ❌ Merge de branches
14. ❌ Push
15. ❌ Implementar features novas

---

## 7. Verificação de Regras (pós-instalação)

| Regra | Status |
|---|---|
| Não sobrescrever CLAUDE.md | ✅ Nenhum CLAUDE.md foi tocado |
| Não substituir `.claude/` inteiro | ✅ Apenas adições, zero remoções |
| Não abrir worktrees | ✅ Zero worktrees criados |
| Não implementar produto | ✅ Zero código de produto alterado |
| Não editar `src/routeTree.gen.ts` | ✅ Arquivo intocado |
| Não rodar deploy | ✅ Nenhum deploy executado |
| Não fazer merge | ✅ Nenhum merge |
| Não fazer push | ✅ Nenhum push |
| Não ler `.env`/secrets/keys | ✅ Nenhum arquivo sensível lido |
| Não instalar dependências novas | ✅ Nenhum pacote novo adicionado ao `package.json` |
| Não mexer em `src/` | ✅ Nenhum arquivo em `src/` foi alterado |

---

## 8. Resultados Lint & Build (pós-instalação)

### Lint
```
bun run lint → 19333+ errors
```
**Todos os erros são pré-existentes e fora do escopo da instalação:**
- `backend\.venv\Lib\site-packages\...` — Python virtual env (deveria estar no .gitignore)
- `docs\kimi\02_execution\original_roadmap\ISLAND_CONFIG.ts` — arquivo antigo de referência Kimi (CRLF, aspas simples)

**Zero erros nos 9 arquivos instalados.**

### Build
```
bun run build → PASSOU
```
- Client: 16 módulos, 80.90 kB CSS, 371.06 kB JS principal → **2.01s**
- Server (SSR): 23 módulos, 718.27 kB server bundle → **1.86s**
