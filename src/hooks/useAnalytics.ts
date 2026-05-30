/**
 * useAnalytics — W21 Hook de Analytics Local
 *
 * Retorna métricas das 6 páginas Instagram em modo sample_data.
 * Meta OAuth é um Human Slot — não conectado.
 * Source badge sempre visível: sample_data / unavailable.
 */

import { useMemo, useState } from "react";
import type { PageSlug } from "../../api-contract/marketing.schema";
import { PAGE_SLUGS } from "../../api-contract/marketing.schema";
import {
  SAMPLE_PAGE_METRICS,
  SAMPLE_TOTALS,
  SAMPLE_ALERTS,
  META_OAUTH_SLOT,
} from "../../api-contract/analytics.schema";
import type { FullPageMetrics, AnalyticsSource } from "../../api-contract/analytics.schema";

export type AnalyticsPeriod = 7 | 30 | 90;

export interface UseAnalyticsResult {
  metrics: Record<PageSlug, FullPageMetrics>;
  totals: typeof SAMPLE_TOTALS;
  alerts: typeof SAMPLE_ALERTS;
  metaOAuthSlot: typeof META_OAUTH_SLOT;
  source: AnalyticsSource;
  isLiveMeta: false;        // sempre false em W21
  selectedPeriod: AnalyticsPeriod;
  setSelectedPeriod: (p: AnalyticsPeriod) => void;
  /** Rankings */
  rankedByReach: FullPageMetrics[];
  rankedByEngagement: FullPageMetrics[];
  rankedByGrowth: FullPageMetrics[];
  /** Comparativo */
  leaderByReach: string;
  leaderByEngagement: string;
  leaderByGrowth: string;
}

export function useAnalytics(): UseAnalyticsResult {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(30);

  // Em W21, todos os dados são sample_data independente do período
  const allMetrics = useMemo(() => {
    return { ...SAMPLE_PAGE_METRICS };
  }, []);

  const rankedByReach = useMemo(
    () => [...PAGE_SLUGS].map((s) => allMetrics[s]).sort((a, b) => b.reach - a.reach),
    [allMetrics],
  );

  const rankedByEngagement = useMemo(
    () => [...PAGE_SLUGS].map((s) => allMetrics[s]).sort((a, b) => b.engagement_rate - a.engagement_rate),
    [allMetrics],
  );

  const rankedByGrowth = useMemo(
    () => [...PAGE_SLUGS].map((s) => allMetrics[s]).sort((a, b) => b.followers_growth_pct - a.followers_growth_pct),
    [allMetrics],
  );

  return {
    metrics: allMetrics,
    totals: SAMPLE_TOTALS,
    alerts: SAMPLE_ALERTS,
    metaOAuthSlot: META_OAUTH_SLOT,
    source: "sample_data",
    isLiveMeta: false,
    selectedPeriod,
    setSelectedPeriod,
    rankedByReach,
    rankedByEngagement,
    rankedByGrowth,
    leaderByReach: rankedByReach[0]?.slug ?? "—",
    leaderByEngagement: rankedByEngagement[0]?.slug ?? "—",
    leaderByGrowth: rankedByGrowth[0]?.slug ?? "—",
  };
}
