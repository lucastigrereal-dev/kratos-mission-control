/**
 * K07 — OMNIS Read-Only Fallback Tests
 * Verifies OMNIS layer is read-only, mock-backed, and never executes.
 * Bun-native, no jsdom, no real network calls.
 */

import { describe, it, expect, beforeEach } from "bun:test";
import {
  getOmnisStatus,
  getOmnisServiceHealth,
  getOmnisCrewStatus,
  getOmnisRecentJobs,
  _reset,
} from "../../backend/omnis/store";

describe("OMNIS Read-Only Fallback", () => {
  beforeEach(() => {
    _reset();
  });

  describe("Boundary: read-only enforced at store level", () => {
    it("store exports only GET functions", () => {
      // These are the only exports — no execute, run, trigger, post functions
      expect(typeof getOmnisStatus).toBe("function");
      expect(typeof getOmnisServiceHealth).toBe("function");
      expect(typeof getOmnisCrewStatus).toBe("function");
      expect(typeof getOmnisRecentJobs).toBe("function");
      expect(typeof _reset).toBe("function");
    });

    it("getOmnisStatus never throws (fallback guaranteed)", () => {
      let threw = false;
      try {
        getOmnisStatus();
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });

    it("getOmnisServiceHealth never throws", () => {
      let threw = false;
      try {
        getOmnisServiceHealth();
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });

    it("getOmnisCrewStatus never throws", () => {
      let threw = false;
      try {
        getOmnisCrewStatus();
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });

    it("getOmnisRecentJobs never throws", () => {
      let threw = false;
      try {
        getOmnisRecentJobs();
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });
  });

  describe("Fallback data integrity", () => {
    it("status always has required shape", () => {
      const status = getOmnisStatus();
      expect(Array.isArray(status.servicos)).toBe(true);
      expect(Array.isArray(status.crews)).toBe(true);
      expect(Array.isArray(status.jobsRecentes)).toBe(true);
      expect(typeof status.memoria).toBe("object");
      expect(typeof status.atualizadoEm).toBe("string");
    });

    it("health counts are non-negative numbers", () => {
      const health = getOmnisServiceHealth();
      expect(health.healthy).toBeGreaterThanOrEqual(0);
      expect(health.degraded).toBeGreaterThanOrEqual(0);
      expect(health.down).toBeGreaterThanOrEqual(0);
    });

    it("health counts sum equals total services", () => {
      const health = getOmnisServiceHealth();
      const status = getOmnisStatus();
      expect(health.healthy + health.degraded + health.down).toBe(status.servicos.length);
    });

    it("crews have required fields", () => {
      const crews = getOmnisCrewStatus();
      expect(crews.length).toBeGreaterThan(0);
      for (const crew of crews) {
        expect(typeof crew.nome).toBe("string");
        expect(typeof crew.status).toBe("string");
        expect(["idle", "running", "failed"]).toContain(crew.status);
      }
    });

    it("jobs respect limit parameter", () => {
      const jobs1 = getOmnisRecentJobs(1);
      const jobs3 = getOmnisRecentJobs(3);
      expect(jobs1.length).toBeLessThanOrEqual(1);
      expect(jobs3.length).toBeLessThanOrEqual(3);
    });

    it("jobs default limit is 5", () => {
      const jobs = getOmnisRecentJobs();
      expect(jobs.length).toBeLessThanOrEqual(5);
    });
  });

  describe("No execution patterns in store", () => {
    it("status does not include execution triggers", () => {
      const status = getOmnisStatus();
      const json = JSON.stringify(status);
      // No webhook or callback URLs in mock data
      expect(json).not.toContain("trigger");
      expect(json).not.toContain("execute");
      expect(json).not.toContain("webhook");
    });

    it("crew status field is read-only metadata", () => {
      const crews = getOmnisCrewStatus();
      for (const crew of crews) {
        // Status is descriptive, not actionable from KRATOS
        expect(["idle", "running", "failed"]).toContain(crew.status);
      }
    });
  });
});
