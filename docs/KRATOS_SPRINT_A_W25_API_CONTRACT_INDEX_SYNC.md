# KRATOS Sprint A W25 — API Contract Index Sync

**Date:** 2026-05-17
**Wave:** A25

## Contract Inventory

| File | Type | Consumers |
|---|---|---|
| `appointment.schema.ts` | Domain schema | `useAppointments`, `appointment-server-fns` |
| `checkpoint.schema.ts` | Domain schema | `useCheckpoints`, `useCheckpointSuggestion`, `checkpoint-server-fns` |
| `contexto.schema.ts` | Domain schema | `useContexto`, `contexto-server-fns` |
| `dashboard.schema.ts` | Aggregation schema | `dashboard-server-fns` |
| `error-taxonomy.ts` | Cross-cutting | `github-provider`, `omnis-provider`, `dashboard-server-fns`, `contexto-server-fns`, `health-server-fns` |
| `github.schema.ts` | Integration schema | `useGithub`, `github-server-fns`, `github-provider` |
| `omnis.schema.ts` | Integration schema | `useOmnis`, `omnis-server-fns`, `omnis-provider` |
| `project.schema.ts` | Domain schema | `useProjects`, `project-server-fns` |
| `service.schema.ts` | Domain schema | `useServices`, `service-server-fns`, `dashboard-server-fns` |
| `source-badge.schema.ts` | Meta schema | `dashboard-server-fns`, `contexto-server-fns` |

## Cross-Reference Verdict
- **10 schema files** — all actively consumed
- **0 orphaned schemas**
- **0 un-contracted API endpoints**
- Documentation files: `KRATOS_API_CONTRACT_V1.md`, `collector-envelope.schema.json`, `live.snapshot.schema.json`, `live.stream.schema.md` — static references, not code-imported

## Contract Coverage by Layer
| Layer | Schemas Consumed |
|---|---|
| Server functions (8 files) | 8 schemas |
| Providers (2 files) | 3 schemas |
| Hooks (10 files) | 7 schemas |
