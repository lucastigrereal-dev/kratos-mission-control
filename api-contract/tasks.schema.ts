/**
 * tasks.schema.ts — W1-B5
 * Contrato canônico para o endpoint GET /tasks e variantes (/today, /overdue, /unfinished).
 *
 * Envelope: { data: Task[], source: "live"|"mock"|"cached"|"fallback", source_ts: iso }
 * O campo `source` vem do backend e indica a origem dos dados — NUNCA mock disfarçado de live.
 */

import { z } from "zod";

// ── Task item ─────────────────────────────────────────────────────────────────

export const TaskStatusSchema = z.enum([
  "inbox",
  "doing",
  "done",
  "cancelled",
  "blocked",
  "planned",
]);

export const TaskPrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export const TaskSchema = z.object({
  id:          z.string(),
  title:       z.string(),
  project_id:  z.string().default(""),
  status:      z.string().default("inbox"),    // permissivo: backend pode ter outros valores
  priority:    z.string().default("medium"),   // permissivo: idem
  source:      z.string().default("manual"),   // origem DA TAREFA (manual/omnis/...) — não confundir com envelope source
  due_date:    z.string().default(""),
  created_at:  z.string(),
  updated_at:  z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

// ── Envelope ─────────────────────────────────────────────────────────────────

export const TaskDataSourceSchema = z.enum(["live", "mock", "cached", "fallback"]);
export type TaskDataSource = z.infer<typeof TaskDataSourceSchema>;

export const TaskEnvelopeSchema = z.object({
  data:       z.array(TaskSchema),
  source:     TaskDataSourceSchema,
  source_ts:  z.string(),
});

export type TaskEnvelope = z.infer<typeof TaskEnvelopeSchema>;

// ── Frontend derivado: TasksIslandData ───────────────────────────────────────
// Mapeamento do envelope para o formato que IslandCard espera.

export interface TaskIslandItem {
  id: string;
  title: string;
  overdue?: boolean;
}

export interface TasksIslandResult {
  urgent: TaskIslandItem[];
  totalCount: number;
  source: TaskDataSource;
  sourceTs: string | null;
}

/** Converte um TaskEnvelope para o formato consumido pelo IslandCard de tasks. */
export function envelopeToIslandData(envelope: TaskEnvelope): TasksIslandResult {
  const today = new Date().toISOString().split("T")[0];
  const urgent = envelope.data
    .filter((t) => t.status === "doing" || t.priority === "high" || t.priority === "critical")
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      title: t.title,
      overdue: Boolean(t.due_date && t.due_date < today),
    }));

  return {
    urgent,
    totalCount: envelope.data.length,
    source:    envelope.source,
    sourceTs:  envelope.source_ts ?? null,
  };
}
