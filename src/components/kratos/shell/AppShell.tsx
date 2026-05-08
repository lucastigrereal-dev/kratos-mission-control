import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AuroraPanel } from "./AuroraPanel";
import { StatusBar } from "./StatusBar";
import type { LiveState } from "../base/LiveStatusIndicator";

const SIDEBAR_KEY = "kratos.sidebar.collapsed";
const AURORA_KEY = "kratos.aurora.open";

// Sandbox-only static signals. Replaced by real hooks in the KRATOS repo.
const LIVE_STATE: LiveState = "live";
const LAST_UPDATE = "12s ago";
const BUILD_TIME = "2026.05.08";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [auroraOpen, setAuroraOpen] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SIDEBAR_KEY);
      const a = localStorage.getItem(AURORA_KEY);
      if (s !== null) setSidebarCollapsed(s === "1");
      if (a !== null) setAuroraOpen(a === "1");
    } catch {
      /* noop */
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const toggleAurora = () => {
    setAuroraOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(AURORA_KEY, next ? "1" : "0");
      } catch {
        /* noop */
      }
      return next;
    });
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: "var(--kratos-surface-0)" }}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          liveState={LIVE_STATE}
          lastUpdate={LAST_UPDATE}
          auroraOpen={auroraOpen}
          onToggleAurora={toggleAurora}
        />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto kratos-scrollbar">
            <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
              {children}
            </div>
          </main>

          <AuroraPanel open={auroraOpen} onClose={toggleAurora} />
        </div>

        <StatusBar
          liveState={LIVE_STATE}
          lastUpdate={LAST_UPDATE}
          buildTime={BUILD_TIME}
        />
      </div>
    </div>
  );
}
