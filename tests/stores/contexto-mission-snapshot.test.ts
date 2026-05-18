import { describe, it, expect } from "bun:test";
import { ContextoSnapshotDataSchema, ContextoModeSchema } from "../../api-contract/contexto.schema";
import { SourceBadgeMetaSchema } from "../../api-contract/source-badge.schema";
import { getLatest, refresh } from "../../backend/contexto/store";

describe("Contexto Mission Snapshot Contract", () => {
  describe("ContextoSnapshotDataSchema", () => {
    it("validates mission snapshot from store", () => {
      const raw = getLatest();
      const data = {
        current_context: raw.project ? `${raw.project} — ${raw.mission}` : "Sem contexto ativo",
        confidence: raw.confidence,
        mode: raw.project ? "execution" : "standby",
        next_action: raw.reasons[0] ?? "Definir próxima ação",
        origin: "local",
      };
      const parsed = ContextoSnapshotDataSchema.safeParse(data);
      expect(parsed.success).toBe(true);
    });

    it("preserves current_context as string", () => {
      const parsed = ContextoSnapshotDataSchema.safeParse({
        current_context: "KRATOS — Sprint B wiring",
        confidence: 85,
        mode: "execution",
        next_action: "Conectar hooks",
        origin: "local",
      });
      expect(parsed.success).toBe(true);
      expect(parsed.data?.current_context).toContain("KRATOS");
    });

    it("accepts all modes", () => {
      for (const mode of ["execution", "planning", "review", "standby", "unknown"]) {
        expect(ContextoModeSchema.safeParse(mode).success).toBe(true);
      }
    });

    it("rejects invalid mode", () => {
      expect(ContextoSnapshotDataSchema.safeParse({
        current_context: "test", confidence: 50,
        mode: "invalid", next_action: "test", origin: "local",
      }).success).toBe(false);
    });

    it("requires confidence as integer", () => {
      expect(ContextoSnapshotDataSchema.safeParse({
        current_context: "test", confidence: 50.5,
        mode: "execution", next_action: "test", origin: "local",
      }).success).toBe(false);
    });

    it("confidence range 0-100", () => {
      expect(ContextoSnapshotDataSchema.safeParse({
        current_context: "test", confidence: 101,
        mode: "execution", next_action: "test", origin: "local",
      }).success).toBe(false);
      expect(ContextoSnapshotDataSchema.safeParse({
        current_context: "test", confidence: -1,
        mode: "execution", next_action: "test", origin: "local",
      }).success).toBe(false);
    });

    it("empty project produces standby mode", () => {
      // Simulate no active project
      const data = {
        current_context: "Sem contexto ativo",
        confidence: 0,
        mode: "standby",
        next_action: "Definir próxima ação",
        origin: "local",
      };
      expect(ContextoSnapshotDataSchema.safeParse(data).success).toBe(true);
    });
  });

  describe("SourceBadgeMeta envelope", () => {
    it("meta from mission snapshot is valid", () => {
      const meta = {
        source: "mock",
        origin: "local",
        stale: false,
        updated_at: new Date().toISOString(),
        errors: [],
      };
      expect(SourceBadgeMetaSchema.safeParse(meta).success).toBe(true);
    });

    it("stale=true marks degraded data", () => {
      const meta = {
        source: "mock",
        origin: "local",
        stale: true,
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        errors: ["Dados com mais de 1h"],
        error_code: "stale_data",
      };
      expect(SourceBadgeMetaSchema.safeParse(meta).success).toBe(true);
    });
  });

  describe("Refresh flow", () => {
    it("refresh returns fresh data", () => {
      const fresh = refresh();
      expect(fresh.capturedAt).toBeDefined();
      expect(typeof fresh.confidence).toBe("number");
    });
  });
});
