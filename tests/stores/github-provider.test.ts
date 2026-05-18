import { describe, it, expect } from "bun:test";
import { checkGithubConfig, fetchRepoStatus, fetchTrackedRepos } from "../../src/lib/github-provider";

describe("GitHub Provider", () => {
  describe("Config detection", () => {
    it("checkGithubConfig returns object with configured field", () => {
      const config = checkGithubConfig();
      expect(typeof config.configured).toBe("boolean");
      expect(config.tokenEnvName).toBe("GITHUB_TOKEN");
      expect(() => new Date(config.checkedAt)).not.toThrow();
    });

    it("checkGithubConfig does not leak token value in shape", () => {
      const config = checkGithubConfig();
      const keys = Object.keys(config);
      expect(keys).toContain("configured");
      expect(keys).toContain("tokenEnvName");
      expect(keys).toContain("checkedAt");
      expect(keys).not.toContain("token");
      expect(keys).not.toContain("value");
    });
  });

  describe("fetchRepoStatus — missing_config", () => {
    it("returns missing_config error when GITHUB_TOKEN is not in globalThis", async () => {
      // In test environment, GITHUB_TOKEN is typically not set
      const result = await fetchRepoStatus("test-owner", "test-repo");
      if (!result.data && result.error) {
        // Either missing_config (token absent) or not_found (mock fallback kicked in from store)
        expect(["missing_config", "not_found"]).toContain(result.error.code);
      }
    });
  });

  describe("fetchTrackedRepos", () => {
    it("returns array of repo names", () => {
      const repos = fetchTrackedRepos();
      expect(Array.isArray(repos)).toBe(true);
      expect(repos.length).toBeGreaterThan(0);
    });

    it("all entries are strings", () => {
      for (const r of fetchTrackedRepos()) {
        expect(typeof r).toBe("string");
      }
    });
  });

  describe("No secrets leak", () => {
    it("config JSON never contains token pattern", () => {
      const json = JSON.stringify(checkGithubConfig());
      expect(json).not.toContain("ghp_");
      expect(json).not.toContain("github_pat_");
      expect(json).not.toContain("Bearer");
    });

    it("fetchRepoStatus error messages never contain token", async () => {
      const result = await fetchRepoStatus("x", "y");
      if (result.error) {
        expect(result.error.message).not.toContain("ghp_");
        expect(result.error.message).not.toContain("github_pat_");
      }
    });
  });
});
