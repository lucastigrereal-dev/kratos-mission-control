import { z } from "zod";
import { ServiceHealthSchema } from "./service.schema";

// ── Summary cards ──
export const DashboardSummaryCardSchema = z.object({
  label: z.string(),
  value: z.string(),
  trend: z.enum(["up", "down", "stable"]).optional(),
  detail: z.string().optional(),
});
export type DashboardSummaryCard = z.infer<typeof DashboardSummaryCardSchema>;

// ── Service health aggregation ──
export const DashboardServicesSummarySchema = z.object({
  total: z.number().int().min(0),
  live: z.number().int().min(0),
  degraded: z.number().int().min(0),
  offline: z.number().int().min(0),
  unknown: z.number().int().min(0),
});
export type DashboardServicesSummary = z.infer<typeof DashboardServicesSummarySchema>;

// ── Repo digest (abbreviated from github.schema) ──
export const DashboardRepoDigestSchema = z.object({
  nome: z.string(),
  nomeCompleto: z.string(),
  url: z.string().url(),
  openPRs: z.number().int().min(0),
  openIssues: z.number().int().min(0),
  ultimoPush: z.string().datetime(),
});
export type DashboardRepoDigest = z.infer<typeof DashboardRepoDigestSchema>;

// ── Next action ──
export const DashboardNextActionSchema = z.object({
  action: z.string(),
  project: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  deadline: z.string().datetime().optional(),
});
export type DashboardNextAction = z.infer<typeof DashboardNextActionSchema>;

// ── Snapshot payload ──
export const DashboardSnapshotDataSchema = z.object({
  summary_cards: z.array(DashboardSummaryCardSchema),
  services: DashboardServicesSummarySchema,
  repos: z.array(DashboardRepoDigestSchema),
  next_actions: z.array(DashboardNextActionSchema),
  health: ServiceHealthSchema,
  updated_at: z.string().datetime(),
});
export type DashboardSnapshotData = z.infer<typeof DashboardSnapshotDataSchema>;
