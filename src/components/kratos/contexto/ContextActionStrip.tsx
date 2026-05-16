import { useNavigate } from "@tanstack/react-router";
import { Save, RotateCcw, Sparkles, ChevronRight } from "lucide-react";
import { SystemCard } from "@/components/kratos/base/SystemCard";

interface Action {
  icon: typeof Save;
  label: string;
  hint: string;
  to?: string;
  handler?: () => void;
}

export function ContextActionStrip() {
  const navigate = useNavigate();

  const actions: Action[] = [
    {
      icon: Save,
      label: "Salvar checkpoint deste contexto",
      hint: "Ir para Checkpoints",
      to: "/checkpoints",
    },
    {
      icon: RotateCcw,
      label: "Retomar último checkpoint",
      hint: "Ver Checkpoints",
      to: "/checkpoints",
    },
    {
      icon: Sparkles,
      label: "Abrir Aurora",
      hint: "Painel lateral",
      handler: () => {
        window.dispatchEvent(new CustomEvent("kratos:toggle-aurora"));
      },
    },
    {
      icon: ChevronRight,
      label: "Ver detalhes do contexto",
      hint: "Recarregar snapshot",
      handler: () => {
        window.dispatchEvent(new CustomEvent("kratos:refresh-context"));
      },
    },
  ];

  return (
    <SystemCard padded={false} className="p-2">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {actions.map(({ icon: Icon, label, hint, to, handler }) => (
          <button
            key={label}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (to) {
                navigate({ to });
              } else if (handler) {
                handler();
              }
            }}
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
