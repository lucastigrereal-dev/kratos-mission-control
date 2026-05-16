import { useState } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import RightPanel from "./RightPanel";
import BottomBar from "./BottomBar";
import StageArea from "../stage/StageArea";
import AuroraChatDrawer from "../interaction/AuroraChatDrawer";
import SpotlightModal from "../interaction/SpotlightModal";
import IslandDetailDrawer from "../interaction/IslandDetailDrawer";
import type { HotspotDef } from "../stage/IslandHotspot";

const GRID: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  display: "grid",
  gridTemplateColumns: "240px 1fr 320px",
  gridTemplateRows: "64px 1fr 72px",
  gridTemplateAreas: `
    "topbar    topbar    topbar"
    "sidebar   stage     rightpanel"
    "sidebar   bottombar rightpanel"
  `,
  overflow: "hidden",
  background: "#0f172a",
  color: "#94a3b8",
  fontFamily: "system-ui, sans-serif",
  fontSize: "14px",
};

export default function MissionControlShell() {
  const [isAuroraOpen, setAuroraOpen] = useState(false);
  const [isSpotlightOpen, setSpotlightOpen] = useState(false);
  const [selectedIsland, setSelectedIsland] = useState<HotspotDef | null>(null);
  const [isIslandDrawerOpen, setIslandDrawerOpen] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <div className="kr-grid" style={GRID}>
        <div
          style={{
            gridArea: "topbar",
            background: "#1e293b",
            borderBottom: "1px solid #334155",
          }}
        >
          <TopBar />
        </div>

        <div
          className="kr-sidebar"
          style={{
            gridArea: "sidebar",
            background: "#1e293b",
            borderRight: "1px solid #334155",
            overflow: "hidden",
          }}
        >
          <SideBar />
        </div>

        <div id="main-content" style={{ gridArea: "stage", overflow: "hidden" }}>
          <StageArea
            onIslandSelect={(island) => {
              setSelectedIsland(island);
              setIslandDrawerOpen(true);
            }}
          />
        </div>

        <div
          className="kr-rightpanel"
          style={{
            gridArea: "rightpanel",
            background: "#1e293b",
            borderLeft: "1px solid #334155",
            overflow: "hidden",
          }}
        >
          <RightPanel onOpenAurora={() => setAuroraOpen(true)} />
        </div>

        <div
          style={{
            gridArea: "bottombar",
            background: "#1e293b",
            borderTop: "1px solid #334155",
          }}
        >
          <BottomBar onOpenNimbus={() => setSpotlightOpen(true)} />
        </div>
      </div>

      {/* Overlays — fixed positioning escapes parent overflow:hidden */}
      <AuroraChatDrawer open={isAuroraOpen} onClose={() => setAuroraOpen(false)} />
      <SpotlightModal open={isSpotlightOpen} onClose={() => setSpotlightOpen(false)} />
      <IslandDetailDrawer
        island={selectedIsland}
        open={isIslandDrawerOpen}
        onClose={() => setIslandDrawerOpen(false)}
      />
    </div>
  );
}
