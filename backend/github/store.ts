import type { GithubRepoStatus, GithubPR, GithubCommit } from "../../api-contract/github.schema";

const MOCK_REPOS: Record<string, GithubRepoStatus> = {
  "kratos-mission-control": {
    nome: "kratos-mission-control",
    nomeCompleto: "lucastigrereal-dev/kratos-mission-control",
    descricao: "Cockpit de missão pessoal — TanStack Start + Cloudflare Workers",
    url: "https://github.com/lucastigrereal-dev/kratos-mission-control",
    stars: 0,
    forks: 0,
    openIssues: 0,
    linguagem: "TypeScript",
    ultimoPush: new Date().toISOString(),
    prs: [],
    commitsRecentes: [
      {
        sha: "e5d531f",
        mensagem: "feat(kratos): phase 2 — data layer hardening",
        autor: "lucastigrereal-dev",
        url: "https://github.com/lucastigrereal-dev/kratos-mission-control/commit/e5d531f",
        data: new Date().toISOString(),
      },
      {
        sha: "e1d521d",
        mensagem: "docs(kratos): waves 19-20 — final QA hardening + continuity final report",
        autor: "lucastigrereal-dev",
        url: "https://github.com/lucastigrereal-dev/kratos-mission-control/commit/e1d521d",
        data: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        sha: "a90dfde",
        mensagem: "docs(kratos): waves 14-18 — documentation & audit reports",
        autor: "lucastigrereal-dev",
        url: "https://github.com/lucastigrereal-dev/kratos-mission-control/commit/a90dfde",
        data: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    atualizadoEm: new Date().toISOString(),
  },
  "omnis-runtime-bridge": {
    nome: "omnis-runtime-bridge",
    nomeCompleto: "lucastigrereal-dev/omnis-runtime-bridge",
    descricao: "Runtime de agentes autônomos — skills, crews, memória vetorial",
    url: "https://github.com/lucastigrereal-dev/omnis-runtime-bridge",
    stars: 0,
    forks: 0,
    openIssues: 3,
    linguagem: "Python",
    ultimoPush: new Date(Date.now() - 3600000).toISOString(),
    prs: [
      {
        id: 1,
        numero: 42,
        titulo: "feat: adicionar collector de métricas do Instagram",
        status: "open",
        autor: "lucastigrereal-dev",
        branch: "feature/instagram-metrics-collector",
        url: "https://github.com/lucastigrereal-dev/omnis-runtime-bridge/pull/42",
        criadoEm: new Date(Date.now() - 86400000).toISOString(),
        atualizadoEm: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    commitsRecentes: [
      {
        sha: "f36a292",
        mensagem: "feat(omnis): Fase 1 — Cabine Mínima Vital (CLI + 6 checkers + 25 testes)",
        autor: "lucastigrereal-dev",
        url: "https://github.com/lucastigrereal-dev/omnis-runtime-bridge/commit/f36a292",
        data: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    atualizadoEm: new Date().toISOString(),
  },
};

const cache = new Map<string, { data: GithubRepoStatus; ts: number }>();
const CACHE_TTL = 120_000; // 2 min

const FETCH_TIMEOUT_MS = 3000;

async function fetchFromGithub(owner: string, repo: string): Promise<GithubRepoStatus | null> {
  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
  const token = (globalThis as Record<string, unknown>).GITHUB_TOKEN as string | undefined;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const [repoRes, prsRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, signal: controller.signal }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=5`, { headers, signal: controller.signal }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, { headers, signal: controller.signal }),
    ]);
    clearTimeout(timeoutId);

    if (!repoRes.ok) return null;

    const repoJson = await repoRes.json() as Record<string, unknown>;
    const prsJson = prsRes.ok ? await prsRes.json() as Array<Record<string, unknown>> : [];
    const commitsJson = commitsRes.ok ? await commitsRes.json() as Array<Record<string, unknown>> : [];

    const prs: GithubPR[] = prsJson.map((p) => ({
      id: p.id as number,
      numero: p.number as number,
      titulo: p.title as string,
      status: (p.draft as boolean) ? "draft" : "open",
      autor: (p.user as Record<string, unknown>)?.login as string,
      autorAvatar: (p.user as Record<string, unknown>)?.avatar_url as string,
      branch: (p.head as Record<string, unknown>)?.ref as string,
      url: p.html_url as string,
      criadoEm: p.created_at as string,
      atualizadoEm: p.updated_at as string,
    }));

    const commits: GithubCommit[] = commitsJson.map((c) => ({
      sha: (c.sha as string).slice(0, 7),
      mensagem: (c.commit as Record<string, unknown>)?.message as string,
      autor: (c.author as Record<string, unknown>)?.login as string ?? (c.commit as Record<string, unknown>)?.author as string,
      autorAvatar: (c.author as Record<string, unknown>)?.avatar_url as string,
      url: c.html_url as string,
      data: ((c.commit as Record<string, unknown>)?.author as Record<string, unknown>)?.date as string,
    }));

    return {
      nome: repo,
      nomeCompleto: repoJson.full_name as string,
      descricao: (repoJson.description as string) ?? undefined,
      url: repoJson.html_url as string,
      stars: repoJson.stargazers_count as number,
      forks: repoJson.forks_count as number,
      openIssues: repoJson.open_issues_count as number,
      linguagem: (repoJson.language as string) ?? undefined,
      ultimoPush: repoJson.pushed_at as string,
      prs,
      commitsRecentes: commits,
      atualizadoEm: new Date().toISOString(),
    };
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function getRepoStatus(owner: string, repo: string): Promise<GithubRepoStatus | null> {
  const key = `${owner}/${repo}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  const live = await fetchFromGithub(owner, repo);
  if (live) {
    cache.set(key, { data: live, ts: Date.now() });
    return live;
  }

  const mock = MOCK_REPOS[repo];
  if (mock) {
    cache.set(key, { data: mock, ts: Date.now() });
    return mock;
  }

  return null;
}

export function listTrackedRepos(): string[] {
  return Object.keys(MOCK_REPOS);
}

/** For testing: reset the store to empty state */
export function _reset(): void {
  cache.clear();
}
