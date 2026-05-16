import { z } from "zod";

export const GithubPRStatusSchema = z.enum(["open", "closed", "merged", "draft"]);

export const GithubPRSchema = z.object({
  id: z.number(),
  numero: z.number(),
  titulo: z.string(),
  status: GithubPRStatusSchema,
  autor: z.string(),
  autorAvatar: z.string().url().optional(),
  branch: z.string(),
  url: z.string().url(),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

export const GithubCommitSchema = z.object({
  sha: z.string(),
  mensagem: z.string(),
  autor: z.string(),
  autorAvatar: z.string().url().optional(),
  url: z.string().url(),
  data: z.string().datetime(),
});

export const GithubRepoStatusSchema = z.object({
  nome: z.string(),
  nomeCompleto: z.string(),
  descricao: z.string().optional(),
  url: z.string().url(),
  stars: z.number().int().min(0),
  forks: z.number().int().min(0),
  openIssues: z.number().int().min(0),
  linguagem: z.string().optional(),
  ultimoPush: z.string().datetime(),
  prs: z.array(GithubPRSchema),
  commitsRecentes: z.array(GithubCommitSchema),
  atualizadoEm: z.string().datetime(),
});

export type GithubPRStatus = z.infer<typeof GithubPRStatusSchema>;
export type GithubPR = z.infer<typeof GithubPRSchema>;
export type GithubCommit = z.infer<typeof GithubCommitSchema>;
export type GithubRepoStatus = z.infer<typeof GithubRepoStatusSchema>;
