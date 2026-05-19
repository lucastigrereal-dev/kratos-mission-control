import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { KratosWorldMap } from "./KratosWorldMap";
import { WorldSidebar } from "./WorldSidebar";
import { WorldTopHud } from "./WorldTopHud";
import { WorldRightPanel } from "./WorldRightPanel";
import { WorldBottomDock } from "./WorldBottomDock";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { KratosLogo } from "@/components/kratos/icons/KratosLogo";
import {
  KratosContextProvider,
  useKratosContext,
} from "./KratosContext";
import type { DashboardLoaderData } from "@/hooks/useDashboard";

/* --------------------------------------------------*\
 * KratosWorldPage — Gamified World Map Dashboard
 *
 * Layout (mockup match):
 *   grid: 260px | 1fr | 320px
 *   height: 100vh, overflow: hidden
 *   Map is the interface — not a blurred background.
 *
 * Layers:
 *   Sidebar left   : WorldSidebar  (blue game menu)
 *   Top center     : WorldTopHud   (energy/level/xp/crest)
 *   Center         : KratosWorldMap (vibrant ocean/sky/islands/castle)
 *   Right          : WorldRightPanel (Aurora/Focus/Progress/Quote/Agenda)
 *   Bottom center  : WorldBottomDock (floating rounded cards)
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

function KratosWorldPageInner({
  ssrData,
}: {
  ssrData?: DashboardLoaderData;
}) {
  const navigate = useNavigate();
  const ctx = useKratosContext();

  const handleIslandClick = useCallback(
    (islandId: string) => {
      navigate({ to: "/ilhas/$islandId", params: { islandId } });
    },
    [navigate],
  );

  const handleCastleClick = useCallback(() => {
    navigate({ to: "/agora" });
  }, [navigate]);

  const showFullLoading =
    ctx.dashboard.isLoading && !ssrData;
  const showFullError = false;

  if (showFullLoading) {
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
          <p
            className="mt-4 text-center text-xs"
            style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
          >
            Carregando Mission Control...
          </p>
        </div>
      </div>
    );
  }

  if (showFullError) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center"
        style={{ background: "var(--kr-ocean-deep, #051024)" }}
      >
        <div className="w-full max-w-md px-6">
          <ErrorState
            title="Mission Control indisponível"
            description="Não foi possível conectar ao backend. Verifique se o servidor está rodando."
            variant="external_unavailable"
          />
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                ctx.lensRefetch();
                ctx.dashboardRefetch();
              }}
              className="rounded-lg px-4 py-2 text-xs font-medium transition-colors hover:brightness-110"
              style={{
                background: "var(--kr-color-mission, #22C55E)",
                color: "#000",
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid h-screen w-screen overflow-hidden"
      style={{
        gridTemplateColumns: "240px minmax(0, 1fr) 320px",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      {/* ── Sidebar (left column, full height) ── */}
      <div className="row-span-3" style={{ zIndex: 100 }}>
        <WorldSidebar />
      </div>

      {/* ── Top HUD (center column, top row) ── */}
      <div className="col-start-2" style={{ zIndex: 90 }}>
        <WorldTopHud
          operatorName="Lucas"
          energy={87}
          level={47}
          xp={32780}
          sourceType={ctx.lensSourceType}
        />
      </div>

      {/* ── World Map (center column, middle row) ── */}
      <div className="col-start-2 row-start-2 relative" style={{ zIndex: 10 }}>
        <KratosWorldMap
          onIslandClick={handleIslandClick}
          onCastleClick={handleCastleClick}
        />
      </div>

      {/* ── Bottom Dock (center column, bottom row) ── */}
      <div className="col-start-2 row-start-3" style={{ zIndex: 90 }}>
        <WorldBottomDock />
      </div>

      {/* ── Right Panel (right column, full height) ── */}
      <div className="row-span-3" style={{ zIndex: 100 }}>
        <WorldRightPanel />
      </div>
    </div>
  );
}

