import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  X,
} from "lucide-react";
import { KratosWorldMap } from "./KratosWorldMap";
import { CentralCastleMission } from "./CentralCastleMission";
import { StatusBarDock } from "./StatusBarDock";
import { WorldCharacterMarker } from "./WorldCharacterMarker";
import { DriftIndicator } from "@/components/kratos/shell/DriftIndicator";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { ZombieBadge } from "@/components/kratos/base/ZombieBadge";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import { OperatorWelcomeCard } from "@/components/kratos/hud/OperatorWelcomeCard";
import { CurrentMissionBar } from "@/components/kratos/hud/CurrentMissionBar";
import { AuroraChatDock } from "@/components/kratos/aurora/AuroraChatDock";
import { KratosLogo } from "@/components/kratos/icons/KratosLogo";
import { SidebarItem } from "@/components/kratos/shell/SidebarItem";
import { VISIBLE_ROUTES } from "@/lib/kratos-routes";
import {
  KratosContextProvider,
  useKratosContext,
} from "./KratosContext";
import type { DashboardLoaderData } from "@/hooks/useDashboard";
import type { DriftState } from "@/hooks/useDriftDetection";
import type { LiveState } from "@/components/kratos/base/LiveStatusIndicator";
import type { useCheckpoints } from "@/hooks/useCheckpoints";

/* --------------------------------------------------*\
 * KratosWorldPage — Master 3D world page with live
 * data binding.
 *
 * Wires KratosWorldMap + HUD overlays to real data
 * from useMissionLens, useDriftDetection,
 * useDashboard, useDashboardSnapshot, useSystemPulse,
 * and useCheckpoints.
 *
 * Layout layers (bottom to top):
 *   z-0..z-70: KratosWorldMap (ocean, sky, islands, castle, bridges)
 *   z-[80]: Sidebar (glass, fixed left)
 *   z-[80]: Top bar (glass, fixed top)
 *   z-[80]: Right rail / Aurora panel
 *   z-[85]: DriftIndicator (fixed top, below topbar)
 *   z-[90]: StatusBarDock (fixed bottom)
\* --------------------------------------------------*/

/* --------------------------------------------------*\
 * Props
\* --------------------------------------------------*/

interface KratosWorldPageProps {
  /** SSR preloaded dashboard data from route loader */
  ssrData?: DashboardLoaderData;
}

/* --------------------------------------------------*\
 * Helper constants
\* --------------------------------------------------*/

const SIDEBAR_KEY = "kratos.sidebar.collapsed";
const AURORA_KEY = "kratos.aurora.open";

const AURORA_QUICK_COMMANDS = [
  { id: "retomar", label: "/retomar", icon: "↩" },
  { id: "salvar", label: "/salvar", icon: "💾" },
  { id: "foco", label: "/foco-agora", icon: "🎯" },
];

const SECTION_LABELS: Record<string, string> = {
  operacao: "Operacao",
  memoria: "Memoria",
  sistema: "Sistema",
};

const NAV_GROUPS = Object.entries(
  VISIBLE_ROUTES.reduce<Record<string, typeof VISIBLE_ROUTES>>(
    (acc, route) => {
      (acc[route.section] ??= []).push(route);
      return acc;
    },
    {},
  ),
).map(([section, items]) => ({
  label: SECTION_LABELS[section] ?? section,
  items: items.map((r) => ({ to: r.path, label: r.label, icon: r.icon })),
}));

/* --------------------------------------------------*\
 * Main exported component
\* --------------------------------------------------*/

export function KratosWorldPage({ ssrData }: KratosWorldPageProps) {
  return (
    <KratosContextProvider ssrDashboard={ssrData}>
      <KratosWorldPageInner ssrData={ssrData} />
    </KratosContextProvider>
  );
}

/* --------------------------------------------------*\
 * Inner component — consumes KratosContext
\* --------------------------------------------------*/

function KratosWorldPageInner({
  ssrData,
}: {
  ssrData?: DashboardLoaderData;
}) {
  const navigate = useNavigate();
  const ctx = useKratosContext();

  // ── Local UI state ─────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [auroraOpen, setAuroraOpen] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SIDEBAR_KEY);
      const a = localStorage.getItem(AURORA_KEY);
      if (s !== null) setSidebarCollapsed(s === "1");
      if (a !== null) setAuroraOpen(a === "1");
    } catch {
      /* noop */
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const toggleAurora = useCallback(() => {
    setAuroraOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(AURORA_KEY, next ? "1" : "0");
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = () => toggleAurora();
    window.addEventListener("kratos:toggle-aurora", handler);
    return () => window.removeEventListener("kratos:toggle-aurora", handler);
  }, [toggleAurora]);

  // ── Interaction handlers ──────
  const handleIslandClick = useCallback(
    (islandId: string) => {
      navigate({ to: "/ilhas/$islandId", params: { islandId } });
    },
    [navigate],
  );

  const handleCastleClick = useCallback(() => {
    navigate({ to: "/agora" });
  }, [navigate]);

  const handleContinue = useCallback(() => {
    const topPaused = ctx.pausedCheckpoints?.[0];
    if (topPaused) {
      ctx.resumeCheckpoint.mutate(topPaused.id);
    }
  }, [ctx.pausedCheckpoints, ctx.resumeCheckpoint]);

  const handleResume = useCallback(() => {
    const topPaused = ctx.pausedCheckpoints?.[0];
    if (topPaused) {
      ctx.resumeCheckpoint.mutate(topPaused.id);
    }
  }, [ctx.pausedCheckpoints, ctx.resumeCheckpoint]);

  // ── Derived values ────────────
  const currentMission =
    ctx.lens?.mission_lens?.current_mission ??
    ssrData?.contexto?.project ??
    undefined;

  const missionPhase = ctx.lens?.mission_lens?.phase;
  const nextAction = ctx.lens?.next_best_action?.action;

  const handleAuroraQuickCommand = useCallback((commandId: string) => {
    switch (commandId) {
      case "retomar": {
        const topPaused = ctx.pausedCheckpoints?.[0];
        if (topPaused) ctx.resumeCheckpoint.mutate(topPaused.id);
        ctx.lensRefetch();
        ctx.dashboardRefetch();
        break;
      }
      case "salvar": {
        const titulo = nextAction ?? currentMission ?? "Checkpoint rapido";
        const descricao = [currentMission, missionPhase].filter(Boolean).join(" — fase: ");
        ctx.createCheckpoint.mutate({
          titulo,
          descricao: descricao || undefined,
          projetoId: null,
        });
        break;
      }
      case "foco": {
        navigate({ to: "/agora" });
        ctx.lensRefetch();
        break;
      }
    }
  }, [ctx.pausedCheckpoints, ctx.resumeCheckpoint, ctx.createCheckpoint, ctx.lensRefetch, ctx.dashboardRefetch, navigate, nextAction, currentMission, missionPhase]);

  const missionStatus = deriveMissionStatus(ctx.checkpoints.data);

  const connectionState: LiveState = ctx.liveStatus.liveState;
  const isOffline = connectionState === "offline" || connectionState === "error";

  // Drift contextual message for Aurora chat dock
  const driftMessage = ctx.driftStatus.driftState !== "on-mission"
    ? {
        id: "drift-alert",
        text: ctx.driftStatus.driftState === "zombie"
          ? `Você está em modo zumbi há ${ctx.driftStatus.minutesOff} minutos. Quer retomar a missão original?`
          : ctx.driftStatus.driftState === "lost"
          ? `Você está perdido há ${ctx.driftStatus.minutesOff} minutos. ${ctx.driftStatus.originalMission ? `Missão original: ${ctx.driftStatus.originalMission}` : "Defina uma missão para voltar ao foco."}`
          : `Você saiu da missão há ${ctx.driftStatus.minutesOff} minutos. Quer voltar, atualizar a missão ou salvar um checkpoint?`,
        from: "aurora" as const,
      }
    : null;

  const auroraMessages = [
    ...(driftMessage ? [driftMessage] : []),
    ...(ctx.lens?.mentor_signals ?? []).map((s, i) => ({
      id: `signal-${i}`,
      text: s.message ?? "",
      from: "aurora" as const,
    })),
  ];

  const showFullLoading =
    ctx.lensLoading && ctx.dashboard.isLoading && !ssrData;
  const showFullError =
    (!ctx.lensLoading && ctx.lens === null && ctx.lensSourceType === "error") ||
    (ctx.dashboardSnapshot.isError && !ssrData);

  // ── Render: Loading ───────────
  if (showFullLoading) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center"
        style={{ background: "var(--kr-ocean-deep, #051024)" }}
      >
        <div className="w-full max-w-md px-6">
          <div className="mb-6 text-center">
            <KratosLogo collapsed={false} />
          </div>
          <LoadingState lines={5} />
          <p
            className="mt-4 text-center text-xs"
            style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
          >
            Carregando Mission Control...
          </p>
        </div>
      </div>
    );
  }

  // ── Render: Full error ───────
  if (showFullError) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center"
        style={{ background: "var(--kr-ocean-deep, #051024)" }}
      >
        <div className="w-full max-w-md px-6">
          <ErrorState
            title="Mission Control indisponivel"
            description="Nao foi possivel conectar ao backend. Verifique se o servidor esta rodando."
            variant="external_unavailable"
          />
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => { ctx.lensRefetch(); ctx.dashboardRefetch(); }}
              className="rounded-lg px-4 py-2 text-xs font-medium transition-colors hover:brightness-110"
              style={{
                background: "var(--kr-color-mission, #22C55E)",
                color: "#000",
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Live world ───────
  return (
    <div
      id="kr-world-viewport"
      className="kr-world-viewport relative h-screen w-screen overflow-hidden"
      style={{ background: "var(--kr-ocean-deep, #051024)" }}
    >
      {/* ════════════════════════════════════════
        Layer: KratosWorldMap (z-0 to z-70)
        The 3D island world background
        ════════════════════════════════════════ */}
      <KratosWorldMap
        currentMission={currentMission}
        onIslandClick={handleIslandClick}
        castleComponent={
          <CentralCastleMission
            currentMission={currentMission}
            missionStatus={missionStatus}
            driftRisk={ctx.lens?.context?.drift_risk}
            onCastleClick={handleCastleClick}
          />
        }
      />

      {/* ════════════════════════════════════════
        Layer: WorldCharacterMarker (z-[75])
        Above world map (z-70), below chrome (z-80)
        ════════════════════════════════════════ */}
      <div className="fixed inset-0 z-[75] pointer-events-none">
        <WorldCharacterMarker
          position={{ x: "50%", y: "45%" }}
          label="Lucas"
          isActive={connectionState === "live"}
          hasCheckpoint={(ctx.pausedCheckpoints?.length ?? 0) > 0}
        />
      </div>

      {/* ════════════════════════════════════════
        Layer: Sidebar (z-80, glass overlay)
        ════════════════════════════════════════ */}
      <aside
        className="fixed left-0 top-0 z-[80] flex h-full flex-col"
        style={{
          width: sidebarCollapsed ? 60 : 232,
          background: "var(--kr-glass-strong-bg, rgba(15, 23, 42, 0.90))",
          borderRight:
            "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "width 200ms ease",
        }}
        aria-label="Navegacao principal"
      >
        {/* Logo area */}
        <div
          className="flex items-center px-3"
          style={{
            height: 52,
            borderBottom:
              "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
          }}
        >
          <KratosLogo collapsed={sidebarCollapsed} />
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto kratos-scrollbar p-2">
          <div className="flex flex-col gap-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-0.5">
                {!sidebarCollapsed && (
                  <div
                    className="kratos-eyebrow px-2.5 mb-1.5"
                    style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
                  >
                    {group.label}
                  </div>
                )}
                {sidebarCollapsed && (
                  <div
                    className="mx-auto mb-1.5 h-px w-5"
                    style={{
                      background:
                        "var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
                    }}
                    aria-hidden
                  />
                )}
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.to}
                    {...item}
                    collapsed={sidebarCollapsed}
                  />
                ))}
              </div>
            ))}
          </div>
        </nav>

        {/* Collapse toggle */}
        <div
          className="p-2"
          style={{
            borderTop:
              "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
          }}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-[10px] kratos-mono uppercase tracking-[0.15em] transition-colors duration-150 kratos-focus-ring"
            style={{ color: "var(--kr-text-muted, #9CA3AF)", background: "transparent" }}
            aria-label={
              sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"
            }
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-3.5 w-3.5" />
            ) : (
              <>
                <PanelLeftClose className="h-3.5 w-3.5" />
                <span>Recolher</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════
        Layer: Top bar (z-80, glass overlay)
        ════════════════════════════════════════ */}
      <header
        className="fixed left-0 right-0 z-[80] flex items-center justify-between px-5"
        style={{
          height: 52,
          left: sidebarCollapsed ? 60 : 232,
          background: "var(--kr-glass-strong-bg, rgba(15, 23, 42, 0.90))",
          borderBottom:
            "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "left 200ms ease",
        }}
      >
        {/* Operator welcome */}
        <OperatorWelcomeCard
          operatorName="Lucas"
          className="px-3 py-1.5 rounded-lg"
        />

        {/* Right cluster: connection + source badge + Aurora toggle */}
        <div className="flex items-center gap-2">
          {/* Connection status */}
          <ConnectionBadge
            liveState={connectionState}
            isSSEConnected={ctx.liveStatus.isSSEConnected}
          />

          {/* Source badge */}
          <SourceBadgeIndicator meta={ctx.dashboardSnapshot.meta} size="sm" />

          {/* Aurora toggle */}
          <button
            type="button"
            onClick={toggleAurora}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] kratos-mono uppercase tracking-[0.18em] transition-colors duration-150 kratos-focus-ring"
            style={{
              background: auroraOpen
                ? "rgba(99,102,241,0.14)"
                : "var(--kr-surface-2, rgba(255,255,255,0.04))",
              border: `1px solid ${auroraOpen ? "var(--kr-border-live, #6366F1)" : "var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))"}`,
              color: auroraOpen
                ? "var(--kr-color-aurora, #6366F1)"
                : "var(--kr-text-secondary, #D1D5DB)",
              boxShadow: auroraOpen
                ? "0 0 0 4px color-mix(in oklab, var(--kr-color-aurora, #6366F1) 10%, transparent)"
                : undefined,
            }}
            aria-pressed={auroraOpen}
            aria-label={
              auroraOpen ? "Fechar painel Aurora" : "Abrir painel Aurora"
            }
          >
            <Sparkles className="h-3 w-3" />
            Aurora
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════
        Layer: Right Rail — Aurora Panel (z-80)
        ════════════════════════════════════════ */}
      <aside
        className="fixed right-0 top-0 z-[80] flex h-full flex-col overflow-hidden"
        style={{
          width: auroraOpen ? 340 : 0,
          top: 52,
          background: "var(--kr-glass-strong-bg, rgba(15, 23, 42, 0.92))",
          borderLeft: auroraOpen
            ? "1px solid var(--kr-border-live, #6366F1)"
            : "none",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          transition: "width 220ms ease",
        }}
        aria-hidden={!auroraOpen}
        aria-label="Painel Aurora"
      >
        {/* Aurora header */}
        <div
          className="flex shrink-0 items-center justify-between px-4"
          style={{ height: 48 }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid var(--kr-border-live, #6366F1)",
              }}
              aria-hidden
            >
              <Sparkles
                className="h-3 w-3"
                style={{ color: "var(--kr-color-aurora, #6366F1)" }}
              />
            </div>
            <span
              className="kratos-eyebrow"
              style={{ color: "var(--kr-text-secondary, #D1D5DB)" }}
            >
              Aurora · Mentor
            </span>
          </div>
          <button
            type="button"
            onClick={toggleAurora}
            className="rounded-md p-1 transition-colors hover:bg-white/5 kratos-focus-ring"
            aria-label="Fechar painel Aurora"
          >
            <X
              className="h-3.5 w-3.5"
              style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
            />
          </button>
        </div>

        {/* Divider */}
        <div
          className="shrink-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--kr-border-live, #6366F1) 20%, var(--kr-border-live, #6366F1) 80%, transparent)",
            opacity: 0.3,
          }}
          aria-hidden
        />

        {/* Aurora content */}
        <AuroraPanelV2Content ctx={ctx} />

        {/* Aurora chat dock — pinned at bottom */}
        <AuroraChatDock
          messages={auroraMessages}
          onSend={(_text) => { ctx.lensRefetch(); }}
          quickCommands={AURORA_QUICK_COMMANDS}
          onQuickCommand={handleAuroraQuickCommand}
          className="shrink-0"
          context={
            ctx.driftStatus.driftState === "on-mission"
              ? "normal"
              : ctx.driftStatus.driftState === "drifting"
                ? "drift"
                : ctx.driftStatus.driftState === "lost"
                  ? "lost"
                  : "zombie"
          }
        />
      </aside>

      {/* ════════════════════════════════════════
        Layer: DriftIndicator (z-85)
        Floats below the top bar, above the world
        ════════════════════════════════════════ */}
      <div
        className="fixed left-0 right-0 z-[85]"
        style={{
          top: 52,
          left: sidebarCollapsed ? 60 : 232,
          transition: "left 200ms ease",
        }}
      >
        <DriftIndicator
          driftState={ctx.driftStatus.driftState}
          minutesOff={ctx.driftStatus.minutesOff}
          nudgeMessage={ctx.driftStatus.nudgeMessage}
          originalMission={ctx.driftStatus.originalMission}
          onResume={handleResume}
          sourceType={ctx.lensSourceType}
        />
      </div>

      {/* ════════════════════════════════════════
        Layer: Offline / zombie badge
        Displayed when system is offline or zombie
        ════════════════════════════════════════ */}
      {(isOffline || ctx.driftStatus.driftState === "zombie") && (
        <div
          className="fixed left-1/2 z-[86] -translate-x-1/2"
          style={{ top: 60 }}
        >
          <ZombieBadge
            driftState={ctx.driftStatus.driftState}
            minutesOff={ctx.driftStatus.minutesOff}
            onResume={handleResume}
            sourceType={ctx.lensSourceType}
            onRetryConnection={() => { ctx.lensRefetch(); ctx.dashboardRefetch(); }}
          />
        </div>
      )}

      {/* ════════════════════════════════════════
        Layer: CurrentMissionBar (z-[89])
        Just above StatusBarDock, shows mission pulse
        ════════════════════════════════════════ */}
      <div
        className="fixed left-0 right-0 z-[89] px-4"
        style={{
          bottom: 48,
          left: sidebarCollapsed ? 60 : 232,
          transition: "left 200ms ease",
        }}
      >
        {/* Restore CTA — shows when paused checkpoint exists */}
        {ctx.pausedCheckpoints && ctx.pausedCheckpoints.length > 0 && (
          <div className="mb-2">
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-150 hover:brightness-110 active:scale-[0.97] kratos-focus-ring"
              style={{
                background: "color-mix(in oklab, var(--kr-color-aurora, #6366F1) 10%, transparent)",
                border: "1px solid color-mix(in oklab, var(--kr-color-aurora, #6366F1) 25%, transparent)",
                color: "var(--kr-color-aurora, #6366F1)",
              }}
            >
              <span>↩</span>
              <span>Retomar: {ctx.pausedCheckpoints[0].titulo}</span>
            </button>
          </div>
        )}
        <CurrentMissionBar
          missionTitle={currentMission}
          progress={ctx.checkpointProgress ?? 0}
          timeRemaining={missionPhase}
          sourceType={ctx.lensSourceType}
        />
      </div>

      {/* Alert count pill — shown above status bar when alerts exist */}
      {(ctx.lens?.alerts?.length ?? 0) > 0 && (
        <div
          className="fixed right-5 z-[89]"
          style={{ bottom: 52 }}
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold kratos-mono"
            style={{
              background: "color-mix(in oklab, var(--kr-color-risk, #EF4444) 12%, transparent)",
              border: "1px solid color-mix(in oklab, var(--kr-color-risk, #EF4444) 30%, transparent)",
              color: "var(--kr-color-risk, #EF4444)",
            }}
          >
            ⚠ {ctx.lens?.alerts?.length ?? 0} alerta{(ctx.lens?.alerts?.length ?? 0) > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* ════════════════════════════════════════
        Layer: StatusBarDock (z-90)
        Fixed at bottom, full width
        ════════════════════════════════════════ */}
      <StatusBarDock
        currentMission={currentMission}
        missionProgress={ctx.checkpointProgress}
        focusOfDay={missionPhase}
        nextAction={nextAction}
        onContinue={handleContinue}
      />
    </div>
  );
}

/* --------------------------------------------------*\
 * ConnectionBadge — Mini status dot + label
\* --------------------------------------------------*/

interface ConnectionBadgeProps {
  liveState: LiveState;
  isSSEConnected: boolean;
}

function ConnectionBadge({ liveState, isSSEConnected }: ConnectionBadgeProps) {
  const severity = liveStateToSeverity(liveState);
  const label = liveStateLabel(liveState, isSSEConnected);

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] kratos-mono"
      style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
    >
      <StatusDot
        severity={severity}
        size="xs"
        pulse={liveState === "live" && isSSEConnected}
      />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

function liveStateToSeverity(
  state: LiveState,
): "ok" | "warn" | "critical" | "info" | "muted" {
  switch (state) {
    case "live":
      return "ok";
    case "degraded":
    case "reconnecting":
      return "warn";
    case "cached":
    case "fallback":
      return "info";
    case "offline":
    case "loading":
    case "empty":
      return "muted";
    case "error":
      return "critical";
    default:
      return "muted";
  }
}

function liveStateLabel(state: LiveState, sseConnected: boolean): string {
  if (state === "live" && sseConnected) return "AO VIVO";
  if (state === "live") return "CONECTADO";
  if (state === "degraded") return "DEGRADADO";
  if (state === "reconnecting") return "RECONECTANDO";
  if (state === "cached") return "CACHE";
  if (state === "fallback") return "FALLBACK";
  if (state === "offline") return "OFFLINE";
  if (state === "error") return "ERRO";
  return "AGUARDANDO";
}

/* --------------------------------------------------*\
 * AuroraPanelV2Content — Aurora panel body with
 * lens data, drift state, mentor signals, alerts.
\* --------------------------------------------------*/

interface AuroraPanelV2ContentProps {
  ctx: ReturnType<typeof useKratosContext>;
}

function AuroraPanelV2Content({ ctx }: AuroraPanelV2ContentProps) {
  const { lens, lensLoading, lensSourceType, lensLastUpdatedAt, driftStatus } = ctx;

  if (lensLoading) {
    return (
      <div className="flex-1 overflow-y-auto kratos-scrollbar p-4">
        <LoadingState lines={8} />
      </div>
    );
  }

  if (!lens) {
    return (
      <div className="flex-1 overflow-y-auto kratos-scrollbar p-4">
        <EmptyState
          title="Aurora indisponivel"
          description="O backend nao esta enviando dados de missao."
        />
      </div>
    );
  }

  const missionLens = lens.mission_lens;
  const mentorSignals = lens.mentor_signals ?? [];
  const alerts = lens.alerts ?? [];
  const nextBestAction = lens.next_best_action;

  return (
    <div className="flex-1 overflow-y-auto kratos-scrollbar p-4 space-y-4">
      {/* Source badge */}
      <div className="flex items-center gap-2">
        <SourceBadgeIndicator
          meta={{
            source: lensSourceType,
            origin: "mission-lens",
            errors: [],
            stale: lensSourceType === "error",
            updated_at: lensLastUpdatedAt,
            confidence: lensSourceType === "live" ? 95 : 50,
          }}
          size="sm"
        />
      </div>

      {/* Mission status */}
      <section>
        <h3
          className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
          style={{ color: "var(--kr-text-muted, #9CA3AF)", fontFamily: "var(--kr-font-mono, monospace)" }}
        >
          Status da Missao
        </h3>
        <div
          className="rounded-lg p-3"
          style={{
            background: "var(--kr-surface-2, rgba(255,255,255,0.03))",
            border: "1px solid var(--kr-glass-strong-border, rgba(255,255,255,0.08))",
          }}
        >
          {missionLens?.current_mission ? (
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--kr-text-primary, #E5E7EB)" }}
            >
              {missionLens.current_mission}
            </p>
          ) : (
            <p
              className="text-sm"
              style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
            >
              Nenhuma missao ativa
            </p>
          )}
          {missionLens?.phase && (
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--kr-text-secondary, #D1D5DB)" }}
            >
              Fase: {missionLens.phase}
            </p>
          )}
          {missionLens?.status && (
            <span
              className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                background:
                  missionLens.status === "on_mission"
                    ? "color-mix(in oklab, var(--kr-color-mission, #22C55E) 12%, transparent)"
                    : "color-mix(in oklab, var(--kr-color-risk, #EF4444) 10%, transparent)",
                color:
                  missionLens.status === "on_mission"
                    ? "var(--kr-color-mission, #22C55E)"
                    : "var(--kr-color-risk, #EF4444)",
                border: `1px solid ${
                  missionLens.status === "on_mission"
                    ? "var(--kr-color-mission, #22C55E)"
                    : "var(--kr-color-risk, #EF4444)"
                }`,
              }}
            >
              {missionLens.status === "on_mission" ? "EM MISSAO" : "FORA DE MISSAO"}
            </span>
          )}
          {/* Focus state + drift risk */}
          {(lens.context?.focus_state || lens.context?.drift_risk) && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {lens.context?.focus_state && (
                <span className="text-[10px] kratos-mono rounded-full px-2 py-0.5"
                  style={{ background: "var(--kr-surface-2, rgba(255,255,255,0.03))", color: "var(--kr-text-muted, #9CA3AF)", border: "1px solid var(--kr-glass-strong-border)" }}>
                  {lens.context.focus_state}
                </span>
              )}
              {lens.context?.drift_risk && lens.context.drift_risk !== "low" && (
                <span className="text-[10px] kratos-mono rounded-full px-2 py-0.5 font-medium"
                  style={{
                    background: lens.context.drift_risk === "high" ? "color-mix(in oklab, var(--kr-color-risk, #EF4444) 12%, transparent)" : "color-mix(in oklab, var(--kr-color-warn, #F59E0B) 12%, transparent)",
                    color: lens.context.drift_risk === "high" ? "var(--kr-color-risk, #EF4444)" : "var(--kr-color-warn, #F59E0B)",
                    border: `1px solid ${lens.context.drift_risk === "high" ? "color-mix(in oklab, var(--kr-color-risk, #EF4444) 30%, transparent)" : "color-mix(in oklab, var(--kr-color-warn, #F59E0B) 30%, transparent)"}`,
                  }}>
                  risco {lens.context.drift_risk === "high" ? "ALTO" : "MÉDIO"}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Next best action */}
      {nextBestAction && (
        <section>
          <h3
            className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
            style={{ color: "var(--kr-text-muted, #9CA3AF)", fontFamily: "var(--kr-font-mono, monospace)" }}
          >
            Proxima Acao
          </h3>
          <div
            className="rounded-lg p-3"
            style={{
              background: "var(--kr-surface-2, rgba(255,255,255,0.03))",
              border: "1px solid var(--kr-glass-strong-border, rgba(255,255,255,0.08))",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--kr-text-primary, #E5E7EB)" }}
            >
              {nextBestAction.action ?? "--"}
            </p>
            {nextBestAction.rationale && (
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--kr-text-secondary, #D1D5DB)" }}
              >
                {nextBestAction.rationale}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Mentor signals */}
      <section>
        <h3
          className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
          style={{ color: "var(--kr-text-muted, #9CA3AF)", fontFamily: "var(--kr-font-mono, monospace)" }}
        >
          Sinais do Mentor
        </h3>
        {mentorSignals.length === 0 ? (
          <p
            className="text-xs"
            style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
          >
            Nenhum sinal ativo.
          </p>
        ) : (
          <div className="space-y-2">
            {mentorSignals.map((signal, i) => {
              const toneColor = signalToneColor(signal.tone);
              return (
                <div
                  key={i}
                  className="rounded-lg p-2.5 flex items-start gap-2"
                  style={{
                    background: `color-mix(in oklab, ${toneColor} 6%, transparent)`,
                    border: `1px solid color-mix(in oklab, ${toneColor} 18%, transparent)`,
                  }}
                >
                  <StatusDot
                    severity={signal.tone === "critical" || signal.tone === "warning" ? "warn" : "info"}
                    size="xs"
                  />
                  <div className="min-w-0">
                    <p
                      className="text-xs"
                      style={{ color: "var(--kr-text-primary, #E5E7EB)" }}
                    >
                      {signal.message ?? "--"}
                    </p>
                    {signal.source && (
                      <span
                        className="text-[10px] mt-0.5"
                        style={{ color: "var(--kr-text-muted, #9CA3AF)" }}
                      >
                        {signal.source}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section>
          <h3
            className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
            style={{ color: "var(--kr-text-muted, #9CA3AF)", fontFamily: "var(--kr-font-mono, monospace)" }}
          >
            Alertas ({alerts.length})
          </h3>
          <div className="space-y-1.5">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className="rounded-md px-2.5 py-1.5 text-xs"
                style={{
                  background: "color-mix(in oklab, var(--kr-color-risk, #EF4444) 8%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--kr-color-risk, #EF4444) 20%, transparent)",
                  color: "var(--kr-text-secondary, #D1D5DB)",
                }}
              >
                {JSON.stringify(alert)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function signalToneColor(tone?: string): string {
  switch (tone) {
    case "critical":
      return "var(--kr-color-risk, #EF4444)";
    case "warning":
      return "var(--kr-color-warn, #F59E0B)";
    case "info":
      return "var(--kr-color-info, #3B82F6)";
    default:
      return "var(--kr-text-muted, #9CA3AF)";
  }
}

/* --------------------------------------------------*\
 * deriveMissionStatus — maps checkpoint data to
 * CentralCastleMission status prop
\* --------------------------------------------------*/

function deriveMissionStatus(
  checkpoints: ReturnType<typeof useCheckpoints>["data"],
): "active" | "paused" | "completed" {
  if (!checkpoints || checkpoints.length === 0) return "paused";
  const hasInProgress = checkpoints.some((c) => c.status === "in_progress");
  if (hasInProgress) return "active";
  const hasPending = checkpoints.some((c) => c.status === "pending");
  if (hasPending) return "paused";
  const allComplete = checkpoints.every((c) => c.status === "completed");
  if (allComplete) return "completed";
  return "paused";
}
