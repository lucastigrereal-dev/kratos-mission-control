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
  onIslandClick?: (islandId: string) => void;
  onCastleClick?: () => void;
}

/**
 * Island hotspot positions — invisible clickable buttons over the illustrated islands.
 * Coordinates are % of the center column (between sidebar and right panel).
 * Background image is provided by the parent (KratosWorldPage).
 */
const ISLANDS: IslandDef[] = [
  { id: "omnis",        label: "OMNIS Lab",       left: "8%",  top: "12%", width: "18%", height: "18%" },
  { id: "agencia",      label: "Agência",          left: "3%",  top: "32%", width: "18%", height: "18%" },
  { id: "vila",         label: "Vila Viva",        left: "5%",  top: "52%", width: "18%", height: "18%" },
  { id: "arena",        label: "Arena Comercial",  left: "15%", top: "70%", width: "18%", height: "18%" },
  { id: "forja",        label: "Forja / Corpo",    left: "32%", top: "76%", width: "18%", height: "18%" },
  { id: "akasha",       label: "Akasha",           left: "74%", top: "12%", width: "18%", height: "18%" },
  { id: "filosofia",    label: "Filosofia",        left: "79%", top: "32%", width: "18%", height: "18%" },
  { id: "financas",     label: "Finanças",         left: "77%", top: "52%", width: "18%", height: "18%" },
  { id: "observatorio", label: "Observatório",     left: "67%", top: "70%", width: "18%", height: "18%" },
  { id: "nimbus",       label: "Nimbus",           left: "40%", top: "85%", width: "20%", height: "12%" },
];

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
              "absolute z-50 rounded-xl transition-all duration-200",
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
          />
        ))}
      </nav>
    </div>
  );
}
