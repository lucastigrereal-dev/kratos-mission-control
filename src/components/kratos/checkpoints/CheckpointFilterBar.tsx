import { Filter } from "lucide-react";

type Chip = { label: string; active?: boolean };

const CHIPS: Chip[] = [
  { label: "Hoje", active: true },
  { label: "Recentes" },
  { label: "Manuais" },
  { label: "Contexto" },
];

export function CheckpointFilterBar() {
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
      {CHIPS.map((c) => (
        <span
          key={c.label}
          aria-disabled="true"
          title="Filtro visual — sem efeito real"
          className="rounded-sm px-2 py-1 text-[11px] kratos-mono uppercase tracking-[0.12em]"
          style={{
            color: c.active
              ? "var(--kratos-text-primary)"
              : "var(--kratos-text-secondary)",
            background: c.active
              ? "var(--kratos-surface-4)"
              : "var(--kratos-surface-3)",
            border: `1px solid ${c.active ? "var(--kratos-border-live)" : "var(--kratos-border)"}`,
          }}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}
