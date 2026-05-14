import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import SourceBadge from "./SourceBadge";
import { useLiveKratos } from "../hooks/useLiveKratos";

const NAV_ITEMS = [
  { to: "/mission-lens", label: "Mission Lens", icon: "◈" },
  { to: "/tarefas", label: "Tarefas", icon: "☰" },
  { to: "/projetos", label: "Projetos", icon: "⬡" },
  { to: "/contexto", label: "Contexto", icon: "◎" },
  { to: "/sistema", label: "Sistema", icon: "⚙" },
  { to: "/checkpoints", label: "Checkpoints", icon: "◆" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { connectionState } = useLiveKratos();

  const statusSource = connectionState === "live" ? "live" :
    connectionState === "polling" ? "live" :
    connectionState === "reconnecting" ? "cached" :
    connectionState === "fallback" ? "fallback" : "error";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className="glass-panel"
        style={{
          width: 220,
          flexShrink: 0,
          margin: 8,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "var(--kr-text-lg)", fontWeight: 700, letterSpacing: "0.08em" }}>
            KRATOS
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span
              className={
                connectionState === "live" ? "kr-dot kr-dot-live" :
                connectionState === "offline" ? "kr-dot kr-dot-critical" :
                "kr-dot kr-dot-degraded"
              }
            />
            <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)" }}>
              {connectionState === "live" ? "online" : connectionState}
            </span>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: "var(--kr-radius-lg)",
                fontSize: "var(--kr-text-sm)",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--kr-text-primary)" : "var(--kr-text-secondary)",
                background: isActive ? "var(--kr-bg-tertiary)" : "transparent",
                textDecoration: "none",
                transition: "background var(--kr-duration-fast) var(--kr-ease-out)",
              })}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid var(--kr-border-default)", paddingTop: "0.75rem" }}>
          <SourceBadge source={statusSource} compact />
          <span style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", marginLeft: 6 }}>
            KRATOS 0.10
          </span>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "1.5rem", overflowY: "auto", maxWidth: 1400, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
