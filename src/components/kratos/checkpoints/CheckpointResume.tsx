import { RotateCcw, Play } from "lucide-react";
import { ProgressRing } from "@/components/kratos/base/ProgressRing";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { Link } from "@tanstack/react-router";

interface CheckpointResumeProps {
  checkpoint?: {
    id: string;
    titulo: string;
    descricao?: string;
    progresso: number;
    atualizadoEm: string;
  } | null;
  isLoading?: boolean;
  onResume?: (id: string) => void;
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  if (Number.isNaN(then)) return "há algum tempo";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "agora mesmo";
  if (minutes < 60) return `há ${minutes}min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;
  return `há ${Math.floor(days / 7)}sem`;
}

export function CheckpointResume({
  checkpoint,
  isLoading = false,
  onResume,
}: CheckpointResumeProps) {
  // --- Loading ---
  if (isLoading) {
    return (
      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--kratos-surface-2)",
          border: `1px solid var(--kratos-border)`,
        }}
      >
        <LoadingState lines={2} compact />
      </div>
    );
  }

  // --- Empty ---
  if (!checkpoint) {
    return (
      <div
        className="rounded-xl p-5 text-center"
        style={{
          background: "var(--kratos-surface-2)",
          border: `1px solid var(--kratos-border)`,
        }}
      >
        <div
          className="text-[13px]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Nenhum checkpoint ativo. Crie um em{" "}
          <Link
            to="/checkpoints"
            className="underline underline-offset-2 kratos-focus-ring rounded"
            style={{ color: "var(--kratos-accent)" }}
          >
            /checkpoints
          </Link>
          .
        </div>
      </div>
    );
  }

  // --- Normal: checkpoint exists ---
  const { id, titulo, descricao, progresso, atualizadoEm } = checkpoint;

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2.5"
      style={{
        background: "var(--kratos-surface-2)",
        border: `1px solid var(--kratos-border)`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-text-secondary)" }}
          />
          <span className="kratos-eyebrow">Retomar checkpoint</span>
        </div>
        <ProgressRing
          value={progresso}
          size={32}
          strokeWidth={3}
          color="var(--kratos-accent)"
          trackColor="var(--kratos-surface-4)"
          label={`${Math.round(progresso)}%`}
        />
      </div>

      {/* Title */}
      <div
        className="text-[14px] font-medium leading-tight"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {titulo}
      </div>

      {/* Description (1-line truncate) */}
      {descricao && (
        <div
          className="text-[12px] truncate"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          {descricao}
        </div>
      )}

      {/* Footer: relative time + resume button */}
      <div className="flex items-center justify-between mt-1">
        <span
          className="text-[11px] kratos-mono"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          atualizado {relativeTime(atualizadoEm)}
        </span>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150 kratos-focus-ring"
          style={{
            background: "color-mix(in oklab, var(--kratos-accent) 14%, transparent)",
            color: "var(--kratos-accent)",
          }}
          onClick={() => onResume?.(id)}
        >
          <Play className="h-3 w-3" />
          Retomar
        </button>
      </div>
    </div>
  );
}
