/**
 * K11 — Dashboard Snapshot Tests
 * Tests the backend sources that feed the dashboard aggregation.
 * Validates that each source produces consistent data for DashboardSummary.
 * Bun-native, no jsdom.
 */

import { describe, it, expect } from "bun:test";
import { getAll as getCheckpoints } from "../../backend/checkpoints/store";
import { getAll as getProjects } from "../../backend/projects/store";
import { getAll as getAppointments } from "../../backend/appointments/store";
import { getLatest as getContextLatest } from "../../backend/contexto/store";

describe("Dashboard Snapshot Sources", () => {

  describe("Checkpoints source", () => {
    it("returns array for summary counting", () => {
      const list = getCheckpoints();
      expect(Array.isArray(list)).toBe(true);
    });

    it("each checkpoint has status field", () => {
      const list = getCheckpoints();
      for (const c of list) {
        expect(["pending", "in_progress", "completed", "archived"]).toContain(c.status);
      }
    });

    it("counts add up correctly", () => {
      const list = getCheckpoints();
      const pending = list.filter((c) => c.status === "pending").length;
      const inProgress = list.filter((c) => c.status === "in_progress").length;
      const completed = list.filter((c) => c.status === "completed").length;
      const archived = list.filter((c) => c.status === "archived").length;
      expect(pending + inProgress + completed + archived).toBe(list.length);
    });
  });

  describe("Projects source", () => {
    it("returns array for summary counting", () => {
      const list = getProjects();
      expect(Array.isArray(list)).toBe(true);
    });

    it("each project has status field", () => {
      const list = getProjects();
      for (const p of list) {
        expect(["active", "paused", "completed", "archived"]).toContain(p.status);
      }
    });

    it("active + paused + completed <= total", () => {
      const list = getProjects();
      const active = list.filter((p) => p.status === "active").length;
      const paused = list.filter((p) => p.status === "paused").length;
      const completed = list.filter((p) => p.status === "completed").length;
      expect(active + paused + completed).toBeLessThanOrEqual(list.length);
    });
  });

  describe("Appointments source", () => {
    it("returns array for summary counting", () => {
      const list = getAppointments();
      expect(Array.isArray(list)).toBe(true);
    });

    it("each appointment has data (date) field", () => {
      const list = getAppointments();
      for (const a of list) {
        expect(typeof a.data).toBe("string");
        expect(a.data.length).toBeGreaterThanOrEqual(10); // YYYY-MM-DD minimum
      }
    });

    it("overdue count is non-negative", () => {
      const list = getAppointments();
      const today = new Date().toISOString().slice(0, 10);
      const overdue = list.filter((a) => a.data < today && a.status !== "completed").length;
      expect(overdue).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Contexto source", () => {
    it("returns snapshot with focusStatus", () => {
      const snapshot = getContextLatest();
      expect(snapshot).not.toBeNull();
      expect(["on_focus", "off_focus", "unknown"]).toContain(snapshot.focusStatus);
    });

    it("returns snapshot with drift", () => {
      const snapshot = getContextLatest();
      expect(["none", "light", "high"]).toContain(snapshot.drift);
    });

    it("returns snapshot with project", () => {
      const snapshot = getContextLatest();
      expect(typeof snapshot.project).toBe("string");
      expect(snapshot.project.length).toBeGreaterThan(0);
    });
  });

  describe("Partial data handling", () => {
    it("checkpoints list is always an array (not error)", () => {
      const list = getCheckpoints();
      expect(Array.isArray(list)).toBe(true);
    });

    it("dashboard can be assembled from all sources without throwing", () => {
      let threw = false;
      try {
        const checkpoints = getCheckpoints();
        const projects = getProjects();
        const appointments = getAppointments();
        const contexto = getContextLatest();
        const today = new Date().toISOString().slice(0, 10);
        const summary = {
          checkpoints: {
            total: checkpoints.length,
            pending: checkpoints.filter((c) => c.status === "pending").length,
            inProgress: checkpoints.filter((c) => c.status === "in_progress").length,
            completed: checkpoints.filter((c) => c.status === "completed").length,
          },
          projects: {
            total: projects.length,
            active: projects.filter((p) => p.status === "active").length,
          },
          appointments: {
            today: appointments.filter((a) => a.data === today).length,
            overdue: appointments.filter((a) => a.data < today && a.status !== "completed").length,
            total: appointments.length,
          },
          contexto: contexto
            ? { focusStatus: contexto.focusStatus, drift: contexto.drift, project: contexto.project }
            : null,
        };
        expect(summary.checkpoints.total).toBeGreaterThanOrEqual(0);
        expect(summary.projects.total).toBeGreaterThanOrEqual(0);
        expect(summary.appointments.total).toBeGreaterThanOrEqual(0);
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });
  });
});
