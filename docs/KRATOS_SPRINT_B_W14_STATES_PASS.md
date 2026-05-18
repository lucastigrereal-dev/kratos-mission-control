# KRATOS Sprint B W14 — States Pass Audit

**Date:** 2026-05-17
**Wave:** B14

## State Coverage by View

| View | Loading | Empty | Error | Stale | Missing Config |
|---|---|---|---|---|---|
| DashboardView | `LoadingState` (full page) | Inline `?? []` defaults | Silently absorbed → UI shows 0s | `SourceBadgeIndicator` | GithubConfig badge |
| ContextoView | `LoadingState` (full page) | `EmptyState` (browser tabs) | `ErrorState` + retry btn | `SourceBadgeIndicator` | N/A (always mock) |
| SistemaView | Per-section `LoadingState` | Per-section `EmptyState` | Per-section `ErrorState` | N/A | OmnisConfig + GithubConfig badges |
| AgoraView | `LoadingState` | `EmptyState` + create CTA | `ErrorState` + retry | N/A | N/A |
| AgendaView | `LoadingState` | `EmptyState` | `ErrorState` + retry | N/A | N/A |
| CheckpointsView | `LoadingState` | `EmptyState` + CTA | `ErrorState` + retry | N/A | N/A |
| ProjetosView | `LoadingState` | `EmptyState` + CTA | `ErrorState` + retry | N/A | N/A |

## New States Added in Sprint B
- SourceBadgeIndicator on DashboardView, ContextoView
- Worker health status badge on SistemaView
- GitHub/OMNIS config missing badges on DashboardView and SistemaView
- `useContextoMissionSnapshot()` added alongside existing `useContextSnapshot()` on ContextoView

## Pattern Consistency
- All views use shared base components: `LoadingState`, `EmptyState`, `ErrorState`
- All views handle `isLoading` → Loading, `isError` → Error, empty data → Empty
- No custom inline loading spinners — all use component library
