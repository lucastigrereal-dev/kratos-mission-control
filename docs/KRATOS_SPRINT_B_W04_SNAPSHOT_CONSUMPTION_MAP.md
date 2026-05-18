# KRATOS Sprint B W04 — Snapshot Consumption Map

**Date:** 2026-05-17
**Wave:** B04

## View → Hook → Endpoint → Fallback Matrix

| View | Hook(s) | Server Function | Fallback | Error Pattern |
|---|---|---|---|---|
| DashboardView | `useDashboard()` | `getCheckpoints`, `getProjects`, `getAppointments`, `getContextSnapshot` | `?? []` / `?? null` | Silently absorbed |
| DashboardView | `useTrackedRepos()` | `getTrackedRepos` | `?? []` | React Query isError |
| DashboardView | `useGithubRepo(owner, repo)` | `getGithubRepo` | enabled guard | React Query isError |
| ContextoView | `useContextSnapshot()` | `getContextSnapshot` | `?? null`, auto-poll 30s | `isError` + retry |
| SistemaView | `useServices()` | `getServicesHealth` | `?? []`, auto-poll 30s | `isError` + retry |
| SistemaView | `useOmnisStatus/Crews/Jobs()` | `fetchOmnisStatus/Crews/Jobs` | React Query default | `isError` per section |
| CheckpointsView | `useCheckpoints()` + CRUD | `getCheckpoints` + mutations | `?? []` | `isError` + retry |
| ProjetosView | `useProjects()` + CRUD | `getProjects` + mutations | `?? []` | `isError` + retry |
| AgendaView | `useAppointments()` + CRUD | `getAppointments` + mutations | `?? []` | `isError` + retry |
| AgoraView | `useCheckpoints` + `useAppointments` + `useLiveStatus` | Same as above | Various | `isError` + retry |

## Two Fallback Patterns

**Pattern A (custom wrapper):** Dashboard, Contexto, Services
- Returns custom object with `isLoading`, `isError`, `error`, `refetch`
- Error from `query.data?.error` (server-side), not React Query boundary

**Pattern B (raw React Query):** Checkpoints, Projects, Appointments, Omnis, Github
- Returns raw `UseQueryResult` / `UseMutationResult`
- Server errors thrown as `new Error(result.error)`, caught by React Query

## Composition Hooks (no direct server call)
- `useDashboard()` — orchestrates 4 queries, computes aggregates
- `useCheckpointSuggestion()` — reads `useCheckpoints` + `useProjects`
- `useLiveStatus()` — reads `useServices` + `useOmnisStatus`

## Sprint B Wiring Target
- `useDashboard` should consume `getDashboardSnapshot` (single aggregated query instead of 4 separate)
- `useContextSnapshot` already consumes `getContextSnapshot` — add `getContextoSnapshot` awareness
- `SistemaView` can add `getWorkerHealth` for live health badge
- `SourceBadgeMeta` not surfaced in any view yet
