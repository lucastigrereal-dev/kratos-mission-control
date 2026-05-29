import { useEffect, useState, useMemo } from "react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { useIslandDock } from "./shared/IslandDockContext";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { useAgenciaQueue } from "@/hooks/useAgenciaQueue";
import { ContentDraftsCard } from "@/components/kratos/omnis/ContentDraftsCard";
import { PageCard } from "@/components/kratos/islands/marketing/PageCard";
import { PerformanceCharts } from "@/components/kratos/islands/marketing/PerformanceCharts";
import { PageSwitcher } from "@/components/kratos/shell/PageSwitcher";
import { usePageMetrics } from "@/hooks/usePageMetrics";
import { useCrossPageAnalytics } from "@/hooks/useCrossPageAnalytics";
import type { UsePageMetricsResult } from "@/hooks/usePageMetrics";
import type { PeriodFilter } from "@/hooks/useCrossPageAnalytics";
import type { PageSelection } from "@/components/kratos/shell/PageSwitcher";
import {
  PAGE_PROFILES,
  PAGE_SLUGS,
  TOTAL_FOLLOWERS,
} from "../../../../api-contract/marketing.schema";
import type { AgenciaQueueSummary } from "../../../../api-contract/agencia.schema";
import {
  CalendarClock,
  Layers,
  Users,
  TrendingUp,
  Calendar,
  Instagram,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

/** "2026-05-03" → "03 Mai" */
function formatSlotDate(iso: string): string {
  try {
    const parts = iso.split("-");
    const month = parseInt(parts[1] ?? "0", 10);
    const day = parts[2] ?? "??";
    const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    return `${day} ${MESES[month - 1] ?? "?"}`;
  } catch {
    return iso;
  }
}

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  caption_ready: { label: "Caption pronta",  color: "var(--kratos-ok)" },
  needs_asset:   { label: "Aguarda asset",   color: "var(--kr-warning)" },
  done:          { label: "Publicado",        color: "var(--kratos-text-muted)" },
  published:     { label: "Publicado",        color: "var(--kratos-text-muted)" },
  cancelled:     { label: "Cancelado",        color: "var(--kratos-critical)" },
  unknown:       { label: "Desconhecido",     color: "var(--kratos-text-muted)" },
};

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 100_000 ? 0 : 1)}K`;
  return String(n);
}

// ── QueueSummaryCard ─────────────────────────────────────────────────────────

function QueueSummaryCard({ summary }: { summary: AgenciaQueueSummary }) {
  const accent = "var(--kr-island-agencia)";
  const captionReady = summary.por_status["caption_ready"] ?? 0;
  const readyPct = summary.total > 0 ? Math.round((captionReady / summary.total) * 100) : 0;
  const statusEntries = Object.entries(summary.por_status).sort(([, a], [, b]) => b - a);

  return (
    <GlassPanel padding="md" className="space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 shrink-0" style={{ color: accent }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Pipeline de Conteúdo
        </span>
        <span
          className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded"
          style={{ background: `color-mix(in oklab, ${accent} 12%, transparent)`, color: accent }}
        >
          {summary.total} slots
        </span>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
            Prontos para publicar
          </span>
          <span className="text-[10px] kratos-mono font-medium" style={{ color: "var(--kratos-ok)" }}>
            {captionReady} / {summary.total}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${readyPct}%`, background: "var(--kratos-ok)" }}
            role="progressbar"
            aria-valuenow={readyPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {statusEntries.map(([status, count]) => {
          const cfg = STATUS_CFG[status];
          const color = cfg?.color ?? "var(--kratos-text-muted)";
          const label = cfg?.label ?? status;
          const pct = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
          return (
            <div key={status} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} aria-hidden />
              <span className="text-[11px] flex-1" style={{ color: "var(--kratos-text-secondary)" }}>
                {label}
              </span>
              <span className="text-[11px] kratos-mono font-medium" style={{ color }}>{count}</span>
              <span className="text-[9px] kratos-mono w-7 text-right shrink-0" style={{ color: "var(--kratos-text-muted)" }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {summary.proximo_slot && (
        <div
          className="flex items-start gap-2.5 pt-3"
          style={{ borderTop: "1px solid var(--kratos-border)" }}
        >
          <CalendarClock className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: accent }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-medium kratos-mono" style={{ color: "var(--kratos-text-primary)" }}>
                {formatSlotDate(summary.proximo_slot.date)} · {summary.proximo_slot.time}
              </span>
              {summary.proximo_slot.account && (
                <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                  @{summary.proximo_slot.account}
                </span>
              )}
            </div>
            {summary.proximo_slot.objective && (
              <span
                className="inline-block mt-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  background: `color-mix(in oklab, ${accent} 10%, transparent)`,
                  color: accent,
                  border: `1px solid color-mix(in oklab, ${accent} 20%, transparent)`,
                }}
              >
                {summary.proximo_slot.objective}
              </span>
            )}
          </div>
        </div>
      )}
    </GlassPanel>
  );
}

// ── ContentCalendarStrip ─────────────────────────────────────────────────────

interface CalendarPost {
  date: string;
  time: string;
  account: string;
  caption: string;
  status: "ready" | "needs_asset" | "draft";
}

const MOCK_CALENDAR: CalendarPost[] = [
  { date: "2026-05-28", time: "18:00", account: "oinatalrn",         caption: "Pôr do sol em Pipa — guia completo",    status: "ready" },
  { date: "2026-05-28", time: "20:00", account: "oquecomernatalrn",  caption: "5 restaurantes frente mar em Natal",     status: "ready" },
  { date: "2026-05-29", time: "12:00", account: "lucastigrereal",    caption: "Bastidores: como negocie 10 collabs/mês", status: "needs_asset" },
  { date: "2026-05-29", time: "19:00", account: "agenteviajabrasil", caption: "Road trip pelo interior do RN",          status: "ready" },
  { date: "2026-05-30", time: "18:00", account: "natalaivoueu",      caption: "Praia de Maracajaú: guia rápido",        status: "draft" },
  { date: "2026-05-31", time: "18:00", account: "afamiliatigrereal", caption: "Viagem em família para Fortaleza",       status: "needs_asset" },
  { date: "2026-06-01", time: "12:00", account: "lucastigrereal",    caption: "Review Hotel Serhs Natal Grand",         status: "draft" },
];

const CAL_STATUS_CFG: Record<CalendarPost["status"], { label: string; color: string }> = {
  ready:       { label: "Pronto",      color: "var(--kratos-ok)" },
  needs_asset: { label: "Falta asset", color: "var(--kratos-warn)" },
  draft:       { label: "Rascunho",    color: "var(--kratos-text-muted)" },
};

function fmtCalDate(iso: string): string {
  try {
    const [, , d] = iso.split("-");
    const dt = new Date(`${iso}T12:00:00`);
    const DIAS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
    return `${DIAS[dt.getDay()] ?? "?"} ${d}`;
  } catch {
    return iso;
  }
}

function ContentCalendarStrip() {
  const accent = "var(--kr-island-agencia)";
  return (
    <GlassPanel padding="md" className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 shrink-0" style={{ color: accent }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Calendário — próximos 7 posts
        </span>
        <span
          className="ml-auto text-[9px] kratos-mono px-1.5 py-0.5 rounded font-bold"
          style={{
            background: "color-mix(in oklab, var(--kratos-warn) 15%, transparent)",
            border: "1px solid color-mix(in oklab, var(--kratos-warn) 30%, transparent)",
            color: "var(--kratos-warn)",
          }}
        >
          DEMO
        </span>
      </div>

      <div className="space-y-1">
        {MOCK_CALENDAR.map((post, i) => {
          const cfg = CAL_STATUS_CFG[post.status];
          return (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 -mx-2 kratos-card-hover"
              style={{ transition: "background 0.15s" }}
            >
              <div className="shrink-0 text-right" style={{ minWidth: "52px" }}>
                <div className="text-[10px] kratos-mono font-medium" style={{ color: "var(--kratos-text-primary)" }}>
                  {fmtCalDate(post.date)}
                </div>
                <div className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
                  {post.time}
                </div>
              </div>
              <div
                className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: cfg.color }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] leading-snug truncate" style={{ color: "var(--kratos-text-primary)" }}>
                  {post.caption}
                </div>
                <div className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
                  @{post.account} · <span style={{ color: cfg.color }}>{cfg.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

// ── CrmTeaserCard ─────────────────────────────────────────────────────────────

function CrmTeaserCard() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          CRM — Pipeline de Collabs
        </span>
        <span
          className="ml-auto text-[9px] kratos-mono px-1.5 py-0.5 rounded font-bold flex items-center gap-1"
          style={{
            background: "color-mix(in oklab, var(--kratos-accent) 10%, transparent)",
            border: "1px solid color-mix(in oklab, var(--kratos-accent) 25%, transparent)",
            color: "var(--kratos-accent)",
          }}
        >
          <TrendingUp className="h-2.5 w-2.5" />
          W10-B3
        </span>
      </div>
      <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
        Pipeline de hotéis e restaurantes (Starter · Growth · Premium) será exibido aqui.
        Ver{" "}
        <span className="kratos-mono" style={{ color: "var(--kratos-text-secondary)" }}>Arena ↗</span>{" "}
        para leads ativos.
      </p>
    </GlassPanel>
  );
}

// ── MultiPageCockpit — W12-B1 ────────────────────────────────────────────────
// Hooks chamados em nível de componente — 6 slugs fixos, sem loop de hooks.

function MultiPageCockpit() {
  const accent = "var(--kr-island-agencia)";
  const [period, setPeriod] = useState<PeriodFilter>(7);
  const [selectedPage, setSelectedPage] = useState<PageSelection>("all");

  // 6 hooks fixos (regra: não em loop — slugs nunca mudam)
  const m0 = usePageMetrics("lucastigrereal",    period);
  const m1 = usePageMetrics("oinatalrn",         period);
  const m2 = usePageMetrics("agenteviajabrasil", period);
  const m3 = usePageMetrics("afamiliatigrereal", period);
  const m4 = usePageMetrics("oquecomernatalrn",  period);
  const m5 = usePageMetrics("natalaivoueu",      period);

  const crossAnalytics = useCrossPageAnalytics(period);

  const allHooks: UsePageMetricsResult[] = [m0, m1, m2, m3, m4, m5];

  // Top performer = highest reach (gets 🔥 badge)
  const hotSlug = useMemo(() => {
    let best: string | null = null;
    let bestReach = -1;
    PAGE_SLUGS.forEach((slug, i) => {
      const reach = allHooks[i]?.metrics?.reach ?? 0;
      if (reach > bestReach) { bestReach = reach; best = slug; }
    });
    return best;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m0.metrics, m1.metrics, m2.metrics, m3.metrics, m4.metrics, m5.metrics]);

  // Filter displayed pages
  const visibleSlugs: string[] = selectedPage === "all" ? [...PAGE_SLUGS] : [selectedPage as string];

  // Aggregate for header bar
  const totalReach = allHooks.reduce((s, h) => s + (h.metrics?.reach ?? 0), 0);
  const avgEngagement =
    allHooks.filter((h) => h.metrics != null).length > 0
      ? allHooks.reduce((s, h) => s + (h.metrics?.engagement_rate_pct ?? 0), 0) /
        allHooks.filter((h) => h.metrics != null).length
      : 0;

  return (
    <div className="space-y-3">
      {/* Header: aggregate totals */}
      <GlassPanel padding="md" className="space-y-3">
        <div className="flex items-center gap-2">
          <Instagram className="h-4 w-4 shrink-0" style={{ color: accent }} />
          <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            Multi-Page Cockpit
          </span>
          <span className="text-[9px] kratos-mono ml-auto" style={{ color: "var(--kratos-text-muted)" }}>
            {fmtNum(TOTAL_FOLLOWERS)} seguidores totais
          </span>
        </div>

        {/* Aggregate metrics */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Seguidores",   value: fmtNum(TOTAL_FOLLOWERS), color: accent },
            { label: "Alcance 7d",   value: fmtNum(totalReach),       color: "var(--kratos-ok)" },
            { label: "Eng. médio",   value: `${avgEngagement.toFixed(1)}%`, color: "var(--kratos-info, #60a5fa)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-lg p-2 text-center"
              style={{ background: "var(--kratos-surface-4)" }}
            >
              <div className="text-[14px] font-bold kratos-mono" style={{ color }}>
                {value}
              </div>
              <div className="text-[9px] mt-0.5 leading-tight" style={{ color: "var(--kratos-text-muted)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Page switcher */}
        <PageSwitcher selected={selectedPage} onChange={setSelectedPage} compact />
      </GlassPanel>

      {/* PageCard grid */}
      <div className={visibleSlugs.length === 1 ? "space-y-0" : "grid grid-cols-2 gap-3"}>
        {visibleSlugs.map((slug) => {
          const idx = PAGE_SLUGS.indexOf(slug as typeof PAGE_SLUGS[number]);
          const hook = allHooks[idx] ?? allHooks[0]!;
          return (
            <PageCard
              key={slug}
              profile={PAGE_PROFILES[slug as keyof typeof PAGE_PROFILES]}
              metrics={hook.metrics}
              sourceType={hook.sourceType}
              isLoading={hook.isLoading}
              isHot={slug === hotSlug}
            />
          );
        })}
      </div>

      {/* Cross-page performance charts */}
      <PerformanceCharts
        analytics={crossAnalytics.analytics}
        period={period}
        onPeriodChange={setPeriod}
        isLoading={crossAnalytics.isLoading}
      />
    </div>
  );
}

// ── AgenciaScreen (export) ────────────────────────────────────────────────────

interface AgenciaScreenProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}

export function AgenciaScreen({
  isLoading = false,
  error = null,
  isEmpty = false,
}: AgenciaScreenProps) {
  const {
    summary,
    isLoading: queueLoading,
    isError: queueError,
  } = useAgenciaQueue();
  const { setData } = useIslandDock();

  const hasData = summary != null;
  const loading = isLoading || queueLoading;
  const errorMsg =
    error ?? (queueError ? "Erro ao carregar fila de conteúdo" : null);

  const queueTotal = summary?.total ?? 0;
  const queuePending = summary
    ? Object.entries(summary.por_status)
        .filter(([status]) => !["done", "published", "cancelled"].includes(status))
        .reduce((s, [, count]) => s + count, 0)
    : 0;

  useEffect(() => {
    setData({
      islandId: "agencia",
      label: "Fila",
      value: queueTotal > 0 ? `${queuePending} pendentes` : "—",
      progress: queueTotal > 0 ? Math.round(((queueTotal - queuePending) / queueTotal) * 100) : 0,
      progressColor: "var(--kr-island-agencia)",
      quickActions: [{ label: "Criar Conteúdo" }, { label: "Agendar" }],
    });
    return () => setData(null);
  }, [setData, queueTotal, queuePending]);

  return (
    <IslandPageFrame theme="agencia">
      {loading ? (
        <LoadingState lines={6} />
      ) : errorMsg ? (
        <ErrorState
          title="Erro ao carregar"
          description={errorMsg}
          variant="external_unavailable"
        />
      ) : isEmpty || !hasData ? (
        <EmptyState
          title="Agência sem dados"
          description="Pipeline de conteúdo não disponível. Verifique se o OMNIS está rodando e o content_queue.jsonl existe."
        />
      ) : (
        <>
          <IslandPageHeader
            title="AGÊNCIA / ESTÚDIO"
            subtitle="Conteúdo, Marca e Comunicação que constroem autoridade"
            theme="agencia"
          />

          {/* Dado real: pipeline do content_queue.jsonl */}
          <QueueSummaryCard summary={summary!} />

          {/* Calendário editorial — próximos 7 posts (DEMO até Publer W10-B4) */}
          <ContentCalendarStrip />

          {/* W12 — Multi-Page Cockpit: 6 PageCards + PerformanceCharts */}
          <MultiPageCockpit />

          {/* Dado real: fila de aprovação de captions (caption_drafts.jsonl) */}
          <ContentDraftsCard />

          {/* CRM teaser — Arena island tem pipeline completo */}
          <CrmTeaserCard />
        </>
      )}
    </IslandPageFrame>
  );
}
