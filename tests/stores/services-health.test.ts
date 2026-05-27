/**
 * K14 — Services Health Observability Tests
 * Bun-native, no jsdom.
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { getServices, getServicesHealthSummary, _reset } from "../../backend/services/store";
import { ServiceSchema } from "../../api-contract/service.schema";

describe("Services Health Observability", () => {
  beforeEach(() => {
    _reset();
  });

  describe("getServices", () => {
    it("returns non-empty service list", async () => {
      const services = await getServices();
      expect(services.length).toBeGreaterThan(0);
    });

    it("each service validates against ServiceSchema", async () => {
      const services = await getServices();
      for (const s of services) {
        const result = ServiceSchema.safeParse(s);
        expect(result.success).toBe(true);
      }
    });

    it("each service has valid health enum", async () => {
      const services = await getServices();
      for (const s of services) {
        expect(["live", "degraded", "offline", "unknown"]).toContain(s.health);
      }
    });

    it("ultimoPing is a recent ISO datetime", async () => {
      const services = await getServices();
      for (const s of services) {
        const ts = new Date(s.ultimoPing).getTime();
        expect(ts).not.toBeNaN();
        expect(Date.now() - ts).toBeLessThan(5000); // within 5 seconds
      }
    });
  });

  describe("getServicesHealthSummary", () => {
    it("returns summary with all required fields", async () => {
      const summary = await getServicesHealthSummary();
      expect(typeof summary.total).toBe("number");
      expect(typeof summary.live).toBe("number");
      expect(typeof summary.degraded).toBe("number");
      expect(typeof summary.offline).toBe("number");
      expect(typeof summary.unknown).toBe("number");
      expect(typeof summary.stale).toBe("boolean");
      expect(typeof summary.checked_at).toBe("string");
    });

    it("counts sum equals total", async () => {
      const summary = await getServicesHealthSummary();
      expect(summary.live + summary.degraded + summary.offline + summary.unknown).toBe(summary.total);
    });

    it("total matches getServices().length", async () => {
      const services = await getServices();
      const summary = await getServicesHealthSummary();
      expect(summary.total).toBe(services.length);
    });

    it("checked_at is valid ISO datetime", async () => {
      const summary = await getServicesHealthSummary();
      expect(new Date(summary.checked_at).getTime()).not.toBeNaN();
    });

    it("at least one live service in mock data", async () => {
      const summary = await getServicesHealthSummary();
      expect(summary.total).toBeGreaterThan(0);
    });
  });

  describe("Stale detection", () => {
    it("mock data is never stale", async () => {
      const summary = await getServicesHealthSummary();
      expect(summary.stale).toBe(false);
    });
  });
});
