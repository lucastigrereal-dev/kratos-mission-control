import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Timer,
  Save,
  AlertTriangle,
  CalendarDays,
  MessageSquare,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { AuroraOrb } from "./AuroraOrb";
import { AuroraSignalList, type AuroraSignal } from "./AuroraSignalList";
import type { MissionLensData } from "@/hooks/useMissionLens";
import type { DriftState } from "@/hooks/useDriftDetection";
import type { DataSource } from "@/api-contract/source-badge.schema";

interface AuroraPanelV2Props {
  lens?: MissionLensData | null;
  driftState?: DriftState;
  isLoading?: boolean;
  sourceType?: DataSource;
  onCommandPalette?: () => void;
}

interface QuickAction {
  icon: typeof Timer;
  label: string;
  onClick: () => void;
}

export function AuroraPanelV2({
  lens,
  driftState = "on-mission",
  isLoading = false,
  sourceType,
  onCommandPalette,
}: AuroraPanelV2Props) {
  const navigate = useNavigate();

  const isLive = sourceType === "live";
  const isError = sourceType === "error";
  const orbActive = isLive || sourceType === "cache";

  // Derive greeting from lens context
  const greeting = useMemo(() => {
    const mission = lens?.mission_lens?.current_mission;
    const focus = lens?.context?.focus_state;
    if (mission && focus) return `${mission} — ${focus}`;
    if (mission) return `Missão: ${mission}`;
    if (focus) return `Foco: ${focus}`;
    return "Bom te ver de volta.";
  }, [lens]);

  // Map mentor_signals to AuroraSignal format
  const signals: AuroraSignal[] = useMemo(() => {
    if (!lens?.mentor_signals) return [];
    return lens.mentor_signals
      .filter((s) => s.message)
      .map((s) => ({
        tone: (s.tone ?? "neutral") as AuroraSignal["tone"],
        message: s.message ?? "",
        source: s.source,
      }));
  }, [lens]);

  // Derive status text
  const statusText = useMemo(() => {
    if (isError) return "OFFLINE";
    if (isLoading) return "Conectando...";
    if (isLive) return "ONLINE";
    return lens?.mission_lens?.status ?? "OBSERVANDO";
  }, [isError, isLoading, isLive, lens]);

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        icon: Timer,
        label: "Plano 25min",
        onClick: () => {
          /* TODO: wire to Pomodoro timer */
        },
      },
      {
        icon: Save,
        label: "Salvar checkpoint",
        onClick: () =>
          navigate({ to: "/checkpoints" }),
      },
      {
        icon: AlertTriangle,
        label: "Ver riscos",
        onClick: () =>
          navigate({ to: "/projetos" }),
      },
      {
        icon: CalendarDays,
        label: "Resumir dia",
        onClick: () =>
          navigate({ to: "/agora" }),
      },
    ],
    [navigate],
  );

  // Loading state — compact skeleton
  if (isLoading) {
    return (
      <GlassPanel padding="md" className="space-y-3">
        <div className="flex items-center gap-3">
          <AuroraOrb active={false} />
          <div>
            <div
              className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              AURORA
            </div>
            <div
              className="text-[11px]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              Conectando...
            </div>
          </div>
        </div>
        <LoadingState lines={3} compact />
      </GlassPanel>
    );
  }

  // Error state — backend unreachable
  if (isError) {
    return (
      <GlassPanel padding="md" className="space-y-3">
        <div className="flex items-center gap-3">
          <AuroraOrb active={false} />
          <div>
            <div
              className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              AURORA
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusDot severity="critical" size="xs" pulse={false} />
              <span
                className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
                style={{ color: "var(--kratos-critical)" }}
              >
                OFFLINE
              </span>
            </div>
          </div>
        </div>
        <ErrorState
          title="Aurora indisponível"
          description="Backend inacessível. Verifique o servidor."
          variant="external_unavailable"
        />
      </GlassPanel>
    );
  }

  // Normal content
  return (
    <GlassPanel padding="md" className="space-y-3">
      {/* Header — Orb + label + status */}
      <div className="flex items-center gap-3">
        <AuroraOrb active={orbActive} pulse={isLive} />

        <div className="min-w-0 flex-1">
          <div
            className="text-[10px] kratos-mono uppercase tracking-[0.15em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            AURORA
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusDot
              severity={isLive ? "ok" : "ghost"}
              size="xs"
              pulse={isLive}
            />
            <span
              className={cn(
                "text-[10px] kratos-mono uppercase tracking-[0.15em]",
              )}
              style={{
                color: isLive
                  ? "var(--kratos-ok)"
                  : "var(--kratos-text-muted)",
              }}
            >
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Drift warning banner */}
      {driftState !== "on-mission" && (
        <div
          className="rounded-lg px-3 py-2 text-[11px]"
          style={{
            background:
              "color-mix(in oklab, var(--kratos-warn) 8%, var(--kratos-surface-2))",
            border: "1px solid color-mix(in oklab, var(--kratos-warn) 20%, transparent)",
            color: "var(--kratos-warn)",
          }}
        >
          {driftState === "drifting" && "Você saiu da missão. Quer retomar?"}
          {driftState === "lost" && "Missão parada. Último checkpoint disponível."}
          {driftState === "zombie" && "Sem atividade há muito tempo. Retomar ou arquivar?"}
        </div>
      )}

      {/* Greeting */}
      <p
        className="text-[13px] font-medium leading-snug"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        {greeting}
      </p>

      {/* Aurora divider */}
      <div className="kratos-aurora-divider" />

      {/* Signals */}
      <div>
        <div
          className="mb-2 text-[10px] kratos-mono uppercase tracking-[0.15em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Sinais
        </div>
        <AuroraSignalList signals={signals} />
      </div>

      {/* Quick actions */}
      <div>
        <div
          className="mb-2 text-[10px] kratos-mono uppercase tracking-[0.15em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Ações rápidas
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {quickActions.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="kratos-focus-ring kratos-card-hover flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px]"
              style={{
                background: "var(--kratos-surface-3)",
                border: "1px solid var(--kratos-border)",
                color: "var(--kratos-text-primary)",
              }}
            >
              <Icon
                className="h-3 w-3 shrink-0"
                style={{ color: "var(--kratos-ghost)" }}
              />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Aurora divider */}
      <div className="kratos-aurora-divider" />

      {/* Command palette trigger */}
      <button
        type="button"
        onClick={onCommandPalette}
        className="kratos-focus-ring kratos-card-hover flex w-full items-center justify-between rounded-lg px-3 py-2 text-left"
        style={{
          background: "var(--kratos-surface-3)",
          border: "1px solid var(--kratos-border)",
          color: "var(--kratos-text-primary)",
        }}
      >
        <div className="flex items-center gap-2">
          <Command
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-accent)" }}
          />
          <span className="text-[11px]">Paleta de comandos</span>
        </div>
        <kbd
          className="rounded-md px-1.5 py-0.5 text-[9px] kratos-mono"
          style={{
            background: "var(--kratos-surface-4)",
            color: "var(--kratos-text-muted)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Falar com Aurora — subtle bottom action */}
      <button
        type="button"
        onClick={onCommandPalette}
        className="kratos-focus-ring kratos-card-hover flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2"
        style={{
          background: "var(--kratos-surface-3)",
          border: "1px solid var(--kratos-border)",
          color: "var(--kratos-text-secondary)",
        }}
      >
        <MessageSquare
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-ghost)" }}
        />
        <span className="text-[11px]">Falar com Aurora</span>
      </button>
    </GlassPanel>
  );
}
