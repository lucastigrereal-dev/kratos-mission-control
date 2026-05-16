import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { GithubRepoStatusSchema, type GithubRepoStatus } from "../../api-contract/github.schema";
import { getRepoStatus, listTrackedRepos } from "../../backend/github/store";

type Envelope<T> = { data: T | null; error: string | null };

export const getGithubRepo = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      owner: z.string().min(1),
      repo: z.string().min(1),
    }),
  )
  .handler(
    async ({ data }: { data: { owner: string; repo: string } }): Promise<Envelope<GithubRepoStatus>> => {
      try {
        const status = await getRepoStatus(data.owner, data.repo);
        if (!status) {
          return { data: null, error: "Repositório não encontrado" };
        }
        const parsed = GithubRepoStatusSchema.safeParse(status);
        if (!parsed.success) {
          return { data: null, error: parsed.error.message };
        }
        return { data: parsed.data, error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : "Falha ao buscar repositório" };
      }
    },
  );

export const getTrackedRepos = createServerFn({ method: "GET" }).handler(
  async (): Promise<Envelope<string[]>> => {
    try {
      return { data: listTrackedRepos(), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Falha ao listar repositórios" };
    }
  },
);
