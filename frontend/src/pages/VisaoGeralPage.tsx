import { useKratosContext } from "../components/Layout";
import KratosWorldMap from "../components/KratosWorldMap";
import TodayMissionPanel from "../components/TodayMissionPanel";
import NextBestActionCard from "../components/NextBestActionCard";
import BlockedItemsCard from "../components/BlockedItemsCard";
import FocusNowCard from "../components/FocusNowCard";
import { useApi } from "../hooks/useApi";
import SourceBadge, { type SourceType } from "../components/SourceBadge";
import { useNavigate } from "react-router-dom";

interface OmnisBrief {
  source: string;
  data?: { status: string; mode?: string };
}

interface PendingCount {
  source: string;
  data: Array<{ id: string }>;
  meta?: { count: number };
}

export default function VisaoGeralPage() {
  const { currentMission } = useKratosContext();
  const navigate = useNavigate();
  const { data: omnis } = useApi<OmnisBrief>("/omnis/status");
  const { data: approvals } = useApi<PendingCount>("/approvals/?status=pending");

  const omnisSource = (omnis?.source ?? "unknown") as SourceType;
  const omnisStatus = omnis?.data?.status ?? "unknown";
  const pendingCount = approvals?.meta?.count ?? approvals?.data?.length ?? 0;

  return (
    <div style={{ padding: "var(--kr-space-page)", display: "flex", flexDirection: "column", gap: "var(--kr-space-section)" }}>
      {/* Header row with quick stats */}
      <div className="kr-section-title-wrap">
        <div className="kr-section-title-header">
          <h2 style={{ margin: 0 }}>Mission Control</h2>
          <SourceBadge source={omnisSource} />
        </div>
        <p className="kr-section-title-sub">
          KRATOS 0.10 — Verdade Operacional. Nada executa sem aprovacao humana.
        </p>
        <div className="kr-section-title-divider" />
      </div>

      {/* Quick-glance stats */}
      <div className="kr-motion-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--kr-space-hud)" }}>
        <div
          className={`kr-metric-badge ${omnisStatus === "operational" ? "kr-metric-badge--good" : omnisStatus === "degraded" ? "kr-metric-badge--warning" : "kr-metric-badge--danger"}`}
          onClick={() => navigate("/omnis")}
          style={{ cursor: "pointer" }}
        >
          <span className="kr-metric-badge-value">{omnisStatus === "operational" ? "ON" : omnisStatus === "degraded" ? "DEG" : "ERR"}</span>
          <span className="kr-metric-badge-label">OMNIS</span>
        </div>
        <div
          className={`kr-metric-badge ${pendingCount > 0 ? "kr-metric-badge--warning" : "kr-metric-badge--good"}`}
          onClick={() => navigate("/approvals")}
          style={{ cursor: "pointer" }}
        >
          <span className="kr-metric-badge-value">{pendingCount}</span>
          <span className="kr-metric-badge-label">Pendencias</span>
        </div>
        <div
          className="kr-metric-badge kr-metric-badge--info"
          onClick={() => navigate("/tarefas")}
          style={{ cursor: "pointer" }}
        >
          <span className="kr-metric-badge-value">...</span>
          <span className="kr-metric-badge-label">Tarefas</span>
        </div>
        <div
          className="kr-metric-badge kr-metric-badge--neutral"
          onClick={() => navigate("/projetos")}
          style={{ cursor: "pointer" }}
        >
          <span className="kr-metric-badge-value">...</span>
          <span className="kr-metric-badge-label">Projetos</span>
        </div>
      </div>

      {/* World Map — visual centerpiece */}
      <KratosWorldMap currentMission={currentMission} />

      {/* Dashboard grid — 2x2 cards answering the 7 questions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--kr-space-hud)",
      }}>
        <TodayMissionPanel />
        <NextBestActionCard />
        <BlockedItemsCard />
        <FocusNowCard />
      </div>
    </div>
  );
}
