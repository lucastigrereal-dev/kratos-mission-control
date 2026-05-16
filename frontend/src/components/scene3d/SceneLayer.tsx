import { Canvas } from "@react-three/fiber";
import IsometricCamera from "./IsometricCamera";
import Lighting from "./Lighting";
import CastleCentral from "./CastleCentral";
import IslandMesh from "./IslandMesh";

const ISLANDS: Array<{
  id: string;
  position: [number, number, number];
  baseColor: string;
  accentColor: string;
  scale: number;
}> = [
  { id: "omnis-lab", position: [-5, 0, -3], baseColor: "#0ea5e9", accentColor: "#38bdf8", scale: 2.8 },
  { id: "agencia", position: [-6, 0, 1], baseColor: "#f97316", accentColor: "#fb923c", scale: 2.6 },
  { id: "vila-viva", position: [-4.5, 0, 5], baseColor: "#22c55e", accentColor: "#4ade80", scale: 2.4 },
  { id: "arena-comercial", position: [-2, 0, 5.5], baseColor: "#dc2626", accentColor: "#f87171", scale: 2.4 },
  { id: "forja", position: [2, 0, 5.5], baseColor: "#78716c", accentColor: "#a8a29e", scale: 2.5 },
  { id: "gringotts", position: [5, 0, -3], baseColor: "#ca8a04", accentColor: "#eab308", scale: 2.8 },
  { id: "filosofia", position: [6, 0, 1], baseColor: "#a855f7", accentColor: "#c084fc", scale: 2.6 },
  { id: "tesouro", position: [5.5, 0, 3.5], baseColor: "#eab308", accentColor: "#facc15", scale: 2.6 },
  { id: "observatorio", position: [3.5, 0, 5.5], baseColor: "#6366f1", accentColor: "#818cf8", scale: 2.3 },
];

export default function SceneLayer() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        frameloop="demand"
        gl={{ alpha: true, antialias: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <IsometricCamera />
        <Lighting />
        <CastleCentral />
        {ISLANDS.map((island) => (
          <IslandMesh key={island.id} {...island} />
        ))}
      </Canvas>
    </div>
  );
}
