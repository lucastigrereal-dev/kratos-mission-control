import { useState, useEffect } from "react";
import { Play, Bookmark, Shield, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIslandDock } from "@/components/kratos/islands/shared/IslandDockContext";
import { useMissionLens } from "@/hooks/useMissionLens";

interface BottomDockV2Props {
  className?: string;
  currentMission?: string;
  missionProgress?: number;
  focusOfDay?: string;
  nextAction?: string;
  onContinue?: () => void;
  onSaveCheckpoint?: () => void;
}

/** Relógio ao vivo — útil para TDAH (ancora temporal sem abrir outra tela) */
function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const dayLabel = now.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Clock className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
      <div className="flex flex-col leading-none gap-0.5">
        <span
          className="text-[18px] font-bold kratos-mono leading-none"
          style={{ color: "var(--kratos-text-primary)" }}
          aria-label={`Hora atual: ${time}`}
        >
          {time}
        </span>
        <span
          className="text-[9px] uppercase tracking-[0.1em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          {dayLabel}
        </span>
      </div>
    </div>
  );
}

export function BottomDockV2({
  className,
  currentMission: currentMissionProp,
  missionProgress,
  focusOfDay: focusOfDayProp,
  nextAction: nextActionProp,
  onContinue,
  onSaveCheckpoint,
}: BottomDockV2Props) {
  const { data: islandData } = useIslandDock();

  // Dados reais do /mission/lens — sobrescrevem props hardcoded do AppShell
  const { lens } = useMissionLens();
  const currentMission =
    lens?.mission_lens?.current_mission ?? currentMissionProp ?? null;
  const focusOfDay =
    lens?.context?.project ??
    lens?.context?.focus_state ??
    focusOfDayProp ??
    null;
  const nextAction =
    lens?.next_best_action?.action ?? nextActionProp ?? null;

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[90] flex items-center gap-4 px-5",
        className,
      )}
      style={{
        height: 72,
        background: "var(--kr-glass-strong-bg, rgba(15, 23, 42, 0.94))",
        borderTop: "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.10))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      role="status"
      aria-label="Barra de status da missão"
    >
      {/* Left: Relógio ao vivo — âncora temporal TDAH */}
      <div className="shrink-0">
        <LiveClock />
      </div>

      {/* Divider */}
      <div
        className="h-10 w-px shrink-0"
        style={{ background: "rgba(255,255,255,0.06)" }}
        aria-hidden
      />

      {/* Center: Mission info */}
      <div className="flex flex-1 items-center gap-4 min-w-0"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1"
        >
          <Shield
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--kr-gold, #FFD700)" }}
            aria-hidden
          />
          <div className="min-w-0"
          >
            {currentMission ? (
              <span
                className="block truncate text-xs font-semibold"
                style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
                title={currentMission}
              >
                {currentMission}
              </span>
            ) : (
              <span
                className="block truncate text-xs"
                style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
              >
                Nenhuma missão ativa
              </span>
            )}
            {missionProgress !== undefined && (
              <div className="mt-1 flex items-center gap-2"
              >
                <div
                  className="h-0.5 flex-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)", maxWidth: 120 }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, missionProgress)}%`,
                      background: "linear-gradient(90deg, var(--kr-color-aurora, #6366f1), var(--kr-gold, #FFD700))",
                      boxShadow: "0 0 8px rgba(99,102,241,0.3)",
                    }}
                  />
                </div>
                <span
                  className="shrink-0 text-[10px] kratos-mono"
                  style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
                >
                  {missionProgress}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Island context or Focus + Next */}
        <div className="hidden md:flex items-center gap-4 shrink-0"
        >
          {islandData ? (
            <>
              <div className="flex flex-col gap-0 min-w-0"
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
                >
                  {islandData.label}
                </span>
                {islandData.value && (
                  <span
                    className="text-[11px] font-medium truncate max-w-[180px]"
                    style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
                    title={islandData.value}
                  >
                    {islandData.value}
                  </span>
                )}
                {islandData.progress !== undefined && (
                  <div className="mt-1 flex items-center gap-2"
                  >
                    <div
                      className="h-0.5 flex-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)", maxWidth: 120 }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, islandData.progress)}%`,
                          background: islandData.progressColor ?? "var(--kr-color-aurora, #6366f1)",
                        }}
                      />
                    </div>
                    <span
                      className="shrink-0 text-[10px] kratos-mono"
                      style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
                    >
                      {islandData.progress}%
                    </span>
                  </div>
                )}
              </div>
              {islandData.quickActions?.map((action, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={action.onClick}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-all hover:brightness-110 active:scale-[0.97] kratos-focus-ring"
                  style={{
                    background: "var(--kr-surface-2, rgba(255,255,255,0.04))",
                    border: "1px solid var(--kr-glass-strong-border, rgba(255,255,255,0.08))",
                    color: "var(--kr-text-secondary, #8a8a9a)",
                  }}
                >
                  <Zap className="h-3 w-3" aria-hidden />
                  {action.label}
                </button>
              ))}
            </>
          ) : (
            <>
              {focusOfDay && (
                <div className="flex flex-col gap-0"
                >
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.15em]"
                    style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
                  >
                    FOCO
                  </span>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: "var(--kr-text-secondary, #8a8a9a)" }}
                  >
                    {focusOfDay}
                  </span>
                </div>
              )}
              {nextAction && (
                <div className="flex flex-col gap-0"
                >
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.15em]"
                    style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
                  >
                    PRÓX
                  </span>
                  <span
                    className="text-[11px] font-medium truncate max-w-[180px]"
                    style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
                    title={nextAction}
                  >
                    {nextAction}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-10 w-px shrink-0"
        style={{ background: "rgba(255,255,255,0.06)" }}
        aria-hidden
      />

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onSaveCheckpoint}
          disabled={!onSaveCheckpoint}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "var(--kr-surface-2, rgba(255,255,255,0.04))",
            border: "1px solid var(--kr-glass-strong-border, rgba(255,255,255,0.08))",
            color: "var(--kr-text-secondary, #8a8a9a)",
          }}
          aria-label="Salvar checkpoint"
          title="Salvar checkpoint do estado atual"
        >
          <Bookmark className="h-3 w-3" aria-hidden />
          <span className="hidden sm:inline">Salvar</span>
        </button>

        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:brightness-110 active:scale-[0.97]"
            style={{
              background: "var(--kr-color-mission, #22C55E)",
              color: "#000",
              boxShadow: "0 0 12px rgba(34,197,94,0.3)",
            }}
          >
            <Play className="h-3 w-3" aria-hidden />
            Continuar
          </button>
        )}
      </div>
    </footer>
  );
}
