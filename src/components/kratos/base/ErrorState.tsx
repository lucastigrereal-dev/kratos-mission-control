import { AlertTriangle, Wrench, Unplug, SignalLow } from "lucide-react";

type ErrorVariant = "error" | "missing_config" | "external_unavailable" | "degraded";

type Props = {
  title?: string;
  description?: string;
  hint?: string;
  variant?: ErrorVariant;
};

const VARIANT_META: Record<
  ErrorVariant,
  { icon: typeof AlertTriangle; defaultTitle: string; color: string; bg: string }
> = {
  error: {
    icon: AlertTriangle,
    defaultTitle: "Algo falhou",
    color: "var(--kratos-critical)",
    bg: "color-mix(in oklab, var(--kratos-critical) 12%, transparent)",
  },
  missing_config: {
    icon: Wrench,
    defaultTitle: "Configuração pendente",
    color: "var(--kratos-warn)",
    bg: "color-mix(in oklab, var(--kratos-warn) 12%, transparent)",
  },
  external_unavailable: {
    icon: Unplug,
    defaultTitle: "Serviço externo indisponível",
    color: "var(--kratos-text-muted)",
    bg: "var(--kratos-surface-3)",
  },
  degraded: {
    icon: SignalLow,
    defaultTitle: "Funcionando parcialmente",
    color: "var(--kratos-warn)",
    bg: "color-mix(in oklab, var(--kratos-warn) 12%, transparent)",
  },
};

export function ErrorState({
  title,
  description = "Não foi possível carregar este painel.",
  hint,
  variant = "error",
}: Props) {
  const meta = VARIANT_META[variant];
  const Icon = meta.icon;

  return (
    <div
      className="flex items-start gap-3 rounded-md p-3"
      style={{
        background: "var(--kratos-surface-3)",
        border: `1px solid ${variant === "error" ? "var(--kratos-border-off-focus)" : "var(--kratos-border)"}`,
      }}
      role="alert"
    >
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ background: meta.bg, color: meta.color }}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
          {title ?? meta.defaultTitle}
        </div>
        <div className="mt-0.5 text-[11px]" style={{ color: "var(--kratos-text-secondary)" }}>
          {description}
        </div>
        {hint && (
          <div
            className="mt-1.5 text-[10px] kratos-mono uppercase tracking-wider"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}
