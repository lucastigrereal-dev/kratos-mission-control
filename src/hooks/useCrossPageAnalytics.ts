/**
 * useCrossPageAnalytics — W12
 * Hook para analytics cruzado das 6 páginas.
 * Consome OMNIS /marketing/analytics/cross-pages com fallback mock.
 *
 * OMNIS W24 endpoint: GET /marketing/analytics/cross-pages?period=30
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import {
  CrossPageEnvelopeSchema,
  PAGE_SLUGS,
  type CrossPageAnalytics,
  type WeeklyMetricPoint,
} from "../../api-contract/marketing.schema";
import type { DataSource } from "../../api-contract/source-badge.schema";

// ── Mock factory ──────────────────────────────────────────────────────────────

function makeWeek(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offset * 7);
  const year = d.getFullYear();
  const start = new Date(year, 0, 1);
  const week = Math.ceil((((d.getTime() - start.getTime()) / 86_400_000) + start.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

const BASE_REACH: Record<string, number> = {
  lucastigrereal:    280_000,
  oinatalrn:         195_000,
  agenteviajabrasil: 142_000,
  afamiliatigrereal: 110_000,
  oquecomernatalrn:  85_000,
  natalaivoueu:      74_000,
};

function makeMockCrossAnalytics(periodDays: number): CrossPageAnalytics {
  const weeks = Math.min(Math.ceil(periodDays / 7), 12);
  const series: WeeklyMetricPoint[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const weekStr = makeWeek(w);
    for (const slug of PAGE_SLUGS) {
      const base = BASE_REACH[slug] ?? 50_000;
      const jitter = 0.85 + Math.random() * 0.3;
      series.push({
        week:           weekStr,
        slug,
        reach:          Math.round(base * jitter / weeks * periodDays / 7),
        engagement_pct: +(3.5 + Math.random() * 2).toFixed(2),
        new_followers:  Math.round(200 + Math.random() * 800),
      });
    }
  }

  return {
    period_days:   periodDays,
    top_performer: "lucastigrereal",
    weekly_series: series,
    source:        "mock",
    updated_at:    new Date().toISOString(),
  };
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchCrossPageAnalytics(
  periodDays: number,
): Promise<{ analytics: CrossPageAnalytics | null; sourceType: DataSource }> {
  const result = await apiGet(`/marketing/analytics/cross-pages?period=${periodDays}`);

  if (!result.ok || result.raw == null) {
    return { analytics: makeMockCrossAnalytics(periodDays), sourceType: "partial" };
  }

  const parsed = CrossPageEnvelopeSchema.safeParse(result.raw);
  if (!parsed.success || !parsed.data.data) {
    return { analytics: makeMockCrossAnalytics(periodDays), sourceType: "partial" };
  }

  const src = parsed.data.source;
  const sourceType: DataSource = src === "live" ? "live" : src === "cached" ? "cache" : "partial";
  return { analytics: parsed.data.data, sourceType };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export type PeriodFilter = 7 | 30 | 90;

export interface UseCrossPageAnalyticsResult {
  analytics: CrossPageAnalytics | null;
  sourceType: DataSource;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useCrossPageAnalytics(
  periodDays: PeriodFilter = 30,
): UseCrossPageAnalyticsResult {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey:        ["marketing", "cross-analytics", periodDays],
    queryFn:         () => fetchCrossPageAnalytics(periodDays),
    staleTime:       120_000,
    refetchInterval: 120_000,
    retry:           1,
  });

  return {
    analytics:  query.data?.analytics ?? null,
    sourceType: query.data?.sourceType ?? (query.isError ? "error" : "partial"),
    isLoading:  query.isLoading,
    isError:    query.isError,
    refetch:    () => void qc.invalidateQueries({ queryKey: ["marketing", "cross-analytics"] }),
  };
}
