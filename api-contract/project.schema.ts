import { z } from "zod";

export const ProjectStatusSchema = z.enum([
  "active",
  "paused",
  "completed",
  "archived",
]);

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1).max(100),
  descricao: z.string().max(1000).optional(),
  status: ProjectStatusSchema,
  repo: z.string().max(300).nullable(),
  prioridade: z.number().min(1).max(5),
  ultimaAtividade: z.string().datetime(),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

export const CreateProjectSchema = z.object({
  nome: z.string().min(1).max(100),
  descricao: z.string().max(1000).optional(),
  repo: z.string().max(300).nullable().optional(),
  prioridade: z.number().min(1).max(5).optional(),
});

export const UpdateProjectSchema = z.object({
  nome: z.string().min(1).max(100).optional(),
  descricao: z.string().max(1000).optional(),
  status: ProjectStatusSchema.optional(),
  repo: z.string().max(300).nullable().optional(),
  prioridade: z.number().min(1).max(5).optional(),
  ultimaAtividade: z.string().datetime().optional(),
});

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
