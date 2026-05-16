# Skill: api-contract-sync

Mantém consistência entre schemas Zod do servidor e do cliente.

## Template de schema

```ts
// api-contract/checkpoint.schema.ts
import { z } from 'zod'

export const CheckpointSchema = z.object({
  id: z.string().uuid(),
  projetoId: z.string().uuid().optional(),
  titulo: z.string().min(1).max(200),
  progresso: z.number().min(0).max(100).default(0),
  status: z.enum(['planejado', 'em_andamento', 'concluido', 'cancelado']).default('planejado'),
  deadline: z.string().datetime().optional(),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
})

export const CreateCheckpointSchema = CheckpointSchema.omit({ id: true, criadoEm: true, atualizadoEm: true })
export const UpdateCheckpointSchema = CreateCheckpointSchema.partial()

export type Checkpoint = z.infer<typeof CheckpointSchema>
export type CreateCheckpoint = z.infer<typeof CreateCheckpointSchema>
export type UpdateCheckpoint = z.infer<typeof UpdateCheckpointSchema>
```

## Checklist
- [ ] Schema criado em api-contract/
- [ ] Endpoint Hono usa schema para validar entrada
- [ ] Hook TanStack Query usa tipos exportados
- [ ] Mock data segue formato do schema
