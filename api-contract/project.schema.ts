/**
 * project.schema.ts
 *
 * Two layers:
 *  1. TypeScript store schema (Project, CreateProject, UpdateProject) — Portuguese field names,
 *     used by project-server-fns.ts + useProjects() CRUD hook.
 *  2. Python API envelope schema (ProjectAPIItem, ProjectEnvelopeSchema) — W2-B2,
 *     used by useProjectsAPI() hook + IslandCard. Matches GET /projects response.
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Layer 2 — Python backend envelope (W2)
// ─────────────────────────────────────────────────────────────────────────────

export const ProjectAPIItemSchema = z.object({
  id:            z.string(),
  name:          z.string(),
  description:   z.string().default(""),
  type:          z.string().default("product"),
  status:        z.string().default("active"),
  phase:         z.string().default(""),
  priority:      z.string().default("medium"),
  repo_path:     z.string().default(""),
  next_action:   z.string().default(""),
  deadline:      z.string().default(""),
  last_activity: z.string().default(""),
  risk_level:    z.string().default("low"),
  outputs_count: z.number().default(0),
  created_at:    z.string(),
  updated_at:    z.string(),
});

export type ProjectAPIItem = z.infer<typeof ProjectAPIItemSchema>;

export const ProjectDataSourceSchema = z.enum(["live", "mock", "cached", "fallback"]);
export type ProjectDataSource = z.infer<typeof ProjectDataSourceSchema>;

export const ProjectEnvelopeSchema = z.object({
  data:      z.array(ProjectAPIItemSchema),
  source:    ProjectDataSourceSchema,
  source_ts: z.string(),
});

export type ProjectEnvelope = z.infer<typeof ProjectEnvelopeSchema>;

/** Item shown in the projects IslandCard. */
export interface ProjectIslandItem {
  id: string;
  name: string;
  riskLevel: string;
}

/** Shape returned by useProjectsAPI() and consumed by IslandCard. */
export interface ProjectsIslandResult {
  active: ProjectIslandItem[];   // top 5 active projects, by updated_at desc
  activeCount: number;
  totalCount: number;
  source: ProjectDataSource;
  sourceTs: string | null;
}

/** Convert Python API envelope to IslandCard shape. */
export function projectEnvelopeToIslandData(envelope: ProjectEnvelope): ProjectsIslandResult {
  const active = envelope.data
    .filter((p) => p.status === "active" || p.status === "running")
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      riskLevel: p.risk_level,
    }));

  return {
    active,
    activeCount: envelope.data.filter((p) => p.status === "active" || p.status === "running").length,
    totalCount: envelope.data.length,
    source:    envelope.source,
    sourceTs:  envelope.source_ts ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer 1 — TypeScript store schema (CRUD via project-server-fns.ts)
// ─────────────────────────────────────────────────────────────────────────────

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
