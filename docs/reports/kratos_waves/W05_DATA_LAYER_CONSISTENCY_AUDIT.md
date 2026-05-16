# W05 — Data Layer Consistency Audit

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE (sem alterações de código)

---

## Objetivo

Auditar consistência da camada de dados em todas as 5 entidades:
schema → store → server-fn → hook → UI.

---

## Resultado por entidade

### Checkpoint ✅
| Camada | Arquivo | Tipos |
|---|---|---|
| Schema | `api-contract/checkpoint.schema.ts` | Checkpoint, CreateCheckpoint, UpdateCheckpoint |
| Store | `backend/checkpoints/store.ts` | Importa tipos do schema |
| Server-fn | `src/lib/checkpoint-server-fns.ts` | CreateCheckpointSchema + UpdateCheckpointSchema.extend({id}) |
| Hook | `src/hooks/useCheckpoints.ts` | useQuery<Checkpoint[]>, mutations tipadas |
| UI | `CheckpointsView.tsx` | Consome useCheckpoints(), useCreateCheckpoint(), useDeleteCheckpoint() |

### Project ✅
| Camada | Arquivo | Tipos |
|---|---|---|
| Schema | `api-contract/project.schema.ts` | Project, CreateProject, UpdateProject |
| Store | `backend/projects/store.ts` | Importa tipos do schema |
| Server-fn | `src/lib/project-server-fns.ts` | CreateProjectSchema + UpdateProjectSchema.extend({id}) |
| Hook | `src/hooks/useProjects.ts` | useQuery<Project[]>, mutations tipadas |
| UI | `ProjetosView.tsx` | Consome useProjects(), useCreateProject(), useDeleteProject() |

### Appointment ✅
| Camada | Arquivo | Tipos |
|---|---|---|
| Schema | `api-contract/appointment.schema.ts` | Appointment, CreateAppointment, UpdateAppointment |
| Store | `backend/appointments/store.ts` | Importa tipos do schema |
| Server-fn | `src/lib/appointment-server-fns.ts` | CreateAppointmentSchema + UpdateAppointmentSchema.extend({id}) |
| Hook | `src/hooks/useAppointments.ts` | useQuery<Appointment[]>, mutations tipadas |
| UI | `AgendaView.tsx` | Consome useAppointments() |

### Contexto ✅
| Camada | Arquivo | Tipos |
|---|---|---|
| Schema | `api-contract/contexto.schema.ts` | ContextSnapshot |
| Store | `backend/contexto/store.ts` | getLatest(), refresh() |
| Server-fn | `src/lib/contexto-server-fns.ts` | SafeParse via ContextSnapshotSchema |
| Hook | `src/hooks/useContexto.ts` | useContextSnapshot() com refetchInterval 30s |
| UI | `ContextoView.tsx` | Consome useContextSnapshot() |

### Service ✅
| Camada | Arquivo | Tipos |
|---|---|---|
| Schema | `api-contract/service.schema.ts` | Service, ServiceHealth |
| Store | `backend/services/store.ts` | getServices() |
| Server-fn | `src/lib/service-server-fns.ts` | SafeParse via ServiceSchema.array() |
| Hook | `src/hooks/useServices.ts` | useServices() com refetchInterval 30s |
| UI | `sistema.tsx` | Consome useServices() |

---

## Padrão de consistência

Todas as 5 entidades seguem o mesmo padrão:
1. Schema Zod define tipos e validação em `api-contract/`
2. Store in-memory (`Map<string, T>`) com seed data em `backend/*/store.ts`
3. Server functions com inputValidator no `src/lib/*-server-fns.ts`
4. React Query hooks com staleTime + queryKeys no `src/hooks/use*.ts`
5. Views consomem hooks com estados loading/empty/error

---

## Issues encontrados

Nenhum. Zero inconsistências de tipo, zero imports quebrados,
zero divergências entre schema e implementação.

---

## Dashboard cross-entity

`src/hooks/useDashboard.ts` agrega 4 queries paralelas:
- useCheckpoints, useProjects, useAppointments, useContextSnapshot
- Tipos derivados corretamente de cada schema fonte
