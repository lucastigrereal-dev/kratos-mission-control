import { useApi } from "../hooks/useApi";
import LoadingSkeleton from "./LoadingSkeleton";

interface NextActionData {
  next_action?: string | { title: string; priority?: string; context?: string };
  next_best_action?: string | { title: string; priority?: string; context?: string };
}

function extractAction(action: string | { title?: string; priority?: string; context?: string } | undefined): {
  title: string;
  priority: string;
  context: string;
} {
  if (!action) return { title: "Nenhuma acao definida", priority: "low", context: "" };
  if (typeof action === "string") return { title: action, priority: "low", context: "" };
  return {
    title: action.title ?? "Nenhuma acao definida",
    priority: action.priority ?? "low",
    context: action.context ?? "",
  };
}

const PRIORITY_CLASS: Record<string, string> = {
  high: "kr-metric-badge kr-metric-badge--danger",
  medium: "kr-metric-badge kr-metric-badge--warning",
  low: "kr-metric-badge kr-metric-badge--neutral",
  critical: "kr-metric-badge kr-metric-badge--danger",
};

export default function NextBestActionCard() {
  const { data, loading, error } = useApi<NextActionData>("/mentor/next-action");

  if (loading) return <LoadingSkeleton type="card" count={1} />;

  const action = extractAction(data?.next_best_action ?? data?.next_action);

  return (
    <div className="kr-glass-panel" style={{ padding: "var(--kr-space-section)", height: "100%" }}>
      <div className="kr-section-title">Proxima Acao</div>

      {error && (
        <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-muted)", marginTop: 8 }}>
          Indisponivel
        </div>
      )}

      {!error && (
        <>
          <div style={{ marginTop: 8, fontWeight: 600, fontSize: "1.05rem", lineHeight: 1.3 }}>
            {action.title}
          </div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span className={PRIORITY_CLASS[action.priority] ?? PRIORITY_CLASS.low} style={{ fontSize: "var(--kr-text-xs)" }}>
              {action.priority}
            </span>
          </div>
          {action.context && (
            <div style={{ marginTop: 8, fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", lineHeight: 1.4 }}>
              {action.context}
            </div>
          )}
        </>
      )}
    </div>
  );
}
