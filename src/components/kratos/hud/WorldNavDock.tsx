import { MapPin, Globe, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorldItem {
  id: string;
  label: string;
  color: string;
}

interface WorldNavDockProps {
  worlds?: WorldItem[];
  currentWorld?: string;
  onWorldChange?: (worldId: string) => void;
  className?: string;
}

const DEFAULT_WORLDS: WorldItem[] = [
  { id: "master", label: "Master World", color: "var(--kr-island-omnis)" },
  { id: "agencia", label: "Agência", color: "var(--kr-island-agencia)" },
  { id: "akasha", label: "Akasha", color: "var(--kr-island-akasha)" },
  { id: "nimbus", label: "Nimbus", color: "var(--kr-island-nimbus)" },
  { id: "vila", label: "Vila Viva", color: "var(--kr-island-vila)" },
];

export function WorldNavDock({
  worlds = DEFAULT_WORLDS,
  currentWorld = "master",
  onWorldChange,
  className,
}: WorldNavDockProps) {
  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="navigation"
      aria-label="Navegação entre mundos"
    >
      {worlds.map((world) => {
        const isActive = world.id === currentWorld;

        return (
          <button
            key={world.id}
            type="button"
            onClick={() => onWorldChange?.(world.id)}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 kratos-focus-ring",
            )}
            style={{
              background: isActive
                ? `color-mix(in oklab, ${world.color} 18%, transparent)`
                : "var(--kr-surface-deep)",
              border: `1px solid ${isActive ? `color-mix(in oklab, ${world.color} 40%, transparent)` : "var(--kr-glass-border)"}`,
              color: isActive ? world.color : "var(--kr-text-muted)",
              boxShadow: isActive
                ? `0 0 10px color-mix(in oklab, ${world.color} 30%, transparent)`
                : undefined,
            }}
            aria-label={world.label}
            aria-current={isActive ? "page" : undefined}
            title={world.label}
          >
            <MapPin className="h-4 w-4" aria-hidden />
          </button>
        );
      })}

      {/* More worlds indicator */}
      <button
        type="button"
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 kratos-focus-ring",
        )}
        style={{
          background: "var(--kr-surface-deep)",
          border: "1px solid var(--kr-glass-border)",
          color: "var(--kr-text-muted)",
        }}
        aria-label="Mais mundos"
        title="Ver todos os mundos"
      >
        <Globe className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
