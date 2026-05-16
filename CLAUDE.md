# KRATOS — Mission Control

**Stack:** React 19 · TanStack Start · TanStack Router · TanStack Query · Tailwind v4 · Radix UI · shadcn/ui · Zod · Vite 7 · Bun · Cloudflare Workers
**Deploy:** Cloudflare Workers via `wrangler.jsonc` (REQUER AUTORIZAÇÃO EXPLÍCITA)
**Repositório:** `kratos-mission-control`
**Owner:** Lucas Tigre (@lucastigrereal-dev)

---

## Missão do Produto

KRATOS é o **cockpit de missão pessoal** do Lucas — um Mission Control para gerenciar o agora, projetos, checkpoints, agenda e contexto. Não é app genérico de produtividade. É um painel de controle de vida real.

KRATOS é **frontend/cockpit**. Não é backend agêntico. Não é OMNIS.

| Rota | Propósito | Ação Primária |
|---|---|---|
| `/` | Dashboard — visão geral do momento | Ver o que importa agora |
| `/agora` | Foco do momento presente | Definir/executar próxima ação |
| `/agenda` | Calendário e compromissos | Ver o que vem hoje/amanhã |
| `/checkpoints` | Marcos e metas com progresso | Salvar/retomar checkpoint |
| `/projetos` | Projetos ativos e status | Ver progresso dos projetos |
| `/contexto` | Contexto pessoal e situacional | Registrar contexto atual |
| `/sistema` | Status do sistema e configurações | Ver saúde dos serviços |

---

## Arquitetura do Projeto

```
kratos-mission-control/
├── src/
│   ├── routes/              ← Páginas (TanStack Router file-based)
│   │   ├── __root.tsx       ← Root layout + providers
│   │   ├── index.tsx        ← /
│   │   ├── agora.tsx        ← /agora
│   │   ├── agenda.tsx       ← /agenda
│   │   ├── checkpoints.tsx  ← /checkpoints
│   │   ├── projetos.tsx     ← /projetos
│   │   ├── contexto.tsx     ← /contexto
│   │   └── sistema.tsx      ← /sistema
│   ├── components/
│   │   ├── kratos/          ← Componentes de domínio (~40 componentes)
│   │   │   ├── shell/       ← AppShell, Topbar, Sidebar, StatusBar, AuroraPanel
│   │   │   ├── views/       ← AgendaView, AgoraView, CheckpointsView, ContextoView
│   │   │   ├── agora/       ← FocusCard, NextActionCard, CriticalAlertCard, ...
│   │   │   ├── agenda/      ← TodayExecutionPanel, OverduePanel, DeadlineRadar, ...
│   │   │   ├── checkpoints/ ← CheckpointItemCard, CheckpointTimeline, ...
│   │   │   ├── contexto/    ← CurrentContextHero, FocusDriftCard, ...
│   │   │   ├── aurora/      ← AuroraPanelContent, AuroraQuickActions
│   │   │   ├── base/        ← EmptyState, ErrorState, LoadingState, StatusCard, ...
│   │   │   ├── mentor/      ← ExecutionScoreCard, RiskProjectCard
│   │   │   └── icons/       ← KratosLogo
│   │   └── ui/              ← shadcn/ui (47 componentes)
│   ├── hooks/               ← Custom hooks (useApi, useLiveKratos, useCheckpoints, ...)
│   ├── lib/                 ← Utilitários, helpers, types, cn()
│   ├── server.ts            ← Hono server (Cloudflare Worker)
│   ├── router.tsx           ← Configuração do TanStack Router
│   ├── start.ts             ← Entry point TanStack Start
│   └── styles.css           ← Tailwind v4 + KRATOS design tokens
├── frontend/                ← Estrutura Vite standalone secundária
├── backend/                 ← Lógica server-side
├── api-contract/            ← Contratos de API (schemas Zod)
├── mock-data/               ← Dados de desenvolvimento
├── docs/                    ← Documentação técnica e relatórios
├── .claude/
│   ├── agents/              ← 5 agentes de execução (kratos-*)
│   └── skills/              ← 11 skills (10 originais + api-contract-sync)
├── wrangler.jsonc           ← Configuração Cloudflare Workers
└── vite.config.ts
```

---

## Regras de Ouro

**REGRA #0 — `src/routeTree.gen.ts` é GERADO automaticamente. NUNCA editar manualmente.**

1. **Build gate obrigatório** — `bun run build` deve passar limpo antes de qualquer commit
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

## Convenções de Código

### TypeScript
- Tipos explícitos — **zero `any`**
- Props via `interface`, não `type`
- Named exports — nunca `export default`

### Rotas (TanStack Router)
- `createFileRoute` em cada arquivo em `src/routes/`
- Loader para data fetching no servidor
- `routeTree.gen.ts` é **auto-gerado pelo plugin Vite** — NUNCA editar
- 1 rota = 1 responsabilidade = 1 view component

### Estado e Dados
- `@tanstack/react-query` para estado servidor
- Estado local: `useState`/`useReducer` — apenas quando necessário
- **Sem Redux, Zustand ou stores globais**
- Schemas Zod em `api-contract/` para validação
- `useApi<T>(path)` para fetch — **nunca `useEffect` + `fetch()`**

### Design System (KRATOS Tokens)
- **CSS custom properties obrigatórios**: `var(--kr-*)`
- **Proibido**: `style={{ color: "#..." }}` — usar tokens
- Glass panels: classe `.glass-panel` ou tokens `var(--kr-glass-*)`
- Cores semânticas: `--kr-color-aurora`, `--kr-color-mission`, `--kr-color-risk`, etc.
- Tipografia: `var(--kr-text-*)` para tamanhos, `var(--kr-font-sans)` para família
- Espaçamento: `var(--kr-space-*)` — nunca px hardcoded
- Animação: `var(--kr-duration-*)` + `var(--kr-ease-*)`
- `prefers-reduced-motion: reduce` **desliga toda animação** — testar antes de commit

### Backend / API
- Hono em `src/server.ts` (Cloudflare Worker)
- Rotas prefixadas `/api/`
- Resposta padrão: `{ data: T | null, error: string | null }`
- Validar entrada com schemas de `api-contract/`
- Usar `c.env` para variáveis — nunca `process.env`

### Testes
- **Runner**: `bun test` (ou `bun run test` via package.json)
- **Localização**: `tests/stores/` para store tests, `tests/` para integração
- **Padrão**: `describe(...)` + `it(...)` de `bun:test`, `beforeEach` para reset
- **Store tests**: criar `createStore()` factory inline (isolado, sem side effects de seed). Testar CRUD + data integrity
- **Sem jsdom**: testes são pura lógica, sem DOM. Zero dependências externas
- **Testes existentes**: `tests/stores/checkpoint-store.test.ts` (14), `project-store.test.ts` (14), `appointment-store.test.ts` (13) — 41 testes
- **Regra**: todos os testes passam (`bun test`) antes de qualquer commit

### Estilo
- Tailwind v4 puro via CSS — tokens em `src/styles.css` via `@theme`
- `cn()` helper de `src/lib/utils.ts` para merge de classes
- `lucide-react` para ícones — nunca emojis como ícones
- Dark mode via CSS variables
- shadcn/ui como base — componentes em `src/components/ui/`

---

## Neuro-UX (TDAH-first)

O operador tem TDAH. Cada elemento compete por atenção limitada.

- **Máximo 7±2 elementos de decisão** visíveis por tela (Lei de Miller)
- **1 ação primária** — a mais proeminente visualmente
- **Posições fixas** (spatial memory) — componentes não reordenam sozinhos
- **Zero popups** sem trigger explícito do usuário
- **Notificações**: apenas no right rail, nunca no centro da tela
- **Cores vibrantes**: só para alertas críticos
- **Animações**: sem loops infinitos, máximo 2 simultâneas, duração ≤ 0.6s
- **Tom da UI**: operacional, focado, sem frescura
- **Referência**: Linear + Vercel Dashboard
- **Retomada sem vergonha**: checkpoint 1-clique, sem fricção

---

## Componentes Protegidos

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

## Definition of Done

Uma task está pronta quando:

### TypeScript
- [ ] `bun run lint` — sem erros **novos** (erros pré-existentes em `backend\.venv\` e `docs\kimi\` não são regressão)
- [ ] Zero `any` no código novo
- [ ] Todas as props com interface definida

### Build
- [ ] `bun run build` — **zero erros** (client + SSR)
- [ ] Sem regressão de bundle size > 10%

### Funcional
- [ ] Componente renderiza sem erro no dev (`bun run dev`)
- [ ] Loader retorna dados corretos (se rota)
- [ ] Schemas Zod validando entrada (se API)
- [ ] Todo CTA/botão tem handler funcional — **nenhum botão decorativo**
- [ ] Navegação funciona sem erro de rota

### Visual
- [ ] Dark mode verificado
- [ ] Mobile 375px sem quebra de layout
- [ ] Nenhum `style={{ color: "#..." }}` no diff — usar tokens
- [ ] `prefers-reduced-motion` testado
- [ ] Loading, Empty, Error states implementados
- [ ] Console do navegador sem erros

### Final
- [ ] Nenhum `console.log` no código final
- [ ] Commit com mensagem seguindo convenção

---

## Paralelização com Worktrees

**⚠️ WORKTREES SÓ ABREM APÓS:**
1. Auditoria de pacote aprovada
2. `bun run lint` — sem erros novos
3. `bun run build` — 100% limpo

**Regras:**
- **Máximo 2 worktrees simultâneas** — nunca 5
- Ordem: `data-layer` → `api-routes` → `ui-pages`
- `auth` e `deploy-config` exigem autorização explícita
- `src/routeTree.gen.ts` é compartilhado → só 1 sessão adiciona rotas por vez

```bash
# Só abrir 1-2 por vez, na ordem:
git worktree add ../kratos-data    -b feat/data-layer
git worktree add ../kratos-api     -b feat/api-routes
git worktree add ../kratos-ui      -b feat/ui-pages
```

---

## Deploy

**REQUER AUTORIZAÇÃO EXPLÍCITA DO LUCAS.**

Nenhum agente, skill ou workflow pode executar `wrangler deploy` ou `bunx wrangler deploy`.

A frente `feat/deploy-config` só abre com confirmação verbal do Lucas. Seu escopo é **apenas preparar e documentar** — nunca executar.

---

## Integrações Externas

| Sistema | Propósito | Status | Relação com KRATOS |
|---|---|---|---|
| **Akasha** | Memória vetorial (pgvector) | Backend existe, UI placeholder | KRATOS **exibe** status e busca — não escreve na Akasha |
| **Omnis** | Execução de skills/crews | Backend existe, UI placeholder | KRATOS **lê** status do Omnis — NUNCA comanda |
| **GitHub** | Status de repositórios | Planejado | KRATOS exibe PRs e commits |

**Boundary crítica:** KRATOS é o cockpit de visualização. Akasha e Omnis são sistemas separados com contratos próprios. KRATOS consome APIs, não controla execução.

---

## Agentes (`.claude/agents/`)

| Agente | Quando usar |
|---|---|
| `kratos-architect` | Antes de iniciar qualquer frente — planejar arquitetura |
| `kratos-ui-builder` | Construir UI de rotas — nunca editar routeTree.gen.ts |
| `kratos-api-builder` | Criar endpoints Hono — sempre validar com api-contract/ |
| `kratos-data-layer` | Definir schemas Zod, hooks, mock data |
| `kratos-qa-guard` | Revisar qualidade antes de commit/merge |

**Todo agente segue as Regras de Ouro deste CLAUDE.md.**
