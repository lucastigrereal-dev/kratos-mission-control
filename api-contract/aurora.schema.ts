import { z } from "zod";

// Schema para o campo aurora_insight escrito pelo OMNIS no state.json.
// OMNIS pensa via Ollama, escreve aqui. KRATOS lê e espelha — nunca inventa.
export const AuroraInsightSchema = z.object({
  text: z.string(),
  generated_at: z.string(),
  source: z.enum(["omnis_ollama", "omnis_fallback", "manual"]),
  confidence: z.enum(["high", "medium", "low"]).optional(),
  focus_recommendation: z.string().optional(),
});

export const AuroraInsightEnvelopeSchema = z.object({
  data: AuroraInsightSchema.nullable(),
  source: z.enum(["live", "error"]),
  state_path: z.string().optional(),
});

export type AuroraInsight = z.infer<typeof AuroraInsightSchema>;
export type AuroraInsightEnvelope = z.infer<typeof AuroraInsightEnvelopeSchema>;
