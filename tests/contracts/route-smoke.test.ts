/**
 * K16 — Route Smoke Test Foundation
 * Verifies that each route's backend data source returns without error.
 * This is the backend smoke layer — Playwright visual smoke is in K15 plan.
 * Bun-native, no jsdom.
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { getAll as getCheckpoints } from "../../backend/checkpoints/store";
import { getAll as getProjects } from "../../backend/projects/store";
import { getAll as getAppointments } from "../../backend/appointments/store";
import { getLatest as getContextLatest } from "../../backend/contexto/store";
import { getOmnisStatus } from "../../backend/omnis/store";
import { getServices } from "../../backend/services/store";
import { listTrackedRepos } from "../../backend/github/store";

/**
 * Each route + its backend data source:
 * / (dashboard)    → checkpoints + projects + appointments + contexto
 * /agora           → checkpoints
 * /agenda          → appointments
 * /checkpoints     → checkpoints
 * /projetos        → projects
 * /contexto        → contexto
 * /sistema         → services + omnis + github
 */

describe("Route Backend Smoke Tests", () => {
  describe("/ (dashboard) — all sources", () => {
    it("checkpoints source returns array", () => {
      const result = getCheckpoints();
      expect(Array.isArray(result)).toBe(true);
    });

    it("projects source returns array", () => {
      const result = getProjects();
      expect(Array.isArray(result)).toBe(true);
    });

    it("appointments source returns array", () => {
      const result = getAppointments();
      expect(Array.isArray(result)).toBe(true);
    });

    it("contexto source returns snapshot", () => {
      const result = getContextLatest();
      expect(result).not.toBeNull();
    });
  });

  describe("/agora — checkpoints", () => {
    it("returns at least one checkpoint", () => {
      const result = getCheckpoints();
      expect(result.length).toBeGreaterThan(0);
    });

    it("in_progress checkpoints have id and title", () => {
      const result = getCheckpoints();
      for (const c of result.filter((c) => c.status === "in_progress")) {
        expect(c.id).toBeTruthy();
        expect(c.titulo).toBeTruthy();
      }
    });
  });

  describe("/agenda — appointments", () => {
    it("returns appointments", () => {
      const result = getAppointments();
      expect(Array.isArray(result)).toBe(true);
    });

    it("each appointment has data (date string)", () => {
      const result = getAppointments();
      for (const a of result) {
        expect(typeof a.data).toBe("string");
      }
    });
  });

  describe("/checkpoints — checkpoints", () => {
    it("pending checkpoints are accessible", () => {
      const result = getCheckpoints();
      const pending = result.filter((c) => c.status === "pending");
      expect(Array.isArray(pending)).toBe(true);
    });
  });

  describe("/projetos — projects", () => {
    it("active projects are accessible", () => {
      const result = getProjects();
      const active = result.filter((p) => p.status === "active");
      expect(Array.isArray(active)).toBe(true);
    });

    it("each project has nome field", () => {
      const result = getProjects();
      for (const p of result) {
        expect(typeof p.nome).toBe("string");
      }
    });
  });

  describe("/contexto — contexto snapshot", () => {
    it("focusStatus is valid", () => {
      const result = getContextLatest();
      expect(["on_focus", "off_focus", "unknown"]).toContain(result.focusStatus);
    });

    it("confidence is 0-100", () => {
      const result = getContextLatest();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe("/sistema — services + omnis + github", () => {
    it("services returns list with health info", () => {
      const result = getServices();
      expect(result.length).toBeGreaterThan(0);
      for (const s of result) {
        expect(["live", "degraded", "offline", "unknown"]).toContain(s.health);
      }
    });

    it("OMNIS status is accessible", () => {
      const result = getOmnisStatus();
      expect(result.servicos.length).toBeGreaterThan(0);
    });

    it("GitHub tracked repos list is accessible", () => {
      const result = listTrackedRepos();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
