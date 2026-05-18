import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { OceanBackdrop } from "./OceanBackdrop";
import { SkyLayer } from "./SkyLayer";
import { CloudLayer } from "./CloudLayer";
import { BridgeSystem } from "./BridgeSystem";
import { FloatingIsland } from "./FloatingIsland";
import { IslandLabel } from "./IslandLabel";

interface IslandDef {
  id: string;
  label: string;
  subtitle?: string;
  theme: string;
  left: string;
  top: string;
  size: "sm" | "md" | "lg" | "xl";
  status?: "active" | "idle" | "alert";
}

interface KratosWorldMapProps {
  className?: string;
  /** Currently active mission title */
  currentMission?: string;
  /** Callback when an island is clicked */
  onIslandClick?: (islandId: string) => void;
  /** Slot for CentralCastle component (PACK 5) */
  castleComponent?: ReactNode;
}

/**
 * Island definitions — positioned as % of viewport.
 * Coordinates from KRATOS Visual Spec Fase 3, Section 4.2.
 */
const ISLANDS: IslandDef[] = [
  {
    id: "omnis",
    label: "OMNIS Lab",
    subtitle: "IA & Agentes",
    theme: "omnis",
    left: "10%",
    top: "8%",
    size: "lg",
    status: "idle",
  },
  {
    id: "agencia",
    label: "Agencia",
    subtitle: "Conteudo & Marca",
    theme: "agencia",
    left: "8%",
    top: "38%",
    size: "lg",
    status: "idle",
  },
  {
    id: "vila",
    label: "Vila Viva",
    subtitle: "Familia & Lar",
    theme: "vila",
    left: "12%",
    top: "62%",
    size: "lg",
    status: "idle",
  },
  {
    id: "arena",
    label: "Arena",
    subtitle: "Vendas & Negocios",
    theme: "arena",
    left: "22%",
    top: "78%",
    size: "lg",
    status: "idle",
  },
  {
    id: "akasha",
    label: "Akasha",
    subtitle: "Memoria & Conhecimento",
    theme: "akasha",
    left: "75%",
    top: "10%",
    size: "lg",
    status: "idle",
  },
  {
    id: "filosofia",
    label: "Filosofia",
    subtitle: "Sabedoria & Estudos",
    theme: "filosofia",
    left: "82%",
    top: "38%",
    size: "lg",
    status: "idle",
  },
  {
    id: "financas",
    label: "Financas",
    subtitle: "Tesouro & Metricas",
    theme: "financas",
    left: "78%",
    top: "65%",
    size: "lg",
    status: "idle",
  },
  {
    id: "forja",
    label: "Forja",
    subtitle: "Corpo & Disciplina",
    theme: "forja",
    left: "45%",
    top: "72%",
    size: "lg",
    status: "idle",
  },
  {
    id: "observatorio",
    label: "Observatorio",
    subtitle: "Visao & Estrategia",
    theme: "observatorio",
    left: "65%",
    top: "82%",
    size: "lg",
    status: "idle",
  },
  {
    id: "nimbus",
    label: "Nimbus",
    subtitle: "Sonhos & Viagens",
    theme: "nimbus",
    left: "48%",
    top: "92%",
    size: "md",
    status: "idle",
  },
];

/**
 * Bridge connections between nearby islands.
 * Each connection has from/to positions as % of viewport.
 */
const BRIDGES = [
  // Left cluster
  { from: { x: 10, y: 8 }, to: { x: 8, y: 38 } },     // OMNIS -> Agencia
  { from: { x: 8, y: 38 }, to: { x: 12, y: 62 } },     // Agencia -> Vila Viva
  { from: { x: 12, y: 62 }, to: { x: 22, y: 78 } },    // Vila Viva -> Arena
  { from: { x: 22, y: 78 }, to: { x: 45, y: 72 } },    // Arena -> Forja
  // Right cluster
  { from: { x: 75, y: 10 }, to: { x: 82, y: 38 } },    // Akasha -> Filosofia
  { from: { x: 82, y: 38 }, to: { x: 78, y: 65 } },    // Filosofia -> Financas
  { from: { x: 78, y: 65 }, to: { x: 65, y: 82 } },    // Financas -> Observatorio
  { from: { x: 65, y: 82 }, to: { x: 48, y: 92 } },    // Observatorio -> Nimbus
  // Cross connections — left to right
  { from: { x: 8, y: 38 }, to: { x: 82, y: 38 } },     // Agencia -> Filosofia
  { from: { x: 10, y: 8 }, to: { x: 75, y: 10 } },     // OMNIS -> Akasha
  { from: { x: 45, y: 72 }, to: { x: 65, y: 82 } },    // Forja -> Observatorio
  // Central spokes (connect to castle position at 50, 45)
  { from: { x: 8, y: 38 }, to: { x: 50, y: 45 } },     // Agencia -> Castle
  { from: { x: 82, y: 38 }, to: { x: 50, y: 45 } },    // Filosofia -> Castle
  { from: { x: 10, y: 8 }, to: { x: 50, y: 45 } },     // OMNIS -> Castle
  { from: { x: 75, y: 10 }, to: { x: 50, y: 45 } },    // Akasha -> Castle
  { from: { x: 45, y: 72 }, to: { x: 50, y: 45 } },    // Forja -> Castle
  { from: { x: 48, y: 92 }, to: { x: 50, y: 45 } },    // Nimbus -> Castle
];

/**
 * KratosWorldMap — Master composition of the pseudo-3D island world.
 *
 * Z-index layer order (bottom to top):
 *   z-0:  OceanBackdrop
 *   z-10: SkyLayer
 *   z-15: GhostIslands (decorative, non-interactive — future PACK)
 *   z-20: CloudLayer
 *   z-30: BridgeSystem
 *   z-40: FloatingIsland x10
 *   z-50: CentralCastleMission (castleComponent slot)
 *   z-60: IslandLabel x10
 *
 * HUD (TopBar, Sidebar, RightRail, BottomDock) sits at z-90/z-100
 * and is rendered OUTSIDE this component by the shell layout.
 */
export function KratosWorldMap({
  className,
  currentMission,
  onIslandClick,
  castleComponent,
}: KratosWorldMapProps) {
  return (
    <div
      className={cn(
        "relative h-screen w-screen overflow-hidden",
        className,
      )}
      style={{
        background: "var(--kr-ocean-deep, #051024)",
      }}
    >
      {/* z-0: Ocean backdrop */}
      <OceanBackdrop />

      {/* z-10: Sky layer with sun */}
      <SkyLayer timeOfDay="noon" />

      {/* z-20: Cloud layer */}
      <CloudLayer count={4} />

      {/* z-30: Bridge system — behind islands, above clouds */}
      <BridgeSystem
        connections={BRIDGES}
        className="fixed inset-0 z-[30]"
      />

      {/* z-40: Floating islands */}
      {ISLANDS.map((island) => (
        <div
          key={island.id}
          className="absolute z-[40]"
          style={{
            left: island.left,
            top: island.top,
            transform: "translate(-50%, -50%)",
          }}
        >
          <FloatingIsland
            size={island.size}
            label={island.label}
            theme={island.theme}
            status={island.status}
            onClick={onIslandClick ? () => onIslandClick(island.id) : undefined}
          />
        </div>
      ))}

      {/* z-50: Central Castle — slot for PACK 5 component */}
      <div
        className="absolute z-[50]"
        style={{
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {castleComponent ?? (
          /* Placeholder castle — replaced by PACK 5 */
          <div className="flex flex-col items-center">
            <div
              className="flex items-end justify-center rounded-t-3xl"
              style={{
                width: 180,
                height: 120,
                background: "linear-gradient(180deg, var(--kr-castle-wall, #A8A29E) 0%, var(--kr-castle-stone, #78716C) 100%)",
                clipPath: "polygon(20% 0%, 80% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Battlements */}
              <div
                className="absolute -left-1 top-0 rounded-t-lg"
                style={{
                  width: 32,
                  height: 64,
                  background: "var(--kr-castle-stone, #78716C)",
                }}
              >
                <div
                  className="absolute -top-3 left-0 rounded-t-md"
                  style={{
                    height: 6,
                    width: 32,
                    background: "var(--kr-castle-roof, #1E40AF)",
                  }}
                />
              </div>
              <div
                className="absolute -right-1 top-0 rounded-t-lg"
                style={{
                  width: 32,
                  height: 64,
                  background: "var(--kr-castle-stone, #78716C)",
                }}
              >
                <div
                  className="absolute -top-3 left-0 rounded-t-md"
                  style={{
                    height: 6,
                    width: 32,
                    background: "var(--kr-castle-roof, #1E40AF)",
                  }}
                />
              </div>
              {/* Central tower */}
              <div
                className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-t-lg"
                style={{
                  width: 40,
                  height: 50,
                  background: "var(--kr-castle-stone, #78716C)",
                }}
              >
                <div
                  className="absolute -top-4 left-0 rounded-t-md"
                  style={{
                    height: 8,
                    width: 40,
                    background: "var(--kr-castle-roof, #1E40AF)",
                  }}
                />
              </div>
              {/* Shield */}
              <div
                className="mb-4 flex items-center justify-center rounded-full"
                style={{
                  width: 56,
                  height: 56,
                  border: "3px solid var(--kr-gold, #FFD700)",
                  background: "var(--kr-castle-roof, #1E40AF)",
                }}
              >
                <span
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: "var(--kr-gold, #FFD700)",
                  }}
                >
                  K
                </span>
              </div>
            </div>
            {/* Earth base */}
            <div
              className="rounded-b-lg"
              style={{
                width: 220,
                height: 36,
                background: "linear-gradient(180deg, var(--kr-earth, #92400E) 0%, var(--kr-earth-dark, #78350F) 100%)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
              }}
            />
          </div>
        )}
      </div>

      {/* z-60: Island labels */}
      {ISLANDS.map((island) => (
        <div
          key={`label-${island.id}`}
          className="absolute z-[60]"
          style={{
            left: island.left,
            top: `calc(${island.top} + ${island.size === "xl" ? "90px" : island.size === "lg" ? "70px" : "55px"})`,
            transform: "translate(-50%, 0)",
          }}
        >
          <IslandLabel
            title={island.label}
            subtitle={island.subtitle}
            theme={island.theme}
          />
        </div>
      ))}

      {/* Mission banner — current mission display */}
      {currentMission && (
        <div className="absolute bottom-32 left-1/2 z-[70] -translate-x-1/2">
          <div
            className="rounded-2xl px-8 py-3"
            style={{
              background: "var(--kr-glass-strong-bg, rgba(15, 23, 42, 0.94))",
              border: "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.15))",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            }}
          >
            <span
              className="block text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--kr-gold, #FFD700)" }}
            >
              MISSAO ATUAL
            </span>
            <span
              className="block text-lg font-bold"
              style={{ color: "var(--kr-text-primary, #E5E7EB)" }}
            >
              {currentMission}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
