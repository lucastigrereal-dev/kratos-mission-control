import { z } from "zod";

export const OmnisHealthCheckSchema = z.object({
  name: z.string(),
  score: z.number().int().min(0),
  max_score: z.number().int().min(0),
  status: z.enum(["ok", "warn", "fail", "skip"]),
  detail: z.string().optional(),
});

export const OmnisHealthScoreSchema = z.object({
  score: z.number().int().min(0).max(100),
  color: z.enum(["green", "yellow", "red"]),
  generated_at: z.string(),
  checks: z.array(OmnisHealthCheckSchema).default([]),
});

export const OmnisHealthEnvelopeSchema = z.object({
  data: OmnisHealthScoreSchema.nullable(),
  source: z.enum(["live", "error"]),
  log_path: z.string().optional(),
});

export type OmnisHealthCheck = z.infer<typeof OmnisHealthCheckSchema>;
export type OmnisHealthScore = z.infer<typeof OmnisHealthScoreSchema>;
export type OmnisHealthEnvelope = z.infer<typeof OmnisHealthEnvelopeSchema>;
