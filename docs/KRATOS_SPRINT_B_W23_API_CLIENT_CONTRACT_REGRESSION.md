# KRATOS Sprint B W23 — API Client Contract Regression

**Date:** 2026-05-17
**Wave:** B23

## Tests Added in Sprint B

| Test File | Tests | Covers |
|---|---|---|
| `contexto-mission-snapshot.test.ts` | 10 | ContextoSnapshotData + SourceBadgeMeta + refresh |
| `dashboard-snapshot-hook.test.ts` | 6 | DashboardSnapshotData + SourceBadgeMeta envelope |
| `worker-health-hook.test.ts` | 5 | HealthCheck contract + status derivation |
| `provider-config-hooks.test.ts` | 6 | checkGithubConfig + checkOmnisConfig |

## Total
- 270 tests across 25 files
- All 8 error taxonomy codes covered
- All 4 new Sprint A server functions tested via hook contracts
- SourceBadgeMeta validated across contexto + dashboard + providers
