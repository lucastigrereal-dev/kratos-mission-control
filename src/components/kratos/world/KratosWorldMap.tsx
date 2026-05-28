import { cn } from "@/lib/utils";

interface IslandDef {
  id: string;
  label: string;
  left: string;
  top: string;
  width: string;
  height: string;
  /** Whether this island has a functional screen with real/mock data */
  hasContent: boolean;
  /** CSS token for island accent glow */
  themeVar: string;
}

interface KratosWorldMapProps {
  className?: string;
  onIslandClick?: (islandId: string) => void;
  onCastleClick?: () => void;
}

/**
 * Island hotspot positions — clickable buttons over the illustrated world map.
 * Background image is provided by the parent (KratosWorldPage).
 *
 * hasContent=true  → glowing label chip (island is functional)
 * hasContent=false → muted label chip (island coming soon)
 *
 * NOTE: "financas" was renamed to "tesouro" in the routes — world map must use "tesouro".
 */
const ISLANDS: IslandDef[] = [
  { id: "omnis",        label: "OMNIS Lab",      left: "8%",  top: "12%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-omnis"        },
  { id: "agencia",      label: "Agência",         left: "3%",  top: "32%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-agencia"      },
  { id: "vila",         label: "Vila Viva",       left: "5%",  top: "52%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-vila"         },
  { id: "arena",        label: "Arena",           left: "15%", top: "70%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-arena"        },
  { id: "forja",        label: "Forja",           left: "32%", top: "76%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-forja"        },
  { id: "akasha",       label: "Akasha",          left: "74%", top: "12%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-akasha"       },
  { id: "filosofia",    label: "Filosofia",       left: "79%", top: "32%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-filosofia"    },
  { id: "tesouro",      label: "Tesouro",         left: "77%", top: "52%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-tesouro"      },
  { id: "observatorio", label: "Observatório",    left: "67%", top: "70%", width: "18%", height: "18%", hasContent: true,  themeVar: "--kr-island-observatorio" },
  { id: "nimbus",       label: "Nimbus",          left: "40%", top: "85%", width: "20%", height: "12%", hasContent: true,  themeVar: "--kr-island-nimbus"       },
];

function IslandLabel({ island }: { island: IslandDef }) {
  return (
    <span
      className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      style={
        island.hasContent
          ? {
              background: `color-mix(in oklab, var(${island.themeVar}) 20%, var(--kratos-surface-3, #1E293B))`,
              color: `var(${island.themeVar})`,
              border: `1px solid color-mix(in oklab, var(${island.themeVar}) 30%, transparent)`,
            }
          : {
              background: "color-mix(in oklab, var(--kratos-text-muted) 10%, var(--kratos-surface-3, #1E293B))",
              color: "var(--kratos-text-muted)",
              border: "1px solid color-mix(in oklab, var(--kratos-text-muted) 15%, transparent)",
            }
      }
    >
      {island.label}
    </span>
  );
}

export function KratosWorldMap({
  className,
  onIslandClick,
  onCastleClick,
}: KratosWorldMapProps) {
  return (
    <div
      className={cn("relative h-full w-full", className)}
      aria-label="Mapa do mundo KRATOS"
    >
      {/* Castle / Missão Atual hotspot */}
      {onCastleClick && (
        <button
          type="button"
          onClick={onCastleClick}
          className="absolute z-50 rounded-xl transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Missão Atual — clique para abrir"
          style={{ left: "37%", top: "25%", width: "26%", height: "32%" }}
        />
      )}

      {/* Island hotspots */}
      <nav aria-label="Ilhas do mundo KRATOS">
        {ISLANDS.map((island) => (
          <button
            key={island.id}
            type="button"
            onClick={onIslandClick ? () => onIslandClick(island.id) : undefined}
            className={cn(
              "group absolute z-50 rounded-xl transition-all duration-200",
              onIslandClick
                ? "cursor-pointer hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                : "pointer-events-none",
            )}
            aria-label={island.label}
            style={{
              left: island.left,
              top: island.top,
              width: island.width,
              height: island.height,
            }}
          >
            {/* Island label chip — visible on hover */}
            <IslandLabel island={island} />

            {/* Live indicator dot for islands with content */}
            {island.hasContent && (
              <span
                className="pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                style={{ backgroundColor: `var(${island.themeVar})` }}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
