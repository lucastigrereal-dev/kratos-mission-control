import { z } from "zod";

export const AgenciaProximoSlotSchema = z.object({
  date: z.string(),
  time: z.string(),
  account: z.string().nullable().optional(),
  objective: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

export const AgenciaQueueSummarySchema = z.object({
  total: z.number().int().min(0),
  por_status: z.record(z.string(), z.number()),
  proximo_slot: AgenciaProximoSlotSchema.nullable(),
});

export const AgenciaQueueEnvelopeSchema = z.object({
  data: AgenciaQueueSummarySchema.nullable(),
  source: z.enum(["live", "error"]),
  queue_path: z.string().optional(),
});

export type AgenciaProximoSlot = z.infer<typeof AgenciaProximoSlotSchema>;
export type AgenciaQueueSummary = z.infer<typeof AgenciaQueueSummarySchema>;
export type AgenciaQueueEnvelope = z.infer<typeof AgenciaQueueEnvelopeSchema>;
