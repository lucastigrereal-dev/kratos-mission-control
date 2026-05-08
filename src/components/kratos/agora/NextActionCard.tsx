import { ArrowRight, Sparkles } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

type Props = {
  title: string;
  rationale?: string;
  score?: number;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function NextActionCard({
  title,
  rationale,
  score,
  primaryLabel = "Executar agora",
  onPrimary,
  secondaryLabel = "Abrir Mentor",
  onSecondary,
}: Props) {
  return (
    <StatusCard accent="info" className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <ArrowRight
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Próxima ação única
        </span>
      </div>

      <div
        className="text-[18px] font-semibold leading-snug"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {title}
      </div>

      {rationale && (
        <p
          className="mt-2 text-[12px] leading-relaxed"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          {rationale}
        </p>
      )}

      <div className="mt-auto pt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPrimary}
          className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-[12px] font-medium kratos-focus-ring transition-colors"
          style={{
            background: "var(--kratos-accent)",
            color: "#0C0C0E",
          }}
        >
          {primaryLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onSecondary}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] kratos-mono uppercase tracking-[0.15em] kratos-focus-ring transition-colors"
          style={{
            background: "var(--kratos-surface-3)",
            color: "var(--kratos-text-secondary)",
            border: "1px solid var(--kratos-border)",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {secondaryLabel}
        </button>

        {typeof score === "number" && (
          <span
            className="ml-auto text-[10px] kratos-mono uppercase tracking-[0.15em]"
            style={{ color: "var(--kratos-info)" }}
          >
            score {score.toFixed(2)}
          </span>
        )}
      </div>
    </StatusCard>
  );
}
