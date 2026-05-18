# KRATOS Mission Control — Master Context

> **Para Manus/Kimi:** Este documento é sua porta de entrada. Leia ANTES de qualquer código.

---

## 1. O que é KRATOS

KRATOS é o **cockpit de missão pessoal** do Lucas Tigre. Não é app genérico de produtividade. Não é dashboard SaaS. É um painel de controle de vida real com mundo 3D CSS, HUD glassmorphism, e Aurora (mentor AI integrado).

**Filosofia:**
- KRATOS **vê** (Mission Lens — dados, alertas, drift)
- Aurora **interpreta** (mensagens contextuais, mentor signals)
- Lucas **decide** (humano no controle)
- OMNIS/HOMINIS **age** (execução com gate humano)
- Akasha **lembra** (memória vetorial)

---

## 2. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TanStack Start |
| Router | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Estilo | Tailwind v4 + CSS custom properties |
| UI base | Radix UI + shadcn/ui (47 componentes) |
| Validação | Zod |
| Bundler | Vite 7 |
| Runtime | Bun |
| Deploy | Cloudflare Workers (`wrangler.jsonc`) |
| Testes | `bun test` (270 pass) |
| E2E | Playwright |

---

## 3. Estado Atual (2026-05-18)

| Área | Status |
|---|---|
| Build client + SSR | ✅ Zero erros |
| Rotas (9/9) | ✅ HTTP 200 |
| Stores (270 pass) | ✅ |
| Mundo 3D CSS | ✅ 10 ilhas flutuantes + castelo |
| Mission Lens binding | ✅ Governa o cockpit |
| Aurora comandos reais | ✅ /retomar, /salvar, /foco |
| Checkpoint CRUD | ✅ Save/Restore |
| OMNIS Gate | ❌ BLOCKED_BY_BACKEND |
| Akasha Real | ❌ PLACEHOLDER HONESTO |
| Testes frontend | ⚠️ 39 fail pré-existentes (jsdom) |

---

## 4. Arquitetura de Diretórios

```
kratos-mission-control/
├── src/
│   ├── routes/              ← Páginas (TanStack Router file-based)
│   │   ├── __root.tsx       ← Root layout + providers
│   │   ├── index.tsx        ← /  (KratosWorldPage)
│   │   ├── agora.tsx        ← /agora
│   │   ├── agenda.tsx       ← /agenda
│   │   ├── checkpoints.tsx  ← /checkpoints
│   │   ├── projetos.tsx     ← /projetos
│   │   ├── contexto.tsx     ← /contexto
│   │   ├── sistema.tsx      ← /sistema
│   │   └── ilhas.$islandId.tsx ← /ilhas/:islandId
│   ├── components/
│   │   ├── kratos/          ← Componentes de domínio (~110 componentes)
│   │   │   ├── shell/       ← AppShell, Topbar, Sidebar, StatusBar
│   │   │   ├── world/       ← KratosWorldPage, KratosWorldMap, ilhas 3D
│   │   │   ├── hud/         ← CurrentMissionBar, StatusBarDock, etc.
│   │   │   ├── aurora/      ← AuroraChatDock, AuroraPanelV2, etc.
│   │   │   ├── views/       ← AgendaView, AgoraView, etc.
│   │   │   ├── islands/     ← 10 telas de ilha (Omnis, Agencia, etc.)
│   │   │   ├── base/        ← EmptyState, ErrorState, LoadingState, etc.
│   │   │   ├── ui-primitives/ ← GlassPanel, KratosCard, ProgressRing, etc.
│   │   │   ├── checkpoints/ ← CheckpointItemCard, CheckpointResume, etc.
│   │   │   ├── agora/       ← FocusCard, NextActionCard, etc.
│   │   │   ├── agenda/      ← TodayExecutionPanel, OverduePanel, etc.
│   │   │   ├── contexto/    ← CurrentContextHero, FocusDriftCard, etc.
│   │   │   ├── mentor/      ← ExecutionScoreCard, RiskProjectCard
│   │   │   ├── sistema/     ← GithubRepoCard, ServiceHealthCard
│   │   │   ├── projetos/    ← ProjectCard, ProjectFilterBar
│   │   │   └── icons/       ← KratosLogo
│   │   └── ui/              ← shadcn/ui (47 componentes)
│   ├── hooks/               ← 15 hooks customizados
│   ├── lib/                 ← Utilitários, server-fns, providers
│   ├── server.ts            ← Hono server (Cloudflare Worker)
│   ├── router.tsx           ← Configuração do TanStack Router
│   ├── start.ts             ← Entry point TanStack Start
│   ├── styles.css           ← Tailwind v4 + KRATOS design tokens
│   └── styles/kratos-tokens.css ← 49 tokens CSS 3D world
├── api-contract/            ← 9 schemas Zod (fonte da verdade)
├── backend/                 ← Stores (SQLite via better-sqlite3)
├── tests/                   ← Testes (stores, contracts, e2e)
├── docs/                    ← Documentação técnica
└── frontend/                ← Estrutura Vite standalone (legacy)
```

---

## 5. Rotas

| Rota | Arquivo | View Component | Função |
|---|---|---|---|
| `/` | `routes/index.tsx` | `KratosWorldPage` | Mundo 3D + cockpit |
| `/agora` | `routes/agora.tsx` | `AgoraView` | Foco do momento |
| `/agenda` | `routes/agenda.tsx` | `AgendaView` | Calendário |
| `/checkpoints` | `routes/checkpoints.tsx` | `CheckpointsView` | Marcos e metas |
| `/projetos` | `routes/projetos.tsx` | `ProjetosView` | Projetos ativos |
| `/contexto` | `routes/contexto.tsx` | `ContextoView` | Contexto atual |
| `/sistema` | `routes/sistema.tsx` | `SistemaView` | Saúde do sistema |
| `/ilhas/$islandId` | `routes/ilhas.$islandId.tsx` | IslandScreen | Tela de ilha |

---

## 6. Contratos de API (`api-contract/`)

**Fonte da verdade.** Todo endpoint e hook consome schemas daqui.

| Schema | Arquivo |
|---|---|
| Checkpoint | `checkpoint.schema.ts` |
| Project | `project.schema.ts` |
| Appointment | `appointment.schema.ts` |
| Service | `service.schema.ts` |
| GitHub | `github.schema.ts` |
| OMNIS | `omnis.schema.ts` |
| Contexto | `contexto.schema.ts` |
| Dashboard | `dashboard.schema.ts` |
| Source Badge | `source-badge.schema.ts` |

---

## 7. Hooks (`src/hooks/`)

| Hook | Função |
|---|---|
| `useMissionLens` | Dados de missão + mentor signals |
| `useDriftDetection` | Detecta deriva de foco |
| `useDashboard` | Dados agregados do dashboard |
| `useCheckpoints` | CRUD de checkpoints |
| `useSystemPulse` | Saúde do sistema |
| `useLiveStatus` | Estado de conexão (SSE/offline) |
| `useProjects` | Projetos |
| `useAppointments` | Compromissos |
| `useContexto` | Contexto atual |
| `useGithub` | Status de repositórios |
| `useOmnis` | Status OMNIS |
| `useServices` | Saúde de serviços |
| `useGlobalShortcuts` | Atalhos de teclado |
| `useSafeQuery` | Query wrapper com fallback |
| `useCheckpointSuggestion` | Sugestão de checkpoint |

---

## 8. Integrações Externas

| Sistema | Status | KRATOS faz |
|---|---|---|
| **OMNIS** | BLOCKED_BY_BACKEND | **Lê** status — NUNCA comanda |
| **Akasha** | PLACEHOLDER HONESTO | **Exibe** status — NÃO escreve |
| **GitHub** | API real + mock fallback | Exibe PRs e commits |

**Regra crítica:** KRATOS é cockpit de visualização. Não é backend agêntico. Não controla OMNIS. Não escreve na Akasha.

---

## 9. Restrições Absolutas

1. ❌ NÃO criar app novo
2. ❌ NÃO reescrever projeto
3. ❌ NÃO trocar stack
4. ❌ NÃO adicionar Three.js/WebGL/3D pesado
5. ❌ NÃO criar animações novas
6. ❌ NÃO criar widgets decorativos
7. ❌ NÃO alterar `backend/` sem necessidade comprovada
8. ❌ NÃO editar `routeTree.gen.ts` manualmente
9. ❌ NÃO fazer deploy (`wrangler deploy`)
10. ❌ NÃO deixar mock parecer dado real
11. ❌ NÃO deixar Aurora fingir execução
12. ❌ NÃO liberar OMNIS/HOMINIS sem gate humano
13. ❌ NÃO mascarar falha de teste

---

## 10. Build e Testes

```bash
# Dev
bun run dev          # http://localhost:8083

# Build (PRÉ-REQUISITO para commit)
bun run build        # client + SSR, zero erros

# Testes
bun test             # 270 pass, 39 fail (pré-existentes jsdom)

# Lint
bun eslint src/      # zero erros novos
```

---

## 11. Últimos Commits (mais recentes primeiro)

```
5c0d875 chore(kratos): add final verification reports
87ae3b2 fix(kratos): resolve P0 SSR hydration — TDZ on nextAction
b79bc3c feat(kratos): wire Aurora commands and mission cockpit actions
2966338 chore(kratos): remove 4 unused imports from KratosWorldPage
4bed963 feat(kratos): reintegrate 4 CODEX components into KratosWorldPage
```
