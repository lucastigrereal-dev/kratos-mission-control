/**
 * RouteErrorBoundary — W11-B7
 *
 * Componente de erro padrão para rotas TanStack Router.
 * Captura erros no Sentry (quando ativo) e exibe UI operacional de fallback.
 *
 * Uso em rotas:
 *   export const Route = createFileRoute("/minha-rota")({
 *     component: MinhaView,
 *     errorComponent: RouteErrorBoundary,
 *   });
 */

import { useRouter } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { captureError } from "@/lib/sentry";
import { trackErrorBoundary } from "@/lib/analytics/kratosAnalytics";
import { useEffect } from "react";

interface RouteErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export function RouteErrorBoundary({ error, reset }: RouteErrorBoundaryProps) {
  const router = useRouter();
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // Capture once on mount
  useEffect(() => {
    captureError(error, { route: pathname });
    trackErrorBoundary(pathname, error.name);
  }, [error, pathname]);

  return (
    <div
      className="flex min-h-[60vh] items-center justify-center px-6 py-12"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in oklab, var(--kratos-critical) 12%, transparent)",
              border: "1px solid color-mix(in oklab, var(--kratos-critical) 30%, transparent)",
            }}
          >
            <AlertTriangle
              className="h-6 w-6"
              style={{ color: "var(--kratos-critical)" }}
              aria-hidden
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2
            className="text-[16px] font-semibold"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            Esta tela encontrou um problema
          </h2>
          <p
            className="text-[12px]"
            style={{ color: "var(--kratos-text-secondary)" }}
          >
            {error.message
              ? error.message.slice(0, 120)
              : "Erro inesperado. O problema foi registrado automaticamente."}
          </p>
          {import.meta.env?.DEV && (
            <pre
              className="mt-2 rounded-lg p-3 text-left text-[10px] overflow-auto max-h-32"
              style={{
                background: "var(--kratos-surface-3)",
                color: "var(--kratos-text-muted)",
                border: "1px solid var(--kratos-border)",
              }}
            >
              {error.stack?.slice(0, 400)}
            </pre>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-medium kratos-focus-ring transition-colors"
            style={{
              background: "var(--kratos-accent)",
              color: "var(--kratos-text-primary)",
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Tentar novamente
          </button>
          <a
            href="/agora"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-medium kratos-focus-ring transition-colors"
            style={{
              background: "var(--kratos-surface-3)",
              border: "1px solid var(--kratos-border)",
              color: "var(--kratos-text-secondary)",
            }}
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
            Ir para Agora
          </a>
        </div>
      </div>
    </div>
  );
}
