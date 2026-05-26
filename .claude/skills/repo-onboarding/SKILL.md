---
id: repo-onboarding
name: Repo Onboarding
description: Restaura contexto operacional completo do KRATOS em sessões novas — elimina releitura redundante e garante que toda sessão começa com estado real.
tags: [onboarding, context, session, productivity]
version: 1.1
context: kratos-mission-control
tree: src/
priority: P0
anthropic_principle: minimal-footprint — lê antes de agir, confirma escopo antes de executar
---

# SKILL: Repo Onboarding

## Propósito
Restaurar contexto em < 90 segundos. Qualquer sessão nova começa aqui.

## Quando Usar
- Início de sessão no KRATOS
- Após troca de branch ou worktree
- Quando contexto parecer defasado
- Antes de qualquer task de médio/grande porte

## Quando NÃO Usar
- Sessão ativa com contexto fresco (< 20 min)
- Fix de 1-2 linhas óbvio

## Inputs
- Objetivo da sessão (obrigatório)
- Branch atual (inferido via git se omitido)

## Processo

### Passo 1 — Estado do repo (paralelo)
```bash
git status --short --branch          # estado do working tree
git log --oneline -5                 # commits recentes
bun run build 2>&1 | tail -3        # saúde do build
```

### Passo 2 — Contexto do projeto
```bash
cat CLAUDE.md | head -80             # regras + arquitetura
ls src/routes/                       # rotas ativas
ls src/components/kratos/            # domínios existentes
cat .claude/state/*.md 2>/dev/null   # estado de sessão anterior
```

### Passo 3 — Riscos ativos
Verificar sempre:
- Working tree suja? → listar arquivos modificados
- Dois frontends? → SEMPRE `src/`, NUNCA `frontend/` sem autorização
- project-state.json desatualizado? → não confiar em cache de estado
- Tokens duplicados? → `--kr-*` é o padrão, ignorar `--kratos-*` legado

### Passo 4 — Briefing
```
KRATOS SESSION BRIEF
Branch:       <branch>
Build:        PASS / FAIL
Working tree: CLEAN / DIRTY (<N> arquivos)
Objetivo:     <objetivo confirmado>
Escopo:       <arquivos no escopo>
Riscos:       <riscos identificados>
Próxima ação: <ação concreta>
```

## Critérios de Qualidade (Anthropic: verificação antes de ação)
- Build status conhecido antes de começar qualquer mudança
- Escopo confirmado — sem "vou ver o que encontro"
- Componentes protegidos identificados e fora do escopo
- Objetivo da sessão em uma linha, não em parágrafo

## Anti-patterns
- Assumir que estado é igual à última sessão
- Iniciar implementação sem confirmar build
- Editar `routeTree.gen.ts` — gerado automaticamente
- Trabalhar em `frontend/` achando que é `src/`

## Saída Esperada
Briefing de 10-15 linhas: branch, build, working tree, objetivo, escopo, riscos, próxima ação.
