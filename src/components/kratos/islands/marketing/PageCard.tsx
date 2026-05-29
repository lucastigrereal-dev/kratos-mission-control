/**
 * PageCard — W12-B1
 * Card compacto para cada página do Instagram no cockpit multi-page.
 *
 * Props:
 *  - profile: PageProfile (metadados estáticos: nome, handle, seguidores)
 *  - metrics: PageMetrics | null (alcance, engajamento, trend semanal)
 *  - isLoading: boolean
 *  - onClick: () => void (navega para detail view)
 *
 * Design: TDAH-first — 3 métricas + trend arrow + top post preview + SourceBadge.
 */

import { TrendingUp, TrendingDown, Minus, Users, Eye, Heart, ExternalLink } from "lucide-react";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import type { PageProfile, PageMetrics } from "../../../../../api-contract/marketing.schema";
import type { DataSource } from "../../../../../api-contract/source-badge.schema";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function TrendBadge({ pct }: { pct: number }) {
  if (Math.abs(pct) < 0.5) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[9px] kratos-mono"
        style={{ color: "var(--kratos-text-muted)" }}>
        <Minus className="h-2.5 w-2.5" />
        {pct.toFixed(1)}%
      </span>
    );
  }
  const isUp = pct > 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[9px] kratos-mono font-medium"
      style={{ color: isUp ? "var(--kratos-ok)" : "var(--kratos-critical)" }}
    >
      {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
      {isUp ? "+" : ""}{pct.toFixed(1)}%
    </span>
  );
}

// ── Sub: AvatarInitial ────────────────────────────────────────────────────────

function AvatarInitial({ name, size = 36 }: { name: string; size?: number }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold"
      style={{
        width: size, height: size,
        fontSize: size * 0.4,
        background: "linear-gradient(135deg, var(--kr-island-agencia), color-mix(in oklab, var(--kr-island-agencia) 60%, var(--kratos-ghost)))",
        color: "#fff",
      }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

// ── PageCard (export) ─────────────────────────────────────────────────────────

export interface PageCardProps {
  profile:   PageProfile;
  metrics:   PageMetrics | null;
  sourceType: DataSource;
  isLoading?: boolean;
  isHot?:    boolean;
  onClick?:  () => void;
}

export function PageCard({
  profile,
  metrics,
  sourceType,
  isLoading = false,
  isHot = false,
  onClick,
}: PageCardProps) {
  const sourceMeta = {
    source:     sourceType,
    stale:      sourceType === "partial" || sourceType === "cache",
    updated_at: metrics?.updated_at ?? new Date().toISOString(),
    errors:     sourceType === "error" ? ["Métricas indisponíveis"] : [],
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-all duration-200 hover:scale-[1.01] kratos-focus-ring"
      style={{
        background: "var(--kratos-surface-2)",
        border: isHot
          ? "1px solid color-mix(in oklab, var(--kr-island-agencia) 50%, transparent)"
          : "1px solid var(--kratos-border)",
        boxShadow: isHot ? "0 0 12px color-mix(in oklab, var(--kr-island-agencia) 15%, transparent)" : "none",
        cursor: onClick ? "pointer" : "default",
      }}
      aria-label={`${profile.name} — ver detalhes`}
    >
      {/* Header: avatar + name + source badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <AvatarInitial name={profile.name} size={36} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p
                className="text-[12px] font-semibold leading-tight truncate"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {profile.name}
              </p>
              {isHot && (
                <span
                  className="text-[8px] kratos-mono uppercase px-1 rounded"
                  style={{
                    background: "color-mix(in oklab, var(--kr-island-agencia) 20%, transparent)",
                    color: "var(--kr-island-agencia)",
                    border: "1px solid color-mix(in oklab, var(--kr-island-agencia) 40%, transparent)",
                  }}
                >
                  🔥 top
                </span>
              )}
            </div>
            <p className="text-[10px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
              {profile.handle}
            </p>
          </div>
        </div>
        <SourceBadgeIndicator meta={sourceMeta} size="sm" />
      </div>

      {/* Body: metrics */}
      {isLoading ? (
        <LoadingState lines={2} compact />
      ) : (
        <>
          {/* Followers row */}
          <div
            className="flex items-center gap-1 mb-3 text-[11px]"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            <Users className="h-3 w-3 shrink-0" style={{ color: "var(--kr-island-agencia)" }} />
            <span className="font-medium kratos-mono">{formatNumber(profile.followers)}</span>
            <span style={{ color: "var(--kratos-text-muted)" }}>seguidores</span>
          </div>

          {/* 3 core metrics */}
          {metrics ? (
            <div className="grid grid-cols-3 gap-2">
              <MetricCell
                icon={<Eye className="h-3 w-3" />}
                label="alcance"
                value={formatNumber(metrics.reach)}
                trend={metrics.reach_trend_pct}
              />
              <MetricCell
                icon={<Heart className="h-3 w-3" />}
                label="engaj."
                value={`${metrics.engagement_rate_pct.toFixed(1)}%`}
                trend={metrics.engagement_trend_pct}
              />
              <MetricCell
                icon={<Users className="h-3 w-3" />}
                label="+seguid."
                value={formatNumber(metrics.new_followers)}
                trend={metrics.followers_trend_pct}
              />
            </div>
          ) : (
            <div className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
              Métricas indisponíveis
            </div>
          )}

          {/* Top post preview */}
          {metrics?.top_post && (
            <div
              className="mt-3 rounded-lg px-2.5 py-1.5 text-[10px] leading-relaxed"
              style={{
                background: "var(--kratos-surface-3)",
                border: "1px solid var(--kratos-border)",
                color: "var(--kratos-text-muted)",
              }}
            >
              <span className="font-medium" style={{ color: "var(--kratos-text-secondary)" }}>
                Top post:{" "}
              </span>
              {metrics.top_post.caption_preview.slice(0, 60)}…
            </div>
          )}

          {/* CTA hint */}
          {onClick && (
            <div
              className="mt-2 flex items-center gap-1 text-[9px] kratos-mono uppercase tracking-wider"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              <ExternalLink className="h-2.5 w-2.5" />
              ver detalhes
            </div>
          )}
        </>
      )}
    </button>
  );
}

// ── MetricCell ────────────────────────────────────────────────────────────────

function MetricCell({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: number;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div
        className="flex items-center gap-1 text-[9px] kratos-mono uppercase tracking-wider"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        <span style={{ color: "var(--kr-island-agencia)" }}>{icon}</span>
        {label}
      </div>
      <p className="text-[13px] font-semibold kratos-mono" style={{ color: "var(--kratos-text-primary)" }}>
        {value}
      </p>
      <TrendBadge pct={trend} />
    </div>
  );
}
