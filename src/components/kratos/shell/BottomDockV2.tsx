import { Play, Pause, SkipBack, SkipForward, Bookmark, Shield, Music, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIslandDock } from "@/components/kratos/islands/shared/IslandDockContext";

interface BottomDockV2Props {
  className?: string;
  currentMission?: string;
  missionProgress?: number;
  focusOfDay?: string;
  nextAction?: string;
  onContinue?: () => void;
  onSaveCheckpoint?: () => void;
}

function MusicPlayer() {
  return (
    <div className="flex items-center gap-3 min-w-0"
    >
      {/* Cover art */}
      <div
        className="shrink-0 rounded-lg"
        style={{
          width: 44,
          height: 44,
          background: "linear-gradient(135deg, #1e3a5f, #0f172a)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <Music className="h-5 w-5" style={{ color: "rgba(255,255,255,0.4)" }} />
        </div>
      </div>

      {/* Info + controls */}
      <div className="flex flex-col gap-1 min-w-0"
      >
        <div className="flex items-center gap-2"
        >
          <span
            className="text-[11px] font-semibold truncate"
            style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
          >
            Koopa Road
          </span>
          <span
            className="text-[10px] truncate hidden sm:inline"
            style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
          >
            Tyler, The Creator
          </span>
        </div>

        {/* Progress mini-bar */}
        <div className="flex items-center gap-2"
        >
          <span
            className="text-[9px] kratos-mono shrink-0"
            style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
          >
            1:17
          </span>
          <div
            className="h-1 flex-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)", minWidth: 60 }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "35%",
                background: "linear-gradient(90deg, var(--kr-ghost, #6366f1), var(--kr-gold, #FFD700))",
              }}
            />
          </div>
          <span
            className="text-[9px] kratos-mono shrink-0"
            style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
          >
            3:22
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2"
        >
          <button
            type="button"
            className="rounded p-0.5 transition-colors hover:bg-white/10 kratos-focus-ring"
            aria-label="Música anterior"
          >
            <SkipBack className="h-3 w-3" style={{ color: "var(--kr-text-secondary, #8a8a9a)" }} />
          </button>
          <button
            type="button"
            className="rounded p-0.5 transition-colors hover:bg-white/10 kratos-focus-ring"
            aria-label="Play"
          >
            <Play className="h-3.5 w-3.5" style={{ color: "var(--kr-text-primary, #f0f0f2)" }} />
          </button>
          <button
            type="button"
            className="rounded p-0.5 transition-colors hover:bg-white/10 kratos-focus-ring"
            aria-label="Próxima música"
          >
            <SkipForward className="h-3 w-3" style={{ color: "var(--kr-text-secondary, #8a8a9a)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamAvatars() {
  const members = ["L", "A", "C", "M"];
  return (
    <div className="flex items-center gap-1"
    >
      {members.map((initial, i) => (
        <div
          key={i}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold"
          style={{
            background: `hsl(${220 + i * 30}, 60%, 45%)`,
            color: "var(--kratos-text-primary)",
            border: "1px solid rgba(255,255,255,0.15)",
            marginLeft: i > 0 ? -6 : 0,
            zIndex: members.length - i,
          }}
        >
          {initial}
        </div>
      ))}
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors hover:bg-white/10 kratos-focus-ring"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "var(--kr-text-muted, #4a4a5a)",
          border: "1px solid rgba(255,255,255,0.1)",
          marginLeft: -6,
          zIndex: 0,
        }}
        aria-label="Adicionar membro"
      >
        +
      </button>
    </div>
  );
}

export function BottomDockV2({
  className,
  currentMission,
  missionProgress,
  focusOfDay,
  nextAction,
  onContinue,
  onSaveCheckpoint,
}: BottomDockV2Props) {
  const { data: islandData } = useIslandDock();

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
      {/* Left: Music player */}
      <div className="shrink-0"
      >
        <MusicPlayer />
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

      {/* Right: Actions + Team */}
      <div className="flex items-center gap-3 shrink-0"
      >
        <TeamAvatars />

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
