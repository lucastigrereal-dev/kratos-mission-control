import { useQuery } from "@tanstack/react-query";
import { getGithubRepo, getTrackedRepos } from "@/lib/github-server-fns";
import { checkGithubConfig } from "@/lib/github-provider";
import type { GithubRepoStatus } from "../../api-contract/github.schema";

export function useGithubRepo(owner: string, repo: string) {
  return useQuery<GithubRepoStatus | null, Error>({
    queryKey: ["github", "repo", owner, repo],
    queryFn: async () => {
      const result = await getGithubRepo({ data: { owner, repo } });
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 60_000,
    enabled: !!owner && !!repo,
  });
}

export function useTrackedRepos() {
  return useQuery<string[], Error>({
    queryKey: ["github", "tracked"],
    queryFn: async () => {
      const result = await getTrackedRepos();
      if (result.error) throw new Error(result.error);
      return result.data ?? [];
    },
    staleTime: 120_000,
  });
}

// ── GitHub config detection (Sprint A checkGithubConfig) ──

export function useGithubConfig() {
  return useQuery({
    queryKey: ["github", "config"],
    queryFn: () => checkGithubConfig(),
    staleTime: 120_000,
  });
}
