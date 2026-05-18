import { describe, it, expect } from "bun:test";
import { SourceBadgeMetaSchema, type SourceBadgeMeta } from "../../api-contract/source-badge.schema";

describe("Source Metadata Standardization", () => {
  describe("SourceBadgeMetaSchema — full shape", () => {
    it("validates minimal meta (required fields only)", () => {
      const minimal = {
        source: "mock",
        stale: false,
        updated_at: new Date().toISOString(),
      };
      expect(SourceBadgeMetaSchema.safeParse(minimal).success).toBe(true);
    });

    it("validates full meta with all optional fields", () => {
      const full: SourceBadgeMeta = {
        source: "live",
        origin: "github",
        source_kind: "api_response",
        stale: false,
        updated_at: new Date().toISOString(),
        confidence: 95,
        error_code: undefined,
        generated_by: "github-provider",
        errors: [],
      };
      const result = SourceBadgeMetaSchema.safeParse(full);
      expect(result.success).toBe(true);
    });

    it("validates meta with error_code set", () => {
      const meta = {
        source: "partial",
        stale: true,
        updated_at: new Date().toISOString(),
        error_code: "external_unavailable",
        generated_by: "kratos-snapshot-engine",
        errors: ["Serviço externo indisponível"],
      };
      expect(SourceBadgeMetaSchema.safeParse(meta).success).toBe(true);
    });

    it("rejects invalid source enum", () => {
      const invalid = {
        source: "invalid_source",
        stale: false,
        updated_at: new Date().toISOString(),
      };
      expect(SourceBadgeMetaSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects missing required fields", () => {
      expect(SourceBadgeMetaSchema.safeParse({}).success).toBe(false);
      expect(SourceBadgeMetaSchema.safeParse({ source: "mock" }).success).toBe(false);
    });

    it("rejects confidence outside 0-100", () => {
      const invalid = {
        source: "live",
        stale: false,
        updated_at: new Date().toISOString(),
        confidence: 150,
      };
      expect(SourceBadgeMetaSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects non-integer confidence", () => {
      const invalid = {
        source: "live",
        stale: false,
        updated_at: new Date().toISOString(),
        confidence: 85.5,
      };
      expect(SourceBadgeMetaSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects invalid origin enum", () => {
      const invalid = {
        source: "mock",
        stale: false,
        updated_at: new Date().toISOString(),
        origin: "invalid_origin",
      };
      expect(SourceBadgeMetaSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("Source metadata never contains secrets", () => {
    it("full meta object serialized has no token patterns", () => {
      const meta: SourceBadgeMeta = {
        source: "mock",
        origin: "github",
        source_kind: "mock_fallback",
        stale: false,
        updated_at: new Date().toISOString(),
        confidence: 80,
        error_code: "missing_config",
        generated_by: "github-provider",
        errors: ["GITHUB_TOKEN ausente"],
      };
      const json = JSON.stringify(meta);
      expect(json).not.toContain("ghp_");
      expect(json).not.toContain("github_pat_");
      expect(json).not.toContain("Bearer");
    });
  });

  describe("Backward compatibility", () => {
    it("old minimal shape (source, origin, stale, updated_at, errors) still valid", () => {
      const old = {
        source: "mock",
        origin: "local",
        stale: false,
        updated_at: new Date().toISOString(),
        errors: [],
      };
      expect(SourceBadgeMetaSchema.safeParse(old).success).toBe(true);
    });
  });
});
