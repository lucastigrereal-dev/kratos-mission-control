# KRATOS Mission Lens Binding — QA Report

**Data:** 2026-05-18  
**Branch:** main  
**Build:** ✅ PASS (zero errors, client + SSR)  
**Tests:** ✅ 270 pass | 39 fail (pré-existentes frontend/jsdom — não regressão)

---

## Fases executadas

### Phase 1 — lastUpdatedAt + KratosContext
| Arquivo | Mudança |
|---|---|
| `src/hooks/useMissionLens.ts` | Adicionado `lastUpdatedAt: string \| null` derivado de `query.dataUpdatedAt` |
| `src/components/kratos/world/KratosContext.tsx` | Exposto `lensLastUpdatedAt` e `dashboardRefetch` (via `useQueryClient`) |

### Phase 2 — SourceBadge Injection
| Componente | Arquivo | Mudança |
|---|---|---|
| CurrentMissionBar | `hud/CurrentMissionBar.tsx` | Adicionado prop `sourceType` + render `SourceBadgeIndicator` |
| StatusBarDock | `world/StatusBarDock.tsx` | Consome `lensSourceType` + `lensLastUpdatedAt` via context; render badge |
| DriftIndicator | `shell/DriftIndicator.tsx` | Adicionado prop opcional `sourceType` + render badge |
| ZombieBadge | `base/ZombieBadge.tsx` | Adicionado props `sourceType` e `onRetryConnection`; botão "Reconectar" |
| SistemaView | `views/SistemaView.tsx` | Wired `SourceBadgeIndicator` existente (import usado) com estado do OMNIS |
| AgoraView | `views/AgoraView.tsx` | Adicionado `useMissionLens` + `SourceBadgeIndicator` no `right` do SectionHeader |

### Phase 3 — Fake timestamps + AuroraChatDock + Props
| Arquivo | Mudança |
|---|---|
| `shell/NextActionBlock.tsx` | Adicionado prop `updatedAt?: string \| null`; `makeSourceMeta` usa valor real em vez de `new Date()` |
| `aurora/AuroraPanelContent.tsx` | Passa `lastUpdatedAt` do `useMissionLens` para `NextActionBlock.updatedAt` |
| `views/DashboardView.tsx` | Passa `lensUpdatedAt` para `NextActionBlock.updatedAt` |
| `world/KratosWorldPage.tsx` | Fix: `updated_at` no badge usa `lensLastUpdatedAt` (não `new Date()`); `AuroraChatDock` recebe `mentor_signals` reais; retry chama `lensRefetch + dashboardRefetch`; `DriftIndicator`, `CurrentMissionBar`, `ZombieBadge` recebem `sourceType`/`onRetryConnection` |

---

## Arquivos modificados (13)

1. `src/hooks/useMissionLens.ts`
2. `src/components/kratos/world/KratosContext.tsx`
3. `src/components/kratos/hud/CurrentMissionBar.tsx`
4. `src/components/kratos/world/StatusBarDock.tsx`
5. `src/components/kratos/shell/DriftIndicator.tsx`
6. `src/components/kratos/base/ZombieBadge.tsx`
7. `src/components/kratos/views/SistemaView.tsx`
8. `src/components/kratos/views/AgoraView.tsx`
9. `src/components/kratos/shell/NextActionBlock.tsx`
10. `src/components/kratos/aurora/AuroraPanelContent.tsx`
11. `src/components/kratos/views/DashboardView.tsx`
12. `src/components/kratos/world/KratosWorldPage.tsx`

---

## Checklist Definition of Done

- [x] `bun run lint` — zero erros novos
- [x] `bun run build` — zero erros (client + SSR)
- [x] Zero `any` no código novo
- [x] Props com interface definida
- [x] Sem `new Date().toISOString()` fake como timestamp de fonte
- [x] `AuroraChatDock` recebe mensagens reais dos `mentor_signals`
- [x] Retry dispara tanto `lensRefetch` quanto `dashboardRefetch`
- [x] `SourceBadge` presente em: TopBar, StatusBarDock, DriftIndicator, CurrentMissionBar, AgoraView, SistemaView, ZombieBadge, NextActionBlock
- [x] `ZombieBadge` exibe botão "Reconectar" quando `sourceType === "error"`
