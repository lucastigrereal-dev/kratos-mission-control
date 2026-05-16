/**
 * P2 — Persistence Tests: OMNIS Store
 * Tests readonly mock store for OMNIS runtime bridge status.
 * Bun-native, no jsdom needed.
 */

import { describe, it, expect, beforeEach } from "bun:test";
import {
  getOmnisStatus,
  getOmnisServiceHealth,
  getOmnisCrewStatus,
  getOmnisRecentJobs,
  _reset,
} from "../../backend/omnis/store";

describe("OMNIS Store", () => {
  beforeEach(() => {
    _reset();
  });

  describe("getOmnisStatus", () => {
    it("returns full status object", () => {
      const status = getOmnisStatus();
      expect(status.servicos.length).toBeGreaterThanOrEqual(1);
      expect(status.crews.length).toBeGreaterThanOrEqual(1);
      expect(status.jobsRecentes.length).toBeGreaterThanOrEqual(1);
      expect(status.memoria.totalDocs).toBeGreaterThan(0);
      expect(status.atualizadoEm).toBeTruthy();
    });

    it("includes services with valid fields", () => {
      const status = getOmnisStatus();
      for (const svc of status.servicos) {
        expect(svc.nome).toBeTruthy();
        expect(["healthy", "degraded", "down"]).toContain(svc.status);
      }
    });

    it("includes crews with valid status", () => {
      const status = getOmnisStatus();
      for (const crew of status.crews) {
        expect(crew.nome).toBeTruthy();
        expect(["idle", "running", "failed"]).toContain(crew.status);
        expect(crew.taxaSucesso).toBeGreaterThanOrEqual(0);
        expect(crew.taxaSucesso).toBeLessThanOrEqual(1);
        expect(crew.jobsConcluidos).toBeGreaterThanOrEqual(0);
      }
    });

    it("includes jobs with valid status", () => {
      const status = getOmnisStatus();
      for (const job of status.jobsRecentes) {
        expect(job.id).toBeTruthy();
        expect(job.tipo).toBeTruthy();
        expect(["queued", "running", "done", "failed", "needs_review"]).toContain(job.status);
        expect(job.criadoEm).toBeTruthy();
      }
    });

    it("includes memory stats", () => {
      const status = getOmnisStatus();
      expect(status.memoria.totalDocs).toBeGreaterThanOrEqual(0);
      expect(status.memoria.totalChunks).toBeGreaterThanOrEqual(0);
      expect(status.memoria.dominios).toBeGreaterThanOrEqual(0);
    });

    it("caches results within TTL", () => {
      const a = getOmnisStatus();
      const b = getOmnisStatus();
      expect(a.atualizadoEm).toBe(b.atualizadoEm); // Same cache hit
    });
  });

  describe("getOmnisServiceHealth", () => {
    it("returns health breakdown", () => {
      const health = getOmnisServiceHealth();
      expect(health.healthy).toBeGreaterThanOrEqual(0);
      expect(health.degraded).toBeGreaterThanOrEqual(0);
      expect(health.down).toBeGreaterThanOrEqual(0);
      const total = health.healthy + health.degraded + health.down;
      expect(total).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getOmnisCrewStatus", () => {
    it("returns crew array", () => {
      const crews = getOmnisCrewStatus();
      expect(crews.length).toBeGreaterThanOrEqual(1);
      expect(crews[0].nome).toBeTruthy();
    });
  });

  describe("getOmnisRecentJobs", () => {
    it("returns capped list", () => {
      const jobs = getOmnisRecentJobs(2);
      expect(jobs.length).toBeLessThanOrEqual(2);
    });

    it("defaults to 5", () => {
      const jobs = getOmnisRecentJobs();
      expect(jobs.length).toBeLessThanOrEqual(5);
      expect(jobs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("_reset", () => {
    it("clears cache so fresh fetch re-computes", () => {
      getOmnisStatus();
      _reset();
      const after = getOmnisStatus();
      expect(after.servicos.length).toBeGreaterThanOrEqual(1);
      expect(after.atualizadoEm).toBeTruthy();
    });
  });
});
