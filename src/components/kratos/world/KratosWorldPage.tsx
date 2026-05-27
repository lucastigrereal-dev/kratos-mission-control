import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { KratosWorldMap } from "./KratosWorldMap";
import { WorldSidebar } from "./WorldSidebar";
import { WorldTopHud } from "./WorldTopHud";
import { WorldRightPanel } from "./WorldRightPanel";
import { WorldBottomDock } from "./WorldBottomDock";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { KratosLogo } from "@/components/kratos/icons/KratosLogo";
import {
  KratosContextProvider,
  useKratosContext,
} from "./KratosContext";
import type { DashboardLoaderData } from "@/hooks/useDashboard";

/* --------------------------------------------------*\
 * Arquitetura de camadas:
 *
 * Layer 0 — Base: world-map-mockup.png preenche 100vw × 100vh
 * Layer 1 — Grid overlay: CSS grid responsivo sobre a imagem
 *   • Sidebar: clamp(180px,12.5vw,260px) | colapsada: 64px
 *   • Centro: 1fr (mapa + hotspots invisíveis)
 *   • Painel direito: clamp(260px,16.67vw,320px)
 *
 * Colapso da sidebar é gerenciado aqui e passado como prop.
 * Grid column ajusta junto → sem gap transparente.
\* --------------------------------------------------*/

interface KratosWorldPageProps {
  ssrData?: DashboardLoaderData;
}

export function KratosWorldPage({ ssrData }: KratosWorldPageProps) {
  return (
    <KratosContextProvider ssrDashboard={ssrData}>
      <KratosWorldPageInner ssrData={ssrData} />
    </KratosContextProvider>
  );
}

function KratosWorldPageInner({ ssrData }: { ssrData?: DashboardLoaderData }) {
  const navigate = useNavigate();
  const ctx = useKratosContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((p) => !p), []);

  const handleIslandClick = useCallback(
    (islandId: string) => navigate({ to: "/ilhas/$islandId", params: { islandId } }),
    [navigate],
  );

  const handleCastleClick = useCallback(
    () => navigate({ to: "/agora" }),
    [navigate],
  );

  if (ctx.dashboard.isLoading && !ssrData) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center"
        style={{ background: "var(--kr-ocean-deep, #051024)" }}
      >
        <div className="w-full max-w-md px-6">
          <div className="mb-6 text-center">
            <KratosLogo collapsed={false} />
          </div>
          <LoadingState lines={5} />
          <p className="mt-4 text-center text-xs" style={{ color: "var(--kr-text-muted, #9CA3AF)" }}>
            Carregando Mission Control...
          </p>
        </div>
      </div>
    );
  }

  const gridCols = sidebarCollapsed
    ? "64px 1fr clamp(260px, 16.67vw, 320px)"
    : "clamp(180px, 12.5vw, 260px) 1fr clamp(260px, 16.67vw, 320px)";

  return (
    <div className="fixed inset-0 overflow-hidden" aria-label="KRATOS Mission Control">
      {/* ── Layer 0: Imagem base full-screen ── */}
      <img
        src="/assets/images/world-map-mockup.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
        style={{ objectPosition: "center center" }}
        draggable={false}
        loading="eager"
      />

      {/* ── Layer 1: Grid overlay responsivo ── */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: gridCols,
          gridTemplateRows: "auto 1fr auto",
          transition: "grid-template-columns 0.3s ease",
        }}
      >
        {/* Sidebar — full height, colunas 1, rows 1-3 */}
        <div className="row-span-3 z-[100]">
          <WorldSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </div>

        {/* Top HUD — coluna 2, row 1 */}
        <div className="z-[90]">
          <WorldTopHud
            operatorName="Lucas"
            energy={87}
            level={47}
            xp={32780}
            sourceType={ctx.lensSourceType}
          />
        </div>

        {/* Painel direito — full height, colunas 3, rows 1-3 */}
        <div className="row-span-3 z-[100]">
          <WorldRightPanel />
        </div>

        {/* Hotspots do mapa — coluna 2, row 2 */}
        <div className="relative z-[50]">
          <KratosWorldMap
            onIslandClick={handleIslandClick}
            onCastleClick={handleCastleClick}
          />
        </div>

        {/* Bottom dock — coluna 2, row 3 */}
        <div className="z-[90]">
          <WorldBottomDock />
        </div>
      </div>
    </div>
  );
}
