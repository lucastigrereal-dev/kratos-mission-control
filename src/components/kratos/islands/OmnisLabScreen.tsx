import { useEffect } from "react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { useIslandDock } from "./shared/IslandDockContext";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { cn } from "@/lib/utils";
import { useOmnisStatus, useOmnisCrews, useOmnisJobs } from "@/hooks/useOmnis";
import type { OmnisCrew, OmnisJob } from "../../../../api-contract/omnis.schema";
import {
  Cpu,
  Zap,
  Workflow,
  Play,
  CheckCircle2,
  Clock,
  Circle,
  Activity,
  FlaskConical,
} from "lucide-react";

// ── Color palette for crews ─────────────────────────────────────────────────

const CREW_COLORS = [
  "var(--kr-success)",
  "var(--kr-accent-purple)",
  "var(--kr-sky)",
  "var(--kr-accent-cyan)",
  "var(--kr-island-agencia)",
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function jobStatusLabel(status: OmnisJob["status"]): string {
  const MAP: Record<OmnisJob["status"], string> = {
    queued: "Na fila",
    running: "Executando",
    done: "Concluído",
    failed: "Falhou",
    needs_review: "Revisão",
  };
  return MAP[status] ?? status;
}

function crewStatusColor(status: OmnisCrew["status"]): string {
  if (status === "running") return "var(--kr-accent-cyan)";
  if (status === "failed") return "var(--kratos-critical)";
  return "var(--kratos-text-muted)";
}

function relativeTimeShort(iso: string): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  return `${Math.floor(hr / 24)}d`;
}

// ── Static flow steps — no real data equivalent ─────────────────────────────

const FLOW_STEPS = [
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
              "radial-gradient(circle, color-mix(in oklab, var(--kr-aurora, #8B5CF6) 25%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Ring container */}
        <div
          className="relative flex h-full w-full items-center justify-center rounded-full"
          style={{
            border: "2px solid color-mix(in oklab, var(--kr-island-omnis, #7C3AED) 30%, transparent)",
            background: "color-mix(in oklab, var(--kr-surface-abyss, #020617) 60%, transparent)",
            boxShadow: "0 0 60px color-mix(in oklab, var(--kr-aurora, #8B5CF6) 40%, transparent)",
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
                <stop offset="0%" stopColor="var(--kr-aurora)" />
                <stop offset="100%" stopColor="var(--kr-accent-cyan)" />
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
                <stop offset="0%" stopColor="var(--kr-accent-cyan-bright)" />
                <stop offset="100%" stopColor="var(--kr-sky)" />
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
                  border: "1px solid color-mix(in oklab, var(--kr-accent-cyan, #06B6D4) 60%, transparent)",
                  background: "color-mix(in oklab, var(--kr-accent-cyan, #06B6D4) 10%, transparent)",
                  boxShadow: "0 0 15px color-mix(in oklab, var(--kr-accent-cyan, #06B6D4) 50%, transparent)",
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
                border: "1px solid color-mix(in oklab, var(--kr-accent-cyan, #06B6D4) 60%, transparent)",
                background: "color-mix(in oklab, var(--kr-accent-cyan, #06B6D4) 10%, transparent)",
                transform: "rotateX(90deg) translateZ(24px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                border: "1px solid color-mix(in oklab, var(--kr-accent-cyan, #06B6D4) 60%, transparent)",
                background: "color-mix(in oklab, var(--kr-accent-cyan, #06B6D4) 10%, transparent)",
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
          background: "color-mix(in oklab, var(--kr-surface-abyss, #020617) 90%, transparent)",
          border: "1px solid color-mix(in oklab, var(--kr-island-omnis, #7C3AED) 40%, transparent)",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--kr-accent-cyan)" }}
        >
          OMNIS Core
        </span>
      </div>
    </div>
  );
}

interface SummaryCard {
  label: string;
  value: string;
  icon: React.ElementType;
}

function OmnisSummaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <GlassPanel key={card.label} padding="md" className="text-center">
          <card.icon
            className="h-5 w-5 mx-auto mb-2"
            style={{ color: "var(--kr-accent-purple-lighter)" }}
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

function AutomationBoard({ jobs }: { jobs: OmnisJob[] }) {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Jobs Recentes
      </h3>
      {jobs.length === 0 ? (
        <EmptyState title="Sem jobs" description="Nenhum job registrado." compact />
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors kratos-card-hover"
              style={{ background: "var(--kratos-surface-2)" }}
            >
              <span className="text-[13px] kratos-mono truncate max-w-[140px]" style={{ color: "var(--kratos-text-primary)" }}>
                {job.tipo}
              </span>
              <span className="text-[10px] kratos-mono uppercase tracking-[0.1em] flex-shrink-0">
                {job.status === "running" && (
                  <span style={{ color: "var(--kr-accent-cyan)" }}>{jobStatusLabel(job.status)}</span>
                )}
                {job.status === "done" && (
                  <span style={{ color: "var(--kr-success)" }}>{jobStatusLabel(job.status)}</span>
                )}
                {job.status === "failed" && (
                  <span style={{ color: "var(--kratos-critical)" }}>{jobStatusLabel(job.status)}</span>
                )}
                {(job.status === "queued" || job.status === "needs_review") && (
                  <span style={{ color: "var(--kratos-text-muted)" }}>{jobStatusLabel(job.status)}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassPanel>
  );
}

function ActiveAgentsList({ crews }: { crews: OmnisCrew[] }) {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Crews OMNIS
      </h3>
      {crews.length === 0 ? (
        <EmptyState title="Sem crews" description="Nenhuma crew registrada." compact />
      ) : (
        <div className="space-y-3">
          {crews.map((crew, i) => {
            const color = CREW_COLORS[i % CREW_COLORS.length];
            return (
              <div key={crew.nome} className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center"
                  style={{
                    background: `color-mix(in srgb, ${color} 12%, transparent)`,
                    border: `2px solid ${color}`,
                    boxShadow: `0 0 10px color-mix(in srgb, ${color} 25%, transparent)`,
                  }}
                >
                  <Activity className="h-4 w-4" style={{ color }} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate kratos-mono" style={{ color: "var(--kratos-text-primary)" }}>
                    {crew.nome}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
                    {crew.descricao ?? `${crew.jobsConcluidos} jobs · ${Math.round(crew.taxaSucesso * 100)}% sucesso`}
                  </p>
                </div>
                <div
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ background: crewStatusColor(crew.status) }}
                  aria-label={crew.status}
                />
              </div>
            );
          })}
        </div>
      )}
    </GlassPanel>
  );
}

function RecentExecutionsList({ jobs }: { jobs: OmnisJob[] }) {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Últimas Execuções
      </h3>
      {jobs.length === 0 ? (
        <EmptyState title="Sem execuções" description="Nenhuma execução registrada." compact />
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2"
              style={{ background: "var(--kratos-surface-2)" }}
            >
              {job.status === "done" ? (
                <CheckCircle2
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "var(--kr-success)" }}
                  aria-label="Concluído"
                />
              ) : (
                <Circle
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: job.status === "failed" ? "var(--kratos-critical)" : "var(--kr-warning)" }}
                  aria-label={job.status}
                />
              )}
              <span className="flex-1 text-[13px] kratos-mono truncate" style={{ color: "var(--kratos-text-primary)" }}>
                {job.tipo}
              </span>
              <span
                className="kratos-mono text-[11px] flex-shrink-0"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                <Clock className="h-3 w-3 inline mr-1" aria-hidden />
                {relativeTimeShort(job.criadoEm)}
              </span>
            </div>
          ))}
        </div>
      )}
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
        {FLOW_STEPS.map((step, i) => (
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
                    ? "var(--kr-island-omnis)"
                    : step.active
                      ? "color-mix(in srgb, var(--kr-island-omnis) 40%, transparent)"
                      : "var(--kratos-surface-4)",
                  border: step.active
                    ? "2px solid var(--kr-accent-purple-lighter)"
                    : step.done
                      ? "2px solid var(--kr-island-omnis)"
                      : "2px solid var(--kratos-border)",
                }}
              >
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4" style={{ color: "var(--kr-text-on-primary, white)" }} aria-hidden />
                ) : (
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: step.active ? "var(--kr-accent-purple-lighter)" : "var(--kratos-text-muted)" }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] uppercase tracking-[0.08em] text-center"
                style={{
                  color: step.done ? "var(--kr-accent-purple-light)" : step.active ? "var(--kr-accent-purple-lighter)" : "var(--kratos-text-muted)",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < FLOW_STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 mb-5" style={{ background: step.done ? "var(--kr-island-omnis)" : "var(--kratos-surface-4)" }} aria-hidden />
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

interface OmnisLabScreenProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}

export function OmnisLabScreen({
  isLoading: propLoading = false,
  error: propError = null,
  isEmpty = false,
}: OmnisLabScreenProps) {
  const { data: omnis, isLoading: omLoading, isError: omError } = useOmnisStatus();
  const { data: crews, isLoading: crLoading } = useOmnisCrews();
  const { data: jobs, isLoading: jbLoading } = useOmnisJobs(5);
  const { setData } = useIslandDock();

  const anyLoading = propLoading || omLoading || crLoading || jbLoading;

  // Update dock badge with real data once loaded
  useEffect(() => {
    if (!omLoading && crews != null) {
      setData({
        islandId: "omnis",
        label: "Crews Ativas",
        value: `${crews.length} crews · ${omnis?.test_count?.toLocaleString("pt-BR") ?? "—"} testes`,
        progress: omnis?.test_count != null ? Math.min(100, Math.round((omnis.test_count / 10000) * 100)) : 72,
        progressColor: "var(--kr-island-omnis)",
        quickActions: [{ label: "Ver Sistema" }],
      });
    }
  }, [omLoading, crews, omnis, setData]);

  // Build real summary cards from live data
  const summaryCards: SummaryCard[] = [
    {
      label: "Testes OMNIS",
      value: omnis?.test_count != null ? omnis.test_count.toLocaleString("pt-BR") : omLoading ? "…" : "—",
      icon: FlaskConical,
    },
    {
      label: "Crews Ativas",
      value: crews != null ? String(crews.length) : crLoading ? "…" : "—",
      icon: Cpu,
    },
    {
      label: "Docs Akasha",
      value: omnis?.memoria?.totalDocs != null ? omnis.memoria.totalDocs.toLocaleString("pt-BR") : omLoading ? "…" : "—",
      icon: Workflow,
    },
    {
      label: "Jobs Recentes",
      value: jobs != null ? String(jobs.length) : jbLoading ? "…" : "—",
      icon: Play,
    },
  ];

  const crewList = crews ?? [];
  const jobList = jobs ?? [];

  return (
    <IslandPageFrame theme="omnis">
      {anyLoading ? (
        <LoadingState lines={6} />
      ) : propError || omError ? (
        <ErrorState
          title="Erro ao carregar"
          description={propError ?? "Falha ao consultar OMNIS."}
          variant="external_unavailable"
        />
      ) : isEmpty ? (
        <EmptyState
          title="Nada por aqui"
          description="Nenhum dado disponível neste momento."
        />
      ) : (
        <>
          <IslandPageHeader
            title="OMNIS LAB"
            subtitle="Centro de IA, Automações e Inteligência de Execução"
            theme="omnis"
          />

          {/* Holographic Core — centered hero */}
          <div className="flex justify-center mb-10">
            <HolographicCore />
          </div>

          {/* Summary cards — real data */}
          <OmnisSummaryCards cards={summaryCards} />

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <AutomationBoard jobs={jobList} />
            <ActiveAgentsList crews={crewList} />
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
            <div className="lg:col-span-2">
              <RecentExecutionsList jobs={jobList} />
            </div>
            <div className="lg:col-span-3">
              <RealtimeFlowStepper />
            </div>
          </div>
        </>
      )}
    </IslandPageFrame>
  );
}
