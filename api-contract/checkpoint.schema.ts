import { z } from "zod";

export const CheckpointStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "blocked",
  "cancelled",
]);

export const CheckpointSchema = z.object({
  id: z.string().uuid(),
  projetoId: z.string().uuid().nullable(),
  titulo: z.string().min(1).max(200),
  descricao: z.string().max(2000).optional(),
  progresso: z.number().min(0).max(100),
  status: CheckpointStatusSchema,
  deadline: z.string().datetime().nullable(),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

export const CreateCheckpointSchema = z.object({
  titulo: z.string().min(1).max(200),
  descricao: z.string().max(2000).optional(),
  projetoId: z.string().uuid().nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
});

export const UpdateCheckpointSchema = z.object({
  titulo: z.string().min(1).max(200).optional(),
  descricao: z.string().max(2000).optional(),
  progresso: z.number().min(0).max(100).optional(),
  status: CheckpointStatusSchema.optional(),
  projetoId: z.string().uuid().nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
});

export type CheckpointStatus = z.infer<typeof CheckpointStatusSchema>;
export type Checkpoint = z.infer<typeof CheckpointSchema>;
export type CreateCheckpoint = z.infer<typeof CreateCheckpointSchema>;
export type UpdateCheckpoint = z.infer<typeof UpdateCheckpointSchema>;
