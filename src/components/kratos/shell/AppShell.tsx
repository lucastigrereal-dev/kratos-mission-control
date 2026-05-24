import { useEffect, useState, type ReactNode } from "react";
import { SidebarV2 } from "./SidebarV2";
import { TopBarV2 } from "./TopBarV2";
import { AuroraDrawer } from "./AuroraDrawer";
import { AuroraOrb } from "./AuroraOrb";
import { BottomDockV2 } from "./BottomDockV2";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";

const SIDEBAR_KEY = "kratos.sidebar.collapsed";
const AURORA_KEY = "kratos.aurora.open";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [auroraOpen, setAuroraOpen] = useState(false);

  useGlobalShortcuts();

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

  useEffect(() => {
    const handler = () => toggleAurora();
    window.addEventListener("kratos:toggle-aurora", handler);
    return () => window.removeEventListener("kratos:toggle-aurora", handler);
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

  const sidebarWidth = sidebarCollapsed ? 60 : 232;

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      style={{ background: "var(--kr-ocean-deep, #051024)" }}
    >
      <a
        href="#kratos-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2.5 focus:text-[13px] focus:font-medium focus:outline-none"
        style={{
          background: "var(--kratos-surface-3)",
          color: "var(--kratos-text-primary)",
          boxShadow: "0 0 0 2px var(--kratos-accent)",
        }}
      >
        Pular para conteúdo principal
      </a>

      <SidebarV2 collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <TopBarV2
        operatorName="Lucas"
        energy={87}
        level={47}
        xp={32780}
        auroraOnline={true}
        onToggleAurora={toggleAurora}
        auroraOpen={auroraOpen}
        leftOffset={sidebarWidth}
      />

      <AuroraDrawer
        open={auroraOpen}
        onClose={() => setAuroraOpen(false)}
        topOffset={90}
      />

      <AuroraOrb open={auroraOpen} onClick={toggleAurora} />

      <main
        id="kratos-main-content"
        className="overflow-y-auto kratos-scrollbar fixed"
        style={{
          top: 90,
          left: sidebarWidth,
          right: 0,
          bottom: 72,
          padding: "24px 32px",
          background: "var(--kr-ocean-deep, #051024)",
        }}
      >
        {children}
      </main>

      <BottomDockV2
        currentMission="Construir o Futuro"
        missionProgress={62}
        focusOfDay="Foco principal"
        nextAction="Próxima dedicação"
        onContinue={() => {}}
        onSaveCheckpoint={() => {}}
      />
    </div>
  );
}
