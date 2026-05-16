/**
 * P1 — Persistence Tests: GitHub Store
 * Tests in-memory mock store with cache and fallback behavior.
 * Bun-native, no jsdom needed.
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { getRepoStatus, listTrackedRepos, _reset } from "../../backend/github/store";

describe("GitHub Store", () => {
  beforeEach(() => {
    _reset();
  });

  describe("listTrackedRepos", () => {
    it("returns known repo names", () => {
      const repos = listTrackedRepos();
      expect(repos).toContain("kratos-mission-control");
      expect(repos).toContain("omnis-runtime-bridge");
      expect(repos.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("getRepoStatus", () => {
    it("returns mock data for kratos-mission-control", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      expect(status).not.toBeNull();
      expect(status!.nome).toBe("kratos-mission-control");
      expect(status!.nomeCompleto).toContain("lucastigrereal-dev/kratos-mission-control");
      expect(status!.linguagem).toBe("TypeScript");
      expect(status!.url).toContain("github.com");
      expect(status!.stars).toBeGreaterThanOrEqual(0);
      expect(status!.forks).toBeGreaterThanOrEqual(0);
      expect(status!.openIssues).toBeGreaterThanOrEqual(0);
      expect(status!.ultimoPush).toBeTruthy();
      expect(status!.atualizadoEm).toBeTruthy();
    });

    it("returns mock data for omnis-runtime-bridge", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "omnis-runtime-bridge");
      expect(status).not.toBeNull();
      expect(status!.nome).toBe("omnis-runtime-bridge");
      expect(status!.linguagem).toBe("Python");
    });

    it("returns null for unknown repo", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "nonexistent-repo");
      expect(status).toBeNull();
    });

    it("includes commitsRecentes with valid shape", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      expect(Array.isArray(status!.commitsRecentes)).toBe(true);
      for (const commit of status!.commitsRecentes) {
        expect(commit.sha).toBeTruthy();
        expect(commit.mensagem).toBeTruthy();
        expect(commit.autor).toBeTruthy();
        expect(commit.url).toContain("github.com");
        expect(commit.data).toBeTruthy();
      }
    });

    it("omnis-runtime-bridge has prs if live fetch returns data", async () => {
      const status = await getRepoStatus("lucastigrereal-dev", "omnis-runtime-bridge");
      expect(Array.isArray(status!.prs)).toBe(true);
      for (const pr of status!.prs) {
        expect(pr.id).toBeTruthy();
        expect(pr.numero).toBeGreaterThan(0);
        expect(pr.titulo).toBeTruthy();
        expect(pr.status).toBeTruthy();
        expect(pr.autor).toBeTruthy();
        expect(pr.branch).toBeTruthy();
        expect(pr.url).toContain("github.com");
        expect(pr.criadoEm).toBeTruthy();
        expect(pr.atualizadoEm).toBeTruthy();
      }
    });

    it("caches results within TTL", async () => {
      const a = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      const b = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      expect(a).not.toBeNull();
      expect(b).not.toBeNull();
      // Same cache hit — should return equivalent data
      expect(b!.nome).toBe(a!.nome);
      expect(b!.atualizadoEm).toBe(a!.atualizadoEm);
    });
  });

  describe("_reset", () => {
    it("clears cache so next fetch re-computes", async () => {
      await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      _reset();
      const status = await getRepoStatus("lucastigrereal-dev", "kratos-mission-control");
      expect(status).not.toBeNull();
    });
  });
});
