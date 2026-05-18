import { describe, it, expect } from "bun:test";
import { ContextoSnapshotDataSchema } from "../../api-contract/contexto.schema";
import { DashboardSnapshotDataSchema } from "../../api-contract/dashboard.schema";
import { SourceBadgeMetaSchema } from "../../api-contract/source-badge.schema";
import { createApiError } from "../../api-contract/error-taxonomy";
import { getLatest } from "../../backend/contexto/store";
import { getServicesHealthSummary } from "../../backend/services/store";
import { fetchTrackedRepos } from "../../src/lib/github-provider";
import { fetchOmnisStatus } from "../../src/lib/omnis-provider";

describe("Snapshot Contract Regression", () => {
  describe("Contexto Snapshot — success", () => {
    it("produces valid ContextoSnapshotData from store", () => {
      const raw = getLatest();
      const data = { current_context: `${raw.project} — ${raw.mission}`, confidence: raw.confidence, mode: raw.project ? "execution" : "standby", next_action: raw.reasons[0] ?? "N/A", origin: "local" };
      expect(ContextoSnapshotDataSchema.safeParse(data).success).toBe(true);
    });
  });

  describe("Contexto Snapshot — empty", () => {
    it("rejects empty object", () => {
      expect(ContextoSnapshotDataSchema.safeParse({}).success).toBe(false);
    });
  });

  describe("Dashboard Snapshot — success", () => {
    it("produces valid DashboardSnapshotData from all sources", () => {
      const svc = getServicesHealthSummary();
      const repos = fetchTrackedRepos();
      const payload = { summary_cards: [{ label: "Serviços", value: `${svc.live}/${svc.total}` }], services: { total: svc.total, live: svc.live, degraded: svc.degraded, offline: svc.offline, unknown: svc.unknown }, repos: repos.map((r) => ({ nome: r, nomeCompleto: `lucastigrereal-dev/${r}`, url: `https://github.com/lucastigrereal-dev/${r}`, openPRs: 0, openIssues: 0, ultimoPush: new Date().toISOString() })), next_actions: [], health: "live", updated_at: new Date().toISOString() };
      expect(DashboardSnapshotDataSchema.safeParse(payload).success).toBe(true);
    });
  });

  describe("Missing config detection", () => {
    it("createApiError missing_config has correct structure", () => {
      const err = createApiError("missing_config", "GITHUB_TOKEN não configurado");
      expect(err.code).toBe("missing_config");
      expect(err.message.length).toBeGreaterThan(0);
    });
  });

  describe("External unavailable detection", () => {
    it("createApiError external_unavailable has correct structure", () => {
      const err = createApiError("external_unavailable", "Serviço indisponível");
      expect(err.code).toBe("external_unavailable");
    });
  });

  describe("Validation error detection", () => {
    it("createApiError validation_error has correct structure", () => {
      const err = createApiError("validation_error", "Schema inválido", "missing field X");
      expect(err.code).toBe("validation_error");
      expect(err.detail).toBe("missing field X");
    });
  });

  describe("Stale detection via SourceBadgeMeta", () => {
    it("stale=true marks outdated data", () => {
      const meta = SourceBadgeMetaSchema.safeParse({ source: "stale", stale: true, updated_at: new Date(Date.now() - 3600000).toISOString(), errors: ["Dados com mais de 1h"] });
      expect(meta.success).toBe(true);
    });
  });

  describe("Partial data is valid", () => {
    it("partial source with errors is valid metadata", () => {
      const meta = SourceBadgeMetaSchema.safeParse({ source: "partial", stale: true, updated_at: new Date().toISOString(), error_code: "external_unavailable", errors: ["OMNIS offline, GitHub ok"] });
      expect(meta.success).toBe(true);
    });
  });

  describe("OMNIS read-only contract", () => {
    it("fetchOmnisStatus returns valid shape", () => {
      const result = fetchOmnisStatus();
      if (result.data) {
        expect(result.data.servicos.length).toBeGreaterThan(0);
        expect(result.data.crews.length).toBeGreaterThan(0);
      }
    });
  });
});
