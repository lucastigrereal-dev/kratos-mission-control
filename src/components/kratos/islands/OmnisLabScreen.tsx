import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { cn } from "@/lib/utils";
import {
  Cpu,
  Zap,
  Workflow,
  Play,
  CheckCircle2,
  Clock,
  Circle,
  Activity,
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────────────────────

const summaryCards = [
  { label: "Agentes IA", value: "5", icon: Cpu },
  { label: "Automações", value: "12", icon: Zap },
  { label: "Workflows", value: "3", icon: Workflow },
  { label: "Execuções Hoje", value: "47", icon: Play },
];

const automations = [
  { name: "Gerar relatório diário", status: "idle" as const },
  { name: "Backup do banco", status: "running" as const },
  { name: "Limpar cache", status: "done" as const },
];

const agents = [
  { name: "Omnis Core", role: "Orquestrador", color: "#4ADE80" },
  { name: "Aurora AI", role: "Mentora", color: "#A855F7" },
  { name: "Chrono Bot", role: "Documentação", color: "#3B82F6" },
  { name: "Insight Bot", role: "Análises", color: "#06B6D4" },
  { name: "Builder Bot", role: "Desenvolvimento", color: "#F97316" },
];

const executions = [
  { name: "Pipeline Diário", time: "08:32", status: "success" as const },
  { name: "Análise de Sentimento", time: "07:15", status: "success" as const },
  { name: "Sync Knowledge Base", time: "06:00", status: "success" as const },
  { name: "Health Check", time: "05:45", status: "warning" as const },
];

const flowSteps = [
  { label: "Coleta", done: true },
  { label: "Processamento", done: true },
  { label: "Decisão", done: true },
  { label: "Execução", done: false, active: true },
  { label: "Resultado", done: false },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function HolographicCore() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex h-40 w-40 items-center justify-center"
        style={{ perspective: "600px" }}
      >
        {/* Outer glow */}
        <div
          className="absolute -inset-8 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Ring container */}
        <div
          className="relative flex h-full w-full items-center justify-center rounded-full"
          style={{
            border: "2px solid rgba(124, 58, 237, 0.3)",
            background: "rgba(15, 15, 20, 0.6)",
            boxShadow: "0 0 60px rgba(139, 92, 246, 0.4)",
          }}
        >
          {/* SVG Rings — spinning */}
          <svg
            className="absolute inset-0 h-full w-full"
            style={{ animation: "spin 10s linear infinite" }}
            viewBox="0 0 160 160"
          >
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#hcg1)"
              strokeWidth="2"
              strokeDasharray="20 40"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="hcg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <svg
            className="absolute inset-3 h-[calc(100%-24px)] w-[calc(100%-24px)]"
            style={{ animation: "spin 7s linear infinite reverse" }}
            viewBox="0 0 136 136"
          >
            <circle
              cx="68"
              cy="68"
              r="60"
              fill="none"
              stroke="url(#hcg2)"
              strokeWidth="3"
              strokeDasharray="60 30"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="hcg2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>

          {/* CSS 3D Cube */}
          <div
            className="relative h-12 w-12"
            style={{ transformStyle: "preserve-3d" }}
          >
            {[0, 90, 180, 270].map((deg, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  border: "1px solid rgba(6, 182, 212, 0.6)",
                  background: "rgba(6, 182, 212, 0.1)",
                  boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
                  transform:
                    i < 2
                      ? `rotateY(${deg}deg) translateZ(24px)`
                      : `rotateX(${deg - 180}deg) translateZ(24px)`,
                }}
              />
            ))}
            <div
              className="absolute inset-0"
              style={{
                border: "1px solid rgba(6, 182, 212, 0.6)",
                background: "rgba(6, 182, 212, 0.1)",
                transform: "rotateX(90deg) translateZ(24px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                border: "1px solid rgba(6, 182, 212, 0.6)",
                background: "rgba(6, 182, 212, 0.1)",
                transform: "rotateX(-90deg) translateZ(24px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        className="relative z-10 -mt-4 rounded-lg px-6 py-1.5"
        style={{
          background: "rgba(15, 15, 20, 0.9)",
          border: "1px solid rgba(124, 58, 237, 0.4)",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "#06B6D4" }}
        >
          OMNIS Core
        </span>
      </div>
    </div>
  );
}

function OmnisSummaryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {summaryCards.map((card) => (
        <GlassPanel key={card.label} padding="md" className="text-center">
          <card.icon
            className="h-5 w-5 mx-auto mb-2"
            style={{ color: "#A78BFA" }}
            aria-hidden
          />
          <p className="kratos-num text-xl">{card.value}</p>
          <p className="text-[10px] uppercase tracking-[0.1em] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
            {card.label}
          </p>
        </GlassPanel>
      ))}
    </div>
  );
}

function AutomationBoard() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Automações Rápidas
      </h3>
      <div className="space-y-2">
        {automations.map((a) => (
          <div
            key={a.name}
            className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors kratos-card-hover"
            style={{ background: "var(--kratos-surface-2)" }}
          >
            <span className="text-[13px]" style={{ color: "var(--kratos-text-primary)" }}>
              {a.name}
            </span>
            <span className="text-[10px] kratos-mono uppercase tracking-[0.1em]">
              {a.status === "running" && (
                <span style={{ color: "#06B6D4" }}>Executando</span>
              )}
              {a.status === "idle" && (
                <span style={{ color: "var(--kratos-text-muted)" }}>Parado</span>
              )}
              {a.status === "done" && (
                <span style={{ color: "#4ADE80" }}>Concluído</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function ActiveAgentsList() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Agentes Ativos
      </h3>
      <div className="space-y-3">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center gap-3">
            {/* Avatar with colored ring */}
            <div
              className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center"
              style={{
                background: `${agent.color}20`,
                border: `2px solid ${agent.color}`,
                boxShadow: `0 0 10px ${agent.color}40`,
              }}
            >
              <Activity className="h-4 w-4" style={{ color: agent.color }} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium truncate" style={{ color: "var(--kratos-text-primary)" }}>
                {agent.name}
              </p>
              <p className="text-[11px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
                {agent.role}
              </p>
            </div>
            {/* Status dot */}
            <div
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ background: agent.color }}
              aria-label="Online"
            />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function RecentExecutionsList() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Últimas Execuções
      </h3>
      <div className="space-y-2">
        {executions.map((ex) => (
          <div
            key={ex.name}
            className="flex items-center gap-3 rounded-lg px-3 py-2"
            style={{ background: "var(--kratos-surface-2)" }}
          >
            {ex.status === "success" ? (
              <CheckCircle2
                className="h-4 w-4 flex-shrink-0"
                style={{ color: "#4ADE80" }}
                aria-label="Sucesso"
              />
            ) : (
              <Circle
                className="h-4 w-4 flex-shrink-0"
                style={{ color: "#F59E0B" }}
                aria-label="Aviso"
              />
            )}
            <span className="flex-1 text-[13px]" style={{ color: "var(--kratos-text-primary)" }}>
              {ex.name}
            </span>
            <span
              className="kratos-mono text-[11px] flex-shrink-0"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              <Clock className="h-3 w-3 inline mr-1" aria-hidden />
              {ex.time}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function RealtimeFlowStepper() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-4"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Fluxo em Tempo Real
      </h3>
      <div className="flex items-center justify-between">
        {flowSteps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-0 flex-1">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                  step.active && "kratos-pulse",
                )}
                style={{
                  background: step.done
                    ? "#7C3AED"
                    : step.active
                      ? "rgba(124, 58, 237, 0.4)"
                      : "var(--kratos-surface-4)",
                  border: step.active
                    ? "2px solid #A78BFA"
                    : step.done
                      ? "2px solid #7C3AED"
                      : "2px solid var(--kratos-border)",
                }}
              >
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4" style={{ color: "#fff" }} aria-hidden />
                ) : (
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: step.active ? "#A78BFA" : "var(--kratos-text-muted)" }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] uppercase tracking-[0.08em] text-center"
                style={{
                  color: step.done ? "#C4B5FD" : step.active ? "#A78BFA" : "var(--kratos-text-muted)",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < flowSteps.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 mb-5" style={{ background: step.done ? "#7C3AED" : "var(--kratos-surface-4)" }} aria-hidden />
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

export function OmnisLabScreen() {
  return (
    <IslandPageFrame theme="omnis">
      <IslandPageHeader
        title="OMNIS LAB"
        subtitle="Centro de IA, Automações e Inteligência de Execução"
        theme="omnis"
      />

      {/* Holographic Core — centered hero */}
      <div className="flex justify-center mb-10">
        <HolographicCore />
      </div>

      {/* Summary cards */}
      <OmnisSummaryCards />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <AutomationBoard />
        <ActiveAgentsList />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
        <div className="lg:col-span-2">
          <RecentExecutionsList />
        </div>
        <div className="lg:col-span-3">
          <RealtimeFlowStepper />
        </div>
      </div>
    </IslandPageFrame>
  );
}
