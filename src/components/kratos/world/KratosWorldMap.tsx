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
 * Circular layout around central castle (50%, 45%).
 * Coordinates tuned to match kratos-overview-reference.png mockup.
 */
const ISLANDS: IslandDef[] = [
  {
    id: "omnis",
    label: "OMNIS Lab",
    subtitle: "IA, Agentes, Controle",
    theme: "omnis",
    left: "12%",
    top: "18%",
    size: "lg",
    status: "idle",
  },
  {
    id: "agencia",
    label: "AGÊNCIA / REDES SOCIAIS",
    subtitle: "Conteúdo, Criatividade & Marketing",
    theme: "agencia",
    left: "8%",
    top: "38%",
    size: "lg",
    status: "idle",
  },
  {
    id: "vila",
    label: "VILA VIVA",
    subtitle: "Família, Filhos & Vida Social",
    theme: "vila",
    left: "10%",
    top: "58%",
    size: "lg",
    status: "idle",
  },
  {
    id: "arena",
    label: "ARENA COMERCIAL",
    subtitle: "Vendas, Negócios & Competição",
    theme: "arena",
    left: "20%",
    top: "76%",
    size: "lg",
    status: "idle",
  },
  {
    id: "forja",
    label: "FORJA / CORPO",
    subtitle: "Corpo, Saúde & Disciplina",
    theme: "forja",
    left: "38%",
    top: "82%",
    size: "lg",
    status: "idle",
  },
  {
    id: "akasha",
    label: "GRINGOTTS / AKASHA",
    subtitle: "Memória & Arquivos",
    theme: "akasha",
    left: "88%",
    top: "18%",
    size: "lg",
    status: "idle",
  },
  {
    id: "filosofia",
    label: "FILOSOFIA & SABEDORIA",
    subtitle: "Sabedoria, Estudos & Evolução Pessoal",
    theme: "filosofia",
    left: "92%",
    top: "38%",
    size: "lg",
    status: "idle",
  },
  {
    id: "financas",
    label: "TESOURO / FINANÇAS",
    subtitle: "Finanças, Patrimônio & Investimentos",
    theme: "financas",
    left: "90%",
    top: "58%",
    size: "lg",
    status: "idle",
  },
  {
    id: "observatorio",
    label: "OBSERVATÓRIO",
    subtitle: "Visão, Estratégia & Inspirações",
    theme: "observatorio",
    left: "80%",
    top: "76%",
    size: "lg",
    status: "idle",
  },
  {
    id: "nimbus",
    label: "NIMBUS",
    subtitle: "Sonhos, Viagens, Vida na Névoa Preciosa",
    theme: "nimbus",
    left: "50%",
    top: "94%",
    size: "md",
    status: "idle",
  },
];

/**
 * Bridge connections between nearby islands and castle.
 * Each connection has from/to positions as % of viewport.
 * Castle center is at (50, 45).
 */
const BRIDGES = [
  // Left arc
  { from: { x: 12, y: 18 }, to: { x: 8, y: 38 } },    // OMNIS -> Agencia
  { from: { x: 8, y: 38 }, to: { x: 10, y: 58 } },     // Agencia -> Vila
  { from: { x: 10, y: 58 }, to: { x: 20, y: 76 } },    // Vila -> Arena
  { from: { x: 20, y: 76 }, to: { x: 38, y: 82 } },    // Arena -> Forja
  { from: { x: 38, y: 82 }, to: { x: 50, y: 94 } },     // Forja -> Nimbus
  // Right arc
  { from: { x: 88, y: 18 }, to: { x: 92, y: 38 } },    // Akasha -> Filosofia
  { from: { x: 92, y: 38 }, to: { x: 90, y: 58 } },    // Filosofia -> Financas
  { from: { x: 90, y: 58 }, to: { x: 80, y: 76 } },     // Financas -> Observatorio
  { from: { x: 80, y: 76 }, to: { x: 50, y: 94 } },     // Observatorio -> Nimbus
  // Cross bridges
  { from: { x: 8, y: 38 }, to: { x: 92, y: 38 } },      // Agencia -> Filosofia
  { from: { x: 12, y: 18 }, to: { x: 88, y: 18 } },     // OMNIS -> Akasha
  // Radial spokes to castle (50,45)
  { from: { x: 12, y: 18 }, to: { x: 50, y: 45 } },
  { from: { x: 8, y: 38 }, to: { x: 50, y: 45 } },
  { from: { x: 10, y: 58 }, to: { x: 50, y: 45 } },
  { from: { x: 20, y: 76 }, to: { x: 50, y: 45 } },
  { from: { x: 38, y: 82 }, to: { x: 50, y: 45 } },
  { from: { x: 88, y: 18 }, to: { x: 50, y: 45 } },
  { from: { x: 92, y: 38 }, to: { x: 50, y: 45 } },
  { from: { x: 90, y: 58 }, to: { x: 50, y: 45 } },
  { from: { x: 80, y: 76 }, to: { x: 50, y: 45 } },
  { from: { x: 50, y: 94 }, to: { x: 50, y: 45 } },
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
        "absolute inset-0 overflow-hidden",
        className,
      )}
      style={{
        background: "transparent",
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
        className="absolute inset-0 z-[30]"
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
                boxShadow: "0 20px 60px color-mix(in oklab, black 50%, transparent)",
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
                boxShadow: "0 8px 24px color-mix(in oklab, black 40%, transparent)",
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

      {/* Central mission banner is now rendered inside CentralCastleMission */}
    </div>
  );
}
