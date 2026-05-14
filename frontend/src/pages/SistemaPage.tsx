import { useState, useEffect } from "react";
import SourceBadge, { type SourceType } from "../components/SourceBadge";

interface CollectorEntry {
  source: string;
  status: string;
  degraded?: boolean;
  error?: string;
  cpu_percent?: number;
  memory_percent?: number;
  total?: number;
  running?: number;
  unhealthy?: number;
}

interface CollectorStatus {
  system?: CollectorEntry;
  docker?: CollectorEntry;
  omnis?: CollectorEntry;
  git?: CollectorEntry;
  activitywatch?: CollectorEntry;
}

const API_BASE = "http://127.0.0.1:5100";

export default function SistemaPage() {
  const [data, setData] = useState<CollectorStatus | null>(null);
  const [source, setSource] = useState<SourceType>("unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/live/snapshot`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.collector_status);
        setSource("live");
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setSource("error");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <h2>Sistema</h2>
        <SourceBadge source={source} />
      </div>

      {loading && <div className="kr-empty-state">Carregando...</div>}
      {error && <div className="kr-empty-state" style={{ color: "var(--kr-red-400)" }}>Erro: {error}</div>}

      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
          {/* System */}
          <div className="kr-card">
            <h6>SYSTEM</h6>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className={`kr-chip ${data.system?.status === "ok" ? "kr-chip-healthy" : data.system?.degraded ? "kr-chip-critical" : "kr-chip-neutral"}`}
              >
                {data.system?.status || "?"}
              </span>
              <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                {data.system?.source || "?"}
              </span>
            </div>
            <div style={{ fontSize: "var(--kr-text-sm)", marginTop: 6 }}>
              CPU: {data.system?.cpu_percent ?? "?"}% · RAM: {data.system?.memory_percent ?? "?"}%
            </div>
          </div>

          {/* Docker */}
          <div className="kr-card">
            <h6>DOCKER</h6>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className={`kr-chip ${data.docker?.status === "ok" ? "kr-chip-healthy" : data.docker?.degraded ? "kr-chip-critical" : "kr-chip-neutral"}`}
              >
                {data.docker?.status || "?"}
              </span>
              <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                {data.docker?.source || "?"}
              </span>
            </div>
            <div style={{ fontSize: "var(--kr-text-sm)", marginTop: 6 }}>
              Containers: {data.docker?.total ?? "?"} total · {data.docker?.running ?? "?"} running
            </div>
            {data.docker?.unhealthy ? (
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-red-400)" }}>
                {data.docker.unhealthy} unhealthy
              </div>
            ) : null}
          </div>

          {/* Git */}
          <div className="kr-card">
            <h6>GIT</h6>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className={`kr-chip ${data.git?.status === "ok" ? "kr-chip-healthy" : data.git?.degraded ? "kr-chip-critical" : "kr-chip-neutral"}`}
              >
                {data.git?.status || "?"}
              </span>
              <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                {data.git?.source || "?"}
              </span>
            </div>
          </div>

          {/* OMNIS */}
          <div className="kr-card">
            <h6>OMNIS</h6>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className={`kr-chip ${data.omnis?.status === "ok" ? "kr-chip-healthy" : data.omnis?.degraded ? "kr-chip-critical" : "kr-chip-neutral"}`}
              >
                {data.omnis?.status || "?"}
              </span>
              <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                {data.omnis?.source || "?"}
              </span>
            </div>
          </div>

          {/* ActivityWatch */}
          <div className="kr-card">
            <h6>ACTIVITYWATCH</h6>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className={`kr-chip ${data.activitywatch?.status === "ok" ? "kr-chip-healthy" : data.activitywatch?.degraded ? "kr-chip-critical" : "kr-chip-neutral"}`}
              >
                {data.activitywatch?.status || "?"}
              </span>
              <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
                {data.activitywatch?.source || "?"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
