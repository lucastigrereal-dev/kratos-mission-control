import {
  HelpCircle,
  ArrowRight,
  Save,
  Timer,
  type LucideIcon,
} from "lucide-react";

type Action = { icon: LucideIcon; label: string };

const ACTIONS: Action[] = [
  { icon: HelpCircle, label: "Onde parei?" },
  { icon: ArrowRight, label: "O que faço agora?" },
  { icon: Save, label: "Salvar checkpoint" },
  { icon: Timer, label: "Plano de 25 min" },
];

export function AuroraQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ACTIONS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          onClick={(e) => e.preventDefault()}
          title="Mock visual — sem efeito real"
          aria-disabled="true"
          className="kratos-focus-ring kratos-card-hover flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px]"
          style={{
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
            color: "var(--kratos-text-primary)",
          }}
        >
          <Icon
            className="h-3 w-3 shrink-0"
            style={{ color: "var(--kratos-ghost)" }}
          />
          <span className="truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}
