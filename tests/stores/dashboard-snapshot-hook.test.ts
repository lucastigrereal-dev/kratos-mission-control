import { describe, it, expect } from "bun:test";
import { DashboardSnapshotDataSchema } from "../../api-contract/dashboard.schema";
import { SourceBadgeMetaSchema } from "../../api-contract/source-badge.schema";
import { getServicesHealthSummary } from "../../backend/services/store";
import { getLatest } from "../../backend/contexto/store";
import { listTrackedRepos } from "../../backend/github/store";

describe("Dashboard Snapshot Hook Contract", () => {
  describe("DashboardSnapshotDataSchema", () => {
    it("validates snapshot from services + contexto + repos", () => {
      const svc = getServicesHealthSummary();
      const ctx = getLatest();
      const repos = listTrackedRepos();

      const payload = {
        summary_cards: [
          { label: "Serviços", value: `${svc.live}/${svc.total}`, trend: "stable" as const },
          { label: "Repos", value: `${repos.length}`, detail: "tracked" },
          { label: "Confiança", value: `${ctx.confidence}%`, detail: ctx.project },
        ],
        services: { total: svc.total, live: svc.live, degraded: svc.degraded, offline: svc.offline, unknown: svc.unknown },
        repos: repos.map((r) => ({
          nome: r,
          nomeCompleto: `lucastigrereal-dev/${r}`,
          url: `https://github.com/lucastigrereal-dev/${r}`,
          openPRs: 0,
          openIssues: 0,
          ultimoPush: new Date().toISOString(),
        })),
        next_actions: [{ action: ctx.reasons[0] ?? "N/A", project: ctx.project, priority: "high" as const }],
        health: svc.offline > 0 ? "offline" : svc.degraded > 0 ? "degraded" : svc.unknown === svc.total ? "unknown" : "live",
        updated_at: new Date().toISOString(),
      };

      const parsed = DashboardSnapshotDataSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
    });

    it("empty repos array is valid", () => {
      const payload = {
        summary_cards: [],
        services: { total: 0, live: 0, degraded: 0, offline: 0, unknown: 0 },
        repos: [],
        next_actions: [],
        health: "unknown" as const,
        updated_at: new Date().toISOString(),
      };
      expect(DashboardSnapshotDataSchema.safeParse(payload).success).toBe(true);
    });

    it("rejects invalid summary_card trend", () => {
      const payload = {
        summary_cards: [{ label: "X", value: "1", trend: "sideways" }],
        services: { total: 1, live: 1, degraded: 0, offline: 0, unknown: 0 },
        repos: [],
        next_actions: [],
        health: "live" as const,
        updated_at: new Date().toISOString(),
      };
      expect(DashboardSnapshotDataSchema.safeParse(payload).success).toBe(false);
    });

    it("rejects invalid health value", () => {
      const payload = {
        summary_cards: [],
        services: { total: 1, live: 1, degraded: 0, offline: 0, unknown: 0 },
        repos: [],
        next_actions: [],
        health: "crash",
        updated_at: new Date().toISOString(),
      };
      expect(DashboardSnapshotDataSchema.safeParse(payload).success).toBe(false);
    });
  });

  describe("SourceBadgeMeta envelope", () => {
    it("dashboard meta with source=mock is valid", () => {
      const meta = {
        source: "mock",
        origin: "local",
        stale: false,
        updated_at: new Date().toISOString(),
        errors: [],
      };
      expect(SourceBadgeMetaSchema.safeParse(meta).success).toBe(true);
    });

    it("partial dashboard meta with warnings", () => {
      const meta = {
        source: "partial",
        origin: "local",
        stale: true,
        updated_at: new Date().toISOString(),
        error_code: "external_unavailable",
        errors: ["GitHub offline — dados de repositórios podem estar desatualizados"],
      };
      expect(SourceBadgeMetaSchema.safeParse(meta).success).toBe(true);
    });
  });
});
