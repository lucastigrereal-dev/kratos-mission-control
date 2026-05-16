import { Filter } from "lucide-react";
import type { CheckpointStatus } from "@/../api-contract/checkpoint.schema";

interface Chip {
  label: string;
  value: CheckpointStatus | "all";
}

const CHIPS: Chip[] = [
  { label: "Todos", value: "all" },
  { label: "Em progresso", value: "in_progress" },
  { label: "Pendentes", value: "pending" },
  { label: "Concluídos", value: "completed" },
  { label: "Bloqueados", value: "blocked" },
];

interface Props {
  active: CheckpointStatus | "all";
  onChange: (value: CheckpointStatus | "all") => void;
}

export function CheckpointFilterBar({ active, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-md px-3 py-2"
      style={{
        background: "var(--kratos-surface-2)",
        border: "1px solid var(--kratos-border)",
      }}
    >
      <Filter
        className="h-3.5 w-3.5"
        style={{ color: "var(--kratos-text-muted)" }}
      />
      <span
        className="mr-2 text-[10px] kratos-mono uppercase tracking-[0.18em]"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        Filtros
      </span>
      {CHIPS.map((c) => {
        const isActive = active === c.value;
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            className="rounded-sm px-3 py-2 text-[11px] kratos-mono uppercase tracking-[0.12em] kratos-card-hover kratos-focus-ring"
            style={{
              color: isActive
                ? "var(--kratos-text-primary)"
                : "var(--kratos-text-secondary)",
              background: isActive
                ? "var(--kratos-surface-4)"
                : "var(--kratos-surface-3)",
              border: `1px solid ${isActive ? "var(--kratos-border-live)" : "var(--kratos-border)"}`,
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
