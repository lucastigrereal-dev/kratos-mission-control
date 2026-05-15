import { useState } from "react";
import { useApi } from "../hooks/useApi";
import SourceBadge, { type SourceType } from "../components/SourceBadge";
import ApprovalCard from "../components/ApprovalCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { EmptyState, ErrorState } from "../components/ui";

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

interface ApprovalsResponse {
  source: string;
  data: ApprovalItem[];
  meta: { count: number };
}

const RISK_OPTIONS = ["low", "medium", "high", "critical"] as const;

export default function ApprovalsPage() {
  const { data: resp, loading, error, refetch } = useApi<ApprovalsResponse>("/approvals/");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newRisk, setNewRisk] = useState<string>("low");
  const [submitting, setSubmitting] = useState(false);

  const approvals = resp?.data ?? [];
  const source = (resp?.source ?? "unknown") as SourceType;

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/approvals/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), description: newDesc.trim(), risk: newRisk, source: "manual" }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewDesc("");
        setNewRisk("low");
        refetch();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/approvals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refetch();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/approvals/${id}`, { method: "DELETE" });
    refetch();
  }

  return (
    <div style={{ padding: "var(--kr-space-page)" }}>
      <div className="kr-section-title-wrap">
        <div className="kr-section-title-header">
          <h2 style={{ margin: 0 }}>Approval Cockpit</h2>
          <SourceBadge source={source} />
        </div>
        <p className="kr-section-title-sub">
          Fila de decisao local — nada executa sem aprovacao humana
        </p>
        <div className="kr-section-title-divider" />
      </div>

      {/* Create form */}
      <div className="kr-glass-panel" style={{ padding: "var(--kr-space-section)", marginBottom: "var(--kr-space-section)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", display: "block", marginBottom: 2 }}>
              Titulo
            </label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Nova aprovacao..."
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: "var(--kr-radius-sm)",
                border: "1px solid var(--kr-glass-border)",
                background: "var(--kr-glass-bg)",
                color: "var(--kr-text-primary)",
                fontSize: "var(--kr-text-sm)",
              }}
            />
          </div>
          <div style={{ flex: "0 1 140px" }}>
            <label style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", display: "block", marginBottom: 2 }}>
              Risco
            </label>
            <select
              value={newRisk}
              onChange={(e) => setNewRisk(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "var(--kr-radius-sm)",
                border: "1px solid var(--kr-glass-border)",
                background: "var(--kr-glass-bg)",
                color: "var(--kr-text-primary)",
                fontSize: "var(--kr-text-sm)",
              }}
            >
              {RISK_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={submitting || !newTitle.trim()}
            className="kr-interactive"
            style={{
              padding: "6px 16px",
              borderRadius: "var(--kr-radius-sm)",
              border: "none",
              background: submitting ? "var(--kr-text-disabled)" : "var(--kr-purple-500)",
              color: "#fff",
              fontSize: "var(--kr-text-sm)",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {submitting ? "..." : "Criar"}
          </button>
        </div>
      </div>

      {/* List */}
      {loading && <LoadingSkeleton type="card" count={3} />}
      {error && !loading && <ErrorState title="Erro ao carregar aprovacoes" description={error} onRetry={refetch} />}
      {!loading && !error && approvals.length === 0 && (
        <EmptyState title="Nenhuma aprovacao" description="Crie uma aprovacao para comecar a fila de decisao." />
      )}

      {!loading && approvals.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginBottom: 4 }}>
            {resp?.meta?.count ?? approvals.length} item(ns)
          </div>
          {approvals.map((a) => (
            <ApprovalCard
              key={a.id}
              approval={a}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
