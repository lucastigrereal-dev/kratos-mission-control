import { z } from "zod";

export const OmnisServiceStatusSchema = z.object({
  nome: z.string(),
  status: z.enum(["healthy", "degraded", "down"]),
  porta: z.number().int().optional(),
  uptime: z.string().optional(),
});

export const OmnisCrewSchema = z.object({
  nome: z.string(),
  descricao: z.string().optional(),
  ultimaExecucao: z.string().datetime().optional(),
  status: z.enum(["idle", "running", "failed"]),
  jobsConcluidos: z.number().int().min(0),
  taxaSucesso: z.number().min(0).max(1),
});

export const OmnisJobSchema = z.object({
  id: z.string(),
  tipo: z.string(),
  status: z.enum(["queued", "running", "done", "failed", "needs_review"]),
  criadoEm: z.string().datetime(),
  duracaoSegundos: z.number().min(0).optional(),
  outputTipo: z.string().optional(),
});

export const OmnisMemoryStatsSchema = z.object({
  totalDocs: z.number().int().min(0),
  totalChunks: z.number().int().min(0),
  dominios: z.number().int().min(0),
});

export const OmnisStatusSchema = z.object({
  servicos: z.array(OmnisServiceStatusSchema),
  crews: z.array(OmnisCrewSchema),
  jobsRecentes: z.array(OmnisJobSchema),
  memoria: OmnisMemoryStatsSchema,
  atualizadoEm: z.string().datetime(),
  test_count: z.number().int().min(0).optional(),
});

export type OmnisServiceStatus = z.infer<typeof OmnisServiceStatusSchema>;
export type OmnisCrew = z.infer<typeof OmnisCrewSchema>;
export type OmnisJob = z.infer<typeof OmnisJobSchema>;
export type OmnisMemoryStats = z.infer<typeof OmnisMemoryStatsSchema>;
export type OmnisStatus = z.infer<typeof OmnisStatusSchema>;
