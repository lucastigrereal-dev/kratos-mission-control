import { useState } from "react";
import { Sparkles, Clock, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { AuroraInsight } from "../../../../api-contract/aurora.schema";

const MAX_TEXT_CHARS = 220; // trunca texto longo; usuário expande se quiser

const CONFIDENCE_COLORS: Record<string, string> = {
  high: "var(--kr-success)",
  medium: "var(--kr-warning)",
  low: "var(--kratos-text-muted)",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "agora mesmo";
    if (diffMin < 60) return `há ${diffMin}m`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `há ${diffH}h`;
    return `há ${Math.floor(diffH / 24)}d`;
  } catch {
    return "";
  }
}

interface AuroraInsightCardProps {
  insight: AuroraInsight | null;
  isLoading: boolean;
  isError: boolean;
  onRefetch?: () => void;
}

export function AuroraInsightCard({
  insight,
  isLoading,
  isError,
  onRefetch,
}: AuroraInsightCardProps) {
  // Sem dado real → EmptyState honesto. Nunca inventa texto.
  if (!insight && !isLoading) {
    return (
      <div
        className="rounded-lg p-3 space-y-1.5"
        style={{ background: "rgba(99,102,241,0.06)", border: "1px dashed var(--kratos-border)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kratos-ghost)" }} />
          <span className="text-[11px] font-medium" style={{ color: "var(--kratos-text-secondary)" }}>
            Aurora · Insight
          </span>
        </div>
        <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
          {isError
            ? "Não foi possível ler o state.json do OMNIS."
            : "Aguardando análise do OMNIS. Quando o OMNIS gerar um insight, aparece aqui."}
        </p>
        {onRefetch && (
          <button
            type="button"
            onClick={onRefetch}
            className="flex items-center gap-1 text-[10px] transition-opacity hover:opacity-70"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            <RefreshCw className="h-3 w-3" />
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="rounded-lg p-3 animate-pulse"
        style={{ background: "rgba(99,102,241,0.06)", border: "1px dashed var(--kratos-border)" }}
      >
        <div className="h-3 w-24 rounded mb-2" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-full rounded mb-1" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-3/4 rounded" style={{ background: "var(--kratos-surface-4)" }} />
      </div>
    );
  }

  if (!insight) return null;

  const relativeTime = formatRelativeTime(insight.generated_at);
  const confidenceColor = insight.confidence
    ? CONFIDENCE_COLORS[insight.confidence]
    : undefined;
  const confidenceLabel = insight.confidence
    ? CONFIDENCE_LABELS[insight.confidence]
    : undefined;
  const isLong = insight.text.length > MAX_TEXT_CHARS;

  return <AuroraInsightCardInner
    insight={insight}
    relativeTime={relativeTime}
    confidenceColor={confidenceColor}
    confidenceLabel={confidenceLabel}
    isLong={isLong}
  />;
}

interface InnerProps {
  insight: AuroraInsight;
  relativeTime: string;
  confidenceColor: string | undefined;
  confidenceLabel: string | undefined;
  isLong: boolean;
}

function AuroraInsightCardInner({
  insight,
  relativeTime,
  confidenceColor,
  confidenceLabel,
  isLong,
}: InnerProps) {
  const [expanded, setExpanded] = useState(false);
  const displayText = isLong && !expanded
    ? insight.text.slice(0, MAX_TEXT_CHARS).trimEnd() + "…"
    : insight.text;

  return (
    <div
      className="rounded-lg p-3 space-y-2"
      style={{
        background: "rgba(99,102,241,0.08)",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kratos-ghost)" }} />
          <span
            className="text-[11px] font-medium"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            Aurora · Insight
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {confidenceColor && confidenceLabel && (
            <span
              className="text-[10px] kratos-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                color: confidenceColor,
                background: `color-mix(in oklab, ${confidenceColor} 12%, transparent)`,
                border: `1px solid color-mix(in oklab, ${confidenceColor} 20%, transparent)`,
              }}
            >
              {confidenceLabel}
            </span>
          )}
        </div>
      </div>

      {/* Insight text — truncado com expand */}
      <p
        className="text-[12px] leading-relaxed"
        style={{ color: "var(--kratos-text-primary)" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {displayText}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-[10px] transition-opacity hover:opacity-70"
          style={{ color: "var(--kratos-ghost)" }}
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? "Ver menos" : "Ver mais"}
        </button>
      )}

      {/* Focus recommendation */}
      {insight.focus_recommendation && (
        <div
          className="rounded px-2 py-1.5 text-[11px]"
          style={{
            background: "rgba(99,102,241,0.1)",
            color: "var(--kratos-ghost)",
            borderLeft: "2px solid var(--kratos-ghost)",
          }}
        >
          {insight.focus_recommendation}
        </div>
      )}

      {/* Footer — timestamp + modelo */}
      <div className="flex items-center gap-1.5 pt-0.5">
        <Clock className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
        <span className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
          {relativeTime}
          {" · "}
          {insight.model ?? (insight.source === "omnis_ollama" ? "Ollama" : insight.source)}
        </span>
      </div>
    </div>
  );
}
