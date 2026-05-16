import type { ProjectStatus } from "../../../../api-contract/project.schema";

type FilterValue = ProjectStatus | "all";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "paused", label: "Pausados" },
  { value: "completed", label: "Concluídos" },
];

interface Props {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
  counts: Record<FilterValue, number>;
}

export function ProjectFilterBar({ active, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[10px] kratos-mono uppercase tracking-[0.12em] kratos-focus-ring transition-colors"
          style={{
            background:
              active === f.value
                ? "var(--kratos-surface-3)"
                : "transparent",
            border: `1px solid ${
              active === f.value
                ? "var(--kratos-border-live)"
                : "var(--kratos-border)"
            }`,
            color:
              active === f.value
                ? "var(--kratos-text-primary)"
                : "var(--kratos-text-muted)",
          }}
        >
          {f.label}
          <span
            className="tabular-nums"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {counts[f.value] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
