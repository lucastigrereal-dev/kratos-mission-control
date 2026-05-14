import { useNavigate } from "react-router-dom";
import WorldOceanBackground from "./WorldOceanBackground";
import FloatingIsland from "./FloatingIsland";
import IslandBridge from "./IslandBridge";
import CentralCastleIsland from "./CentralCastleIsland";
import WorldClouds from "./WorldClouds";
import { useLiveKratos } from "../hooks/useLiveKratos";

interface IslandDef {
  id: string;
  label: string;
  icon: string;
  color: string;
  glowColor: string;
  size: "sm" | "md" | "lg" | "central";
  x: number;
  y: number;
  route: string;
}

interface BridgeDef {
  from: string;
  to: string;
  color?: string;
}

const ISLANDS: IslandDef[] = [
  {
    id: "tarefas",
    label: "Tarefas",
    icon: "☰",
    color: "var(--kr-ocean-teal)",
    glowColor: "rgba(20, 184, 166, 0.15)",
    size: "lg",
    x: 28,
    y: 62,
    route: "/tarefas",
  },
  {
    id: "projetos",
    label: "Projetos",
    icon: "⬡",
    color: "var(--kr-azure-400)",
    glowColor: "rgba(96, 165, 250, 0.15)",
    size: "lg",
    x: 72,
    y: 62,
    route: "/projetos",
  },
  {
    id: "contexto",
    label: "Contexto",
    icon: "◎",
    color: "var(--kr-aurora-500)",
    glowColor: "rgba(139, 92, 246, 0.15)",
    size: "md",
    x: 22,
    y: 28,
    route: "/contexto",
  },
  {
    id: "sistema",
    label: "Sistema",
    icon: "⚙",
    color: "var(--kr-arena-ember)",
    glowColor: "rgba(249, 115, 22, 0.12)",
    size: "md",
    x: 78,
    y: 28,
    route: "/sistema",
  },
  {
    id: "checkpoints",
    label: "Checkpoints",
    icon: "◆",
    color: "var(--kr-gold-500)",
    glowColor: "rgba(234, 179, 8, 0.12)",
    size: "sm",
    x: 50,
    y: 16,
    route: "/checkpoints",
  },
  {
    id: "omnis",
    label: "OMNIS",
    icon: "◬",
    color: "var(--kr-aurora-400)",
    glowColor: "rgba(167, 139, 250, 0.12)",
    size: "sm",
    x: 14,
    y: 52,
    route: "/omnis",
  },
  {
    id: "visao",
    label: "Visão",
    icon: "◉",
    color: "var(--kr-ocean-cyan)",
    glowColor: "rgba(6, 182, 212, 0.12)",
    size: "sm",
    x: 86,
    y: 52,
    route: "/visao-geral",
  },
];

const BRIDGES: BridgeDef[] = [
  { from: "castle", to: "tarefas", color: "#8b7355" },
  { from: "castle", to: "projetos", color: "#8b7355" },
  { from: "castle", to: "contexto", color: "#8b7355" },
  { from: "castle", to: "sistema", color: "#8b7355" },
  { from: "tarefas", to: "projetos", color: "#7a6348" },
  { from: "contexto", to: "checkpoints", color: "#7a6348" },
  { from: "sistema", to: "checkpoints", color: "#7a6348" },
  { from: "contexto", to: "omnis", color: "#7a6348" },
  { from: "sistema", to: "visao", color: "#7a6348" },
];

const CASTLE_X = 50;
const CASTLE_Y = 35;

interface KratosWorldMapProps {
  currentMission?: string;
}

export default function KratosWorldMap({ currentMission }: KratosWorldMapProps) {
  const navigate = useNavigate();
  const { connectionState } = useLiveKratos();

  // Build bridge paths: replace "castle" with castle coordinates
  const bridgePaths = BRIDGES.map((b) => {
    const fromIsland = ISLANDS.find((i) => i.id === b.from);
    const toIsland = ISLANDS.find((i) => i.id === b.to);
    return {
      fromX: b.from === "castle" ? CASTLE_X : (fromIsland?.x ?? 0),
      fromY: b.from === "castle" ? CASTLE_Y : (fromIsland?.y ?? 0),
      toX: b.to === "castle" ? CASTLE_X : (toIsland?.x ?? 0),
      toY: b.to === "castle" ? CASTLE_Y : (toIsland?.y ?? 0),
      color: b.color,
    };
  });

  return (
    <WorldOceanBackground>
      <WorldClouds />
      <IslandBridge bridges={bridgePaths} />

      {ISLANDS.map((island) => (
        <FloatingIsland
          key={island.id}
          id={island.id}
          label={island.label}
          icon={island.icon}
          color={island.color}
          glowColor={island.glowColor}
          size={island.size}
          x={island.x}
          y={island.y}
          onClick={() => navigate(island.route)}
        />
      ))}

      <CentralCastleIsland
        currentMission={currentMission}
        connectionState={connectionState}
        onClick={() => navigate("/mission-lens")}
      />
    </WorldOceanBackground>
  );
}
