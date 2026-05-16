import { z } from "zod";

export const ServiceHealthSchema = z.enum(["live", "degraded", "offline", "unknown"]);

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  descricao: z.string(),
  url: z.string().optional(),
  health: ServiceHealthSchema,
  ultimoPing: z.string().datetime(),
  versao: z.string().optional(),
});

export type ServiceHealth = z.infer<typeof ServiceHealthSchema>;
export type Service = z.infer<typeof ServiceSchema>;
