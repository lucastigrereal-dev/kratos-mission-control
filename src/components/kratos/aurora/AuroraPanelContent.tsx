import { useState, useEffect } from "react";
import { Command } from "lucide-react";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { DriftIndicator } from "@/components/kratos/shell/DriftIndicator";
import { NextActionBlock } from "@/components/kratos/shell/NextActionBlock";
import { AuroraQuickActions } from "./AuroraQuickActions";
import { AuroraInsightCard } from "./AuroraInsightCard";
import { AuroraCommandPalette } from "./AuroraCommandPalette";
import { FioMentalPanel } from "./FioMentalPanel";
import { useMissionLens } from "@/hooks/useMissionLens";
import { useDriftDetection } from "@/hooks/useDriftDetection";
import { useAuroraInsight } from "@/hooks/useAuroraInsight";

export function AuroraPanelContent() {
  const { lens, isLoading, sourceType, lastUpdatedAt, refetch } = useMissionLens();
  const { driftState, minutesOff, nudgeMessage, originalMission } =
    useDriftDetection();
  const {
    insight,
    isLoading: insightLoading,
    isError: insightError,
    refetch: refetchInsight,
  } = useAuroraInsight();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Open command palette on ⌘K when Aurora panel is focused
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        // Only intercept if Aurora is already open (panel is in DOM)
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const statusText =
    lens?.mission_lens?.status ?? "Observando contexto";
  const missionName = lens?.mission_lens?.current_mission;
  const greeting = missionName
    ? `Missão: ${missionName}`
    : "Bom te ver de volta.";

  return (
    <>
      {/* Drift bar — fixed at top, above scroll area */}
      <DriftIndicator
        driftState={driftState}
        minutesOff={minutesOff}
        nudgeMessage={nudgeMessage}
        originalMission={originalMission}
        onResume={() => refetch()}
      />

      <div className="flex-1 overflow-y-auto kratos-scrollbar p-4 space-y-4">
        {/* Loading */}
        {isLoading && <LoadingState lines={4} compact />}

        {/* Error — full-panel fallback when backend unreachable */}
        {!isLoading && sourceType === "error" && (
          <ErrorState
            title="Aurora indisponível"
            description="Não foi possível conectar ao backend. Verifique se o KRATOS API está rodando."
            variant="external_unavailable"
          />
        )}

        {/* Content — only when we have data */}
        {!isLoading && sourceType !== "error" && (
          <>
            {/* Greeting header */}
            <div>
              <div
                className="text-[13px] font-medium"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {greeting}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <StatusDot
                  severity={sourceType === "live" ? "ok" : "ghost"}
                  size="xs"
                  pulse={sourceType === "live"}
                />
                <span
                  className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
                  style={{ color: "var(--kratos-text-muted)" }}
                >
                  {statusText}
                </span>
              </div>
            </div>

            {/* Aurora Insight — do OMNIS via state.json. Opção A da arquitetura. */}
            <AuroraInsightCard
              insight={insight}
              isLoading={insightLoading}
              isError={insightError}
              onRefetch={refetchInsight}
            />

            {/* W3-B4: Fio Mental — running OMNIS missions, read-only */}
            <FioMentalPanel />

            {/* Next best action — replaces static AuroraMessagePreview */}
            <NextActionBlock
              action={lens?.next_best_action}
              sourceType={sourceType}
              updatedAt={lastUpdatedAt}
              onStart={() => {
                // TODO: wire into mission execution when ready
              }}
            />

            {/* Quick actions */}
            <div>
              <div
                className="mb-2 text-[10px] kratos-mono uppercase tracking-[0.15em]"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                Ações rápidas
              </div>
              <AuroraQuickActions />
            </div>
          </>
        )}
      </div>

      {/* Command palette trigger — pinned to bottom */}
      <div
        className="shrink-0 p-3"
        style={{ borderTop: "1px solid var(--kratos-border)" }}
      >
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--kratos-border)",
            color: "var(--kratos-text-muted)",
          }}
          aria-label="Abrir paleta de comandos Aurora"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Command className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kratos-ghost)" }} />
            <span className="truncate text-[12px]">
              Pergunte à Aurora ou use um comando…
            </span>
          </div>
          <kbd
            className="kratos-mono inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] shrink-0"
            style={{
              background: "var(--kratos-surface-3)",
              border: "1px solid var(--kratos-border)",
              color: "var(--kratos-text-muted)",
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Command palette — global overlay */}
      <AuroraCommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  );
}
