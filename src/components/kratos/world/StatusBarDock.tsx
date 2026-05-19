import { Bookmark, Play, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKratosContext } from "./KratosContext";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import { useCreateCheckpoint } from "@/hooks/useCheckpoints";

/* --------------------------------------------------*\
 * StatusBarDock — Bottom dock for the 3D world view.
 *
 * Displays current mission, progress, focus of day,
 * next action, and a continue/advance button.
 *
 * Sits at z-90, above the KratosWorldMap.
\* --------------------------------------------------*/

interface StatusBarDockProps {
  className?: string;
  currentMission?: string;
  missionProgress?: number;
  focusOfDay?: string;
  nextAction?: string;
  onContinue?: () => void;
}

export function StatusBarDock({
  className,
  currentMission,
  missionProgress,
  focusOfDay,
  nextAction,
  onContinue,
}: StatusBarDockProps) {
  const { lensSourceType, lensLastUpdatedAt, lens } = useKratosContext();
  const createCheckpoint = useCreateCheckpoint();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[90]",
        "flex items-center justify-between gap-4",
        "px-5",
        className,
      )}
      style={{
        height: "48px",
        background: "var(--kr-glass-strong-bg, color-mix(in oklab, var(--kr-surface-deep, #0F172A) 94%, transparent))",
        borderTop: "1px solid var(--kr-glass-strong-border, color-mix(in oklab, white 10%, transparent))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      role="status"
      aria-label="Barra de status da missão"
    >
      {/* Left: Mission + Progress bar */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Shield
          className="h-4 w-4 shrink-0"
          style={{ color: "var(--kr-gold, #FFD700)" }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          {currentMission ? (
            <span
              className="block truncate text-xs font-semibold"
              style={{ color: "var(--kr-text-primary, #E5E7EB)" }}
              title={currentMission}
            >
              {currentMission}
            </span>
          ) : (
            <span
              className="block truncate text-xs"
              style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
            >
              Nenhuma missão ativa
            </span>
          )}
          {/* Progress mini-bar */}
          {missionProgress !== undefined && (
            <div className="mt-1 flex items-center gap-2">
              <div
                className="h-0.5 flex-1 rounded-full overflow-hidden"
                style={{ background: "color-mix(in oklab, white 8%, transparent)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, missionProgress)}%`,
                    background:
                      "linear-gradient(90deg, var(--kr-color-aurora, #6366F1), var(--kr-gold, #FFD700))",
                    boxShadow: "0 0 8px color-mix(in oklab, var(--kr-color-aurora, #6366F1) 30%, transparent)",
                  }}
                />
              </div>
              <span
                className="shrink-0 text-[10px] kratos-mono"
                style={{ color: "var(--kr-text-muted, #9CA3AF)", fontFamily: "var(--kr-font-mono, monospace)" }}
              >
                {missionProgress}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Center: Focus + Next Action */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        {focusOfDay && (
          <div className="flex items-center gap-1.5">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em]"
              style={{
                color: "var(--kr-text-muted, #9CA3AF)",
                fontFamily: "var(--kr-font-mono, monospace)",
              }}
            >
              FOCO
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: "var(--kr-text-secondary, #D1D5DB)" }}
            >
              {focusOfDay}
            </span>
          </div>
        )}
        {nextAction && (
          <div className="flex items-center gap-1.5">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em]"
              style={{
                color: "var(--kr-text-muted, #9CA3AF)",
                fontFamily: "var(--kr-font-mono, monospace)",
              }}
            >
              PROX
            </span>
            <span
              className="text-[11px] font-medium truncate max-w-[200px]"
              style={{ color: "var(--kr-text-primary, #E5E7EB)" }}
              title={nextAction}
            >
              {nextAction}
            </span>
          </div>
        )}
      </div>

      {/* Source badge */}
      <SourceBadgeIndicator
        meta={{
          source: lensSourceType,
          origin: "mission-lens",
          errors: [],
          stale: lensSourceType === "error" || lensSourceType === "stale",
          updated_at: lensLastUpdatedAt,
          confidence: lensSourceType === "live" ? 95 : 60,
        }}
        size="sm"
      />

      {/* Save checkpoint button */}
      <button
        type="button"
        onClick={() => {
          createCheckpoint.mutate({
            titulo: lens?.mission_lens?.current_mission
              ? `Checkpoint: ${lens.mission_lens.current_mission}`
              : "Checkpoint rápido",
            descricao: lens?.next_best_action?.action
              ? `Próxima ação: ${lens.next_best_action.action}`
              : undefined,
          });
        }}
        disabled={createCheckpoint.isPending}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "var(--kr-surface-2, color-mix(in oklab, white 4%, transparent))",
          border: "1px solid var(--kr-glass-strong-border, color-mix(in oklab, white 8%, transparent))",
          color: "var(--kr-text-secondary, #D1D5DB)",
        }}
        aria-label="Salvar checkpoint"
        title="Salvar checkpoint do estado atual"
      >
        <Bookmark className="h-3 w-3" aria-hidden />
        <span className="hidden sm:inline">Salvar</span>
      </button>

      {/* Right: Continue button */}
      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:brightness-110 active:scale-[0.97]"
          style={{
            background: "var(--kr-color-mission, #22C55E)",
            color: "#000",
            boxShadow: "0 0 12px color-mix(in oklab, var(--kr-color-mission, #22C55E) 30%, transparent)",
          }}
        >
          <Play className="h-3 w-3" aria-hidden />
          Continuar
        </button>
      )}
    </div>
  );
}
