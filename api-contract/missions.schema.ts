import { z } from "zod";

export const MissionSummarySchema = z.object({
  mission_id: z.string(),
  title: z.string(),
  sector: z.string(),
  status: z.enum(["draft", "running", "paused", "completed", "failed", "cancelled"]),
  current_step: z.string().nullable().optional(),
  retry_count: z.number().int().min(0).default(0),
  checkpoint_id: z.string().nullable().optional(),
  checkpoint_label: z.string().nullable().optional(),
  cumulative_cost_usd: z.number().min(0).default(0),
  last_event_type: z.string().nullable().optional(),
  last_event_label: z.string().optional(),
  last_event_at: z.string().nullable().optional(),
  error_count: z.number().int().min(0).default(0),
  last_error: z.string().nullable().optional(),
  event_count: z.number().int().min(0).default(0),
});

export const MissionsEnvelopeSchema = z.object({
  data: z.array(MissionSummarySchema),
  total: z.number().int().min(0),
  source: z.enum(["live", "empty"]),
  missions_dir: z.string().optional(),
});

export type MissionSummary = z.infer<typeof MissionSummarySchema>;
export type MissionsEnvelope = z.infer<typeof MissionsEnvelopeSchema>;
