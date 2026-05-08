import { AlertTriangle } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  hint?: string;
};

export function ErrorState({
  title = "Algo falhou",
  description = "Não foi possível carregar este painel.",
  hint,
}: Props) {
  return (
    <div
      className="flex items-start gap-3 rounded-md p-3"
      style={{
        background: "var(--kratos-surface-3)",
        border: "1px solid var(--kratos-border-off-focus)",
      }}
    >
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ background: "rgba(239,68,68,0.12)", color: "var(--kratos-critical)" }}
      >
        <AlertTriangle className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div
          className="text-[12px] font-medium"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {title}
        </div>
        <div
          className="mt-0.5 text-[11px]"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
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
