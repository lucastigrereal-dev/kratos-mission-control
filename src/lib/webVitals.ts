/**
 * KRATOS Web Vitals — W11-B6
 *
 * Mede Core Web Vitals e os reporta via analytics interno + Sentry breadcrumb.
 * Thresholds baseados nos critérios Google 2024:
 *   LCP  ≤ 2500ms   → good  | ≤ 4000ms → needs improvement | > 4000ms → poor
 *   FID  ≤ 100ms    → good  | ≤ 300ms  → needs improvement | > 300ms  → poor
 *   CLS  ≤ 0.1      → good  | ≤ 0.25   → needs improvement | > 0.25   → poor
 *   FCP  ≤ 1800ms   → good  | ≤ 3000ms → needs improvement | > 3000ms → poor
 *   TTFB ≤ 800ms    → good  | ≤ 1800ms → needs improvement | > 1800ms → poor
 *   INP  ≤ 200ms    → good  | ≤ 500ms  → needs improvement | > 500ms  → poor
 *
 * Chame reportWebVitals() uma vez após a hidratação (ver __root.tsx).
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import type { Metric } from "web-vitals";
import { track } from "@/lib/analytics/kratosAnalytics";
import { addBreadcrumb, sentryEnabled } from "@/lib/sentry";

// ── Thresholds ────────────────────────────────────────────────────────────

// FID removed in web-vitals v4+ (superseded by INP)
const THRESHOLDS: Record<string, [number, number]> = {
  LCP:  [2500, 4000],
  CLS:  [0.1,  0.25],
  FCP:  [1800, 3000],
  TTFB: [800,  1800],
  INP:  [200,  500],
};

type VitalRating = "good" | "needs-improvement" | "poor";

function getRating(name: string, value: number): VitalRating {
  const [good, poor] = THRESHOLDS[name] ?? [Infinity, Infinity];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

// ── Reporter ──────────────────────────────────────────────────────────────

function reportMetric(metric: Metric): void {
  const rating = getRating(metric.name, metric.value);
  const valueRounded = Math.round(metric.value * 100) / 100;

  // Track via internal analytics
  track("route_view", {
    // Reuse route_view bucket — name disambiguation via props
    path: `__webvital__${metric.name}`,
    session_age_s: 0,
  });

  // Sentry breadcrumb (infra observability, not an error)
  if (sentryEnabled()) {
    addBreadcrumb(
      `${metric.name} ${rating}: ${valueRounded}`,
      "web-vitals",
      {
        name: metric.name,
        value: valueRounded,
        rating,
        id: metric.id,
        delta: Math.round(metric.delta * 100) / 100,
        navigationType: metric.navigationType,
      },
      rating === "poor" ? "warning" : "info",
    );
  }

  // Dev: surface in console for local Lighthouse tuning
  if (import.meta.env?.DEV) {
    const emoji = rating === "good" ? "✅" : rating === "needs-improvement" ? "🟡" : "🔴";
    console.debug(
      `[webvitals] ${emoji} ${metric.name} ${valueRounded} (${rating})`,
    );
  }
}

// ── Public API ────────────────────────────────────────────────────────────

let _installed = false;

/**
 * Inicia a coleta de Web Vitals.
 * Chame uma vez após hidratação — idempotente.
 */
export function reportWebVitals(): void {
  if (typeof window === "undefined") return; // SSR guard
  if (_installed) return;
  _installed = true;

  onCLS(reportMetric);
  onFCP(reportMetric);
  // onFID removed in web-vitals v4 — replaced by INP
  onINP(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);
}
