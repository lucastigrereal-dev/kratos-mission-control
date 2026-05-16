import { RotateCcw, Trash2, Loader2 } from "lucide-react";
import { StatusDot, type Severity } from "@/components/kratos/base/StatusDot";

export type CheckpointType = "manual" | "contexto" | "sistema";
export type CheckpointAge = "recente" | "antigo";

const TYPE_LABEL: Record<CheckpointType, string> = {
  manual: "MANUAL",
  contexto: "CONTEXTO",
  sistema: "SISTEMA",
};

const AGE_META: Record<CheckpointAge, { label: string; severity: Severity }> = {
  recente: { label: "RECENTE", severity: "ok" },
  antigo: { label: "ANTIGO", severity: "muted" },
};

export type CheckpointItem = {
  id: string;
  time: string;
  project: string;
  summary: string;
  nextAction: string;
  tags: string[];
  type: CheckpointType;
  age: CheckpointAge;
};

interface Props {
  item: CheckpointItem;
  onResume?: (id: string) => void;
  onDelete?: (id: string) => void;
  isPending?: boolean;
}

export function CheckpointItemCard({
  item,
  onResume,
  onDelete,
  isPending = false,
}: Props) {
  const ageMeta = AGE_META[item.age];
  return (
    <div
      className="rounded-md p-4"
      style={{
        background: "var(--kratos-surface-2)",
        border: "1px solid var(--kratos-border)",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] kratos-mono"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {item.time}
          </span>
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.12em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            · {item.project}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-sm px-1.5 py-0.5 text-[10px] kratos-mono uppercase tracking-[0.12em]"
            style={{
              color: "var(--kratos-text-secondary)",
              background: "var(--kratos-surface-3)",
              border: "1px solid var(--kratos-border)",
            }}
          >
            {TYPE_LABEL[item.type]}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10px] kratos-mono uppercase tracking-[0.12em]"
            style={{
              color: "var(--kratos-text-secondary)",
              background: "var(--kratos-surface-3)",
              border: "1px solid var(--kratos-border)",
            }}
          >
            <StatusDot severity={ageMeta.severity} size="xs" />
            {ageMeta.label}
          </span>
        </div>
      </div>

      <div
        className="text-[13px] font-medium leading-snug"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {item.summary}
      </div>

      <div
        className="mt-1 text-[12px] leading-relaxed"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Próxima ação: {item.nextAction}
      </div>

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-sm px-1.5 py-0.5 text-[10px] kratos-mono"
              style={{
                color: "var(--kratos-text-muted)",
                background: "var(--kratos-surface-3)",
                border: "1px solid var(--kratos-border)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {onResume && (
          <button
            type="button"
            onClick={() => onResume(item.id)}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium kratos-focus-ring kratos-card-hover disabled:opacity-50"
            style={{
              background: "var(--kratos-surface-3)",
              border: "1px solid var(--kratos-border)",
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
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium kratos-focus-ring kratos-card-hover disabled:opacity-50"
            style={{
              background: "var(--kratos-surface-3)",
              border: "1px solid var(--kratos-border)",
              color: "var(--kratos-critical)",
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
