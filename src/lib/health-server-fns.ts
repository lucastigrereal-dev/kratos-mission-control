import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServicesHealthSummary } from "../../backend/services/store";
import type { ApiError } from "../../api-contract/error-taxonomy";

const HealthCheckSchema = z.object({
  status: z.enum(["ok", "degraded", "error"]),
  service: z.string(),
  version: z.string(),
  uptime: z.string().optional(),
  checks: z.object({
    services: z.object({
      total: z.number().int(),
      healthy: z.number().int(),
      degraded: z.number().int(),
    }),
  }),
  updated_at: z.string().datetime(),
});

type HealthCheck = z.infer<typeof HealthCheckSchema>;

interface HealthEnvelope {
  data: HealthCheck | null;
  error: ApiError | null;
}

export const getWorkerHealth = createServerFn({ method: "GET" })
  .handler(async (): Promise<HealthEnvelope> => {
    try {
      const svc = getServicesHealthSummary();
      const payload: HealthCheck = {
        status: svc.offline > 0 ? "error" : svc.degraded > 0 ? "degraded" : "ok",
        service: "kratos-mission-control",
        version: "0.10.0",
        checks: {
          services: {
            total: svc.total,
            healthy: svc.live,
            degraded: svc.degraded,
          },
        },
        updated_at: new Date().toISOString(),
      };
      return { data: HealthCheckSchema.parse(payload), error: null };
    } catch (e) {
      return {
        data: null,
        error: {
          code: "internal_error",
          message: e instanceof Error ? e.message : "Health check falhou",
        },
      };
    }
  });
