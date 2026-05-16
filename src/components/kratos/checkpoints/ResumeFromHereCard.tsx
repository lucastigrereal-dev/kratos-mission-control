import { RotateCcw, Bookmark, Loader2 } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

interface Props {
  project: string;
  time: string;
  summary: string;
  nextAction: string;
  onResume?: () => void;
  isPending?: boolean;
}

export function ResumeFromHereCard({
  project,
  time,
  summary,
  nextAction,
  onResume,
  isPending = false,
}: Props) {
  return (
    <StatusCard accent="ghost" className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-ghost)" }}
          />
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Último ponto de retomada
          </span>
        </div>
        <span
          className="text-[11px] kratos-mono"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          {time}
        </span>
      </div>

      <div
        className="text-[11px] kratos-mono uppercase tracking-[0.15em] mb-1"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        {project}
      </div>

      <div
        className="text-[18px] font-semibold leading-snug"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {summary}
      </div>

      <p
        className="mt-2 text-[13px] leading-relaxed"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Retome daqui sem reconstruir o contexto.
      </p>

      <div
        className="mt-4 rounded-md px-3 py-2.5"
        style={{
          background: "var(--kratos-surface-3)",
          border: "1px solid var(--kratos-border)",
        }}
      >
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.15em] mb-1"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Próxima ação
        </div>
        <div
          className="text-[12px] leading-snug"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {nextAction}
        </div>
      </div>

      {onResume && (
        <button
          type="button"
          onClick={onResume}
          disabled={isPending}
          className="mt-auto pt-4 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-[12px] font-medium kratos-focus-ring kratos-card-hover disabled:opacity-50"
          style={{
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border-live)",
            color: "var(--kratos-text-primary)",
          }}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          Retomar daqui
        </button>
      )}
    </StatusCard>
  );
}
