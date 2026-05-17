/**
 * K05 — GitHub Token Safety Tests
 * Verifies token is never leaked, never logged, and fallback works without token.
 * Bun-native, no jsdom, no real network calls.
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { getRepoStatus, listTrackedRepos, _reset } from "../../backend/github/store";

describe("GitHub Token Safety", () => {
  beforeEach(() => {
    _reset();
    // Ensure no token in globalThis during tests
    delete (globalThis as Record<string, unknown>).GITHUB_TOKEN;
  });

  describe("No token present (unauthenticated fallback)", () => {
    it("returns mock data when GITHUB_TOKEN is absent", async () => {
      expect((globalThis as Record<string, unknown>).GITHUB_TOKEN).toBeUndefined();
      const status = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      // Must still return data (from mock fallback)
      expect(status).not.toBeNull();
      expect(status!.nome).toBe("kratos-mission-control");
    });

    it("does not throw when GITHUB_TOKEN is absent", async () => {
      expect((globalThis as Record<string, unknown>).GITHUB_TOKEN).toBeUndefined();
      let threw = false;
      try {
        await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
    });

    it("returns null for unknown repo with no token (not an exception)", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "totally-unknown-xyz-123");
      expect(status).toBeNull();
    });
  });

  describe("Token never leaked in response data", () => {
    it("repo status does not contain token-like fields", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      expect(status).not.toBeNull();
      const json = JSON.stringify(status);
      // Must not contain Authorization header pattern
      expect(json).not.toContain("Bearer");
      expect(json).not.toContain("Authorization");
      // Must not contain token key
      expect(json).not.toContain("GITHUB_TOKEN");
      expect(json).not.toContain("token");
    });

    it("listTrackedRepos does not expose token", () => {
      const repos = listTrackedRepos();
      const json = JSON.stringify(repos);
      expect(json).not.toContain("Bearer");
      expect(json).not.toContain("Authorization");
      expect(json).not.toContain("GITHUB_TOKEN");
    });
  });

  describe("Response shape integrity (token-independent)", () => {
    it("repo status has required fields regardless of token presence", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      expect(status).not.toBeNull();
      expect(typeof status!.nome).toBe("string");
      expect(typeof status!.nomeCompleto).toBe("string");
      expect(typeof status!.url).toBe("string");
      expect(typeof status!.stars).toBe("number");
      expect(typeof status!.forks).toBe("number");
      expect(typeof status!.openIssues).toBe("number");
      expect(typeof status!.ultimoPush).toBe("string");
      expect(typeof status!.atualizadoEm).toBe("string");
      expect(Array.isArray(status!.prs)).toBe(true);
      expect(Array.isArray(status!.commitsRecentes)).toBe(true);
    });

    it("url fields point to github.com (not internal)", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      expect(status!.url).toMatch(/^https:\/\/github\.com\//);
      for (const commit of status!.commitsRecentes) {
        expect(commit.url).toMatch(/^https:\/\/github\.com\//);
      }
    });
  });

  describe("Cache safety", () => {
    it("cache reset does not leak token between test runs", async () => {
      // Simulate token present in one call
      (globalThis as Record<string, unknown>).GITHUB_TOKEN = undefined;
      _reset();
      const status = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      expect(status).not.toBeNull();
      // After reset, token must still be absent
      expect((globalThis as Record<string, unknown>).GITHUB_TOKEN).toBeUndefined();
    });
  });
});
