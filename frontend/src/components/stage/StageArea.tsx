import { useState, lazy, Suspense } from "react";
import IslandHotspot, { type HotspotDef } from "./IslandHotspot";
import MissionBanner from "./MissionBanner";

const SceneLayer = lazy(() => import("../scene3d/SceneLayer"));

const HOTSPOTS: HotspotDef[] = [
  {
    id: "omnis-lab",
    name: "OMNIS LAB",
    category: "Automações e IAs / Painel de Controle",
    top: "15%",
    left: "12%",
    width: "18%",
    height: "12%",
  },
  {
    id: "agencia",
    name: "AGÊNCIA",
    category: "Conteúdo, Marca e Marketing",
    top: "38%",
    left: "8%",
    width: "20%",
    height: "12%",
  },
  {
    id: "vila-viva",
    name: "VILA VIVA",
    category: "Família, Filho e Vida Real",
    top: "66%",
    left: "10%",
    width: "16%",
    height: "10%",
  },
  {
    id: "arena-comercial",
    name: "ARENA COMERCIAL",
    category: "Vendas, Negociação e Conquistas",
    top: "72%",
    left: "25%",
    width: "18%",
    height: "10%",
  },
  {
    id: "forja",
    name: "FORJA / CORPO",
    category: "Treino, Saúde e Disciplina",
    top: "68%",
    left: "45%",
    width: "18%",
    height: "10%",
  },
  {
    id: "gringotts",
    name: "GRINGOTTS / AKASHA",
    category: "Banco de Conhecimento, Memória e Arquivos",
    top: "16%",
    left: "68%",
    width: "22%",
    height: "12%",
  },
  {
    id: "filosofia",
    name: "FILOSOFIA",
    category: "Aprendizado, Filosofia e Evolução Pessoal",
    top: "36%",
    left: "70%",
    width: "20%",
    height: "12%",
  },
  {
    id: "tesouro",
    name: "TESOURO / FINANÇAS",
    category: "Finanças Pessoais e Investimentos",
    top: "58%",
    left: "72%",
    width: "20%",
    height: "12%",
  },
  {
    id: "observatorio",
    name: "OBSERVATÓRIO",
    category: "Ideias, Inovações e Inspirações",
    top: "75%",
    left: "62%",
    width: "20%",
    height: "10%",
  },
];

export default function StageArea({
  onIslandSelect,
}: {
  onIslandSelect?: (hotspot: HotspotDef) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.6) 0%, #0a0f1a 100%),
          radial-gradient(circle at 25% 30%, rgba(56, 189, 248, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 75% 60%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
          #0a0f1a
        `,
        overflow: "hidden",
      }}
    >
      {/* 3D decorative scene — beneath all HTML overlays */}
      <Suspense fallback={null}>
        <SceneLayer />
      </Suspense>

      {/* Grid lines — subtle structure */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(51, 65, 85, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(51, 65, 85, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* 3D label */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 16,
          fontSize: 9,
          color: "#334155",
          letterSpacing: "0.08em",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        STAGE 3D &middot; DECORATIVE SCENE
      </div>

      {/* Hotspots */}
      {HOTSPOTS.map((hs) => (
        <IslandHotspot
          key={hs.id}
          hotspot={hs}
          selected={selectedId === hs.id}
          onClick={() => {
            setSelectedId(selectedId === hs.id ? null : hs.id);
            console.log(`Island: ${hs.name}`);
            onIslandSelect?.(hs);
          }}
        />
      ))}

      {/* Mission Banner — center */}
      <MissionBanner />
    </div>
  );
}
