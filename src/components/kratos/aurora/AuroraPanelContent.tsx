import { StatusDot } from "@/components/kratos/base/StatusDot";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { DriftIndicator } from "@/components/kratos/shell/DriftIndicator";
import { NextActionBlock } from "@/components/kratos/shell/NextActionBlock";
import { AuroraQuickActions } from "./AuroraQuickActions";
import { AuroraInputMock } from "./AuroraInputMock";
import { useMissionLens } from "@/hooks/useMissionLens";
import { useDriftDetection } from "@/hooks/useDriftDetection";

export function AuroraPanelContent() {
  const { lens, isLoading, sourceType, lastUpdatedAt, refetch } = useMissionLens();
  const { driftState, minutesOff, nudgeMessage, originalMission } =
    useDriftDetection();

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

      {/* Input bar — pinned to bottom */}
      <div
        className="shrink-0 p-3"
        style={{ borderTop: "1px solid var(--kratos-border)" }}
      >
        <AuroraInputMock />
      </div>
    </>
  );
}
