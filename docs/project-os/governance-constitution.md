# KRATOS Governance Constitution v2.0

**Status:** Canonical | **Ratified:** 2026-05-18 | **Amendments:** 0

---

## Preamble

Esta constituição governa o repositório `kratos-mission-control`. Toda alteração, agente, skill, comando e hook está subordinado a estas regras. Em caso de conflito, este documento prevalece sobre qualquer outro — exceto ordem verbal direta do Lucas.

---

## Article I — Identity

KRATOS é o **sistema nervoso central / cockpit local-first** da operação Lucas Tigre.

Ele observa, compõe e exibe o estado operacional em tempo real. Não executa ações — enxerga o campo para que Lucas decida.

O nome importa: KRATOS não é um deus que age. É um titã que **vê**.

---

## Article II — Separation of Powers

```
KRATOS vê.           → observabilidade, composição de estado, exibição
Aurora interpreta.    → voz mentor, análise de padrões, sugestões
OMNIS/HOMINIS age.    → execução de skills, crews, deploys, publicações
Akasha lembra.        → memória vetorial, documentos, insights históricos
Codex/Claude constrói.→ geração de código, relatórios, análise profunda
Lucas decide.         → juízo final, aprovação, direção estratégica
```

**KRATOS nunca cruza a linha de observar para executar.**

Se uma feature exige execução de ação externa, ela pertence ao OMNIS ou à Aurora, não ao KRATOS.

---

## Article III — Golden Rules (Imutáveis sem Emenda)

1. **Build gate obrigatório** — `bun run build` passa limpo antes de qualquer commit
2. **api-contract/ é a fonte da verdade** — todo endpoint e hook consome schemas daqui
3. **Componentes novos em `src/components/kratos/<dominio>/`** — seguir estrutura existente
4. **Hooks em `src/hooks/`** com prefixo `use` — usar `useApi<T>()`, nunca `fetch()` raw
5. **Loader em toda rota** — dados no loader, nunca em `useEffect`
6. **Zod em toda entrada** — validação de API input e output
7. **1 ação primária por tela** — o elemento visualmente mais proeminente
8. **Dark mode + mobile 375px** verificados antes de commit
9. **Tokens CSS sempre** — `var(--kr-*)` para cores, nunca hex inline
10. **Nenhum botão decorativo** — todo CTA tem handler funcional
11. **Estados obrigatórios**: Loading, Empty, Error, Offline em toda tela com dados
12. **Backend offline não quebra frontend** — fallback visual sempre presente

---

## Article IV — Protected Components

**NUNCA recriar ou alterar estes sem autorização explícita do Lucas:**

| Componente | Arquivo | Motivo |
|---|---|---|
| Shell da aplicação | `src/components/kratos/shell/AppShell.tsx` | Layout grid central |
| Topbar HUD | `src/components/kratos/shell/Topbar.tsx` | Barra superior com greeting |
| Sidebar | `src/components/kratos/shell/Sidebar.tsx` | Navegação principal |
| StatusBar | `src/components/kratos/shell/StatusBar.tsx` | Barra de status inferior |
| AuroraPanel | `src/components/kratos/shell/AuroraPanel.tsx` | Painel de inteligência |
| Design tokens | `src/styles.css` | Sistema de design inteiro |
| Route tree | `src/routeTree.gen.ts` | Auto-gerado — nunca editar |

---

## Article V — Safety Directives

1. **Nunca deploy** sem autorização explícita do Lucas
2. **Nunca push** sem autorização explícita
3. **Nunca ler `.env`** ou expor secrets
4. **Nunca executar OMNIS** (sistema separado)
5. **Nunca `git add .`** — sempre staging seletivo
6. **Nunca pular hooks** com `--no-verify`
7. **Nunca force push para main/master**

---

## Article VI — Code Standards

### TypeScript
- Tipos explícitos — **zero `any`**
- Props via `interface`, não `type`
- Named exports — nunca `export default`

### Estado e Dados
- `@tanstack/react-query` para estado servidor
- Estado local: `useState`/`useReducer` — apenas quando necessário
- **Sem Redux, Zustand ou stores globais** além dos existentes
- `useApi<T>(path)` para fetch — **nunca `useEffect` + `fetch()`**

### Design System
- **CSS custom properties obrigatórios**: `var(--kr-*)`
- **Proibido**: `style={{ color: "#..." }}` — usar tokens
- Glass panels: classe `.glass-panel` ou tokens `var(--kr-glass-*)`
- `prefers-reduced-motion: reduce` **desliga toda animação**

### Testes
- Runner: `bun test` (ou `bun run test` via package.json)
- Localização: `tests/stores/`, `tests/e2e/`
- Padrão: `describe(...)` + `it(...)` de `bun:test`

---

## Article VII — Definition of Done

- [ ] `bun run lint` — sem erros novos
- [ ] `bun run build` — zero erros (client + SSR)
- [ ] `bun run test` — todos passam
- [ ] Zero `any` no código novo
- [ ] Dark mode verificado
- [ ] Mobile 375px sem quebra de layout
- [ ] Nenhum `style={{ color: "#..." }}` no diff
- [ ] `prefers-reduced-motion` testado
- [ ] Loading, Empty, Error states implementados
- [ ] Console do navegador sem erros
- [ ] Nenhum `console.log` no código final

---

## Article VIII — Amendment Process

1. Proposta documentada em `docs/project-os/proposals/`
2. Impacto avaliado em todos os agentes e skills afetados
3. Aprovação do Lucas (verbal ou commit assinado)
4. Constituição atualizada com número de emenda e data

---

*Constituição canônica. Violações conscientes constituem quebra de governança e devem ser reportadas ao Lucas.*
