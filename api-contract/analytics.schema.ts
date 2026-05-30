/**
 * Analytics Schema — W21
 * Contrato completo de métricas para as 6 páginas Instagram do Lucas.
 *
 * Modo: LOCAL/MOCK — sem OAuth Meta, sem Meta Graph API.
 * Todos os dados são SAMPLE_DATA ou MOCK.
 * OAuth Meta é um Human Slot (não configurado).
 *
 * Campos marcados com sourceBadge para indicar origem dos dados.
 */

import { z } from "zod";
import type { PageSlug } from "./marketing.schema";
import { PAGE_SLUGS } from "./marketing.schema";

// ── Source Badge para Analytics ───────────────────────────────────────────────

export const AnalyticsSourceSchema = z.enum([
  "live_meta",        // Meta API real — BLOCKED_EXTERNAL
  "sample_data",      // Dados de amostra realistas — disponível agora
  "mock",             // Dados mock gerados — disponível agora
  "cache",            // Dados cacheados da última sincronização real
  "unavailable",      // Fonte indisponível
]);
export type AnalyticsSource = z.infer<typeof AnalyticsSourceSchema>;

// ── Métricas completas por página ─────────────────────────────────────────────

export const FullPageMetricsSchema = z.object({
  slug: z.string(),
  handle: z.string(),
  period_days: z.number().int().min(1).max(365),

  // Audiência
  followers: z.number().int().min(0),
  followers_growth: z.number(),       // absoluto no período
  followers_growth_pct: z.number(),   // %

  // Alcance
  reach: z.number().int().min(0),
  impressions: z.number().int().min(0),
  profile_visits: z.number().int().min(0),

  // Engajamento
  engagement_rate: z.number().min(0).max(1),
  total_likes: z.number().int().min(0),
  total_comments: z.number().int().min(0),
  total_saves: z.number().int().min(0),
  total_shares: z.number().int().min(0),

  // Conteúdo
  posts_published: z.number().int().min(0),
  reels_published: z.number().int().min(0),
  stories_published: z.number().int().min(0),
  avg_reel_views: z.number().int().min(0).optional(),

  // CPM comparativo
  cpm_kratos: z.number().min(0),      // custo por mil via KRATOS (R$)
  cpm_meta_ads: z.number().min(0),    // custo por mil via Meta Ads (R$) - referência
  cpm_savings_pct: z.number(),        // % de economia vs Meta Ads

  // Monetização
  estimated_publi_value_brl: z.number().min(0),

  // Fonte
  source: AnalyticsSourceSchema.default("sample_data"),
  data_as_of: z.string().datetime(),
});
export type FullPageMetrics = z.infer<typeof FullPageMetricsSchema>;

// ── Ponto de série temporal ───────────────────────────────────────────────────

export const AnalyticsTimePointSchema = z.object({
  date: z.string(),   // "YYYY-MM-DD"
  reach: z.number().int().min(0),
  impressions: z.number().int().min(0),
  engagement_rate: z.number().min(0),
  followers_delta: z.number(),
});
export type AnalyticsTimePoint = z.infer<typeof AnalyticsTimePointSchema>;

// ── Dashboard por página ──────────────────────────────────────────────────────

export const PageDashboardSchema = z.object({
  metrics: FullPageMetricsSchema,
  timeline: z.array(AnalyticsTimePointSchema),
  top_post_type: z.enum(["reel", "carrossel", "foto", "stories"]).optional(),
  best_day_of_week: z.string().optional(),
  best_hour: z.number().int().min(0).max(23).optional(),
});
export type PageDashboard = z.infer<typeof PageDashboardSchema>;

// ── Comparativo entre páginas ─────────────────────────────────────────────────

export const PagesComparisonSchema = z.object({
  period_days: z.number().int().min(1),
  pages: z.array(FullPageMetricsSchema),
  leader_by_reach: z.string(),          // slug da página líder
  leader_by_engagement: z.string(),
  leader_by_growth: z.string(),
  total_reach: z.number().int().min(0),
  total_followers: z.number().int().min(0),
  source: AnalyticsSourceSchema.default("sample_data"),
});
export type PagesComparison = z.infer<typeof PagesComparisonSchema>;

// ── Alertas ───────────────────────────────────────────────────────────────────

export const AnalyticsAlertSchema = z.object({
  id: z.string(),
  type: z.enum(["growth_drop", "engagement_drop", "opportunity", "milestone", "warning"]),
  severity: z.enum(["info", "warning", "critical"]),
  slug: z.string().optional(),        // página afetada (null = global)
  title: z.string(),
  description: z.string(),
  suggested_action: z.string().optional(),
  created_at: z.string().datetime(),
});
export type AnalyticsAlert = z.infer<typeof AnalyticsAlertSchema>;

// ── Meta OAuth Human Slot ─────────────────────────────────────────────────────

export const MetaOAuthSlotSchema = z.object({
  configured: z.literal(false),
  required_env_vars: z.array(z.string()),
  status: z.literal("not_configured"),
  description: z.string(),
  human_action_required: z.string(),
});
export type MetaOAuthSlot = z.infer<typeof MetaOAuthSlotSchema>;

export const META_OAUTH_SLOT: MetaOAuthSlot = {
  configured: false,
  required_env_vars: ["META_APP_ID", "META_APP_SECRET", "META_ACCESS_TOKEN"],
  status: "not_configured",
  description: "Meta Graph API — acesso às métricas reais do Instagram",
  human_action_required: "Lucas precisa criar app no Meta for Developers e configurar as variáveis de ambiente",
};

// ── SAMPLE DATA — 6 páginas ───────────────────────────────────────────────────
// Baseado em dados realistas do perfil do Lucas. Marcado como sample_data.

function makeTimestamp(): string {
  return new Date(0).toISOString();
}

export const SAMPLE_PAGE_METRICS: Record<PageSlug, FullPageMetrics> = {
  lucastigrereal: {
    slug: "lucastigrereal", handle: "@lucastigrereal", period_days: 30,
    followers: 690_000, followers_growth: 3_200, followers_growth_pct: 0.47,
    reach: 285_000, impressions: 420_000, profile_visits: 18_500,
    engagement_rate: 0.042, total_likes: 28_500, total_comments: 1_250, total_saves: 3_400, total_shares: 890,
    posts_published: 12, reels_published: 8, stories_published: 45, avg_reel_views: 32_000,
    cpm_kratos: 0.15, cpm_meta_ads: 18.50, cpm_savings_pct: 99.19,
    estimated_publi_value_brl: 2_800,
    source: "sample_data", data_as_of: makeTimestamp(),
  },
  oinatalrn: {
    slug: "oinatalrn", handle: "@oinatalrn", period_days: 30,
    followers: 630_000, followers_growth: 2_800, followers_growth_pct: 0.45,
    reach: 248_000, impressions: 380_000, profile_visits: 15_200,
    engagement_rate: 0.038, total_likes: 24_200, total_comments: 980, total_saves: 2_900, total_shares: 720,
    posts_published: 10, reels_published: 6, stories_published: 38, avg_reel_views: 28_000,
    cpm_kratos: 0.15, cpm_meta_ads: 18.50, cpm_savings_pct: 99.19,
    estimated_publi_value_brl: 2_400,
    source: "sample_data", data_as_of: makeTimestamp(),
  },
  agenteviajabrasil: {
    slug: "agenteviajabrasil", handle: "@agenteviajabrasil", period_days: 30,
    followers: 452_000, followers_growth: 1_900, followers_growth_pct: 0.42,
    reach: 178_000, impressions: 270_000, profile_visits: 11_800,
    engagement_rate: 0.045, total_likes: 19_800, total_comments: 820, total_saves: 2_400, total_shares: 580,
    posts_published: 9, reels_published: 7, stories_published: 32, avg_reel_views: 22_000,
    cpm_kratos: 0.15, cpm_meta_ads: 18.50, cpm_savings_pct: 99.19,
    estimated_publi_value_brl: 1_900,
    source: "sample_data", data_as_of: makeTimestamp(),
  },
  afamiliatigrereal: {
    slug: "afamiliatigrereal", handle: "@afamiliatigrereal", period_days: 30,
    followers: 320_000, followers_growth: 1_100, followers_growth_pct: 0.35,
    reach: 125_000, impressions: 195_000, profile_visits: 8_200,
    engagement_rate: 0.052, total_likes: 16_200, total_comments: 680, total_saves: 1_900, total_shares: 420,
    posts_published: 8, reels_published: 5, stories_published: 28, avg_reel_views: 18_000,
    cpm_kratos: 0.15, cpm_meta_ads: 18.50, cpm_savings_pct: 99.19,
    estimated_publi_value_brl: 1_400,
    source: "sample_data", data_as_of: makeTimestamp(),
  },
  oquecomernatalrn: {
    slug: "oquecomernatalrn", handle: "@oquecomernatalrn", period_days: 30,
    followers: 249_000, followers_growth: 1_200, followers_growth_pct: 0.48,
    reach: 98_000, impressions: 148_000, profile_visits: 7_100,
    engagement_rate: 0.048, total_likes: 11_800, total_comments: 590, total_saves: 1_600, total_shares: 310,
    posts_published: 11, reels_published: 6, stories_published: 40, avg_reel_views: 14_000,
    cpm_kratos: 0.15, cpm_meta_ads: 18.50, cpm_savings_pct: 99.19,
    estimated_publi_value_brl: 1_100,
    source: "sample_data", data_as_of: makeTimestamp(),
  },
  natalaivoueu: {
    slug: "natalaivoueu", handle: "@natalaivoueu", period_days: 30,
    followers: 240_000, followers_growth: 900, followers_growth_pct: 0.38,
    reach: 94_000, impressions: 142_000, profile_visits: 6_800,
    engagement_rate: 0.044, total_likes: 10_400, total_comments: 420, total_saves: 1_400, total_shares: 280,
    posts_published: 8, reels_published: 4, stories_published: 30, avg_reel_views: 12_000,
    cpm_kratos: 0.15, cpm_meta_ads: 18.50, cpm_savings_pct: 99.19,
    estimated_publi_value_brl: 980,
    source: "sample_data", data_as_of: makeTimestamp(),
  },
};

// Total reach e followers
export const SAMPLE_TOTALS = {
  total_followers: PAGE_SLUGS.reduce((acc, slug) => acc + SAMPLE_PAGE_METRICS[slug].followers, 0),
  total_reach_30d: PAGE_SLUGS.reduce((acc, slug) => acc + SAMPLE_PAGE_METRICS[slug].reach, 0),
  total_estimated_value_brl: PAGE_SLUGS.reduce((acc, slug) => acc + SAMPLE_PAGE_METRICS[slug].estimated_publi_value_brl, 0),
  avg_engagement_rate: PAGE_SLUGS.reduce((acc, slug) => acc + SAMPLE_PAGE_METRICS[slug].engagement_rate, 0) / PAGE_SLUGS.length,
  source: "sample_data" as AnalyticsSource,
};

// Alertas de amostra
export const SAMPLE_ALERTS: AnalyticsAlert[] = [
  {
    id: "alert-001",
    type: "opportunity",
    severity: "info",
    slug: "oquecomernatalrn",
    title: "Alto crescimento detectado",
    description: "@oquecomernatalrn cresceu 0.48% nos últimos 30 dias — acima da média das páginas.",
    suggested_action: "Aumentar frequência de posts de gastronomia neste perfil.",
    created_at: new Date(0).toISOString(),
  },
  {
    id: "alert-002",
    type: "warning",
    severity: "warning",
    slug: undefined,
    title: "OAuth Meta não configurado",
    description: "OAuth Meta não configurado — dados reais do Instagram não coletados. Métricas são sample_data.",
    suggested_action: "Configurar META_APP_ID + META_APP_SECRET para dados reais.",
    created_at: new Date(0).toISOString(),
  },
  {
    id: "alert-003",
    type: "milestone",
    severity: "info",
    slug: "lucastigrereal",
    title: "CPM 99% abaixo do Meta Ads",
    description: "R$0,15/mil vs R$18,50/mil — economia de R$2.650 por campanha.",
    suggested_action: "Apresentar este dado como diferencial em propostas.",
    created_at: new Date(0).toISOString(),
  },
];
