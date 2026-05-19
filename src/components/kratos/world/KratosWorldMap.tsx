import { cn } from "@/lib/utils";

interface IslandDef {
  id: string;
  label: string;
  left: string;
  top: string;
  width: string;
  height: string;
}

interface KratosWorldMapProps {
  className?: string;
  /** Callback when an island is clicked */
  onIslandClick?: (islandId: string) => void;
  /** Callback when the castle is clicked */
  onCastleClick?: () => void;
}

/**
 * Island hotspot positions — tuned to match kratos-overview-reference.png.
 * Each hotspot is an invisible clickable area over the illustrated island.
 */
const ISLANDS: IslandDef[] = [
  { id: "omnis", label: "OMNIS Lab", left: "8%", top: "12%", width: "18%", height: "18%" },
  { id: "agencia", label: "Agência", left: "3%", top: "32%", width: "18%", height: "18%" },
  { id: "vila", label: "Vila Viva", left: "5%", top: "52%", width: "18%", height: "18%" },
  { id: "arena", label: "Arena", left: "15%", top: "70%", width: "18%", height: "18%" },
  { id: "forja", label: "Forja", left: "32%", top: "76%", width: "18%", height: "18%" },
  { id: "akasha", label: "Akasha", left: "74%", top: "12%", width: "18%", height: "18%" },
  { id: "filosofia", label: "Filosofia", left: "79%", top: "32%", width: "18%", height: "18%" },
  { id: "financas", label: "Finanças", left: "77%", top: "52%", width: "18%", height: "18%" },
  { id: "observatorio", label: "Observatório", left: "67%", top: "70%", width: "18%", height: "18%" },
  { id: "nimbus", label: "Nimbus", left: "40%", top: "85%", width: "20%", height: "12%" },
];

/**
 * KratosWorldMap — Illustrated world map with interactive hotspots.
 *
 * The entire illustrated scene (ocean, sky, islands, castle, labels)
 * is rendered as a single background image. Only interactive elements
 * (hotspots + character) are real DOM nodes on top.
 */
export function KratosWorldMap({
  className,
  onIslandClick,
  onCastleClick,
}: KratosWorldMapProps) {
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      aria-label="Mapa do mundo KRATOS"
    >
      {/* Illustrated background — single image replaces all CSS pseudo-3D */}
      <img
        src="/assets/images/world-map-mockup.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center center" }}
        draggable={false}
        loading="eager"
      />

      {/* Castle hotspot — center of the map */}
      {onCastleClick && (
        <button
          type="button"
          onClick={onCastleClick}
          className="absolute z-50 rounded-full transition-all duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Castelo central — Missão atual"
          style={{
            left: "42%",
            top: "30%",
            width: "16%",
            height: "28%",
          }}
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
              "absolute z-50 rounded-full transition-all duration-200",
              onIslandClick && "cursor-pointer hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
              !onIslandClick && "pointer-events-none",
            )}
            aria-label={island.label}
            style={{
              left: island.left,
              top: island.top,
              width: island.width,
              height: island.height,
            }}
          />
        ))}
      </nav>
    </div>
  );
}
