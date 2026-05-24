import { useMemo } from "react";
import { Zap, Star, Gem, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorldTopHudProps {
  className?: string;
  operatorName?: string;
  energy?: number;
  level?: number;
  xp?: number;
  sourceType?: "live" | "cache" | "mock" | "stale" | "error" | "fallback";
}

function MockBadge() {
  return (
    <span
      className="inline-flex items-center rounded px-1 py-px text-[7px] font-bold uppercase tracking-wider"
      style={{
        background: "rgba(251,191,36,0.15)",
        color: "#FBBF24",
        border: "1px solid rgba(251,191,36,0.3)",
      }}
    >
      MOCK
    </span>
  );
}

export function WorldTopHud({
  className,
  operatorName = "Lucas",
  energy = 87,
  level = 47,
  xp = 32780,
  sourceType = "live",
}: WorldTopHudProps) {
  const now = useMemo(() => new Date(), []);
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });

  const isHardcoded = sourceType !== "live";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-5 py-3 select-none",
        className,
      )}
      style={{
        background: "rgba(2,38,93,0.96)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Esquerda: Saudação */}
      <div className="flex items-center gap-3">
        <div className="leading-tight">
          <p className="text-[11px] font-bold" style={{ color: "#FFD700" }}>
            Bom dia, {operatorName}!
          </p>
          <p className="text-[10px] font-medium" style={{ color: "color-mix(in oklab, white 60%, transparent)" }}>
            Seu mundo. Suas missões. Seu legado.
          </p>
        </div>
      </div>

      {/* Centro: Crest + Título */}
      <div className="hidden md:flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)",
            boxShadow: "0 0 12px color-mix(in oklab, #FFD700 30%, transparent)",
          }}
        >
          <span className="text-lg font-black" style={{ color: "#02265D" }}>K</span>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wider" style={{ color: "#FFD700" }}>KRATOS</p>
          <p className="text-[9px] font-medium uppercase tracking-widest" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
            Mission Control
          </p>
        </div>
        {sourceType !== "live" && (
          <span
            className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase"
            style={{
              background: sourceType === "error" ? "color-mix(in oklab, #EF4444 20%, transparent)" : "color-mix(in oklab, #F59E0B 20%, transparent)",
              color: sourceType === "error" ? "#EF4444" : "#F59E0B",
              border: `1px solid ${sourceType === "error" ? "color-mix(in oklab, #EF4444 35%, transparent)" : "color-mix(in oklab, #F59E0B 35%, transparent)"}`,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: sourceType === "error" ? "#EF4444" : "#F59E0B" }} />
            {sourceType === "error" ? "Offline" : "Cache"}
          </span>
        )}
      </div>

      {/* Direita: Stats com badges MOCK */}
      <div className="flex items-center gap-4">
        {/* Energia */}
        <div className="flex items-start gap-1.5">
          <Zap className="h-4 w-4 mt-0.5" style={{ color: "#FACC15" }} />
          <div className="leading-tight">
            <div className="flex items-center gap-1">
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
                Energia
              </p>
              <MockBadge />
            </div>
            <p className="text-xs font-bold" style={{ color: "#FACC15" }}>{energy}%</p>
          </div>
        </div>

        {/* Nível */}
        <div className="flex items-start gap-1.5">
          <Star className="h-4 w-4 mt-0.5" style={{ color: "#60A5FA" }} />
          <div className="leading-tight">
            <div className="flex items-center gap-1">
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
                Nível
              </p>
              <MockBadge />
            </div>
            <p className="text-xs font-bold" style={{ color: "#60A5FA" }}>{level}</p>
          </div>
        </div>

        {/* XP */}
        <div className="flex items-start gap-1.5">
          <Gem className="h-4 w-4 mt-0.5" style={{ color: "#A78BFA" }} />
          <div className="leading-tight">
            <div className="flex items-center gap-1">
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
                XP
              </p>
              <MockBadge />
            </div>
            <p className="text-xs font-bold" style={{ color: "#A78BFA" }}>{xp.toLocaleString("pt-BR")}</p>
          </div>
        </div>

        {/* Hora — LIVE (tempo real do sistema) */}
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" style={{ color: "#34D399" }} />
          <div className="leading-tight">
            <p className="text-xs font-bold tabular-nums" style={{ color: "#E5E7EB" }}>{timeStr}</p>
            <p className="text-[9px] font-medium capitalize" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
              {dateStr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
