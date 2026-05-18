# KRATOS Sprint B — Frontend Snapshot Wiring Summary

**Date:** 2026-05-17
**Wave:** B30

## Hooks Connected (7 new)
| Hook | Server Function | File |
|---|---|---|
| `useContextoMissionSnapshot()` | `getContextoSnapshot` | `useContexto.ts` |
| `useDashboardSnapshot()` | `getDashboardSnapshot` | `useDashboard.ts` |
| `useWorkerHealth()` | `getWorkerHealth` | `useServices.ts` |
| `useGithubConfig()` | `checkGithubConfig` | `useGithub.ts` |
| `useOmnisConfig()` | `checkOmnisConfig` | `useOmnis.ts` |
| `useOmnisReadOnlyGuard()` | (static) | `useOmnis.ts` |

## Views Wired (3)
| View | New Data Sources |
|---|---|
| DashboardView | `useDashboardSnapshot` + `useGithubConfig` + `SourceBadgeIndicator` |
| ContextoView | `useContextoMissionSnapshot` + `SourceBadgeIndicator` |
| SistemaView | `useWorkerHealth` + `useOmnisConfig` + `useGithubConfig` |

## New Components (1)
- `SourceBadgeIndicator` — token-based data source badge with mock/live/partial/stale states

## Tests
- 4 new test files, 27 tests
- Total: 270 pass / 0 fail / 25 files
