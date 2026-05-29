/**
 * PerformanceCharts — W12-B2
 * Gráficos de performance cross-page para o cockpit multi-page.
 *
 * Props:
 *  - analytics: CrossPageAnalytics | null
 *  - period: PeriodFilter (7 | 30 | 90)
 *  - onPeriodChange: (p: PeriodFilter) => void
 *  - isLoading: boolean
 *
 * Design: TDAH-first — 1 gráfico de linha (alcance semanal top-3) +
 *         1 barra horizontal (comparativo instantâneo das 6 páginas).
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, BarChart2 } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import type { CrossPageAnalytics, WeeklyMetricPoint } from "../../../../../api-contract/marketing.schema";
import type { PeriodFilter } from "@/hooks/useCrossPageAnalytics";
import { PAGE_SLUGS, PAGE_PROFILES } from "../../../../../api-contract/marketing.schema";

// ── Constants ─────────────────────────────────────────────────────────────────

// Line colors per slug — deterministic, KRATOS token-adjacent hex equivalents
const SLUG_COLORS: Record<string, string> = {
  lucastigrereal:    "#7c6af4",  // ~kr-island-agencia
  oinatalrn:         "#2dd4bf",  // teal
  agenteviajabrasil: "#fb923c",  // orange
  afamiliatigrereal: "#f472b6",  // pink
  oquecomernatalrn:  "#a3e635",  // lime
  natalaivoueu:      "#60a5fa",  // blue
};

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 7,  label: "7d"  },
  { value: 30, label: "30d" },
  { value: 90, label: "90d" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/** Derive top-3 slugs by total reach in the series */
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

/** Build pivot data for the line chart: [{week, slug1: reach, slug2: reach, ...}] */
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

/** Build bar data: total reach per page across the series */
function buildBarData(series: WeeklyMetricPoint[]): { slug: string; name: string; reach: number }[] {
  const totals: Record<string, number> = {};
  for (const pt of series) {
    totals[pt.slug] = (totals[pt.slug] ?? 0) + pt.reach;
  }
  return PAGE_SLUGS
    .map((slug) => ({
      slug,
      name: PAGE_PROFILES[slug]?.name ?? slug,
      reach: totals[slug] ?? 0,
    }))
    .sort((a, b) => b.reach - a.reach);
}

// ── Period Tabs ───────────────────────────────────────────────────────────────

function PeriodTabs({
  value,
  onChange,
}: {
  value: PeriodFilter;
  onChange: (p: PeriodFilter) => void;
}) {
  return (
    <div
      className="inline-flex rounded-lg overflow-hidden"
      style={{ border: "1px solid var(--kratos-border)" }}
      role="group"
      aria-label="Período de análise"
    >
      {PERIOD_OPTIONS.map(({ value: v, label }) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="px-2.5 py-1 text-[10px] kratos-mono font-medium transition-colors"
            style={{
              background: active
                ? "color-mix(in oklab, var(--kr-island-agencia) 20%, transparent)"
                : "transparent",
              color: active ? "var(--kr-island-agencia)" : "var(--kratos-text-muted)",
              borderRight: "1px solid var(--kratos-border)",
            }}
            aria-pressed={active}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── Trend Line Chart ──────────────────────────────────────────────────────────

interface TrendChartProps {
  series: WeeklyMetricPoint[];
}

function TrendChart({ series }: TrendChartProps) {
  const top3 = topSlugs(series, 3);
  const data = buildTrendData(series, top3);

  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center">
        <span className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
          Sem dados de tendência
        </span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={130}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 8, fill: "var(--kratos-text-muted)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(w: string) => w.split("-W")[1] ?? w}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 8, fill: "var(--kratos-text-muted)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtK}
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: "var(--kratos-surface-2)",
            border: "1px solid var(--kratos-border)",
            borderRadius: "8px",
            fontSize: "10px",
            color: "var(--kratos-text-primary)",
          }}
          formatter={(value: number, slug: string) => [fmtK(value), PAGE_PROFILES[slug as keyof typeof PAGE_PROFILES]?.name ?? slug]}
          labelFormatter={(w: string) => `Semana ${w.split("-W")[1] ?? w}`}
        />
        {top3.map((slug) => (
          <Line
            key={slug}
            type="monotone"
            dataKey={slug}
            stroke={SLUG_COLORS[slug] ?? "#888"}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
          />
        ))}
        <Legend
          iconType="circle"
          iconSize={6}
          wrapperStyle={{ fontSize: "9px", paddingTop: "4px" }}
          formatter={(slug: string) => PAGE_PROFILES[slug as keyof typeof PAGE_PROFILES]?.name ?? slug}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Bar Chart (horizontal) ────────────────────────────────────────────────────

function ReachBarChart({ series }: { series: WeeklyMetricPoint[] }) {
  const data = buildBarData(series);

  return (
    <ResponsiveContainer width="100%" height={130}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.06)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 8, fill: "var(--kratos-text-muted)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtK}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 9, fill: "var(--kratos-text-secondary)" }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            background: "var(--kratos-surface-2)",
            border: "1px solid var(--kratos-border)",
            borderRadius: "8px",
            fontSize: "10px",
            color: "var(--kratos-text-primary)",
          }}
          formatter={(value: number) => [fmtK(value), "Alcance"]}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="reach" radius={[0, 3, 3, 0]} maxBarSize={12}>
          {data.map((entry) => (
            <Cell key={entry.slug} fill={SLUG_COLORS[entry.slug] ?? "#888"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── PerformanceCharts (export) ────────────────────────────────────────────────

export interface PerformanceChartsProps {
  analytics: CrossPageAnalytics | null;
  period: PeriodFilter;
  onPeriodChange: (p: PeriodFilter) => void;
  isLoading?: boolean;
}

export function PerformanceCharts({
  analytics,
  period,
  onPeriodChange,
  isLoading = false,
}: PerformanceChartsProps) {
  const accent = "var(--kr-island-agencia)";
  const series = analytics?.weekly_series ?? [];

  return (
    <GlassPanel padding="md" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 shrink-0" style={{ color: accent }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Performance Cross-Page
        </span>
        <div className="ml-auto">
          <PeriodTabs value={period} onChange={onPeriodChange} />
        </div>
      </div>

      {isLoading ? (
        <LoadingState lines={4} compact />
      ) : series.length === 0 ? (
        <div className="h-20 flex items-center justify-center">
          <span className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
            Sem dados para o período selecionado
          </span>
        </div>
      ) : (
        <>
          {/* Tendência semanal — top 3 páginas */}
          <div>
            <p
              className="text-[9px] kratos-mono uppercase tracking-wider mb-2"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              Alcance semanal (top 3)
            </p>
            <TrendChart series={series} />
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--kratos-border)" }} />

          {/* Comparativo instantâneo */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart2 className="h-3 w-3" style={{ color: accent }} />
              <p
                className="text-[9px] kratos-mono uppercase tracking-wider"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                Alcance total no período
              </p>
            </div>
            <ReachBarChart series={series} />
          </div>
        </>
      )}
    </GlassPanel>
  );
}
