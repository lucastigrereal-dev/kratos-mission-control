/**
 * AnalyticsDashboard — W21
 *
 * Dashboard de analytics das 6 páginas Instagram do Lucas.
 * Modo: LOCAL/SAMPLE_DATA — sem OAuth Meta.
 * Features:
 *   - Totais gerais (followers, reach, engagement, valor estimado)
 *   - Ranking por alcance, engajamento e crescimento
 *   - Alertas com ação sugerida
 *   - Meta OAuth Human Slot explícito
 *   - SourceBadge: SAMPLE_DATA sempre visível
 */
import {
  Users, TrendingUp, Eye, DollarSign, AlertTriangle, Lock,
  Trophy, Activity, Zap, Info,
} from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { FullPageMetrics, AnalyticsAlert } from "../../../../api-contract/analytics.schema";

const accent = "var(--kr-island-agencia)";

// ── Source Badge ──────────────────────────────────────────────────────────────

function SampleDataBadge() {
  return (
    <span
      className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{
        background: "color-mix(in srgb, var(--kratos-warn) 10%, transparent)",
        color: "var(--kratos-warn)",
        border: "1px solid color-mix(in srgb, var(--kratos-warn) 25%, transparent)",
      }}
    >
      SAMPLE DATA
    </span>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  subvalue?: string;
  icon: React.ElementType;
  color?: string;
}

function MetricCard({ label, value, subvalue, icon: Icon, color = accent }: MetricCardProps) {
  return (
    <GlassPanel padding="md">
      <div className="flex items-start gap-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color }} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--kratos-text-muted)" }}>
            {label}
          </p>
          <p className="text-[18px] font-bold leading-tight" style={{ color: "var(--kratos-text-primary)" }}>
            {value}
          </p>
          {subvalue && (
            <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
              {subvalue}
            </p>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}

// ── Ranking Row ───────────────────────────────────────────────────────────────

function RankingRow({ metric, rank, field }: {
  metric: FullPageMetrics;
  rank: number;
  field: "reach" | "engagement_rate" | "followers_growth_pct";
}) {
  const value =
    field === "reach" ? metric.reach.toLocaleString("pt-BR")
    : field === "engagement_rate" ? `${(metric.engagement_rate * 100).toFixed(1)}%`
    : `+${metric.followers_growth_pct.toFixed(2)}%`;

  const rankColor = rank === 1 ? "var(--kratos-warn)" : rank === 2 ? "var(--kratos-text-muted)" : "var(--kratos-text-muted)";

  return (
    <div
      className="flex items-center gap-3 rounded-lg px-3 py-2"
      style={{
        background: rank === 1
          ? "color-mix(in srgb, var(--kratos-warn) 5%, transparent)"
          : "color-mix(in srgb, var(--kratos-surface-3) 40%, transparent)",
      }}
    >
      <span
        className="text-[11px] font-bold w-5 text-center flex-shrink-0"
        style={{ color: rankColor }}
      >
        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : `${rank}.`}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium truncate" style={{ color: "var(--kratos-text-primary)" }}>
          {metric.handle}
        </p>
      </div>
      <span className="text-[11px] font-bold kratos-mono flex-shrink-0" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}

// ── Alert Row ─────────────────────────────────────────────────────────────────

function AlertRow({ alert }: { alert: AnalyticsAlert }) {
  const color =
    alert.severity === "critical" ? "var(--kratos-critical)"
    : alert.severity === "warning" ? "var(--kratos-warn)"
    : "var(--kratos-text-muted)";

  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{
        background: `color-mix(in srgb, ${color} 6%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 15%, transparent)`,
      }}
    >
      <div className="flex items-start gap-2">
        {alert.severity === "warning" || alert.severity === "critical" ? (
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color }} aria-hidden />
        ) : (
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color }} aria-hidden />
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            {alert.title}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--kratos-text-secondary)" }}>
            {alert.description}
          </p>
          {alert.suggested_action && (
            <p className="text-[9px] mt-1 flex items-center gap-1" style={{ color }}>
              <Zap className="h-2.5 w-2.5 shrink-0" aria-hidden />
              {alert.suggested_action}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Meta OAuth Human Slot ─────────────────────────────────────────────────────

function MetaOAuthSlot() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-start gap-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "color-mix(in srgb, var(--kratos-text-muted) 8%, transparent)" }}
        >
          <Lock className="h-4 w-4" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
        </div>
        <div>
          <p className="text-[11px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            Meta Graph API — Human Slot
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
            Dados reais do Instagram não estão disponíveis.
          </p>
          <div className="mt-2 space-y-1">
            {["META_APP_ID", "META_APP_SECRET", "META_ACCESS_TOKEN"].map((env) => (
              <div key={env} className="flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ background: "var(--kratos-critical)" }}
                />
                <code
                  className="text-[9px]"
                  style={{ color: "var(--kratos-text-muted)", fontFamily: "var(--kr-font-mono, monospace)" }}
                >
                  {env}
                </code>
                <span className="text-[9px]" style={{ color: "var(--kratos-critical)" }}>
                  não configurado
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export function AnalyticsDashboard() {
  const {
    totals, alerts, rankedByReach, rankedByEngagement, rankedByGrowth,
  } = useAnalytics();

  const totalFollowersStr = totals.total_followers.toLocaleString("pt-BR");
  const totalReachStr = totals.total_reach_30d.toLocaleString("pt-BR");
  const avgEngStr = `${(totals.avg_engagement_rate * 100).toFixed(1)}%`;
  const totalValueStr = `R$${totals.total_estimated_value_brl.toLocaleString("pt-BR")}`;

  return (
    <div className="space-y-4">
      {/* Header com source badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold" style={{ color: "var(--kratos-text-primary)" }}>
          Analytics — 6 Páginas
        </h2>
        <SampleDataBadge />
      </div>

      {/* Totais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Seguidores"
          value={totalFollowersStr}
          icon={Users}
          color="var(--kr-island-agencia)"
        />
        <MetricCard
          label="Alcance 30d"
          value={totalReachStr}
          icon={Eye}
          color="var(--kr-accent-cyan)"
        />
        <MetricCard
          label="Eng. Médio"
          value={avgEngStr}
          icon={Activity}
          color="var(--kratos-ok)"
        />
        <MetricCard
          label="Valor Est. Publi"
          value={totalValueStr}
          subvalue="por campanha"
          icon={DollarSign}
          color="var(--kratos-warn)"
        />
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KratosCard header={<SectionTitle icon={Trophy} title="Top Alcance" />}>
          <div className="space-y-1.5">
            {rankedByReach.slice(0, 3).map((m, i) => (
              <RankingRow key={m.slug} metric={m} rank={i + 1} field="reach" />
            ))}
          </div>
        </KratosCard>

        <KratosCard header={<SectionTitle icon={Activity} title="Top Engajamento" />}>
          <div className="space-y-1.5">
            {rankedByEngagement.slice(0, 3).map((m, i) => (
              <RankingRow key={m.slug} metric={m} rank={i + 1} field="engagement_rate" />
            ))}
          </div>
        </KratosCard>

        <KratosCard header={<SectionTitle icon={TrendingUp} title="Top Crescimento" />}>
          <div className="space-y-1.5">
            {rankedByGrowth.slice(0, 3).map((m, i) => (
              <RankingRow key={m.slug} metric={m} rank={i + 1} field="followers_growth_pct" />
            ))}
          </div>
        </KratosCard>
      </div>

      {/* CPM card */}
      <KratosCard header={<SectionTitle icon={DollarSign} title="CPM vs Meta Ads" />}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[10px] uppercase mb-1" style={{ color: "var(--kratos-text-muted)" }}>KRATOS</p>
            <p className="text-[20px] font-bold" style={{ color: "var(--kratos-ok)" }}>R$0,15</p>
            <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>por mil</p>
          </div>
          <div>
            <p className="text-[10px] uppercase mb-1" style={{ color: "var(--kratos-text-muted)" }}>Meta Ads</p>
            <p className="text-[20px] font-bold" style={{ color: "var(--kratos-critical)" }}>R$18,50</p>
            <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>por mil</p>
          </div>
          <div>
            <p className="text-[10px] uppercase mb-1" style={{ color: "var(--kratos-text-muted)" }}>Economia</p>
            <p className="text-[20px] font-bold" style={{ color: "var(--kratos-warn)" }}>99,2%</p>
            <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>menos custo</p>
          </div>
        </div>
      </KratosCard>

      {/* Alertas */}
      <KratosCard header={<SectionTitle icon={AlertTriangle} title="Alertas & Oportunidades" />}>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      </KratosCard>

      {/* Meta OAuth Human Slot */}
      <MetaOAuthSlot />
    </div>
  );
}
