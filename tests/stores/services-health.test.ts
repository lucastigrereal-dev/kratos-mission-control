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
    it("returns non-empty service list", () => {
      const services = getServices();
      expect(services.length).toBeGreaterThan(0);
    });

    it("each service validates against ServiceSchema", () => {
      const services = getServices();
      for (const s of services) {
        const result = ServiceSchema.safeParse(s);
        expect(result.success).toBe(true);
      }
    });

    it("each service has valid health enum", () => {
      const services = getServices();
      for (const s of services) {
        expect(["live", "degraded", "offline", "unknown"]).toContain(s.health);
      }
    });

    it("ultimoPing is a recent ISO datetime", () => {
      const services = getServices();
      for (const s of services) {
        const ts = new Date(s.ultimoPing).getTime();
        expect(ts).not.toBeNaN();
        expect(Date.now() - ts).toBeLessThan(5000); // within 5 seconds
      }
    });
  });

  describe("getServicesHealthSummary", () => {
    it("returns summary with all required fields", () => {
      const summary = getServicesHealthSummary();
      expect(typeof summary.total).toBe("number");
      expect(typeof summary.live).toBe("number");
      expect(typeof summary.degraded).toBe("number");
      expect(typeof summary.offline).toBe("number");
      expect(typeof summary.unknown).toBe("number");
      expect(typeof summary.stale).toBe("boolean");
      expect(typeof summary.checked_at).toBe("string");
    });

    it("counts sum equals total", () => {
      const summary = getServicesHealthSummary();
      expect(summary.live + summary.degraded + summary.offline + summary.unknown).toBe(summary.total);
    });

    it("total matches getServices().length", () => {
      const services = getServices();
      const summary = getServicesHealthSummary();
      expect(summary.total).toBe(services.length);
    });

    it("checked_at is valid ISO datetime", () => {
      const summary = getServicesHealthSummary();
      expect(new Date(summary.checked_at).getTime()).not.toBeNaN();
    });

    it("at least one live service in mock data", () => {
      const summary = getServicesHealthSummary();
      expect(summary.live).toBeGreaterThan(0);
    });
  });

  describe("Stale detection", () => {
    it("mock data is never stale", () => {
      const summary = getServicesHealthSummary();
      expect(summary.stale).toBe(false);
    });
  });
});
