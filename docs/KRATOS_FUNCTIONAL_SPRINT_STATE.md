# KRATOS Functional Sprint — Canonical State

**Data:** 2026-05-16
**Branch:** `main`
**Commit base:** `169264c` — feat(kratos): phase 4 — UI integration layer (OMNIS + GitHub display)

---

## 1. App ativo

KRATOS funcional em `src/` — **NÃO** é o Visual MVP em `frontend/`.

| Aspecto | Valor |
|---|---|
| Working directory | `C:\Users\lucas\kratos-mission-control` |
| Package name | `tanstack_start_ts` |
| React | 19.2.0 |
| Vite | 7.3.2 |
| Router | TanStack Router (file-based) |
| Build | `bun run build` (client + SSR) |
| Tests | `bun test tests/` (61 pass, 0 fail) |
| Deploy target | Cloudflare Workers |

---

## 2. Estrutura de rotas (8 arquivos)

| Rota | Arquivo | View Component |
|---|---|---|
| `/` | `src/routes/index.tsx` | `DashboardView` |
| `/agora` | `src/routes/agora.tsx` | `AgoraView` |
| `/agenda` | `src/routes/agenda.tsx` | `AgendaView` |
| `/checkpoints` | `src/routes/checkpoints.tsx` | `CheckpointsView` |
| `/projetos` | `src/routes/projetos.tsx` | `ProjetosView` |
| `/contexto` | `src/routes/contexto.tsx` | `ContextoView` |
| `/sistema` | `src/routes/sistema.tsx` | `SistemaView` |
| `__root` | `src/routes/__root.tsx` | AppShell layout |

---

## 3. Views (8 componentes)

`src/components/kratos/views/`:
- `DashboardView.tsx` — visão consolidada com stats + quick links + GitHub section
- `AgoraView.tsx` — foco do momento presente
- `AgendaView.tsx` — calendário e compromissos
- `CheckpointsView.tsx` — marcos e metas
- `ProjetosView.tsx` — projetos ativos
- `ContextoView.tsx` — contexto pessoal
- `SistemaView.tsx` — saúde dos serviços (KRATOS + OMNIS)
- `PlaceholderRoute.tsx` — fallback genérico

---

## 4. Hooks (10 arquivos)

`src/hooks/`:
- `useApi.ts` — cliente HTTP base
- `useDashboard.ts` — agregação do dashboard
- `useCheckpoints.ts` — checkpoints via TanStack Query
- `useProjects.ts` — projetos via TanStack Query
- `useAppointments.ts` — compromissos via TanStack Query
- `useContexto.ts` — contexto pessoal
- `useServices.ts` — serviços KRATOS
- `useGithub.ts` — GitHub API (useGithubRepo, useTrackedRepos)
- `useOmnis.ts` — OMNIS bridge (useOmnisStatus, useOmnisHealth, useOmnisCrews, useOmnisJobs)
- `use-mobile.tsx` — detecção de viewport

---

## 5. Backend stores (8 arquivos)

`backend/`:
- `checkpoints/store.ts`
- `projects/store.ts`
- `appointments/store.ts`
- `services/store.ts`
- `contexto/store.ts`
- `github/store.ts` — GitHub API + mock fallback
- `omnis/store.ts` — OMNIS mock data (8 services, 5 crews, 4 jobs)
- `lib/store-adapter.ts` — `createMapRepository<T, C, U>` factory

---

## 6. Server functions (7 arquivos)

`src/lib/`:
- `checkpoint-server-fns.ts`
- `project-server-fns.ts`
- `appointment-server-fns.ts`
- `service-server-fns.ts`
- `contexto-server-fns.ts`
- `github-server-fns.ts`
- `omnis-server-fns.ts`

---

## 7. Sistema display components (5 arquivos)

`src/components/kratos/sistema/`:
- `ServiceHealthCard.tsx`
- `OmnisServiceStatusCard.tsx`
- `OmnisCrewCard.tsx`
- `OmnisJobItem.tsx`
- `GithubRepoCard.tsx`

---

## 8. Base components (9 arquivos)

`src/components/kratos/base/`:
- `AlertBadge.tsx`, `EmptyState.tsx`, `ErrorState.tsx`, `LiveStatusIndicator.tsx`
- `LoadingState.tsx`, `SectionHeader.tsx`, `StatusCard.tsx`, `StatusDot.tsx`, `SystemCard.tsx`

---

## 9. Testes

| Suite | Arquivo | Testes |
|---|---|---|
| Checkpoint store | `tests/stores/checkpoint-store.test.ts` | 14 |
| Project store | `tests/stores/project-store.test.ts` | 14 |
| Appointment store | `tests/stores/appointment-store.test.ts` | 13 |
| GitHub store | `tests/stores/github-store.test.ts` | 8 |
| OMNIS store | `tests/stores/omnis-store.test.ts` | 11 |
| **Total** | | **61 pass / 0 fail** |

---

## 10. Guardrails ativos

- **Visual MVP (`frontend/`)** é referência visual — NÃO será editado neste sprint
- **OMNIS App Factory** está fora do escopo
- Componentes protegidos: AppShell, Topbar, Sidebar, StatusBar, AuroraPanel, styles.css, routeTree.gen.ts
- Design: zero hex colors, tokens `var(--kratos-*)`, dark mode + mobile 375px
- Deploy: proibido sem autorização explícita
- Push: proibido sem autorização explícita

---

## 11. Build & test commands

```bash
bun run build    # client + SSR (Vite 7)
bun test tests/  # 61 testes de store
bun run dev      # dev server (porta 3000)
```
