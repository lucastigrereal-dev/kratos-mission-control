import { Target, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MissionStep } from "./MissionStep";
import { SquadDock } from "./SquadDock";
import { AudioPlayer } from "./AudioPlayer";

interface SquadConfig {
  name: string;
  icon: import("lucide-react").LucideIcon;
  color: string;
}

interface StatusBarDockProps {
  currentMission?: string;
  missionProgress?: number;
  missionStep?: string;
  focusOfDay?: string;
  nextAction?: string;
  onContinue?: () => void;
  squads?: SquadConfig[];
  trackName?: string;
  trackArtist?: string;
  className?: string;
}

export function StatusBarDock({
  currentMission = "CONSTRUIR O FUTURO",
  missionProgress = 45,
  missionStep = "Fase 3 — HUD Components",
  focusOfDay = "Finalizar Bottom Dock",
  nextAction = "Criar StatusBarDock",
  onContinue,
  squads,
  trackName,
  trackArtist,
  className,
}: StatusBarDockProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 h-[56px] w-full",
        className,
      )}
      style={{
        background: "var(--kr-surface-deep)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(var(--kr-panel-blur))",
        WebkitBackdropFilter: "blur(var(--kr-panel-blur))",
      }}
      role="status"
      aria-label="Status bar operacional"
    >
      {/* ===== Section 1: Missão Atual ===== */}
      <div className="flex items-center gap-3 min-w-0 flex-[1.5]">
        <div
          className="flex-shrink-0 w-[32px] h-[32px] rounded-lg flex items-center justify-center"
          style={{
            background: "color-mix(in oklab, var(--kr-aurora) 18%, transparent)",
            border: "1px solid color-mix(in oklab, var(--kr-aurora) 35%, transparent)",
          }}
        >
          <Target
            className="h-4 w-4"
            style={{ color: "var(--kr-aurora)" }}
            aria-hidden
          />
        </div>
        <MissionStep
          mission={currentMission}
          step={missionStep}
          progress={missionProgress}
        />
      </div>

      {/* Divider */}
      <div
        className="w-[1px] h-7 flex-shrink-0"
        style={{ background: "var(--kr-glass-border)" }}
        aria-hidden
      />

      {/* ===== Section 2: Foco do Dia ===== */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Target
          className="h-4 w-4 flex-shrink-0"
          style={{ color: "var(--kr-gold)" }}
          aria-hidden
        />
        <span
          className="text-[12px] font-medium truncate"
          style={{ color: "var(--kr-text-primary)" }}
        >
          {focusOfDay}
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-[1px] h-7 flex-shrink-0"
        style={{ background: "var(--kr-glass-border)" }}
        aria-hidden
      />

      {/* ===== Section 3: Próxima Ação ===== */}
      <div className="flex items-center gap-2 min-w-0 flex-[1.5]">
        <ChevronRight
          className="h-4 w-4 flex-shrink-0"
          style={{ color: "var(--kr-gold)" }}
          aria-hidden
        />
        <span
          className="text-[12px] font-medium truncate"
          style={{ color: "var(--kr-text-primary)" }}
        >
          {nextAction}
        </span>

        {/* CONTINUAR button — gold gradient */}
        <button
          type="button"
          onClick={onContinue}
          className={cn(
            "ml-auto flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg",
            "text-[11px] font-bold uppercase tracking-[0.05em]",
            "transition-all duration-150",
            "kratos-focus-ring",
          )}
          style={{
            background: `linear-gradient(135deg, ${"var(--kr-gold)"}, ${"var(--kr-warning)"})`,
            color: "var(--kr-surface-abyss)",
            boxShadow: "0 0 12px color-mix(in oklab, var(--kr-gold) 40%, transparent)",
          }}
        >
          Continuar
        </button>
      </div>

      {/* Divider */}
      <div
        className="w-[1px] h-7 flex-shrink-0"
        style={{ background: "var(--kr-glass-border)" }}
        aria-hidden
      />

      {/* ===== Section 4: Squad ===== */}
      <div className="flex items-center flex-shrink-0">
        <SquadDock squads={squads} />
      </div>

      {/* Divider */}
      <div
        className="w-[1px] h-7 flex-shrink-0"
        style={{ background: "var(--kr-glass-border)" }}
        aria-hidden
      />

      {/* ===== Section 5: Player ===== */}
      <div className="flex items-center flex-shrink-0 min-w-0">
        <AudioPlayer compact trackName={trackName} artist={trackArtist} />
      </div>
    </div>
  );
}
