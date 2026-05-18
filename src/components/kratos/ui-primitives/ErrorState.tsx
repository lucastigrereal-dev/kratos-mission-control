import { AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title: string;
  description?: string;
  retry?: () => void;
  variant?: "inline" | "card";
  className?: string;
}

export function ErrorState({
  title,
  description,
  retry,
  variant = "inline",
  className,
}: ErrorStateProps) {
  const content = (
    <>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          background: "var(--kratos-surface-3)",
          color: "var(--kratos-critical)",
        }}
      >
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className="text-sm font-medium"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {title}
        </h3>

        {description && (
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {description}
          </p>
        )}

        {retry && (
          <button
            type="button"
            onClick={retry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
            style={{
              color: "var(--kratos-text-primary)",
              border: "1px solid var(--kratos-border)",
            }}
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            Tentar novamente
          </button>
        )}
      </div>
    </>
  );

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex items-start gap-4 rounded-2xl border p-5",
          className,
        )}
        style={{
          background: "var(--kratos-surface-2)",
          borderColor: "var(--kratos-border)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        role="alert"
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-start gap-3 rounded-lg p-3", className)}
      style={{
        background: "var(--kratos-surface-3)",
        border: "1px solid var(--kratos-border)",
      }}
      role="alert"
    >
      {content}
    </div>
  );
}
