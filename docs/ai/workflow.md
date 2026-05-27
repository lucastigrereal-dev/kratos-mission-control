# KRATOS — Workflow de Trabalho com IA

Como o Claude Code deve trabalhar neste repo para ser melhor que o Lovable.

---

## Hierarquia de Decisão

```
1. CLAUDE.md — regras absolutas do projeto
2. Skills (.claude/skills/) — como executar cada tipo de task
3. Commands (.claude/commands/) — fluxos reutilizáveis
4. Esta documentação — contexto adicional
```

---

## Iniciando uma Sessão

**Sempre começar com `/repo-onboarding <objetivo>`**

Nunca assumir que o estado é igual à última sessão:
- Working tree pode estar suja
- Branch pode ter mudado
- project-state.json pode estar desatualizado
- Build pode estar quebrado

---

## Antes de Implementar

**Qualquer task não-trivial exige plano aprovado.**

```
Trivial (< 5 linhas, causa óbvia):   → implementar direto
Pequeno (1 componente, 1 arquivo):   → plano de 5 linhas + ok
Médio (múltiplos arquivos):          → /criar-feature completo
Grande (nova rota, nova ilha):       → feature-planner + ok explícito
```

**Nunca começar sem classificar o tipo:**
- Nova rota → `src/routes/`
- Novo componente → `src/components/kratos/<dominio>/`
- Nova ilha → `src/components/kratos/world/`
- Nova integração → `src/hooks/` + `api-contract/`

---

## Durante a Implementação

### Regras absolutas
1. **SEMPRE `src/`** — NUNCA `frontend/` sem autorização explícita
2. **NUNCA editar `routeTree.gen.ts`** — gerado automaticamente
3. **Dados no loader** — nunca `useEffect` para fetch de rota
4. **`var(--kr-*)`** — nunca hex inline
5. **Escopo mínimo** — não refatorar código fora da task
6. **Build gate** — `bun run build` antes de qualquer commit

### Framer Motion
- Instalado: sim
- Usar em: entradas de painéis, drawers, overlays, ilha clicks
- Não usar em: listas estáticas, backgrounds, spinners
- Duração: ≤ 0.3s, `ease: 'easeOut'`
- Sempre: `prefers-reduced-motion`

### Dark mode
- KRATOS é dark-only (forçado em `__root.tsx`)
- Não criar lógica de toggle
- Testar dark mode em todo componente

---

## Features Longas — Sem Se Perder

**Para features que span múltiplas sessões:**

1. Criar `tasks.md` na raiz com checklist rastreável
2. Ao final de cada sessão: `/modo-foco` para salvar checkpoint
3. Na próxima sessão: `/repo-onboarding` para restaurar contexto
4. Checkpoint format:
   ```
   CHECKPOINT — <timestamp>
   Missão: <o que estava fazendo>
   Estado: <o que está pronto>
   Próximo: <próximo passo exato>
   Arquivos em progresso: <lista>
   ```

---

## Revisão de Código

**Antes de qualquer commit com UI:**
1. `/revisar-ui` — tokens, estados, dark mode, anti-slop
2. `bun run build` — zero erros
3. `bun test` — zero falhas
4. `/snapshot-visual` — antes de features visuais grandes

**Nunca commitar:**
- Com hex inline
- Com `any` em código novo
- Com botão sem handler
- Com build quebrado
- Com teste falhando

---

## Preparar para Deploy

**Deploy = autorização explícita do Lucas. Sempre.**

1. `/modo-foco preparar-deploy` — define escopo
2. `bun run build` — DEVE passar
3. `bun test` — DEVE passar
4. Verificar `wrangler.jsonc` — sem placeholders
5. Listar secrets necessários para Lucas configurar
6. Entregar checklist `/deploy-automation`
7. **Aguardar autorização** — nunca executar `wrangler deploy`

---

## Evitar Drift de Contexto

**Sinais de drift:**
- Implementando em `frontend/` achando que é `src/`
- Usando `var(--kratos-*)` legado
- Criando store global sem justificativa
- Adicionando feature não planejada durante bug fix
- Editando `routeTree.gen.ts` manualmente

**Quando detectar drift:**
1. Parar
2. Salvar checkpoint
3. Reportar: "Você saiu do escopo. Quer ajustar a missão ou voltar?"
4. Aguardar instrução do Lucas

---

## Hierarquia KRATOS (nunca inverter)

```
KRATOS vê.
Aurora interpreta.
OMNIS/HOMINIS age.
Akasha lembra.
Codex/Claude constrói.
Lucas decide.
```

Claude Code **constrói**. Nunca toma decisões de produto sozinho.
Sempre reportar o que vai fazer antes de fazer.
Sempre aguardar "ok" em mudanças médias/grandes.
