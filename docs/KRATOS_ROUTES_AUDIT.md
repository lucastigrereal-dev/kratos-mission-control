# KRATOS FASE 0.2 — Auditoria de Rotas e Estado Real

**Data:** 2026-05-16
**Agentes:** kratos-architect + kratos-qa-guard
**Build pré-auditoria:** ✅ Passou limpo (client + SSR)

---

## 1. Git Status Atual

```
 M src/routeTree.gen.ts          ← modificado (pré-existente, NÃO por esta auditoria)
?? .claude/agents/               ← 5 agentes (instalados Fase 0.1)
?? .claude/skills/api-contract-sync.md  ← 1 skill (instalada Fase 0.1)
?? CLAUDE.md                     ← constituição (criada Fase 0.1)
?? docs/*.md × 10                ← relatórios e docs de referência
```

---

## 2. Mapeamento por Rota

### 2.1 `/` (index.tsx)

| Campo | Valor |
|---|---|
| **Arquivo** | `src/routes/index.tsx` |
| **Estado** | ⚠️ DUPLICADO — renderiza `<AgoraView />`, idêntico a `/agora` |
| **Loader** | ❌ Nenhum |
| **Componente principal** | `AgoraView` (não tem view própria de dashboard) |
| **Dados** | Hardcoded — `MOCK` object inline (12 campos) |
| **Ações/botões** | "Executar agora" + "Abrir Mentor" em NextActionCard (sem handler), "Atalho visual Aurora" (mock) |
| **Ações funcionais** | 0 de 3 — todos decorativos |
| **Loading/Empty/Error** | ❌ Nenhum estado implementado |
| **Dark mode** | ⚠️ Tokens CSS usados, mas sem verificação explícita |
| **Mobile 375px** | ⚠️ Grid responsivo presente, sem teste confirmado |
| **Ação primária recomendada** | Dashboard real com sinais agregados — não duplicar `/agora` |

**Gap crítico:** `/` não tem identidade própria. É um alias de `/agora`. Viola regra "1 rota = 1 responsabilidade".

---

### 2.2 `/agora` (agora.tsx)

| Campo | Valor |
|---|---|
| **Arquivo** | `src/routes/agora.tsx` |
| **Estado** | 🟡 PARCIAL — UI rica, dados 100% mock, zero interação real |
| **Loader** | ❌ Nenhum |
| **Componentes** | FocusCard, NextActionCard, CriticalAlertCard, DeadlineCard, CheckpointCard, AuroraShortcutCard, SystemPulseStrip, MiniAgenda (8 componentes) |
| **Dados** | `MOCK` inline com 12 campos: focus, nextAction, criticalAlert, warningsCount, deadline, lastCheckpoint, liveState, liveUpdate, systems, agenda |
| **Ações/botões** | 3 botões: "Executar agora", "Abrir Mentor" (NextActionCard — sem onPrimary/onSecondary), "Atalho visual Aurora" (AuroraShortcutCard — onClick vazio) |
| **Ações funcionais** | 0 de 3 — todos decorativos ou sem handler |
| **Loading/Empty/Error** | ❌ Nenhum estado — assume dados sempre presentes |
| **Dark mode** | ⚠️ Usa tokens `var(--kratos-*)`, mas com violação: `color: "#0C0C0E"` em NextActionCard linha 61 |
| **Mobile 375px** | ⚠️ Grid `lg:col-span-*` indica breakpoints, sem teste |
| **Ação primária recomendada** | Botão "Executar agora" deve criar checkpoint e iniciar timer de foco |

**Violações do CLAUDE.md:**
- Regra #4: usa MOCK inline, não `useApi<T>()`
- Regra #5: sem loader — dados não vêm do servidor
- Regra #9: `color: "#0C0C0E"` hardcoded (NextActionCard L61)
- Regra #10: 3 botões decorativos
- Regra #11: sem Loading/Empty/Error states

---

### 2.3 `/agenda` (agenda.tsx)

| Campo | Valor |
|---|---|
| **Arquivo** | `src/routes/agenda.tsx` |
| **Estado** | 🟡 PARCIAL — UI mais completa do app, mas 100% mock |
| **Loader** | ❌ Nenhum |
| **Componentes** | MentorRecommendationCard, ExecutionScoreCard, RiskProjectCard, TodayExecutionPanel, DeadlineRadar, OverduePanel, FinishLinePanel, DoNotDoPanel, WeekDetailList (9 componentes) |
| **Dados** | `MOCK_AGENDA` inline: recommendation, score[4], today[5], overdue[2], radar[4], donotdo[4], finishline[2], risk, week[5] |
| **Ações/botões** | Nenhum botão de ação real identificado nos componentes importados — cards são display-only |
| **Ações funcionais** | 0 — tela inteira é read-only visual |
| **Loading/Empty/Error** | ❌ Nenhum |
| **Dark mode** | ⚠️ Usa tokens, sem violação óbvia de hex |
| **Mobile 375px** | ⚠️ Grid `max-w-[1280px]` com breakpoints |
| **Ação primária recomendada** | "Criar plano do dia" ou "Revisar recomendações do Mentor" |

**Nota:** É a tela com mais componentes (9). Nenhum aceita input do usuário. É um dashboard estático.

---

### 2.4 `/checkpoints` (checkpoints.tsx)

| Campo | Valor |
|---|---|
| **Arquivo** | `src/routes/checkpoints.tsx` |
| **Estado** | 🟡 PARCIAL — timeline visual rica, mas mock e sem CRUD |
| **Loader** | ❌ Nenhum |
| **Componentes** | ResumeFromHereCard, CheckpointSummaryCard, CheckpointFilterBar, CheckpointTimeline (4 componentes) |
| **Dados** | `MOCK_CHECKPOINTS` inline: resume, summary, timeline[4] |
| **Ações/botões** | "Retomar daqui" (ResumeFromHereCard — onClick=e.preventDefault(), aria-disabled="true"), filtros (CheckpointFilterBar — aria-disabled="true") |
| **Ações funcionais** | 0 — todos mock |
| **Loading/Empty/Error** | ❌ Nenhum |
| **Dark mode** | ✅ Tokens usados consistentemente |
| **Mobile 375px** | ⚠️ Grid responsivo |
| **Ação primária recomendada** | "Salvar checkpoint agora" — botão funcional de 1 clique |

---

### 2.5 `/projetos` (projetos.tsx)

| Campo | Valor |
|---|---|
| **Arquivo** | `src/routes/projetos.tsx` |
| **Estado** | 🔴 STUB — `PlaceholderRoute` com EmptyState |
| **Loader** | ❌ Nenhum |
| **Componentes** | PlaceholderRoute → SectionHeader + StatusCard + EmptyState |
| **Dados** | Props estáticas: `eyebrow="Projetos"`, `title="Projetos conhecidos"`, `description="..."` |
| **Ações/botões** | Nenhum |
| **Ações funcionais** | 0 |
| **Loading/Empty/Error** | Só Empty (é o estado padrão do stub) |
| **Dark mode** | ✅ via tokens |
| **Mobile 375px** | ✅ layout simples |
| **Ação primária recomendada** | Listar projetos com status real (usando `GET /projects` do API contract) |

---

### 2.6 `/contexto` (contexto.tsx)

| Campo | Valor |
|---|---|
| **Arquivo** | `src/routes/contexto.tsx` |
| **Estado** | 🟡 PARCIAL — UI rica de contexto, mock, botões decorativos |
| **Loader** | ❌ Nenhum |
| **Componentes** | CurrentContextHero, FocusDriftCard, ActiveWindowCard, ContextReasonCard, ContextActionStrip, BrowserContextList, EmptyState (7 componentes) |
| **Dados** | `MOCK_CONTEXT` inline: hero, drift, activeWindow, reasons[3], browser[5] |
| **Ações/botões** | 4 botões em ContextActionStrip: "Salvar checkpoint", "Retomar último checkpoint", "Abrir Aurora", "Ver detalhes" — TODOS `onClick={(e) => e.preventDefault()}`, `aria-disabled="true"`, `title="Mock visual — sem efeito real"` |
| **Ações funcionais** | 0 de 4 — todos explicitamente decorativos |
| **Loading/Empty/Error** | EmptyState presente no final da tela, mas não como fallback |
| **Dark mode** | ✅ Tokens usados |
| **Mobile 375px** | ⚠️ Grid responsivo |
| **Ação primária recomendada** | "Salvar checkpoint deste contexto" — transformar de mock para funcional |

**Nota:** ContextActionStrip é o exemplo mais explícito de "botão decorativo" — 4 botões com `aria-disabled`, `e.preventDefault()`, e title "Mock visual".

---

### 2.7 `/sistema` (sistema.tsx)

| Campo | Valor |
|---|---|
| **Arquivo** | `src/routes/sistema.tsx` |
| **Estado** | 🟢 MAIS COMPLETO — auto-contido, mostra 9 estados + Empty/Loading/Error |
| **Loader** | ❌ Nenhum |
| **Componentes** | SectionHeader, StatusCard, LiveStatusIndicator, EmptyState, LoadingState, ErrorState (todos de `base/`) |
| **Dados** | Array estático `STATES: LiveState[]` com 9 valores |
| **Ações/botões** | Nenhum — tela de referência visual |
| **Ações funcionais** | N/A — tela é catálogo de estados |
| **Loading/Empty/Error** | ✅ Implementados como exemplos visuais em cards |
| **Dark mode** | ✅ Tokens usados |
| **Mobile 375px** | ✅ Grid `sm:grid-cols-2 lg:grid-cols-3` |
| **Ação primária recomendada** | Conectar ao `GET /system` real (CPU, RAM, Disk) + saúde dos collectors |

**Nota:** É a tela mais próxima de "completa" no sentido visual, mas é um catálogo estático, não um painel de sistema funcional.

---

## 3. Tabela Resumo

| Rota | Estado | Loader | Dados | Botões | Funcionais | Estados UI | Violações CLAUDE.md |
|---|---|---|---|---|---|---|---|
| `/` | ⚠️ DUPLICADO | ❌ | Mock inline | 3 | 0 | ❌ | #4, #5, #10, #11 |
| `/agora` | 🟡 PARCIAL | ❌ | Mock inline | 3 | 0 | ❌ | #4, #5, #9, #10, #11 |
| `/agenda` | 🟡 PARCIAL | ❌ | Mock inline | 0 | 0 | ❌ | #4, #5, #11 |
| `/checkpoints` | 🟡 PARCIAL | ❌ | Mock inline | 3 | 0 | ❌ | #4, #5, #10, #11 |
| `/projetos` | 🔴 STUB | ❌ | Props estáticas | 0 | 0 | Só Empty | #4, #5, #11 |
| `/contexto` | 🟡 PARCIAL | ❌ | Mock inline | 4 | 0 | Só Empty | #4, #5, #10, #11 |
| `/sistema` | 🟢 REFERÊNCIA | ❌ | Array estático | 0 | N/A | ✅ | #5 |

---

## 4. Inventário de Botões Decorativos

| Local | Botão | Evidência |
|---|---|---|
| NextActionCard (agora) | "Executar agora" | `onPrimary` opcional — não passado pelo AgoraView |
| NextActionCard (agora) | "Abrir Mentor" | `onSecondary` opcional — não passado pelo AgoraView |
| AuroraShortcutCard (agora) | "Atalho visual Aurora" | `onClick={() => { /* visual mock */ }}` |
| ContextActionStrip (contexto) × 4 | "Salvar checkpoint", "Retomar", "Abrir Aurora", "Ver detalhes" | `e.preventDefault()`, `aria-disabled="true"`, `title="Mock visual"` |
| ResumeFromHereCard (checkpoints) | "Retomar daqui" | `e.preventDefault()`, `aria-disabled="true"`, `title="Mock visual"` |
| CheckpointFilterBar (checkpoints) × 4 | Chips "Hoje", "Recentes", "Manuais", "Contexto" | `aria-disabled="true"`, `title="Filtro visual"` |

**Total: 13 botões decorativos em 3 telas.**

---

## 5. Componentes Compartilhados (`src/components/`)

### 5.1 `kratos/base/` (9 componentes — infrastrutura)
AlertBadge, EmptyState, ErrorState, LiveStatusIndicator, LoadingState, SectionHeader, StatusCard, StatusDot, SystemCard

### 5.2 `kratos/shell/` (5 componentes — layout)
AppShell, Topbar, Sidebar, StatusBar, AuroraPanel

### 5.3 `kratos/views/` (5 componentes — páginas)
AgoraView, AgendaView, CheckpointsView, ContextoView, PlaceholderRoute

### 5.4 `kratos/agora/` (8 componentes)
FocusCard, NextActionCard, CriticalAlertCard, DeadlineCard, CheckpointCard, AuroraShortcutCard, SystemPulseStrip, MiniAgenda

### 5.5 `kratos/agenda/` (6 componentes)
TodayExecutionPanel, DeadlineRadar, OverduePanel, FinishLinePanel, DoNotDoPanel, WeekDetailList

### 5.6 `kratos/checkpoints/` (5 componentes)
ResumeFromHereCard, CheckpointSummaryCard, CheckpointFilterBar, CheckpointTimeline, CheckpointItemCard

### 5.7 `kratos/contexto/` (6 componentes)
CurrentContextHero, FocusDriftCard, ActiveWindowCard, ContextReasonCard, ContextActionStrip, BrowserContextList

### 5.8 `kratos/aurora/` (4 componentes)
AuroraInputMock, AuroraMessagePreview, AuroraPanelContent, AuroraQuickActions

### 5.9 `kratos/mentor/` (3 componentes)
ExecutionScoreCard, MentorRecommendationCard, RiskProjectCard

### 5.10 `kratos/icons/` (1 componente)
KratosLogo

### 5.11 `ui/` (47 componentes shadcn/ui)
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

**Total: ~99 componentes (52 kratos + 47 shadcn/ui)**

---

## 6. Hooks Existentes (`src/hooks/`)

| Hook | Estado |
|---|---|
| `use-mobile.tsx` | ✅ Presente (shadcn boilerplate) |
| `useApi.ts` | ❌ **NÃO EXISTE** — requerido pelo CLAUDE.md regra #4 |
| `useLiveKratos.ts` | ❌ Não existe — referenciado nas skills kimi-to-code e hud-assembler |
| Domain hooks (useCheckpoints, etc.) | ❌ Nenhum |

**Gap crítico:** `useApi<T>()` é a base de todo data fetching no CLAUDE.md e não existe.

---

## 7. API Contract (`api-contract/`)

| Arquivo | Tipo | Estado |
|---|---|---|
| `KRATOS_API_CONTRACT_V1.md` | Markdown (55+ endpoints) | ✅ Documentação abrangente |
| `collector-envelope.schema.json` | JSON Schema | ✅ Envelope pattern |
| `live.snapshot.schema.json` | JSON Schema | ✅ Snapshot contract |
| `live.stream.schema.md` | Markdown | ✅ SSE stream spec |
| `*.schema.ts` (Zod) | TypeScript | ❌ **ZERO arquivos Zod `.ts`** |

**Gap crítico:** `api-contract/` não tem schemas Zod TypeScript. CLAUDE.md regra #2 e #6 exigem Zod validation — mas não há como importar de `api-contract/`.

---

## 8. Mock Data (`mock-data/`)

| Arquivo | Conteúdo | Usado por |
|---|---|---|
| `now.json` | Projeto atual, missão, next action, riscos | Não referenciado no frontend atual |
| `tasks.json` | 4 tasks (doing, planned) | Não referenciado no frontend atual |
| `projects.json` | (não lido) | Não referenciado no frontend atual |
| `system.json` | (não lido) | Não referenciado no frontend atual |

**Nota:** As views NÃO consomem `mock-data/`. Cada view define seu próprio `MOCK` inline. Os JSONs de `mock-data/` parecem ser para testes/backend.

---

## 9. Dependências entre Camadas

```
┌─────────────────────────────────────────────────────────┐
│ CAMADA ATUAL (SANDBOX)                                  │
│                                                         │
│ src/routes/*.tsx                                        │
│   └─▶ src/components/kratos/views/*View.tsx             │
│         └─▶ src/components/kratos/<dominio>/*Card.tsx   │
│               └─▶ src/components/kratos/base/*.tsx      │
│                     └─▶ src/components/ui/*.tsx          │
│                                                         │
│ DADOS: MOCK inline (hardcoded nos views)                │
│ API:   Zero chamadas                                    │
│ HOOKS: Zero (exceto use-mobile)                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CAMADA ALVO (CLAUDE.md)                                 │
│                                                         │
│ src/routes/*.tsx                                        │
│   └─▶ loader() → fetch data                             │
│         └─▶ src/hooks/useApi<T>(path)                   │
│               └─▶ api-contract/*.schema.ts (Zod)        │
│                     └─▶ src/server.ts (Hono)            │
│                                                         │
│ DADOS: TanStack Query + API endpoints                   │
│ API:   Hono em Cloudflare Worker                        │
│ HOOKS: useApi, useLiveKratos, useCheckpoints, ...       │
└─────────────────────────────────────────────────────────┘
```

**Gap entre as camadas:** Nenhuma rota cruza a ponte sandbox → real. Zero loaders, zero hooks de API, zero schemas Zod importáveis.

---

## 10. Gaps Críticos (ordenados por impacto)

| # | Gap | Impacto | Bloqueia |
|---|---|---|---|
| 1 | `useApi.ts` não existe | **BLOQUEANTE** — nenhuma rota pode buscar dados reais | Todas as rotas |
| 2 | Zero schemas Zod `.ts` em `api-contract/` | **BLOQUEANTE** — validação de API impossível | API, hooks |
| 3 | Zero rotas têm loader | Viola CLAUDE.md regra #5 — dados não vêm do servidor | Todas as rotas |
| 4 | Todas as views usam MOCK inline | Nenhuma integração com backend real | Todas as rotas |
| 5 | `/` duplica `/agora` | Viola "1 rota = 1 responsabilidade" | Rota `/` |
| 6 | `/projetos` é stub puro | Tela inexistente funcionalmente | Rota `/projetos` |
| 7 | 13 botões decorativos | Viola CLAUDE.md regra #10 | `/agora`, `/checkpoints`, `/contexto` |
| 8 | 1 hook total (`use-mobile`) vs ~5 necessários | Infraestrutura de hooks inexistente | Data layer |
| 9 | `#0C0C0E` hardcoded em NextActionCard | Viola regra #9 (hex inline) | `/agora` |
| 10 | Backend tem 55+ endpoints, frontend usa 0 | Desconexão total backend↔frontend | Integração |

---

## 11. Primeira Micro-Frente Recomendada

### `feat/data-layer-foundation`

**Escopo MÍNIMO — 3 arquivos, zero UI nova:**

1. **`src/hooks/useApi.ts`**
   - Hook genérico `useApi<T>(path: string)` com TanStack Query
   - Retorna `{ data, error, isLoading, isError, source }`
   - Fonte: chama `GET /api/<path>` com fetch (depois migra para Hono)
   - Estados: loading, error, empty integrados no retorno

2. **`api-contract/checkpoint.schema.ts`**
   - Schema Zod para Checkpoint (baseado no template de `api-contract-sync.md`)
   - Exporta: `CheckpointSchema`, `CreateCheckpointSchema`, tipos inferidos
   - Primeiro schema Zod real do projeto

3. **`src/hooks/useCheckpoints.ts`**
   - `useCheckpoints()` consumindo `useApi<Checkpoint[]>("/checkpoints")`
   - `useCreateCheckpoint()` mutation
   - Tipado com schemas de `api-contract/checkpoint.schema.ts`

**Por que esta ordem:**
- `useApi` desbloqueia TODAS as rotas (gap #1)
- Schemas Zod desbloqueiam API contract real (gap #2)
- Checkpoints é a rota com ação primária mais clara e menor escopo
- Zero mudança em UI — só infraestrutura
- Testável: `bun run build` deve continuar passando

---

## 12. Checklist Antes de Implementar Qualquer Micro-Frente

- [ ] `bun run build` passa limpo (pré-condição)
- [ ] Nenhum worktree aberto
- [ ] `useApi.ts` criado e tipado
- [ ] Primeiro schema Zod em `api-contract/`
- [ ] Primeiro hook de domínio funcional
- [ ] `bun run build` continua passando
- [ ] Zero alterações em `src/routeTree.gen.ts`
- [ ] Zero novos botões decorativos
- [ ] Zero `style={{ color: "#..." }}` adicionado
- [ ] Nenhum deploy, merge ou push

---

## 13. Riscos

| Risco | Nível |
|---|---|
| `useApi` sem backend Hono real → fetch vai falhar (CORS/404) | 🟡 BAIXO — mock data cobre durante dev |
| Zod schemas duplicarem tipos já definidos em JSON Schema | 🟡 BAIXO — Zod é a fonte de verdade TypeScript |
| Adicionar loaders existentes quebrar build por dependência circular | 🟡 BAIXO — usar `createFileRoute` com loader assíncrono |
| Escopo crescer ("já que estamos mexendo nisso...") | 🔴 ALTO — disciplina: **3 arquivos, nada mais** |
