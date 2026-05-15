import { useApi } from "../hooks/useApi";
import SourceBadge from "../components/SourceBadge";
import type { SourceType } from "../components/SourceBadge";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

interface OmnisStatusData {
  status: string;
  version?: string;
  sectors_count?: number;
  skills_count?: number;
  jobs_running?: number;
  jobs_failed?: number;
  blockers?: string[];
  mode?: string;
  updated_at?: string;
  source?: string;
}

interface OmnisCollectorResponse {
  source: string;
  collector_status: string;
  data: OmnisStatusData;
  error?: string;
}

function mapCollectorSource(source: string): SourceType {
  if (source === "real") return "live";
  if (source === "fallback") return "fallback";
  if (source === "error") return "error";
  return "unknown";
}

function statusLabel(status: string): string {
  switch (status) {
    case "operational": return "Operacional";
    case "degraded": return "Degradado";
    case "error": return "Erro";
    default: return status;
  }
}

function statusVariant(status: string): "healthy" | "degraded" | "critical" | "offline" {
  switch (status) {
    case "operational": return "healthy";
    case "degraded": return "degraded";
    case "error": return "critical";
    default: return "offline";
  }
}

export default function OmnisPage() {
  const { data: statusResp, loading, error, refetch } = useApi<OmnisCollectorResponse>("/omnis/status");

  if (loading) {
    return (
      <div style={{ padding: "var(--kr-space-page)" }}>
        <h2 style={{ marginBottom: "var(--kr-space-section)" }}>OMNIS Bridge</h2>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (error && !statusResp) {
    return (
      <div style={{ padding: "var(--kr-space-page)" }}>
        <h2 style={{ marginBottom: "var(--kr-space-section)" }}>OMNIS Bridge</h2>
        <ErrorState
          severity="error"
          title="Falha ao conectar com OMNIS"
          description={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  const omnisData = statusResp?.data;
  const collectorSource = statusResp?.source ?? "unknown";
  const collectorStatus = statusResp?.collector_status ?? "unknown";

  if (!omnisData) {
    return (
      <div style={{ padding: "var(--kr-space-page)" }}>
        <h2 style={{ marginBottom: "var(--kr-space-section)" }}>OMNIS Bridge</h2>
        <EmptyState
          title="Sem dados do OMNIS"
          description="O coletor retornou uma resposta sem dados. Verifique a conexão com a bridge."
          onAction={refetch}
          actionLabel="Tentar novamente"
        />
      </div>
    );
  }

  const variant = statusVariant(omnisData.status);
  const dotClass = `kr-dot kr-dot-${variant === "healthy" ? "live" : variant === "degraded" ? "degraded" : variant === "critical" ? "critical" : "offline"}`;

  return (
    <div style={{ padding: "var(--kr-space-page)" }}>
      <div className="kr-section-title-wrap">
        <div className="kr-section-title-header">
          <h2 style={{ margin: 0 }}>OMNIS Bridge</h2>
          <SourceBadge source={mapCollectorSource(collectorSource)} />
        </div>
        <p className="kr-section-title-sub">
          Bridge operacional — executor de ações com supervisão humana
        </p>
        <div className="kr-section-title-divider" />
      </div>

      {/* Status Panel */}
      <div className="kr-glass-panel" style={{ padding: "var(--kr-space-section)", marginBottom: "var(--kr-space-section)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kr-space-section)", marginBottom: "var(--kr-space-section)" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: variant === "healthy" ? "var(--kr-status-healthy-bg)"
              : variant === "degraded" ? "var(--kr-status-degraded-bg)"
              : variant === "critical" ? "var(--kr-status-critical-bg)"
              : "var(--kr-status-offline-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem",
          }}>
            <span className={dotClass} style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <div className="kr-section-title" style={{ marginBottom: 0 }}>
              {statusLabel(omnisData.status)}
            </div>
            <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-secondary)" }}>
              {omnisData.mode === "observe" ? "Modo observação"
                : omnisData.mode === "cli-bridge-read-only" ? "Modo leitura (bridge CLI)"
                : omnisData.mode ?? "Desconhecido"}
            </div>
          </div>
        </div>

        {/* Collector status detail */}
        <div style={{
          display: "flex", gap: "var(--kr-space-section)", flexWrap: "wrap",
          fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)",
          borderTop: "1px solid var(--kr-glass-border)",
          paddingTop: "var(--kr-space-hud)",
        }}>
          <span>Fonte: <strong style={{ color: "var(--kr-text-secondary)" }}>{collectorStatus === "ok" ? "Coletor ativo" : collectorStatus}</strong></span>
          {omnisData.version && <span>Versão: <strong style={{ color: "var(--kr-text-secondary)" }}>{omnisData.version}</strong></span>}
          {omnisData.updated_at && <span>Atualizado: <strong style={{ color: "var(--kr-text-secondary)" }}>{omnisData.updated_at}</strong></span>}
          {omnisData.source && <span>Origem: <strong style={{ color: "var(--kr-text-secondary)" }}>{omnisData.source}</strong></span>}
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--kr-space-hud)", marginBottom: "var(--kr-space-section)" }}>
        <div className="kr-metric-badge">
          <span className="kr-metric-badge-value">{omnisData.sectors_count ?? "—"}</span>
          <span className="kr-metric-badge-label">Setores</span>
        </div>
        <div className="kr-metric-badge">
          <span className="kr-metric-badge-value">{omnisData.skills_count ?? "—"}</span>
          <span className="kr-metric-badge-label">Skills</span>
        </div>
        <div className="kr-metric-badge kr-metric-badge--good">
          <span className="kr-metric-badge-value">{omnisData.jobs_running ?? "—"}</span>
          <span className="kr-metric-badge-label">Jobs Ativos</span>
        </div>
        <div className={`kr-metric-badge ${(omnisData.jobs_failed ?? 0) > 0 ? "kr-metric-badge--danger" : "kr-metric-badge--neutral"}`}>
          <span className="kr-metric-badge-value">{omnisData.jobs_failed ?? "—"}</span>
          <span className="kr-metric-badge-label">Jobs Falhos</span>
        </div>
      </div>

      {/* Blockers */}
      {omnisData.blockers && omnisData.blockers.length > 0 && (
        <div className="kr-glass-panel" style={{ padding: "var(--kr-space-section)", marginBottom: "var(--kr-space-section)" }}>
          <div className="kr-section-title">Bloqueios Ativos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {omnisData.blockers.map((blocker: string, i: number) => (
              <div key={i} className="kr-right-rail-risk" style={{ borderLeftColor: "var(--kr-risk-critical)", background: "var(--kr-risk-critical-bg)" }}>
                <span className="kr-dot kr-dot-critical" />
                <span style={{ fontSize: "var(--kr-text-sm)" }}>{blocker}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offline warning */}
      {variant !== "healthy" && (
        <div className="kr-degraded-indicator" style={{ marginBottom: "var(--kr-space-section)" }}>
          <span className="kr-degraded-indicator-dot" />
          <span>
            {variant === "critical" ? "Bridge em estado crítico — verifique a conexão OMNIS."
              : variant === "degraded" ? "Bridge degradada — algumas funcionalidades podem estar indisponíveis."
              : "Bridge offline — sem conexão com OMNIS."}
          </span>
        </div>
      )}
    </div>
  );
}
