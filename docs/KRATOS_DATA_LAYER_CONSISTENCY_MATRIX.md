# KRATOS — Data Layer Consistency Matrix

**Date:** 2026-05-17  
**Wave:** K21  

---

## ENTITY × LAYER MATRIX

| Entity | Schema | Backend Store | Server Fn | Hook | Tests | Status |
|---|---|---|---|---|---|---|
| Checkpoints | `api-contract/checkpoint.schema.ts` | `backend/checkpoints/store.ts` | `src/lib/checkpoint-server-fns.ts` | `useCheckpoints.ts` | ✅ 14 tests | ✅ Complete |
| Projects | `api-contract/project.schema.ts` | `backend/projects/store.ts` | `src/lib/project-server-fns.ts` | `useProjects.ts` | ✅ 14 tests | ✅ Complete |
| Appointments | `api-contract/appointment.schema.ts` | `backend/appointments/store.ts` | `src/lib/appointment-server-fns.ts` | `useAppointments.ts` | ✅ 13 tests | ✅ Complete |
| Contexto | `api-contract/contexto.schema.ts` | `backend/contexto/store.ts` | `src/lib/contexto-server-fns.ts` | `useContexto.ts` | ✅ 16 tests (K09) | ✅ Complete |
| Services | `api-contract/service.schema.ts` | `backend/services/store.ts` | `src/lib/services-server-fns.ts` | `useServices.ts` | ✅ 10 tests (K14) | ✅ Complete |
| GitHub | `api-contract/github.schema.ts` | `backend/github/store.ts` | `src/lib/github-server-fns.ts` | `useGithub.ts` | ✅ 8+8 tests | ✅ Complete |
| OMNIS | `api-contract/omnis.schema.ts` | `backend/omnis/store.ts` | `src/lib/omnis-server-fns.ts` | `useOmnis.ts` | ✅ 11+13 tests | ✅ Complete |
| Dashboard | (no dedicated schema) | (aggregated) | (no dedicated fn) | `useDashboard.ts` | ✅ 14 tests (K11) | ⏳ No schema yet |
| Live Status | `api-contract/live.snapshot.schema.json` | (derived) | — | `useLiveStatus.ts` | ⏳ None | ⚠️ Missing tests |
| Checkpoint Suggest | — | (derived) | — | `useCheckpointSuggestion.ts` | ⏳ None | ⚠️ Missing tests |

---

## SCHEMA FILES INVENTORY

| File | Entities | Zod? |
|---|---|---|
| `checkpoint.schema.ts` | Checkpoint, CheckpointStatus | ✅ |
| `project.schema.ts` | Project, ProjectStatus | ✅ |
| `appointment.schema.ts` | Appointment, AppointmentStatus | ✅ |
| `contexto.schema.ts` | ContextSnapshot, FocusStatus, DriftLevel | ✅ |
| `service.schema.ts` | Service, ServiceHealth | ✅ |
| `github.schema.ts` | GithubRepoStatus, GithubPR, GithubCommit | ✅ |
| `omnis.schema.ts` | OmnisStatus, OmnisCrew, OmnisJob, etc. | ✅ |
| `source-badge.schema.ts` | SourceBadgeMeta, DataSource, DataOrigin | ✅ (K12) |
| `error-taxonomy.ts` | ApiErrorCode | ✅ (K19) |
| `live.snapshot.schema.json` | LiveSnapshot (JSON Schema) | ⚠️ JSON only |
| `collector-envelope.schema.json` | CollectorEnvelope (JSON Schema) | ⚠️ JSON only |

---

## GAPS IDENTIFIED

| Gap | Severity | Action |
|---|---|---|
| No `dashboard.schema.ts` | Medium | Create in next phase |
| `live.snapshot.schema.json` is JSON only | Low | Port to Zod if used |
| `useLiveStatus` has no tests | Medium | Add in K22 |
| `useCheckpointSuggestion` has no tests | Low | Add if logic is complex |
| No `_reset()` in checkpoints/projects/appointments stores | Low | They use seeding pattern |

---

## TEST COVERAGE TOTALS (K21 checkpoint)

| Source | Tests |
|---|---|
| checkpoint-store.test.ts | 14 |
| project-store.test.ts | 14 |
| appointment-store.test.ts | 13 |
| github-store.test.ts | 8 |
| github-token-safety.test.ts | 8 |
| omnis-store.test.ts | 11 |
| omnis-readonly-fallback.test.ts | 13 |
| contexto-snapshot.test.ts | 16 |
| dashboard-snapshot.test.ts | 14 |
| services-health.test.ts | 10 |
| api-envelope.test.ts | 4 |
| kratos-routes.test.ts | 8 |
| route-smoke.test.ts | 16 |
| backend-regression.test.ts | 10 |
| **TOTAL** | **160** |
