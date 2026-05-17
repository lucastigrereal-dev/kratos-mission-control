# KRATOS Functional — Smoke Test Checklist

**Data:** 2026-05-17  
**Branch:** `main`  
**Build:** `bun run build` — ✓ limpo  
**Testes:** 73 pass / 31 fail pre-existentes (frontend/jsdom)

---

## 1. Rotas Principais

| Rota | View | Navegação | Dados | Estado Loading | Estado Error | Estado Empty |
|---|---|---|---|---|---|---|
| `/` | DashboardView | ✓ Link sidebar + KRATOS breadcrumb | TanStack Query | ✓ | ✓ | ✓ |
| `/agora` | AgoraView | ✓ Sidebar item | useCheckpoints | ✓ | ✓ | ✓ |
| `/agenda` | AgendaView | ✓ Sidebar item | useAppointments | ✓ | ✓ | ✓ |
| `/projetos` | ProjetosView | ✓ Sidebar item | useProjects | ✓ | ✓ | ✓ |
| `/contexto` | ContextoView | ✓ Sidebar item | useContextSnapshot | ✓ | ✓ | ✓ |
| `/checkpoints` | CheckpointsView | ✓ Sidebar item | useCheckpoints | ✓ | ✓ | ✓ |
| `/sistema` | SistemaView | ✓ Sidebar item | useServices + useOmnis* | ✓ | ✓ | ✓ |

---

## 2. Ações Prioritárias (CTAs)

| Ação | Rota | Status |
|---|---|---|
| Collapse/expand sidebar | todas | ✓ Funcional |
| Toggle Aurora panel | todas | ✓ Funcional |
| Botão refetch em error state | agenda, agora, projetos, contexto | ✓ Funcional |
| Quick links Dashboard → rotas | `/` | ✓ navigate() |
| Criar checkpoint | `/checkpoints` | ✓ setShowCreate |
| Salvar checkpoint (form) | `/checkpoints` | ✓ useMutateCheckpoint |
| Ações prioritárias (critical alerts) | `/agora` | ✓ handlers onClick |
| Navegar para /agenda do dashboard | `/` | ✓ navigate() |

---

## 3. Hooks / Dados

| Hook | Endpoint | Mock | Real fallback |
|---|---|---|---|
| `useDashboard` | `/api/dashboard/snapshot` | ✓ mock data | ✓ fallback struct |
| `useCheckpoints` | `/api/checkpoints` | store in-memory | ✓ |
| `useProjects` | `/api/projects` | store in-memory | ✓ |
| `useAppointments` | `/api/appointments` | store in-memory | ✓ |
| `useContextSnapshot` | `/api/contexto/snapshot` | ✓ mock data | ✓ |
| `useServices` | `/api/sistema/services` | ✓ mock data | ✓ |
| `useGithubRepo` | `/api/github/repo/:owner/:repo` | ✓ mock fallback | ✓ |
| `useTrackedRepos` | `/api/github/tracked` | ✓ mock data | ✓ |
| `useOmnisStatus` | `/api/omnis/status` | ✓ mock data | ✓ |
| `useOmnisCrews` | `/api/omnis/crews` | ✓ mock data | ✓ |
| `useOmnisJobs` | `/api/omnis/jobs` | ✓ mock data | ✓ |
| `useLiveStatus` | `/api/sistema/live` | ✓ mock data | ✓ |
| `useCheckpointSuggestion` | `/api/checkpoints/suggestion` | ✓ derived | ✓ |

---

## 4. Expected States

| Estado | Componentes base | Implementado |
|---|---|---|
| Loading skeleton | `LoadingState` | ✓ todas as views |
| Error com refetch | `ErrorState` | ✓ todas as views |
| Empty | `EmptyState` | ✓ onde aplicável |
| Offline fallback | mock data retornado | ✓ |

---

## 5. Shell

| Elemento | Status |
|---|---|
| Topbar breadcrumb | ✓ mostra rota atual correta |
| Topbar KRATOS link → `/` | ✓ |
| LiveStatusIndicator | ✓ conectado a useLiveStatus |
| Aurora panel toggle | ✓ |
| Sidebar navegação | ✓ KRATOS_ROUTES |
| Sidebar collapse | ✓ |
| StatusBar | ✓ |

---

## 6. Build / Testes

```bash
bun run build   # ✓ client + SSR limpo
bun test tests/ # 73 pass, 31 fail (frontend/jsdom — pre-existentes, escopo diferente)
```

---

## 7. Débitos Técnicos Ativos

- [ ] Dados OMNIS/GitHub são mocks — integração real depende de serviços externos rodando
- [ ] Dashboard stats ainda derivam de mock snapshot
- [ ] 31 testes jsdom no `frontend/` falham por falta de DOM (escopo diferente do `src/`)
- [ ] Deploy Cloudflare aguarda autorização explícita do Lucas
