interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  status: string;
  risk: string;
  source: string;
  created_at: string;
  updated_at: string;
}

interface ApprovalCardProps {
  approval: ApprovalItem;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendente", className: "kr-chip kr-chip-neutral" },
  { value: "approved", label: "Aprovado", className: "kr-chip kr-chip-healthy" },
  { value: "rejected", label: "Rejeitado", className: "kr-chip kr-chip-critical" },
  { value: "deferred", label: "Adiado", className: "kr-chip kr-chip-degraded" },
  { value: "needs_context", label: "Precisa de contexto", className: "kr-chip kr-chip-info" },
] as const;

const RISK_LABELS: Record<string, { label: string; className: string }> = {
  low: { label: "Baixo", className: "kr-metric-badge kr-metric-badge--good" },
  medium: { label: "Médio", className: "kr-metric-badge kr-metric-badge--warning" },
  high: { label: "Alto", className: "kr-metric-badge kr-metric-badge--danger" },
  critical: { label: "Crítico", className: "kr-metric-badge kr-metric-badge--danger" },
};

export default function ApprovalCard({ approval, onStatusChange, onDelete }: ApprovalCardProps) {
  const riskInfo = RISK_LABELS[approval.risk] ?? RISK_LABELS.low;
  const currentStatus = STATUS_OPTIONS.find((o) => o.value === approval.status) ?? STATUS_OPTIONS[0];

  return (
    <div className="kr-glass-panel" style={{ padding: "var(--kr-space-section)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--kr-space-hud)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{approval.title}</span>
            <span className={riskInfo.className} style={{ fontSize: "var(--kr-text-xs)" }}>
              {riskInfo.label}
            </span>
          </div>
          {approval.description && (
            <div style={{ fontSize: "var(--kr-text-sm)", color: "var(--kr-text-secondary)", marginBottom: 8 }}>
              {approval.description}
            </div>
          )}
          <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", display: "flex", gap: 12 }}>
            <span>Fonte: {approval.source}</span>
            <span>Criado: {approval.created_at}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <select
            value={approval.status}
            onChange={(e) => onStatusChange(approval.id, e.target.value)}
            className={currentStatus.className}
            style={{
              border: "1px solid var(--kr-glass-border)",
              borderRadius: "var(--kr-radius-sm)",
              padding: "4px 8px",
              fontSize: "var(--kr-text-sm)",
              background: "var(--kr-glass-bg)",
              color: "var(--kr-text-primary)",
              cursor: "pointer",
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (window.confirm(`Remover "${approval.title}"? Esta ação é irreversível.`)) {
                onDelete(approval.id);
              }
            }}
            className="kr-interactive"
            style={{
              border: "none",
              background: "var(--kr-risk-critical-bg)",
              color: "var(--kr-risk-critical)",
              padding: "6px 14px",
              borderRadius: "var(--kr-radius-sm)",
              fontSize: "var(--kr-text-sm)",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Remover"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
