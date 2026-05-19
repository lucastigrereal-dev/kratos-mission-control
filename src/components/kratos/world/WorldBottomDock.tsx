import { Music, Cloud, Car, Heart, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorldBottomDockProps {
  className?: string;
}

const SQUAD_ICONS = [
  { id: "car", icon: Car, label: "Lazer" },
  { id: "cloud", icon: Cloud, label: "Céu" },
  { id: "heart", icon: Heart, label: "Agenda" },
  { id: "users", icon: Users, label: "Foco" },
];

export function WorldBottomDock({ className }: WorldBottomDockProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-center gap-5 px-6 pb-5 select-none",
        className,
      )}
    >
      {/* Music Card */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)",
          border: "1px solid color-mix(in oklab, white 12%, transparent)",
          boxShadow: "0 8px 24px color-mix(in oklab, black 40%, transparent)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
          }}
        >
          <Music className="h-4 w-4" style={{ color: "#E0F2FE" }} />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] font-bold" style={{ color: "#93C5FD" }}>
            Koopa Road
          </p>
          <p className="text-[9px]" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
            Super Mario Kart 8
          </p>
        </div>
      </div>

      {/* Nimbus Card */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{
          background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
          border: "1px solid color-mix(in oklab, white 12%, transparent)",
          boxShadow: "0 8px 24px color-mix(in oklab, black 40%, transparent)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #2DD4BF 0%, #0D9488 100%)",
          }}
        >
          <Cloud className="h-4 w-4" style={{ color: "#CCFBF1" }} />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] font-bold" style={{ color: "#5EEAD4" }}>
            NIMBUS
          </p>
          <p className="text-[9px]" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
            Sonhos & Viagens
          </p>
        </div>
      </div>

      {/* Squad Icons */}
      {SQUAD_ICONS.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            className="flex flex-col items-center gap-1 transition-transform duration-150 hover:scale-110"
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
                border: "2px solid color-mix(in oklab, white 20%, transparent)",
                boxShadow: "0 4px 12px color-mix(in oklab, black 30%, transparent)",
              }}
            >
              <Icon className="h-4 w-4" style={{ color: "#E0E7FF" }} />
            </div>
            <span className="text-[9px] font-medium" style={{ color: "color-mix(in oklab, white 70%, transparent)" }}>
              {s.label}
            </span>
          </button>
        );
      })}

      {/* Add button */}
      <button
        type="button"
        className="flex flex-col items-center gap-1 transition-transform duration-150 hover:scale-110"
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 40,
            height: 40,
            background: "color-mix(in oklab, white 10%, transparent)",
            border: "2px dashed color-mix(in oklab, white 25%, transparent)",
          }}
        >
          <Plus className="h-4 w-4" style={{ color: "color-mix(in oklab, white 50%, transparent)" }} />
        </div>
        <span className="text-[9px] font-medium" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
          Novo
        </span>
      </button>
    </div>
  );
}
