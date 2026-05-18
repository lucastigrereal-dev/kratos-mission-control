import { describe, it, expect } from "bun:test";
import { classifyError, toSnapshotError, createApiError, ApiErrorCodeSchema } from "../../api-contract/error-taxonomy";

describe("Snapshot Error Taxonomy", () => {
  describe("ApiErrorCodeSchema", () => {
    it("validates known error codes", () => {
      expect(ApiErrorCodeSchema.safeParse("missing_config").success).toBe(true);
      expect(ApiErrorCodeSchema.safeParse("external_unavailable").success).toBe(true);
      expect(ApiErrorCodeSchema.safeParse("stale_data").success).toBe(true);
      expect(ApiErrorCodeSchema.safeParse("validation_error").success).toBe(true);
      expect(ApiErrorCodeSchema.safeParse("forbidden_action").success).toBe(true);
      expect(ApiErrorCodeSchema.safeParse("internal_error").success).toBe(true);
      expect(ApiErrorCodeSchema.safeParse("not_found").success).toBe(true);
      expect(ApiErrorCodeSchema.safeParse("rate_limited").success).toBe(true);
    });

    it("rejects unknown codes", () => {
      expect(ApiErrorCodeSchema.safeParse("unknown_code").success).toBe(false);
      expect(ApiErrorCodeSchema.safeParse("").success).toBe(false);
    });
  });

  describe("createApiError", () => {
    it("creates structured error", () => {
      const err = createApiError("missing_config", "Test message", "detail");
      expect(err.code).toBe("missing_config");
      expect(err.message).toBe("Test message");
      expect(err.detail).toBe("detail");
    });

    it("detail is optional", () => {
      const err = createApiError("internal_error", "Test");
      expect(err.detail).toBeUndefined();
    });
  });

  describe("classifyError", () => {
    it("classifies network errors as external_unavailable", () => {
      expect(classifyError(new Error("fetch failed"))).toBe("external_unavailable");
      expect(classifyError(new Error("ECONNREFUSED"))).toBe("external_unavailable");
      expect(classifyError(new Error("ETIMEDOUT"))).toBe("external_unavailable");
      expect(classifyError(new Error("network error"))).toBe("external_unavailable");
      expect(classifyError(new Error("The operation was aborted"))).toBe("external_unavailable");
    });

    it("classifies rate limit errors", () => {
      expect(classifyError(new Error("429 Too Many Requests"))).toBe("rate_limited");
      expect(classifyError(new Error("rate limit exceeded"))).toBe("rate_limited");
    });

    it("classifies unknown errors as internal_error", () => {
      expect(classifyError(new Error("Something unexpected"))).toBe("internal_error");
    });

    it("classifies non-Error as internal_error", () => {
      expect(classifyError("string error")).toBe("internal_error");
      expect(classifyError(null)).toBe("internal_error");
    });
  });

  describe("toSnapshotError", () => {
    it("wraps error with stale flag", () => {
      const result = toSnapshotError("stale_data", "Dados antigos");
      expect(result.stale).toBe(true);
      expect(result.error.code).toBe("stale_data");
    });

    it("external_unavailable is stale", () => {
      expect(toSnapshotError("external_unavailable", "Offline").stale).toBe(true);
    });

    it("missing_config is not stale (config issue, not data)", () => {
      expect(toSnapshotError("missing_config", "No token").stale).toBe(false);
    });

    it("validation_error is not stale", () => {
      expect(toSnapshotError("validation_error", "Bad input").stale).toBe(false);
    });
  });

  describe("Error taxonomy in JSON never contains secrets", () => {
    it("error structure has no token fields", () => {
      const err = createApiError("missing_config", "GITHUB_TOKEN ausente");
      const json = JSON.stringify(err);
      expect(json).not.toContain("ghp_");
      expect(json).not.toContain("Bearer");
      expect(json).not.toContain("Authorization");
    });
  });
});
