import { useApi } from "../hooks/useApi";
import LoadingSkeleton from "./LoadingSkeleton";

interface TaskItem {
  id: string;
  title: string;
  status: string;
  priority?: string;
  due_date?: string;
  project_id?: string;
}

interface AlertItem {
  id: string;
  title?: string;
  message?: string;
  severity?: string;
  status?: string;
  created_at?: string;
}

export default function BlockedItemsCard() {
  const { data: overdue, loading: loadingOverdue } = useApi<TaskItem[]>("/tasks/overdue");
  const { data: alerts, loading: loadingAlerts } = useApi<AlertItem[]>("/alerts/active");

  const loading = loadingOverdue || loadingAlerts;
  const blockedCount = (overdue?.length ?? 0) + (alerts?.length ?? 0);

  if (loading) return <LoadingSkeleton type="card" count={1} />;

  return (
    <div className="kr-glass-panel" style={{ padding: "var(--kr-space-section)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="kr-section-title" style={{ marginBottom: 0 }}>Itens Bloqueados</div>
        {blockedCount > 0 && (
          <span className="kr-metric-badge kr-metric-badge--danger" style={{ fontSize: "var(--kr-text-xs)" }}>
            {blockedCount}
          </span>
        )}
      </div>

      {blockedCount === 0 && (
        <div style={{ marginTop: 12, fontSize: "var(--kr-text-sm)", color: "var(--kr-text-muted)" }}>
          Nenhum item bloqueado.
        </div>
      )}

      {blockedCount > 0 && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {overdue && overdue.length > 0 && (
            <div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-risk-critical)", marginBottom: 4, fontWeight: 600 }}>
                Tarefas Atrasadas ({overdue.length})
              </div>
              {overdue.slice(0, 5).map((t) => (
                <div key={t.id} className="kr-right-rail-risk" style={{ borderLeftColor: "var(--kr-risk-critical)", background: "var(--kr-risk-critical-bg)", marginBottom: 2 }}>
                  <span className="kr-dot kr-dot-critical" />
                  <span style={{ fontSize: "var(--kr-text-sm)" }}>{t.title}</span>
                </div>
              ))}
            </div>
          )}

          {alerts && alerts.length > 0 && (
            <div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-risk-critical)", marginBottom: 4, fontWeight: 600 }}>
                Alertas Ativos ({alerts.length})
              </div>
              {alerts.slice(0, 5).map((a, i) => (
                <div key={a.id ?? i} className="kr-right-rail-risk" style={{ borderLeftColor: "var(--kr-risk-degraded)", background: "var(--kr-risk-degraded-bg)", marginBottom: 2 }}>
                  <span className="kr-dot kr-dot-degraded" />
                  <span style={{ fontSize: "var(--kr-text-sm)" }}>{a.title ?? a.message ?? "Alerta sem descricao"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
