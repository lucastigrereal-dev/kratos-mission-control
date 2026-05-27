/**
 * K20 — Backend Contract Regression Tests
 * Ensures existing backend shapes don't change without a report.
 * Tests are data-shape focused — no behavior testing.
 * Bun-native, no jsdom.
 */

import { describe, it, expect } from "bun:test";
import { ContextSnapshotSchema } from "../../api-contract/contexto.schema";
import { GithubRepoStatusSchema } from "../../api-contract/github.schema";
import { OmnisStatusSchema } from "../../api-contract/omnis.schema";
import { ServiceSchema } from "../../api-contract/service.schema";
import { SourceBadgeMetaSchema } from "../../api-contract/source-badge.schema";
import { ApiErrorCodeSchema } from "../../api-contract/error-taxonomy";
import { getLatest } from "../../backend/contexto/store";
import { getOmnisStatus } from "../../backend/omnis/store";
import { getServices } from "../../backend/services/store";

describe("Backend Contract Regression", () => {
  describe("ContextSnapshot schema stability", () => {
    it("required fields still exist", () => {
      const schema = ContextSnapshotSchema.shape;
      expect(schema.id).toBeDefined();
      expect(schema.capturedAt).toBeDefined();
      expect(schema.project).toBeDefined();
      expect(schema.focusStatus).toBeDefined();
      expect(schema.confidence).toBeDefined();
      expect(schema.drift).toBeDefined();
    });

    it("live data validates against schema", () => {
      const snapshot = getLatest();
      const result = ContextSnapshotSchema.safeParse(snapshot);
      expect(result.success).toBe(true);
    });
  });

  describe("GithubRepoStatus schema stability", () => {
    it("required fields still exist", () => {
      const schema = GithubRepoStatusSchema.shape;
      expect(schema.nome).toBeDefined();
      expect(schema.nomeCompleto).toBeDefined();
      expect(schema.url).toBeDefined();
      expect(schema.stars).toBeDefined();
      expect(schema.forks).toBeDefined();
      expect(schema.openIssues).toBeDefined();
      expect(schema.ultimoPush).toBeDefined();
      expect(schema.prs).toBeDefined();
      expect(schema.commitsRecentes).toBeDefined();
      expect(schema.atualizadoEm).toBeDefined();
    });
  });

  describe("OmnisStatus schema stability", () => {
    it("required fields still exist", () => {
      const schema = OmnisStatusSchema.shape;
      expect(schema.servicos).toBeDefined();
      expect(schema.crews).toBeDefined();
      expect(schema.jobsRecentes).toBeDefined();
      expect(schema.memoria).toBeDefined();
      expect(schema.atualizadoEm).toBeDefined();
    });

    it("live data validates against schema", () => {
      const status = getOmnisStatus();
      const result = OmnisStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
    });
  });

  describe("Service schema stability", () => {
    it("required fields still exist", () => {
      const schema = ServiceSchema.shape;
      expect(schema.id).toBeDefined();
      expect(schema.nome).toBeDefined();
      expect(schema.health).toBeDefined();
      expect(schema.ultimoPing).toBeDefined();
    });

    it("live data validates against schema", async () => {
      const services = await getServices();
      expect(services.length).toBeGreaterThan(0);
      for (const s of services) {
        const result = ServiceSchema.safeParse(s);
        expect(result.success).toBe(true);
      }
    });
  });

  describe("SourceBadgeMeta schema stability", () => {
    it("required fields still exist", () => {
      const schema = SourceBadgeMetaSchema.shape;
      expect(schema.source).toBeDefined();
      expect(schema.stale).toBeDefined();
      expect(schema.updated_at).toBeDefined();
      expect(schema.errors).toBeDefined();
    });

    it("valid meta validates", () => {
      const result = SourceBadgeMetaSchema.safeParse({
        source: "mock",
        stale: false,
        updated_at: new Date().toISOString(),
        errors: [],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("ApiErrorCode taxonomy stability", () => {
    it("all 8 error codes still defined", () => {
      const codes = ApiErrorCodeSchema.options;
      expect(codes).toContain("missing_config");
      expect(codes).toContain("external_unavailable");
      expect(codes).toContain("stale_data");
      expect(codes).toContain("validation_error");
      expect(codes).toContain("forbidden_action");
      expect(codes).toContain("internal_error");
      expect(codes).toContain("not_found");
      expect(codes).toContain("rate_limited");
      expect(codes.length).toBe(8);
    });
  });
});
