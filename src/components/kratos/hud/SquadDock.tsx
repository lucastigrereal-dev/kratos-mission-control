import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Cpu,
  Briefcase,
  Heart,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SquadItem {
  name: string;
  icon: LucideIcon;
  color: string;
}

interface SquadDockProps {
  squads?: SquadItem[];
  max?: number;
  className?: string;
}

const DEFAULT_SQUADS: SquadItem[] = [
  { name: "Aurora", icon: Brain, color: "var(--kr-aurora)" },
  { name: "Omnis", icon: Cpu, color: "var(--kr-island-omnis)" },
  { name: "Agência", icon: Briefcase, color: "var(--kr-island-agencia)" },
  { name: "Yemilia", icon: Heart, color: "#EC4899" },
  { name: "Novo Squad", icon: Plus, color: "var(--kr-surface-high)" },
];

export function SquadDock({ squads = DEFAULT_SQUADS, max = 5, className }: SquadDockProps) {
  const visibleSquads = squads.slice(0, max);
  const overflow = squads.length - max;

  return (
    <div
      className={cn("flex items-center -space-x-2", className)}
      role="list"
      aria-label="Squads ativos"
    >
      {visibleSquads.map((squad) => {
        const Icon = squad.icon;
        return (
          <div
            key={squad.name}
            className="relative flex items-center justify-center w-[28px] h-[28px] rounded-full transition-transform duration-150"
            style={{
              background: "var(--kr-surface-deep)",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: squad.color,
              boxShadow: `0 0 6px color-mix(in oklab, ${squad.color} 30%, transparent)`,
            }}
            role="listitem"
            title={squad.name}
          >
            <Icon
              className="h-3.5 w-3.5"
              style={{ color: squad.color }}
              aria-hidden
            />
          </div>
        );
      })}

      {overflow > 0 && (
        <div
          className="relative flex items-center justify-center w-[28px] h-[28px] rounded-full text-[10px] font-bold"
          style={{
            background: "var(--kr-surface-high)",
            border: "2px solid var(--kr-glass-border)",
            color: "var(--kr-text-muted)",
          }}
          title={`+${overflow} more`}
          role="listitem"
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
