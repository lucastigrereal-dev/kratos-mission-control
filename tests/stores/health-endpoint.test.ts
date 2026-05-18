import { describe, it, expect } from "bun:test";
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

describe("Worker Health Endpoint Contract", () => {
  it("validates ok status", () => {
    const payload = { status: "ok", service: "kratos", version: "0.10.0", checks: { services: { total: 8, healthy: 8, degraded: 0 } }, updated_at: new Date().toISOString() };
    expect(HealthCheckSchema.safeParse(payload).success).toBe(true);
  });

  it("validates degraded status", () => {
    const payload = { status: "degraded", service: "kratos", version: "0.10.0", checks: { services: { total: 8, healthy: 6, degraded: 2 } }, updated_at: new Date().toISOString() };
    expect(HealthCheckSchema.safeParse(payload).success).toBe(true);
  });

  it("validates error status", () => {
    const payload = { status: "error", service: "kratos", version: "0.10.0", checks: { services: { total: 8, healthy: 5, degraded: 1 } }, updated_at: new Date().toISOString() };
    expect(HealthCheckSchema.safeParse(payload).success).toBe(true);
  });

  it("rejects invalid status", () => {
    const payload = { status: "unknown", service: "kratos", version: "0.10.0", checks: { services: { total: 1, healthy: 1, degraded: 0 } }, updated_at: new Date().toISOString() };
    expect(HealthCheckSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects missing checks", () => {
    expect(HealthCheckSchema.safeParse({ status: "ok", service: "kratos", version: "0.10.0", updated_at: new Date().toISOString() }).success).toBe(false);
  });
});
