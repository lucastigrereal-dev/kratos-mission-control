import { describe, it, expect } from "bun:test";
import {
  checkOmnisConfig,
  fetchOmnisStatus,
  fetchOmnisHealth,
  fetchOmnisCrews,
  fetchOmnisJobs,
} from "../../src/lib/omnis-provider";

describe("OMNIS Provider", () => {
  describe("Config detection", () => {
    it("checkOmnisConfig returns object with configured field", () => {
      const config = checkOmnisConfig();
      expect(typeof config.configured).toBe("boolean");
      expect(config.baseUrlEnvName).toBe("OMNIS_BASE_URL");
      expect(() => new Date(config.checkedAt)).not.toThrow();
    });

    it("checkOmnisConfig does not leak URL value", () => {
      const config = checkOmnisConfig();
      const keys = Object.keys(config);
      expect(keys).toContain("configured");
      expect(keys).toContain("baseUrlEnvName");
      expect(keys).not.toContain("url");
      expect(keys).not.toContain("value");
    });
  });

  describe("fetchOmnisStatus — read-only", () => {
    it("returns data or error, never throws", () => {
      let threw = false;
      try {
        const result = fetchOmnisStatus();
        expect(result.data !== null || result.error !== null).toBe(true);
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });

    it("success response has OmnisStatus shape", () => {
      const result = fetchOmnisStatus();
      if (result.data) {
        expect(Array.isArray(result.data.servicos)).toBe(true);
        expect(Array.isArray(result.data.crews)).toBe(true);
        expect(Array.isArray(result.data.jobsRecentes)).toBe(true);
        expect(result.data.memoria).toBeTruthy();
        expect(typeof result.data.atualizadoEm).toBe("string");
      }
    });
  });

  describe("fetchOmnisHealth", () => {
    it("returns health counts", () => {
      const result = fetchOmnisHealth();
      if (result.data) {
        expect(result.data.healthy).toBeGreaterThanOrEqual(0);
        expect(result.data.degraded).toBeGreaterThanOrEqual(0);
        expect(result.data.down).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("fetchOmnisCrews", () => {
    it("returns crew array", () => {
      const result = fetchOmnisCrews();
      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBeGreaterThan(0);
        for (const crew of result.data) {
          expect(typeof crew.nome).toBe("string");
          expect(["idle", "running", "failed"]).toContain(crew.status);
        }
      }
    });
  });

  describe("fetchOmnisJobs", () => {
    it("returns job array with default limit", () => {
      const result = fetchOmnisJobs();
      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBeLessThanOrEqual(5);
      }
    });

    it("respects limit parameter", () => {
      const result = fetchOmnisJobs(2);
      if (result.data) {
        expect(result.data.length).toBeLessThanOrEqual(2);
      }
    });
  });

  describe("No execution, no commands", () => {
    it("provider module has no executeJob function", async () => {
      const mod = await import("../../src/lib/omnis-provider");
      expect("executeJob" in mod).toBe(false);
      expect("runCrew" in mod).toBe(false);
      expect("sendCommand" in mod).toBe(false);
    });
  });

  describe("No secrets", () => {
    it("config JSON never contains URL patterns", () => {
      const json = JSON.stringify(checkOmnisConfig());
      expect(json).not.toContain("http://");
      expect(json).not.toContain("https://");
      expect(json).not.toContain("@");
    });
  });
});
