/**
 * K09 — Contexto Snapshot Tests
 * Verifies context snapshot store: success, shape, source metadata, no secrets.
 * Bun-native, no jsdom.
 */

import { describe, it, expect } from "bun:test";
import { getLatest, refresh } from "../../backend/contexto/store";
import { ContextSnapshotSchema, ContextoSnapshotDataSchema } from "../../api-contract/contexto.schema";
import { SourceBadgeMetaSchema } from "../../api-contract/source-badge.schema";

describe("Contexto Snapshot Store", () => {
  describe("Success path", () => {
    it("getLatest returns a valid ContextSnapshot", () => {
      const snapshot = getLatest();
      expect(snapshot).not.toBeNull();
      const parsed = ContextSnapshotSchema.safeParse(snapshot);
      expect(parsed.success).toBe(true);
    });

    it("refresh returns a valid ContextSnapshot", () => {
      const snapshot = refresh();
      expect(snapshot).not.toBeNull();
      const parsed = ContextSnapshotSchema.safeParse(snapshot);
      expect(parsed.success).toBe(true);
    });

    it("snapshot has non-empty project", () => {
      const snapshot = getLatest();
      expect(snapshot.project.length).toBeGreaterThan(0);
    });

    it("snapshot has valid focusStatus", () => {
      const snapshot = getLatest();
      expect(["on_focus", "off_focus", "unknown"]).toContain(snapshot.focusStatus);
    });

    it("confidence is within 0-100", () => {
      const snapshot = getLatest();
      expect(snapshot.confidence).toBeGreaterThanOrEqual(0);
      expect(snapshot.confidence).toBeLessThanOrEqual(100);
    });

    it("drift is a valid enum value", () => {
      const snapshot = getLatest();
      expect(["none", "light", "high"]).toContain(snapshot.drift);
    });

    it("capturedAt is a valid ISO datetime string", () => {
      const snapshot = getLatest();
      expect(() => new Date(snapshot.capturedAt)).not.toThrow();
      expect(new Date(snapshot.capturedAt).getTime()).not.toBeNaN();
    });
  });

  describe("Shape integrity", () => {
    it("reasons is a non-empty array of strings", () => {
      const snapshot = getLatest();
      expect(Array.isArray(snapshot.reasons)).toBe(true);
      expect(snapshot.reasons.length).toBeGreaterThan(0);
      for (const r of snapshot.reasons) {
        expect(typeof r).toBe("string");
      }
    });

    it("browserTabs is an array", () => {
      const snapshot = getLatest();
      expect(Array.isArray(snapshot.browserTabs)).toBe(true);
    });

    it("each browserTab has required fields", () => {
      const snapshot = getLatest();
      for (const tab of snapshot.browserTabs) {
        expect(typeof tab.title).toBe("string");
        expect(typeof tab.domain).toBe("string");
        expect(["active", "idle", "closed"]).toContain(tab.status);
      }
    });

    it("activeWindowApp is a non-empty string", () => {
      const snapshot = getLatest();
      expect(typeof snapshot.activeWindowApp).toBe("string");
      expect(snapshot.activeWindowApp.length).toBeGreaterThan(0);
    });
  });

  describe("Source metadata (stale detection)", () => {
    it("capturedAt is recent (within last minute)", () => {
      const snapshot = getLatest();
      const ageMs = Date.now() - new Date(snapshot.capturedAt).getTime();
      expect(ageMs).toBeLessThan(60_000); // 1 minute
    });

    it("refresh updates capturedAt to now", () => {
      const before = Date.now();
      const snapshot = refresh();
      const after = Date.now();
      const ts = new Date(snapshot.capturedAt).getTime();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after + 100);
    });
  });

  describe("No secrets in snapshot", () => {
    it("snapshot does not contain token patterns", () => {
      const snapshot = getLatest();
      const json = JSON.stringify(snapshot);
      expect(json).not.toContain("Bearer");
      expect(json).not.toContain("Authorization");
      expect(json).not.toContain("AKASHA_URL");
      expect(json).not.toContain("password");
    });
  });

  describe("Error resilience", () => {
    it("getLatest never throws", () => {
      let threw = false;
      try {
        getLatest();
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });

    it("refresh never throws", () => {
      let threw = false;
      try {
        refresh();
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });
  });

  describe("High-level snapshot (ContextoSnapshotData)", () => {
    it("maps store data to ContextoSnapshotData shape", () => {
      const raw = getLatest();
      const snapshot = {
        current_context: raw.project ? `${raw.project} — ${raw.mission}` : "Sem contexto ativo",
        confidence: raw.confidence,
        mode: raw.project ? (raw.focusStatus === "on_focus" ? "execution" : "standby") : "unknown",
        next_action: raw.reasons[0] ?? "Definir próxima ação",
        origin: "local",
      };
      const parsed = ContextoSnapshotDataSchema.safeParse(snapshot);
      expect(parsed.success).toBe(true);
    });

    it("valid ContextoSnapshotData passes schema validation", () => {
      const valid = {
        current_context: "KRATOS — Sprint A em execução",
        confidence: 85,
        mode: "execution",
        next_action: "Implementar A04",
        origin: "local",
      };
      expect(ContextoSnapshotDataSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects snapshot with missing fields", () => {
      expect(ContextoSnapshotDataSchema.safeParse({}).success).toBe(false);
      expect(ContextoSnapshotDataSchema.safeParse({ current_context: "test" }).success).toBe(false);
    });

    it("rejects invalid mode", () => {
      const invalid = {
        current_context: "test",
        confidence: 50,
        mode: "invalid_mode",
        next_action: "do something",
        origin: "local",
      };
      expect(ContextoSnapshotDataSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects confidence outside 0-100", () => {
      const invalid = {
        current_context: "test",
        confidence: 150,
        mode: "execution",
        next_action: "do something",
        origin: "local",
      };
      expect(ContextoSnapshotDataSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("Source badge metadata", () => {
    it("valid SourceBadgeMeta passes schema", () => {
      const meta = {
        source: "mock",
        origin: "local",
        stale: false,
        updated_at: new Date().toISOString(),
        errors: [],
      };
      expect(SourceBadgeMetaSchema.safeParse(meta).success).toBe(true);
    });

    it("SourceBadgeMeta with errors passes schema", () => {
      const meta = {
        source: "partial",
        stale: true,
        updated_at: new Date().toISOString(),
        errors: ["Serviço externo indisponível"],
      };
      expect(SourceBadgeMetaSchema.safeParse(meta).success).toBe(true);
    });
  });
});
