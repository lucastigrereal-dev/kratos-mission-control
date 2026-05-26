import type React from "react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { cn } from "@/lib/utils";
import { useAgenciaQueue } from "@/hooks/useAgenciaQueue";
import type { AgenciaQueueSummary } from "../../../../api-contract/agencia.schema";
import {
  Eye,
  Heart,
  MousePointerClick,
  Users,
  FileText,
  ChevronRight,
  MessageCircle,
  CalendarClock,
  Layers,
} from "lucide-react";

// ── Mock Data — SEM FONTE REAL. hasData=false → EmptyState honesto. ─────────
// Quando Publisher OS expuser endpoint de métricas, remover hasData=false
// e ligar via hook. Não inventar número.

const kpiCards: {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: React.ElementType;
}[] = [
  {
    label: "Alcance",
    value: "128K",
    delta: "+12%",
    deltaPositive: true,
    icon: Eye,
  },
  {
    label: "Engajamento",
    value: "8.4%",
    delta: "+2.1%",
    deltaPositive: true,
    icon: Heart,
  },
  {
    label: "Seguidores",
    value: "+342",
    delta: "+5%",
    deltaPositive: true,
    icon: Users,
  },
  {
    label: "Publicações",
    value: "18",
    delta: "-2",
    deltaPositive: false,
    icon: FileText,
  },
];

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const postDays = [0, 2, 3, 5]; // index of days with posts this week
const todayIdx = 1; // Tuesday (index 1)

const contentPipeline = [
  { stage: "Ideias", count: 24, color: "var(--kr-island-agencia)" },
  { stage: "Roteiros", count: 8, color: "var(--kr-accent-orange-lighter)" },
  { stage: "Produção", count: 5, color: "var(--kr-accent-amber-bright)" },
  { stage: "Edição", count: 3, color: "var(--kr-accent-gold-light)" },
  { stage: "Publicação", count: 2, color: "var(--kr-success)" },
];

const ideas = [
  { name: "Tour pelo KRATOS 3D", progress: 85 },
  { name: "Bastidores da Sprint", progress: 40 },
  { name: "Review de ferramentas IA", progress: 10 },
];

const squads = [
  { name: "Direção", members: 1 },
  { name: "Roteiristas", members: 2 },
  { name: "Designers", members: 1 },
  { name: "Editores", members: 2 },
  { name: "Gestão", members: 1 },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function KpiQuadPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpiCards.map((kpi) => (
        <GlassPanel key={kpi.label} padding="sm" className="text-center">
          <kpi.icon
            className="h-5 w-5 mx-auto mb-1.5"
            style={{ color: "var(--kr-accent-orange-lighter)" }}
            aria-hidden
          />
          <p className="kratos-num text-xl">{kpi.value}</p>
          <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--kratos-text-muted)" }}>
            {kpi.label}
          </p>
          <span
            className={cn(
              "inline-block mt-1 text-[11px] kratos-mono font-medium",
              kpi.deltaPositive ? "" : "",
            )}
            style={{
              color: kpi.deltaPositive ? "var(--kr-success)" : "var(--kr-danger)",
            }}
          >
            {kpi.delta}
          </span>
        </GlassPanel>
      ))}
    </div>
  );
}

function ContentCalendar() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Calendário de Conteúdo
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--kratos-text-muted)" }}>
              {day}
            </span>
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                i === todayIdx && "",
              )}
              style={{
                background:
                  i === todayIdx
                    ? "var(--kr-island-agencia)"
                    : postDays.includes(i)
                      ? "var(--kratos-surface-3)"
                      : "var(--kratos-surface-2)",
                border:
                  i === todayIdx
                    ? "2px solid var(--kr-accent-orange-light)"
                    : "1px solid var(--kratos-border)",
              }}
            >
              {postDays.includes(i) && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: i === todayIdx ? "var(--kratos-text-primary)" : "var(--kr-island-agencia)" }}
                  aria-label="Post agendado"
                />
              )}
              {!postDays.includes(i) && (
                <span
                  className="text-[11px] kratos-mono"
                  style={{ color: i === todayIdx ? "var(--kratos-text-primary)" : "var(--kratos-text-muted)" }}
                >
                  {i + 1}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function CampaignMainCard() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className="kratos-eyebrow block mb-1"
            style={{ color: "var(--kr-accent-orange-light)" }}
          >
            Campanha Principal
          </span>
          <h3 className="text-[15px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            KRATOS 1.0 — Lançamento
          </h3>
        </div>
        <span
          className="kratos-chip"
          style={{ color: "var(--kr-accent-orange-light)", borderColor: "color-mix(in oklab, var(--kr-island-agencia, #F97316) 30%, transparent)" }}
        >
          68%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: "68%",
              background: "linear-gradient(90deg, var(--kr-island-agencia), var(--kr-accent-orange-lighter))",
            }}
            aria-hidden
          />
        </div>
      </div>

      {/* Phases */}
      <div className="flex gap-2">
        {["Pré-lançamento", "Lançamento", "Pós-lançamento"].map((phase, i) => (
          <span
            key={phase}
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              background: i === 1 ? "color-mix(in oklab, var(--kr-island-agencia, #F97316) 20%, transparent)" : "var(--kratos-surface-3)",
              color: i === 1 ? "var(--kr-accent-orange-light)" : "var(--kratos-text-muted)",
            }}
          >
            {phase}
          </span>
        ))}
      </div>
    </GlassPanel>
  );
}

function ContentPipeline() {
  const maxCount = Math.max(...contentPipeline.map((s) => s.count));

  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Pipeline de Conteúdo
      </h3>
      <div className="space-y-3">
        {contentPipeline.map((s) => (
          <div key={s.stage} className="flex items-center gap-3">
            <span
              className="text-[11px] font-medium w-20 flex-shrink-0"
              style={{ color: "var(--kratos-text-secondary)" }}
            >
              {s.stage}
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(s.count / maxCount) * 100}%`,
                  background: s.color,
                }}
                aria-hidden
              />
            </div>
            <span
              className="kratos-mono text-[11px] w-6 text-right flex-shrink-0"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              {s.count}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function IdeaTracker() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Ideias em Desenvolvimento
      </h3>
      <div className="space-y-3">
        {ideas.map((idea) => (
          <div key={idea.name} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ color: "var(--kratos-text-primary)" }}>
                {idea.name}
              </span>
              <span className="kratos-mono text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
                {idea.progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${idea.progress}%`,
                  background:
                    idea.progress >= 70
                      ? "var(--kr-success)"
                      : idea.progress >= 30
                        ? "var(--kr-accent-amber-bright)"
                        : "var(--kr-island-agencia)",
                }}
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function StudioSquads() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Studio Squads
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {squads.map((sq) => (
          <div
            key={sq.name}
            className="flex flex-col items-center gap-1.5 rounded-lg py-2.5 text-center"
            style={{ background: "var(--kratos-surface-2)" }}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ background: "color-mix(in oklab, var(--kr-island-agencia, #F97316) 15%, transparent)" }}
            >
              <Users className="h-4 w-4" style={{ color: "var(--kr-accent-orange-lighter)" }} aria-hidden />
            </div>
            <span className="text-[10px] leading-tight" style={{ color: "var(--kratos-text-primary)" }}>
              {sq.name}
            </span>
            <span className="kratos-mono text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
              {sq.members}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function AuroraMiniChat() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--kr-accent-purple, #A855F7), var(--kr-accent-cyan, #06B6D4))",
            boxShadow: "0 0 12px color-mix(in oklab, var(--kr-accent-purple, #A855F7) 40%, transparent)",
          }}
        >
          <MessageCircle className="h-4 w-4 text-white" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "var(--kr-accent-purple-light)" }}>
            Aurora
          </p>
          <p className="text-[13px]" style={{ color: "var(--kratos-text-primary)" }}>
            Precisa de ajuda com o conteúdo de hoje?
          </p>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
      </div>
    </GlassPanel>
  );
}

// ── Queue Summary — dado real do OMNIS content_queue.jsonl ─────────────────

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

function QueueSummaryCard({ summary }: { summary: AgenciaQueueSummary }) {
  const accent = "var(--kr-island-agencia)";
  const captionReady = summary.por_status["caption_ready"] ?? 0;
  const readyPct = summary.total > 0 ? Math.round((captionReady / summary.total) * 100) : 0;
  const statusEntries = Object.entries(summary.por_status).sort(([, a], [, b]) => b - a);

  return (
    <GlassPanel padding="md" className="space-y-4">
      {/* ── Header ── */}
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

      {/* ── Barra de progresso — % prontos ── */}
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

      {/* ── Breakdown por status ── */}
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

      {/* ── Próximo slot ── */}
      {summary.proximo_slot && (
        <div
          className="flex items-start gap-2.5 pt-3"
          style={{ borderTop: "1px solid var(--kratos-border)" }}
        >
          <CalendarClock className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: accent }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[12px] font-medium kratos-mono"
                style={{ color: "var(--kratos-text-primary)" }}
              >
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
  // KPIs de Instagram (alcance, engajamento) ficam em EmptyState até Publisher OS expor endpoint.
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
          description="Métricas de conteúdo não disponíveis. Conecte o Publisher OS para ver alcance, engajamento e pipeline."
        />
      ) : (
        <>
          <IslandPageHeader
            title="AGÊNCIA / ESTÚDIO"
            subtitle="Conteúdo, Marca e Comunicação que constroem autoridade"
            theme="agencia"
          />

          {/* Dado real: pipeline do content_queue do OMNIS */}
          <QueueSummaryCard summary={summary!} />
        </>
      )}
    </IslandPageFrame>
  );
}
