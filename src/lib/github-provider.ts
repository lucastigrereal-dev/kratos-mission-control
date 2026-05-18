import type { GithubRepoStatus } from "../../api-contract/github.schema";
import type { ApiError } from "../../api-contract/error-taxonomy";
import { createApiError } from "../../api-contract/error-taxonomy";
import { getRepoStatus, listTrackedRepos } from "../../backend/github/store";

// Config detection — never reads .env, only checks globalThis
export interface GithubProviderConfig {
  configured: boolean;
  tokenEnvName: string;
  checkedAt: string;
}

export function checkGithubConfig(): GithubProviderConfig {
  const token = (globalThis as Record<string, unknown>).GITHUB_TOKEN as string | undefined;
  return {
    configured: typeof token === "string" && token.length > 0,
    tokenEnvName: "GITHUB_TOKEN",
    checkedAt: new Date().toISOString(),
  };
}

export interface GithubProviderResult {
  data: GithubRepoStatus | null;
  error: ApiError | null;
}

export async function fetchRepoStatus(owner: string, repo: string): Promise<GithubProviderResult> {
  const config = checkGithubConfig();

  if (!config.configured) {
    return {
      data: null,
      error: createApiError(
        "missing_config",
        "GITHUB_TOKEN não configurado no Worker",
        "Configure a variável GITHUB_TOKEN no Cloudflare Worker",
      ),
    };
  }

  try {
    const status = await getRepoStatus(owner, repo);
    if (!status) {
      return {
        data: null,
        error: createApiError("not_found", `Repositório ${owner}/${repo} não encontrado`),
      };
    }
    return { data: status, error: null };
  } catch (e) {
    return {
      data: null,
      error: createApiError(
        "external_unavailable",
        "GitHub API indisponível",
        e instanceof Error ? e.message : undefined,
      ),
    };
  }
}

export function fetchTrackedRepos(): string[] {
  return listTrackedRepos();
}
