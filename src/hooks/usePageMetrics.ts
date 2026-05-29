/**
 * usePageMetrics — W12
 * Hook para métricas por página do Instagram.
 * Consome OMNIS /marketing/pages/:slug/metrics com fallback para mock.
 *
 * OMNIS W24 endpoint: GET /marketing/pages/{slug}/metrics?period=7
 * Response: PageMetricsEnvelope
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import {
  PageMetricsEnvelopeSchema,
  type PageMetrics,
  type PageSlug,
} from "../../api-contract/marketing.schema";
import type { DataSource } from "../../api-contract/source-badge.schema";

// ── Mock factory ──────────────────────────────────────────────────────────────

const MOCK_METRICS_BY_SLUG: Record<string, Partial<PageMetrics>> = {
  lucastigrereal:    { reach: 285_000, engagement_rate_pct: 3.8, new_followers: 1_200, posts_published: 5, reach_trend_pct: 4.2  },
  oinatalrn:         { reach: 198_000, engagement_rate_pct: 4.1, new_followers: 850,   posts_published: 7, reach_trend_pct: 2.8  },
  agenteviajabrasil: { reach: 145_000, engagement_rate_pct: 3.5, new_followers: 620,   posts_published: 6, reach_trend_pct: -1.2 },
  afamiliatigrereal: { reach: 112_000, engagement_rate_pct: 5.2, new_followers: 430,   posts_published: 4, reach_trend_pct: 6.5  },
  oquecomernatalrn:  { reach: 88_000,  engagement_rate_pct: 4.8, new_followers: 310,   posts_published: 9, reach_trend_pct: 3.1  },
  natalaivoueu:      { reach: 76_000,  engagement_rate_pct: 4.4, new_followers: 280,   posts_published: 6, reach_trend_pct: 1.8  },
};

function makeMockMetrics(slug: string): PageMetrics {
  const overrides = MOCK_METRICS_BY_SLUG[slug] ?? {};
  return {
    slug,
    period_days:          7,
    reach:                overrides.reach ?? 50_000,
    impressions:          (overrides.reach ?? 50_000) * 2,
    engagement_rate_pct:  overrides.engagement_rate_pct ?? 3.0,
    new_followers:        overrides.new_followers ?? 100,
    posts_published:      overrides.posts_published ?? 4,
    reach_trend_pct:      overrides.reach_trend_pct ?? 0,
    engagement_trend_pct: 0.3,
    followers_trend_pct:  0.2,
    top_post: {
      post_id:         `${slug}-top-1`,
      caption_preview: "Confira essa dica incrível que pode mudar sua rotina…",
      format:          "reel",
      reach:           Math.round((overrides.reach ?? 50_000) * 0.4),
      likes:           Math.round((overrides.reach ?? 50_000) * 0.04),
      comments:        Math.round((overrides.reach ?? 50_000) * 0.002),
      published_at:    new Date(Date.now() - 2 * 86_400_000).toISOString(),
    },
    format_breakdown: { reel: 3, carrossel: 2, post: 1, story: 8 },
    source:     "mock",
    updated_at: new Date().toISOString(),
  };
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchPageMetrics(
  slug: string,
  periodDays = 7,
): Promise<{ metrics: PageMetrics | null; sourceType: DataSource }> {
  const result = await apiGet(`/marketing/pages/${slug}/metrics?period=${periodDays}`);

  if (!result.ok || result.raw == null) {
    // Backend not available → return mock data
    return { metrics: makeMockMetrics(slug), sourceType: "partial" };
  }

  const parsed = PageMetricsEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success || !parsed.data.data) {
    return { metrics: makeMockMetrics(slug), sourceType: "partial" };
  }

  const src = parsed.data.source;
  const sourceType: DataSource = src === "live" ? "live" : src === "cached" ? "cache" : "partial";
  return { metrics: parsed.data.data, sourceType };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UsePageMetricsResult {
  metrics: PageMetrics | null;
  sourceType: DataSource;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function usePageMetrics(
  slug: PageSlug | string,
  periodDays = 7,
): UsePageMetricsResult {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey:        ["marketing", "page", slug, periodDays],
    queryFn:         () => fetchPageMetrics(slug, periodDays),
    staleTime:       60_000,
    refetchInterval: 60_000,
    retry:           1,
  });

  return {
    metrics:    query.data?.metrics ?? null,
    sourceType: query.data?.sourceType ?? (query.isError ? "error" : "partial"),
    isLoading:  query.isLoading,
    isError:    query.isError,
    refetch:    () => void qc.invalidateQueries({ queryKey: ["marketing", "page", slug] }),
  };
}
