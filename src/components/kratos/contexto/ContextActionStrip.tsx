import { Save, RotateCcw, Sparkles, ChevronRight, type LucideIcon } from "lucide-react";
import { SystemCard } from "@/components/kratos/base/SystemCard";

type Action = {
  icon: LucideIcon;
  label: string;
  hint: string;
};

const ACTIONS: Action[] = [
  { icon: Save, label: "Salvar checkpoint deste contexto", hint: "Visual" },
  { icon: RotateCcw, label: "Retomar último checkpoint", hint: "Visual" },
  { icon: Sparkles, label: "Abrir Aurora", hint: "Atalho visual" },
  { icon: ChevronRight, label: "Ver detalhes", hint: "Visual" },
];

export function ContextActionStrip() {
  return (
    <SystemCard padded={false} className="p-2">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {ACTIONS.map(({ icon: Icon, label, hint }) => (
          <button
            key={label}
            type="button"
            onClick={(e) => e.preventDefault()}
            title="Mock visual — sem efeito real"
            aria-disabled="true"
            className="kratos-focus-ring kratos-card-hover flex items-center gap-3 rounded-md px-3 py-2.5 text-left"
            style={{
              background: "var(--kratos-surface-3)",
              border: "1px solid var(--kratos-border)",
            }}
          >
            <Icon
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "var(--kratos-text-muted)" }}
            />
            <div className="min-w-0">
              <div
                className="truncate text-[12px] font-medium"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {label}
              </div>
              <div
                className="text-[10px] kratos-mono uppercase tracking-[0.12em]"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                {hint}
              </div>
            </div>
          </button>
        ))}
      </div>
    </SystemCard>
  );
}
