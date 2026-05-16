import { Save, Loader2 } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";

interface Props {
  lastCheckpoint?: string;
  onSave?: () => void;
  isPending?: boolean;
}

export function CheckpointCard({
  lastCheckpoint,
  onSave,
  isPending = false,
}: Props) {
  return (
    <StatusCard className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Save
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Checkpoint
        </span>
      </div>

      <p
        className="text-[12px] leading-relaxed"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Salve onde parou antes de trocar de frente.
      </p>

      <button
        type="button"
        onClick={onSave}
        disabled={!onSave || isPending}
        className="mt-auto pt-4 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-[12px] font-medium kratos-focus-ring kratos-card-hover disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "var(--kratos-surface-3)",
          border: `1px solid ${onSave ? "var(--kratos-border-live)" : "var(--kratos-border)"}`,
          color: "var(--kratos-text-primary)",
        }}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        Salvar checkpoint deste contexto
      </button>

      <div
        className="mt-3 text-[10px] kratos-mono uppercase tracking-[0.15em]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        Último: {lastCheckpoint ?? "—"}
      </div>
    </StatusCard>
  );
}
