import SourceBadge, { type SourceType } from "./SourceBadge";
import { type ConnectionState } from "../hooks/useLiveKratos";
import { useMemo } from "react";

interface KratosTopHudProps {
  connectionState: ConnectionState;
  snapshotSource?: string;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function fmtTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function fmtDate(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "America/Sao_Paulo",
  });
}

const STATUS_MAP: Record<ConnectionState, { label: string; className: string }> = {
  live: { label: "Operacional", className: "kr-dot-live" },
  reconnecting: { label: "Reconectando", className: "kr-dot-degraded" },
  polling: { label: "Polling", className: "kr-dot-degraded" },
  fallback: { label: "Fallback", className: "kr-dot-degraded" },
  offline: { label: "Offline", className: "kr-dot-critical" },
};

function badgeSource(state: ConnectionState): SourceType {
  if (state === "live") return "live";
  if (state === "offline") return "error";
  return "cached";
}

export default function KratosTopHud({ connectionState, snapshotSource }: KratosTopHudProps) {
  const greeting = useMemo(getGreeting, []);
  const time = useMemo(fmtTime, []);
  const date = useMemo(fmtDate, []);
  const status = STATUS_MAP[connectionState] || STATUS_MAP.offline;

  return (
    <div className="kr-top-hud">
      <div className="kr-top-hud-left">
        <span className="kr-top-hud-greeting">{greeting}, Lucas</span>
        <span className="kr-top-hud-brand">KRATOS CONTROL</span>
      </div>

      <div className="kr-top-hud-center">
        <div className="kr-top-hud-status">
          <span className={`kr-dot ${status.className}`} />
          <span>{status.label}</span>
        </div>
        <SourceBadge source={badgeSource(connectionState)} />
      </div>

      <div className="kr-top-hud-right">
        <time className="kr-top-hud-time">{time}</time>
        <span className="kr-top-hud-date">{date}</span>
      </div>
    </div>
  );
}
