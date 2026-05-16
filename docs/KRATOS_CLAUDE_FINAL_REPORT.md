# KRATOS CLAUDE.md — Final Constitution Report

**Data:** 2026-05-16
**Ação:** Criação do CLAUDE.md final na raiz do projeto
**Agentes:** kratos-architect + kratos-qa-guard
**Branch:** `main`

---

## 1. Ação Realizada

**CRIADO** `CLAUDE.md` na raiz de `kratos-mission-control`.

- Backup: **não necessário** — não existia CLAUDE.md prévio
- Origem: merge entre pacote auditado (`kratos-claude-pack.zip`) + contexto real do projeto

---

## 2. Estrutura do CLAUDE.md Final

| Seção | Origem |
|---|---|
| Missão do Produto | Pacote (adaptado) + tabela de ação primária (novo) |
| Arquitetura do Projeto | Contexto real — árvore completa com 40+ componentes |
| Regras de Ouro | Pacote (8 regras base) + 4 regras específicas (total 12) |
| Convenções de Código | Pacote + Design System KRATOS real |
| Neuro-UX TDAH | Contexto real — 10 princípios |
| Componentes Protegidos | Contexto real — 7 itens blindados |
| Definition of Done | Pacote (expandido) — 15 checkpoints em 4 categorias |
| Paralelização | Pacote (com trava: max 2, não 5) |
| Deploy | Bloqueado — requer autorização explícita |
| Integrações | Contexto real — Akasha, Omnis, GitHub com boundaries |
| Agentes | Pacote — 5 agentes mapeados |

---

## 3. Principais Regras Adicionadas (além do pacote)

1. **Regra #0**: `routeTree.gen.ts` nunca editar — citada 3x
2. **Build gate**: `bun run build` limpo obrigatório antes de commit
3. **Tokens CSS**: `var(--kr-*)` sempre, hex inline proibido
4. **Botão funcional**: todo CTA tem handler — "nenhum botão decorativo"
5. **Estados obrigatórios**: Loading, Empty, Error, Offline
6. **Neuro-UX**: 7±2 elementos, 1 ação primária, posições fixas, sem popups
7. **Protected components**: 7 itens blindados contra recriação
8. **Boundary Omnis**: KRATOS lê, nunca comanda
9. **Worktrees**: máximo 2, condições explícitas
10. **Lint**: erros pré-existentes em `backend\.venv\` e `docs\kimi\` NÃO são regressão

---

## 4. Riscos Restantes

| Risco | Nível | Nota |
|---|---|---|
| **Lint pré-existente** | 🟡 BAIXO | Erros em `backend\.venv\` e `docs\kimi\` — não relacionados ao frontend. Adicionar ao `.gitignore` ou `.eslintignore` resolve. |
| **Estrutura dual de frontend** | 🟡 BAIXO | `src/` (TanStack Start) + `frontend/` (Vite standalone). CLAUDE.md documenta ambas. Consolidar depois da Fase 0.2. |
| **Worktrees como tentação** | 🟡 BAIXO | CLAUDE.md trava em 2 max, mas o comando está documentado. Disciplina do operador. |
| **Agentes sem frontmatter** | 🟡 BAIXO | Agentes são `.md` soltos sem YAML. Funcionam assim, mas padrão poderia ser consistente. |

---

## 5. Próximo Passo Seguro

**Fase 0.2 — Mapear estado atual das rotas e componentes**

Sem redesign, sem ilhas 3D, sem frescura. Apenas:

- Quais telas existem e renderizam
- Quais são stub ou placeholder
- Quais botões não fazem nada
- Quais dados são mock vs real
- Quais rotas quebram
- Qual ação primária cada tela deve ter
- Build:确认通过

**Inimigo:** "interface bonita que mente" — funcional antes de estético.
