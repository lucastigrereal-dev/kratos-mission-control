import { z } from "zod";

export const MissionRunSchema = z.object({
  run_id: z.string(),
  command: z.string(),
  module: z.string().optional(),
  status: z.enum(["success", "error", "running", "pending"]),
  started_at: z.string(),
  finished_at: z.string().optional(),
  duration_ms: z.number().optional(),
  inputs: z.record(z.unknown()).optional(),
  outputs: z.record(z.unknown()).optional(),
  warnings: z.array(z.string()).default([]),
  errors: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional(),
});

export const MissionRunsEnvelopeSchema = z.object({
  data: z.array(MissionRunSchema),
  total: z.number().int().min(0),
  source: z.enum(["live", "empty", "error"]),
  log_path: z.string().optional(),
});

export type MissionRun = z.infer<typeof MissionRunSchema>;
export type MissionRunsEnvelope = z.infer<typeof MissionRunsEnvelopeSchema>;
