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
  Lock,
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

// ── MetricsLockedCard — EmptyState honesto até Meta OAuth ─────────────────

function MetricsLockedCard() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Métricas de Performance
        </span>
        <span
          className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded flex items-center gap-1"
          style={{
            background: "color-mix(in oklab, var(--kr-warning) 10%, transparent)",
            color: "var(--kr-warning)",
          }}
        >
          <Lock className="h-2.5 w-2.5" />
          Pendente
        </span>
      </div>
      <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
        Alcance, engajamento e crescimento de seguidores disponíveis após conectar a API do Instagram.
        Bloqueio ativo: <span className="kratos-mono" style={{ color: "var(--kr-warning)" }}>META_APP_ID/SECRET</span> não configurados.
      </p>
    </GlassPanel>
  );
}

// ── CrmLockedCard — EmptyState honesto até CRM backend ────────────────────

function CrmLockedCard() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          CRM — Pipeline de Collabs
        </span>
        <span
          className="ml-auto text-[10px] kratos-mono px-1.5 py-0.5 rounded flex items-center gap-1"
          style={{
            background: "color-mix(in oklab, var(--kratos-critical) 10%, transparent)",
            color: "var(--kratos-critical)",
          }}
        >
          <Lock className="h-2.5 w-2.5" />
          Offline
        </span>
      </div>
      <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
        Pipeline de hotéis e restaurantes (Starter · Growth · Premium) indisponível.
        Bloqueio ativo: <span className="kratos-mono" style={{ color: "var(--kratos-critical)" }}>crm-tigre-backend unhealthy</span>.
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

          {/* Dado real: fila de aprovação de captions (caption_drafts.jsonl) */}
          <ContentDraftsCard />

          {/* Métricas de Instagram — aguardando Meta OAuth */}
          <MetricsLockedCard />

          {/* CRM Pipeline — aguardando crm-tigre-backend */}
          <CrmLockedCard />
        </>
      )}
    </IslandPageFrame>
  );
}
