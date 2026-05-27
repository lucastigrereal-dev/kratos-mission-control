import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { useAgenciaQueue } from "@/hooks/useAgenciaQueue";
import { ContentDraftsCard } from "@/components/kratos/omnis/ContentDraftsCard";
import type { AgenciaQueueSummary } from "../../../../api-contract/agencia.schema";
import {
  CalendarClock,
  Layers,
  BarChart2,
  Users,
  TrendingUp,
  Calendar,
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
  caption_ready: { label: "Caption pronta",  color: "var(--kr-success)" },
  needs_asset:   { label: "Aguarda asset",   color: "var(--kr-warning)" },
  done:          { label: "Publicado",        color: "var(--kratos-text-muted)" },
  published:     { label: "Publicado",        color: "var(--kratos-text-muted)" },
  cancelled:     { label: "Cancelado",        color: "var(--kratos-critical)" },
  unknown:       { label: "Desconhecido",     color: "var(--kratos-text-muted)" },
};

// ── QueueSummaryCard — dado real do OMNIS content_queue.jsonl ─────────────

function QueueSummaryCard({ summary }: { summary: AgenciaQueueSummary }) {
  const accent = "var(--kr-island-agencia)";
  const captionReady = summary.por_status["caption_ready"] ?? 0;
  const readyPct = summary.total > 0 ? Math.round((captionReady / summary.total) * 100) : 0;
  const statusEntries = Object.entries(summary.por_status).sort(([, a], [, b]) => b - a);

  return (
    <GlassPanel padding="md" className="space-y-4">
      {/* Header */}
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

      {/* Progress — % prontos */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
            Prontos para publicar
          </span>
          <span className="text-[10px] kratos-mono font-medium" style={{ color: "var(--kr-success)" }}>
            {captionReady} / {summary.total}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${readyPct}%`, background: "var(--kr-success)" }}
            role="progressbar"
            aria-valuenow={readyPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Breakdown por status */}
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
              <span className="text-[11px] kratos-mono font-medium" style={{ color }}>
                {count}
              </span>
              <span className="text-[9px] kratos-mono w-7 text-right shrink-0" style={{ color: "var(--kratos-text-muted)" }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Próximo slot */}
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

// ── MarketingMetricsCard — demo data (MOCK) — Publer real: W10-B4 ─────────
// Fonte futura: /agencia/metrics (Publer) — NÃO Meta Graph API (W4 decisão)

interface AccountMetric {
  handle: string;
  followers: number;
  reach: number;
  engagement_pct: number;
}

const MOCK_METRICS: AccountMetric[] = [
  { handle: "lucastigrereal",    followers: 690_000, reach: 41_200, engagement_pct: 4.8 },
  { handle: "oinatalrn",         followers: 630_000, reach: 37_800, engagement_pct: 5.1 },
  { handle: "agenteviajabrasil", followers: 452_000, reach: 28_400, engagement_pct: 4.3 },
  { handle: "afamiliatigrereal", followers: 320_000, reach: 19_600, engagement_pct: 3.9 },
  { handle: "oquecomernatalrn",  followers: 249_000, reach: 17_800, engagement_pct: 5.6 },
  { handle: "natalaivoueu",      followers: 240_000, reach: 15_200, engagement_pct: 4.7 },
];

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 100_000 ? 0 : 1)}K`;
  return String(n);
}

function MarketingMetricsCard() {
  const accent = "var(--kr-island-agencia)";
  const totalFollowers = MOCK_METRICS.reduce((s, a) => s + a.followers, 0);
  const totalReach = MOCK_METRICS.reduce((s, a) => s + a.reach, 0);
  const avgEng = (MOCK_METRICS.reduce((s, a) => s + a.engagement_pct, 0) / MOCK_METRICS.length).toFixed(1);

  return (
    <GlassPanel padding="md" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart2 className="h-4 w-4 shrink-0" style={{ color: accent }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Métricas de Performance
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

      {/* Totals row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total seguidores", value: fmtNum(totalFollowers), color: accent },
          { label: "Alcance 7 dias",   value: fmtNum(totalReach),     color: "var(--kr-success)" },
          { label: "Eng. médio",       value: `${avgEng}%`,           color: "var(--kr-info, var(--kratos-info))" },
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

      {/* Per-account breakdown */}
      <div className="space-y-1.5">
        {MOCK_METRICS.map((a) => {
          const engColor =
            a.engagement_pct >= 5 ? "var(--kr-success)" :
            a.engagement_pct >= 4 ? accent :
            "var(--kratos-text-muted)";
          return (
            <div key={a.handle} className="flex items-center gap-2">
              <span className="text-[10px] kratos-mono flex-1 truncate" style={{ color: "var(--kratos-text-secondary)" }}>
                @{a.handle}
              </span>
              <span className="text-[10px] kratos-mono w-14 text-right" style={{ color: "var(--kratos-text-muted)" }}>
                {fmtNum(a.followers)}
              </span>
              <span className="text-[10px] kratos-mono w-10 text-right font-medium" style={{ color: engColor }}>
                {a.engagement_pct}%
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
        Fonte futura: <span className="kratos-mono">/agencia/metrics</span> via Publer — disponível em W10-B4.
      </p>
    </GlassPanel>
  );
}

// ── ContentCalendarStrip — próximos 7 posts planejados (MOCK) ─────────────

interface CalendarPost {
  date: string; // "2026-05-28"
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
  ready:       { label: "Pronto",      color: "var(--kr-success)" },
  needs_asset: { label: "Falta asset", color: "var(--kratos-warn)" },
  draft:       { label: "Rascunho",    color: "var(--kratos-text-muted)" },
};

/** "2026-05-28" → "Qua 28" */
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
              {/* Date + time */}
              <div className="shrink-0 text-right" style={{ minWidth: "52px" }}>
                <div className="text-[10px] kratos-mono font-medium" style={{ color: "var(--kratos-text-primary)" }}>
                  {fmtCalDate(post.date)}
                </div>
                <div className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
                  {post.time}
                </div>
              </div>

              {/* Dot */}
              <div
                className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: cfg.color }}
                aria-hidden
              />

              {/* Caption + account */}
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

// ── CrmTeaser — placeholder até CRM backend saudável ─────────────────────

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

// ── Main Export ────────────────────────────────────────────────────────────

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

  // hasData = true quando content_queue do OMNIS tem itens reais.
  const hasData = summary != null;
  const loading = isLoading || queueLoading;
  const errorMsg =
    error ?? (queueError ? "Erro ao carregar fila de conteúdo" : null);

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

          {/* Dado real: fila de aprovação de captions (caption_drafts.jsonl) */}
          <ContentDraftsCard />

          {/* Métricas de performance por conta (DEMO até Publer W10-B4) */}
          <MarketingMetricsCard />

          {/* CRM teaser — Arena island tem pipeline completo */}
          <CrmTeaserCard />
        </>
      )}
    </IslandPageFrame>
  );
}
