/**
 * W12 — Multi-Page Cockpit: unit tests for pure logic
 *
 * Scope:
 *  - formatNumber helper (PageCard)
 *  - TrendBadge threshold
 *  - Mock data shape validation (usePageMetrics, useCrossPageAnalytics)
 *  - Chart data derivation helpers (PerformanceCharts)
 *  - PageSwitcher fmtFollowers
 *  - PAGE_PROFILES & TOTAL_FOLLOWERS invariants
 *  - PeriodFilter values
 *
 * All tests are pure-logic (no DOM, no React) — bun:test compatible.
 */

import { describe, it, expect } from "bun:test";
import {
  PAGE_PROFILES,
  PAGE_SLUGS,
  TOTAL_FOLLOWERS,
  type PageMetrics,
  type WeeklyMetricPoint,
} from "../../api-contract/marketing.schema";

// ── Mirrored helpers (must match component implementations) ──────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function trendBadgeState(pct: number): "flat" | "up" | "down" {
  if (Math.abs(pct) < 0.5) return "flat";
  return pct > 0 ? "up" : "down";
}

function fmtFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

// Mirrors topSlugs from PerformanceCharts
function topSlugs(series: WeeklyMetricPoint[], n = 3): string[] {
  const totals: Record<string, number> = {};
  for (const pt of series) {
    totals[pt.slug] = (totals[pt.slug] ?? 0) + pt.reach;
  }
  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([slug]) => slug);
}

// Mirrors buildTrendData from PerformanceCharts
function buildTrendData(
  series: WeeklyMetricPoint[],
  slugsToShow: string[],
): Record<string, string | number>[] {
  const weeks = [...new Set(series.map((p) => p.week))].sort();
  return weeks.map((week) => {
    const row: Record<string, string | number> = { week };
    for (const slug of slugsToShow) {
      const pt = series.find((p) => p.week === week && p.slug === slug);
      row[slug] = pt?.reach ?? 0;
    }
    return row;
  });
}

// Mirrors buildBarData from PerformanceCharts
function buildBarData(series: WeeklyMetricPoint[]): { slug: string; reach: number }[] {
  const totals: Record<string, number> = {};
  for (const pt of series) {
    totals[pt.slug] = (totals[pt.slug] ?? 0) + pt.reach;
  }
  return PAGE_SLUGS
    .map((slug) => ({ slug, reach: totals[slug] ?? 0 }))
    .sort((a, b) => b.reach - a.reach);
}

// Mirrors hotSlug detection from AgenciaScreen
function detectHotSlug(metricsMap: Record<string, number>): string | null {
  let best: string | null = null;
  let bestReach = -1;
  for (const [slug, reach] of Object.entries(metricsMap)) {
    if (reach > bestReach) { bestReach = reach; best = slug; }
  }
  return best;
}

// ── PAGE_PROFILES invariants ─────────────────────────────────────────────────

describe("PAGE_PROFILES", () => {
  it("has exactly 6 pages", () => {
    expect(Object.keys(PAGE_PROFILES)).toHaveLength(6);
  });

  it("matches PAGE_SLUGS order", () => {
    for (const slug of PAGE_SLUGS) {
      expect(PAGE_PROFILES[slug]).toBeDefined();
    }
  });

  it("has only 1 primary page (lucastigrereal)", () => {
    const primaries = Object.values(PAGE_PROFILES).filter((p) => p.is_primary);
    expect(primaries).toHaveLength(1);
    expect(primaries[0]?.slug).toBe("lucastigrereal");
  });

  it("all pages have valid follower counts > 0", () => {
    for (const profile of Object.values(PAGE_PROFILES)) {
      expect(profile.followers).toBeGreaterThan(0);
    }
  });

  it("pages are ordered by followers descending", () => {
    const followers = PAGE_SLUGS.map((s) => PAGE_PROFILES[s]!.followers);
    for (let i = 1; i < followers.length; i++) {
      expect(followers[i - 1]).toBeGreaterThanOrEqual(followers[i]!);
    }
  });

  it("lucastigrereal has most followers (690K)", () => {
    expect(PAGE_PROFILES.lucastigrereal.followers).toBe(690_000);
  });

  it("natalaivoueu has fewest followers (240K)", () => {
    expect(PAGE_PROFILES.natalaivoueu.followers).toBe(240_000);
  });

  it("all handles start with @", () => {
    for (const profile of Object.values(PAGE_PROFILES)) {
      expect(profile.handle.startsWith("@")).toBe(true);
    }
  });
});

describe("TOTAL_FOLLOWERS", () => {
  it("equals sum of all page followers", () => {
    const sum = Object.values(PAGE_PROFILES).reduce((s, p) => s + p.followers, 0);
    expect(TOTAL_FOLLOWERS).toBe(sum);
  });

  it("is 2_581_000", () => {
    expect(TOTAL_FOLLOWERS).toBe(2_581_000);
  });
});

// ── formatNumber ─────────────────────────────────────────────────────────────

describe("formatNumber", () => {
  it("formats millions", () => {
    expect(formatNumber(1_500_000)).toBe("1.5M");
    expect(formatNumber(2_581_000)).toBe("2.6M");
  });

  it("formats thousands", () => {
    expect(formatNumber(285_000)).toBe("285K");
    expect(formatNumber(1_000)).toBe("1K");
    expect(formatNumber(9_999)).toBe("10K");
  });

  it("formats small numbers as-is", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(500)).toBe("500");
  });

  it("formats engagement counts (small)", () => {
    expect(formatNumber(850)).toBe("850");
    expect(formatNumber(1_200)).toBe("1K");
  });
});

// ── trendBadgeState ───────────────────────────────────────────────────────────

describe("trendBadgeState", () => {
  it("returns flat for |pct| < 0.5", () => {
    expect(trendBadgeState(0)).toBe("flat");
    expect(trendBadgeState(0.4)).toBe("flat");
    expect(trendBadgeState(-0.4)).toBe("flat");
    expect(trendBadgeState(-0.49)).toBe("flat");
  });

  it("threshold is exactly 0.5 (exclusive)", () => {
    expect(trendBadgeState(0.5)).toBe("up");
    expect(trendBadgeState(-0.5)).toBe("down");
  });

  it("returns up for positive pct >= 0.5", () => {
    expect(trendBadgeState(1)).toBe("up");
    expect(trendBadgeState(4.2)).toBe("up");
    expect(trendBadgeState(100)).toBe("up");
  });

  it("returns down for negative pct <= -0.5", () => {
    expect(trendBadgeState(-1)).toBe("down");
    expect(trendBadgeState(-1.2)).toBe("down");
    expect(trendBadgeState(-50)).toBe("down");
  });
});

// ── fmtFollowers (PageSwitcher) ───────────────────────────────────────────────

describe("fmtFollowers (PageSwitcher)", () => {
  it("formats millions", () => {
    expect(fmtFollowers(2_581_000)).toBe("2.6M");
  });

  it("formats thousands (rounded)", () => {
    expect(fmtFollowers(690_000)).toBe("690K");
    expect(fmtFollowers(452_000)).toBe("452K");
    expect(fmtFollowers(1_500)).toBe("2K"); // Math.round(1500/1000) = 2
  });

  it("formats small numbers verbatim", () => {
    expect(fmtFollowers(999)).toBe("999");
    expect(fmtFollowers(0)).toBe("0");
  });
});

// ── topSlugs ─────────────────────────────────────────────────────────────────

describe("topSlugs", () => {
  const makeSeries = (): WeeklyMetricPoint[] => [
    { week: "2026-W01", slug: "lucastigrereal",    reach: 100_000, engagement_pct: 3.8, new_followers: 500 },
    { week: "2026-W01", slug: "oinatalrn",         reach: 80_000,  engagement_pct: 4.1, new_followers: 400 },
    { week: "2026-W01", slug: "agenteviajabrasil", reach: 60_000,  engagement_pct: 3.5, new_followers: 300 },
    { week: "2026-W01", slug: "afamiliatigrereal", reach: 40_000,  engagement_pct: 5.2, new_followers: 200 },
    { week: "2026-W01", slug: "oquecomernatalrn",  reach: 30_000,  engagement_pct: 4.8, new_followers: 150 },
    { week: "2026-W01", slug: "natalaivoueu",      reach: 20_000,  engagement_pct: 4.4, new_followers: 100 },
    { week: "2026-W02", slug: "lucastigrereal",    reach: 120_000, engagement_pct: 4.0, new_followers: 600 },
    { week: "2026-W02", slug: "oinatalrn",         reach: 90_000,  engagement_pct: 4.2, new_followers: 450 },
    { week: "2026-W02", slug: "agenteviajabrasil", reach: 70_000,  engagement_pct: 3.7, new_followers: 350 },
  ];

  it("returns top 3 slugs by total reach", () => {
    const result = topSlugs(makeSeries(), 3);
    expect(result).toHaveLength(3);
    expect(result[0]).toBe("lucastigrereal");  // 220K total
    expect(result[1]).toBe("oinatalrn");        // 170K total
    expect(result[2]).toBe("agenteviajabrasil"); // 130K total
  });

  it("returns top 1 slug", () => {
    const result = topSlugs(makeSeries(), 1);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe("lucastigrereal");
  });

  it("handles empty series", () => {
    const result = topSlugs([], 3);
    expect(result).toHaveLength(0);
  });

  it("doesn't exceed available slugs", () => {
    const result = topSlugs(makeSeries(), 10);
    // Series only has entries for some slugs
    expect(result.length).toBeLessThanOrEqual(10);
  });
});

// ── buildTrendData ────────────────────────────────────────────────────────────

describe("buildTrendData", () => {
  const series: WeeklyMetricPoint[] = [
    { week: "2026-W01", slug: "lucastigrereal", reach: 100_000, engagement_pct: 3.8, new_followers: 500 },
    { week: "2026-W01", slug: "oinatalrn",      reach: 80_000,  engagement_pct: 4.1, new_followers: 400 },
    { week: "2026-W02", slug: "lucastigrereal", reach: 120_000, engagement_pct: 4.0, new_followers: 600 },
    { week: "2026-W02", slug: "oinatalrn",      reach: 90_000,  engagement_pct: 4.2, new_followers: 450 },
  ];

  it("produces one row per week", () => {
    const data = buildTrendData(series, ["lucastigrereal", "oinatalrn"]);
    expect(data).toHaveLength(2);
  });

  it("weeks are sorted", () => {
    const data = buildTrendData(series, ["lucastigrereal"]);
    expect(data[0]?.week).toBe("2026-W01");
    expect(data[1]?.week).toBe("2026-W02");
  });

  it("each row contains a value per requested slug", () => {
    const data = buildTrendData(series, ["lucastigrereal", "oinatalrn"]);
    expect(data[0]?.["lucastigrereal"]).toBe(100_000);
    expect(data[0]?.["oinatalrn"]).toBe(80_000);
    expect(data[1]?.["lucastigrereal"]).toBe(120_000);
  });

  it("missing data defaults to 0", () => {
    const data = buildTrendData(series, ["lucastigrereal", "afamiliatigrereal"]);
    // afamiliatigrereal not in series
    expect(data[0]?.["afamiliatigrereal"]).toBe(0);
    expect(data[1]?.["afamiliatigrereal"]).toBe(0);
  });

  it("empty series returns empty array", () => {
    expect(buildTrendData([], ["lucastigrereal"])).toHaveLength(0);
  });
});

// ── buildBarData ──────────────────────────────────────────────────────────────

describe("buildBarData", () => {
  const series: WeeklyMetricPoint[] = [
    { week: "2026-W01", slug: "lucastigrereal", reach: 100_000, engagement_pct: 3.8, new_followers: 500 },
    { week: "2026-W02", slug: "lucastigrereal", reach: 120_000, engagement_pct: 4.0, new_followers: 600 },
    { week: "2026-W01", slug: "oinatalrn",      reach: 80_000,  engagement_pct: 4.1, new_followers: 400 },
  ];

  it("returns one bar per PAGE_SLUG", () => {
    const data = buildBarData(series);
    expect(data).toHaveLength(PAGE_SLUGS.length);
  });

  it("accumulates reach across weeks", () => {
    const data = buildBarData(series);
    const lt = data.find((d) => d.slug === "lucastigrereal");
    expect(lt?.reach).toBe(220_000); // 100K + 120K
  });

  it("pages without data have reach=0", () => {
    const data = buildBarData(series);
    const missing = data.find((d) => d.slug === "natalaivoueu");
    expect(missing?.reach).toBe(0);
  });

  it("sorted descending by reach", () => {
    const data = buildBarData(series);
    for (let i = 1; i < data.length; i++) {
      expect(data[i - 1]!.reach).toBeGreaterThanOrEqual(data[i]!.reach);
    }
  });
});

// ── detectHotSlug ─────────────────────────────────────────────────────────────

describe("detectHotSlug", () => {
  it("returns slug with highest reach", () => {
    const map = {
      lucastigrereal:    285_000,
      oinatalrn:         198_000,
      agenteviajabrasil: 145_000,
      afamiliatigrereal: 112_000,
      oquecomernatalrn:  88_000,
      natalaivoueu:      76_000,
    };
    expect(detectHotSlug(map)).toBe("lucastigrereal");
  });

  it("returns correct slug when another page leads", () => {
    const map = {
      lucastigrereal:    100,
      oinatalrn:         999_999,
    };
    expect(detectHotSlug(map)).toBe("oinatalrn");
  });

  it("returns null for empty map", () => {
    expect(detectHotSlug({})).toBeNull();
  });

  it("handles tie by keeping first encountered", () => {
    const map = { pageA: 1000, pageB: 1000 };
    // Both equal — one of them returned, not null
    expect(detectHotSlug(map)).not.toBeNull();
  });
});

// ── PageMetrics shape ─────────────────────────────────────────────────────────

describe("PageMetrics shape invariants", () => {
  const validMetrics: PageMetrics = {
    slug: "lucastigrereal",
    period_days: 7,
    reach: 285_000,
    impressions: 570_000,
    engagement_rate_pct: 3.8,
    new_followers: 1_200,
    posts_published: 5,
    reach_trend_pct: 4.2,
    engagement_trend_pct: 0.3,
    followers_trend_pct: 0.2,
    source: "mock",
    updated_at: new Date().toISOString(),
  };

  it("reach is non-negative", () => {
    expect(validMetrics.reach).toBeGreaterThanOrEqual(0);
  });

  it("impressions >= reach (always)", () => {
    expect(validMetrics.impressions).toBeGreaterThanOrEqual(validMetrics.reach);
  });

  it("engagement_rate_pct is a percentage (0-100 realistic)", () => {
    expect(validMetrics.engagement_rate_pct).toBeGreaterThanOrEqual(0);
    expect(validMetrics.engagement_rate_pct).toBeLessThan(100);
  });

  it("period_days is positive integer", () => {
    expect(Number.isInteger(validMetrics.period_days)).toBe(true);
    expect(validMetrics.period_days).toBeGreaterThan(0);
  });
});

// ── PeriodFilter values ───────────────────────────────────────────────────────

describe("PeriodFilter", () => {
  const validPeriods = [7, 30, 90] as const;

  it("has exactly 3 valid values", () => {
    expect(validPeriods).toHaveLength(3);
  });

  it("periods are ascending", () => {
    expect(validPeriods[0]).toBeLessThan(validPeriods[1]!);
    expect(validPeriods[1]).toBeLessThan(validPeriods[2]!);
  });

  it("shortest period is 7 days", () => {
    expect(validPeriods[0]).toBe(7);
  });

  it("longest period is 90 days", () => {
    expect(validPeriods[2]).toBe(90);
  });
});
