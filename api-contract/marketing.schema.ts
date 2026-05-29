/**
 * marketing.schema.ts — W12
 * Contratos para as 6 páginas do Instagram de Lucas Tigre.
 * Sincronizado com OMNIS W24 Pydantic models (quando disponível).
 *
 * Páginas:
 *   lucastigrereal      — @lucastigrereal      690K  (Autoridade/Lifestyle)
 *   oinatalrn           — @oinatalrn           630K  (Turismo Natal/RN)
 *   agenteviajabrasil   — @agenteviajabrasil   452K  (Viagens Brasil)
 *   afamiliatigrereal   — @afamiliatigrereal   320K  (Família)
 *   oquecomernatalrn    — @oquecomernatalrn    249K  (Gastronomia Natal)
 *   natalaivoueu        — @natalaivoueu        240K  (Guia Natal/Praias)
 */

import { z } from "zod";

// ── Page slugs ────────────────────────────────────────────────────────────────

export const PAGE_SLUGS = [
  "lucastigrereal",
  "oinatalrn",
  "agenteviajabrasil",
  "afamiliatigrereal",
  "oquecomernatalrn",
  "natalaivoueu",
] as const;

export type PageSlug = typeof PAGE_SLUGS[number];

// ── PageProfile ───────────────────────────────────────────────────────────────

export const PageProfileSchema = z.object({
  slug:       z.string(),
  handle:     z.string(),
  name:       z.string(),
  niche:      z.string(),
  followers:  z.number().int().min(0),
  avatar_url: z.string().url().nullable().optional(),
  is_primary: z.boolean().default(false),
});

// ── PageMetrics (por-página, período semanal) ─────────────────────────────────

export const PostFormatSchema = z.enum(["reel", "carrossel", "post", "story"]);
export type PostFormat = z.infer<typeof PostFormatSchema>;

export const TopPostSchema = z.object({
  post_id:         z.string(),
  caption_preview: z.string().max(120),
  format:          PostFormatSchema,
  reach:           z.number().int().min(0),
  likes:           z.number().int().min(0),
  comments:        z.number().int().min(0),
  published_at:    z.string().nullable().optional(),
  thumbnail_url:   z.string().nullable().optional(),
});

export const PageMetricsSchema = z.object({
  slug:                  z.string(),
  period_days:           z.number().int().min(1).default(7),
  reach:                 z.number().int().min(0).default(0),
  impressions:           z.number().int().min(0).default(0),
  engagement_rate_pct:   z.number().min(0).default(0),
  new_followers:         z.number().int().default(0),
  posts_published:       z.number().int().min(0).default(0),
  reach_trend_pct:       z.number().default(0),
  engagement_trend_pct:  z.number().default(0),
  followers_trend_pct:   z.number().default(0),
  top_post:              TopPostSchema.nullable().optional(),
  format_breakdown:      z.record(PostFormatSchema, z.number().int().min(0)).optional(),
  source:                z.enum(["live", "cached", "mock", "error"]).default("mock"),
  updated_at:            z.string().nullable().optional(),
});

export const PageMetricsEnvelopeSchema = z.object({
  data:   PageMetricsSchema.nullable(),
  source: z.enum(["live", "cached", "mock", "error"]).default("mock"),
  error:  z.string().nullable().optional(),
});

// ── CrossPageAnalytics ────────────────────────────────────────────────────────

export const WeeklyMetricPointSchema = z.object({
  week:           z.string(),   // "2026-W20"
  slug:           z.string(),
  reach:          z.number().int().min(0),
  engagement_pct: z.number().min(0),
  new_followers:  z.number().int(),
});

export const CrossPageAnalyticsSchema = z.object({
  period_days:     z.number().int().min(1).default(30),
  top_performer:   z.string().nullable().optional(),
  weekly_series:   z.array(WeeklyMetricPointSchema),
  source:          z.enum(["live", "cached", "mock", "error"]).default("mock"),
  updated_at:      z.string().nullable().optional(),
});

export const CrossPageEnvelopeSchema = z.object({
  data:   CrossPageAnalyticsSchema.nullable(),
  source: z.enum(["live", "cached", "mock", "error"]).default("mock"),
  error:  z.string().nullable().optional(),
});

// ── TypeScript types ──────────────────────────────────────────────────────────

export type PageProfile         = z.infer<typeof PageProfileSchema>;
export type PageMetrics         = z.infer<typeof PageMetricsSchema>;
export type PageMetricsEnvelope = z.infer<typeof PageMetricsEnvelopeSchema>;
export type TopPost             = z.infer<typeof TopPostSchema>;
export type WeeklyMetricPoint   = z.infer<typeof WeeklyMetricPointSchema>;
export type CrossPageAnalytics  = z.infer<typeof CrossPageAnalyticsSchema>;

// ── Canonical page profiles (static metadata) ────────────────────────────────

export const PAGE_PROFILES: Record<PageSlug, PageProfile> = {
  lucastigrereal:    { slug: "lucastigrereal",    handle: "@lucastigrereal",    name: "Lucas Tigre",          niche: "Autoridade / Lifestyle", followers: 690_000, is_primary: true  },
  oinatalrn:         { slug: "oinatalrn",         handle: "@oinatalrn",         name: "O que é Natal",        niche: "Turismo Natal/RN",       followers: 630_000, is_primary: false },
  agenteviajabrasil: { slug: "agenteviajabrasil", handle: "@agenteviajabrasil", name: "A Gente Viaja Brasil", niche: "Viagens Brasil",          followers: 452_000, is_primary: false },
  afamiliatigrereal: { slug: "afamiliatigrereal", handle: "@afamiliatigrereal", name: "A Família Tigre",      niche: "Família",                 followers: 320_000, is_primary: false },
  oquecomernatalrn:  { slug: "oquecomernatalrn",  handle: "@oquecomernatalrn",  name: "O Que Comer em Natal", niche: "Gastronomia Natal",       followers: 249_000, is_primary: false },
  natalaivoueu:      { slug: "natalaivoueu",      handle: "@natalaivoueu",      name: "Natal, Ai Vou Eu",     niche: "Guia Natal / Praias",     followers: 240_000, is_primary: false },
};

export const TOTAL_FOLLOWERS = Object.values(PAGE_PROFILES)
  .reduce((sum, p) => sum + p.followers, 0); // 2_581_000
