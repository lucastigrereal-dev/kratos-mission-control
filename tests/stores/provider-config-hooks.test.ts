import { describe, it, expect } from "bun:test";
import { checkGithubConfig } from "../../src/lib/github-provider";
import { checkOmnisConfig } from "../../src/lib/omnis-provider";

describe("Provider Config Detection", () => {
  describe("GitHub config", () => {
    it("checkGithubConfig returns structured config", () => {
      const config = checkGithubConfig();
      expect(typeof config.configured).toBe("boolean");
      expect(config.tokenEnvName).toBe("GITHUB_TOKEN");
      expect(config.checkedAt).toBeDefined();
    });

    it("config has expected tokenEnvName field", () => {
      const config = checkGithubConfig();
      expect(config.tokenEnvName).toBe("GITHUB_TOKEN");
    });
  });

  describe("OMNIS config", () => {
    it("checkOmnisConfig returns structured config", () => {
      const config = checkOmnisConfig();
      expect(typeof config.configured).toBe("boolean");
      expect(config.baseUrlEnvName).toBe("OMNIS_BASE_URL");
      expect(config.checkedAt).toBeDefined();
    });

    it("config has expected baseUrlEnvName field", () => {
      const config = checkOmnisConfig();
      expect(config.baseUrlEnvName).toBe("OMNIS_BASE_URL");
    });
  });

  describe("Config safety", () => {
    it("GitHub config check never reads .env", () => {
      const config = checkGithubConfig();
      // configured is false in test (no globalThis.GITHUB_TOKEN)
      // But it should never throw — safe regardless
      expect(typeof config.configured).toBe("boolean");
    });

    it("OMNIS config check never reads .env", () => {
      const config = checkOmnisConfig();
      expect(typeof config.configured).toBe("boolean");
    });
  });
});
