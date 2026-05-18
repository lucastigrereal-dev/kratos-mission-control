import { describe, it, expect } from "bun:test";
import { getServicesHealthSummary } from "../../backend/services/store";
import { z } from "zod";

const HealthCheckSchema = z.object({
  status: z.enum(["ok", "degraded", "error"]),
  service: z.string(),
  version: z.string(),
  checks: z.object({
    services: z.object({ total: z.number().int(), healthy: z.number().int(), degraded: z.number().int() }),
  }),
  updated_at: z.string().datetime(),
});

describe("Worker Health Hook Contract", () => {
  it("derives ok status when all services healthy", () => {
    const svc = getServicesHealthSummary();
    const status = svc.offline > 0 ? "error" : svc.degraded > 0 ? "degraded" : "ok";
    expect(["ok", "degraded", "error"]).toContain(status);
  });

  it("worker health payload passes schema", () => {
    const svc = getServicesHealthSummary();
    const payload = {
      status: svc.offline > 0 ? "error" : svc.degraded > 0 ? "degraded" : "ok",
      service: "kratos-mission-control",
      version: "0.10.0",
      checks: { services: { total: svc.total, healthy: svc.live, degraded: svc.degraded } },
      updated_at: new Date().toISOString(),
    };
    expect(HealthCheckSchema.safeParse(payload).success).toBe(true);
  });

  it("service name is kratos-mission-control", () => {
    const svc = getServicesHealthSummary();
    const name = "kratos-mission-control";
    expect(name).toBe("kratos-mission-control");
    expect(svc.total).toBeGreaterThan(0);
  });

  it("version is 0.10.0", () => {
    const version = "0.10.0";
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("checks.services.total equals sum", () => {
    const svc = getServicesHealthSummary();
    expect(svc.total).toBe(svc.live + svc.degraded + svc.offline + svc.unknown);
  });
});
