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
import { getServicesHealthSummary } from "../../backend/services/store";
import { getRepoStatus, listTrackedRepos } from "../../backend/github/store";
import { DashboardSnapshotDataSchema } from "../../api-contract/dashboard.schema";
import { SourceBadgeMetaSchema } from "../../api-contract/source-badge.schema";

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

  describe("Dashboard Snapshot Data contract", () => {
    it("assembles valid DashboardSnapshotData from backend sources", async () => {
      const svc = getServicesHealthSummary();
      const ctx = getContextLatest();
      const repoDigests = (await Promise.all(listTrackedRepos().map(async (r) => {
        const gh = await getRepoStatus("lucastigrereal-dev", r);
        if (!gh) return null;
        return {
          nome: gh.nome,
          nomeCompleto: gh.nomeCompleto,
          url: gh.url,
          openPRs: gh.prs.filter((p) => p.status === "open").length,
          openIssues: gh.openIssues,
          ultimoPush: gh.ultimoPush,
        };
      }))).filter(Boolean);

      const payload = {
        summary_cards: [
          { label: "Serviços", value: `${svc.live}/${svc.total}` },
          { label: "Repos", value: `${repoDigests.length}` },
        ],
        services: { total: svc.total, live: svc.live, degraded: svc.degraded, offline: svc.offline, unknown: svc.unknown },
        repos: repoDigests,
        next_actions: [{ action: ctx.reasons[0], project: ctx.project, priority: "high" }],
        health: svc.offline > 0 ? "offline" : svc.degraded > 0 ? "degraded" : "live",
        updated_at: new Date().toISOString(),
      };

      const parsed = DashboardSnapshotDataSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
    });

    it("rejects payload missing summary_cards", () => {
      const result = DashboardSnapshotDataSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("valid summary_cards with trend field passes", () => {
      const card = { label: "Test", value: "100", trend: "up", detail: "detail" };
      const result = DashboardSnapshotDataSchema.safeParse({
        summary_cards: [card],
        services: { total: 1, live: 1, degraded: 0, offline: 0, unknown: 0 },
        repos: [],
        next_actions: [],
        health: "live",
        updated_at: new Date().toISOString(),
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid priority in next_action", () => {
      const payload = {
        summary_cards: [],
        services: { total: 1, live: 1, degraded: 0, offline: 0, unknown: 0 },
        repos: [],
        next_actions: [{ action: "test", project: "test", priority: "urgent" }],
        health: "live",
        updated_at: new Date().toISOString(),
      };
      expect(DashboardSnapshotDataSchema.safeParse(payload).success).toBe(false);
    });

    it("rejects repos with missing nomeCompleto", () => {
      const payload = {
        summary_cards: [],
        services: { total: 0, live: 0, degraded: 0, offline: 0, unknown: 0 },
        repos: [{ nome: "test", url: "https://github.com/a/b", openPRs: 0, openIssues: 0, ultimoPush: new Date().toISOString() }],
        next_actions: [],
        health: "live",
        updated_at: new Date().toISOString(),
      };
      expect(DashboardSnapshotDataSchema.safeParse(payload).success).toBe(false);
    });
  });

  describe("Dashboard source metadata", () => {
    it("meta with source=mock and origin=local is valid", () => {
      const meta = {
        source: "mock",
        origin: "local",
        stale: false,
        updated_at: new Date().toISOString(),
        errors: [],
      };
      expect(SourceBadgeMetaSchema.safeParse(meta).success).toBe(true);
    });
  });
});
