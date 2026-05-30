import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandDetailStage } from "./shared/IslandDetailStage";
import { IslandGlassCard } from "./shared/IslandGlassCard";
import { useIslandDock } from "./shared/IslandDockContext";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { cn } from "@/lib/utils";
import { useOmnisStatus, useOmnisCrews, useOmnisJobs } from "@/hooks/useOmnis";
import { useMissions } from "@/hooks/useMissions";
import type { OmnisCrew, OmnisJob } from "../../../../api-contract/omnis.schema";
import { HealthScoreCard } from "@/components/kratos/omnis/HealthScoreCard";
import { MissionRunsCard } from "@/components/kratos/omnis/MissionRunsCard";
import { MissionGraphCard } from "@/components/kratos/omnis/MissionGraphCard";
import { GuardrailAlertCard } from "@/components/kratos/omnis/GuardrailAlertCard";
import { CostSummaryCard } from "@/components/kratos/omnis/CostSummaryCard";
import { ModelCostDashboard } from "@/components/kratos/omnis/ModelCostDashboard";
import { MissionEventLogCard } from "@/components/kratos/omnis/MissionEventLogCard";
import { OmnisExecutionCockpit } from "@/components/kratos/omnis/OmnisExecutionCockpit";
import { AppFactoryPanel } from "@/components/kratos/omnis/AppFactoryPanel";
import { MissionCommandPanel } from "@/components/kratos/omnis/MissionCommandPanel";
import {
  Cpu,
  Workflow,
  Play,
  CheckCircle2,
  Clock,
  Circle,
  Activity,
  FlaskConical,
  Sparkles,
  Target,
  ShieldAlert,
  XCircle,
} from "lucide-react";

// ── Cores por crew ────────────────────────────────────────────────────────────

const CREW_COLORS = [
  "var(--kr-success)",
  "var(--kr-accent-purple)",
  "var(--kr-sky)",
  "var(--kr-accent-cyan)",
  "var(--kr-island-agencia)",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Passos de fluxo — hardcoded (badge MOCK no header) ───────────────────────

const FLOW_STEPS = [
  { label: "Coleta", done: true },
  { label: "Processamento", done: true },
  { label: "Decisão", done: true },
  { label: "Execução", done: false, active: true },
  { label: "Resultado", done: false },
];

// ── Badge MOCK ────────────────────────────────────────────────────────────────

function MockBadge() {
  return (
    <span
      className="inline-flex items-center rounded px-1 py-px text-[7px] font-bold uppercase tracking-wider"
      style={{
        background: "rgba(251,191,36,0.15)",
        color: "#FBBF24",
        border: "1px solid rgba(251,191,36,0.3)",
      }}
    >
      MOCK
    </span>
  );
}

// ── Aurora Card ───────────────────────────────────────────────────────────────

function AuroraCard() {
  return (
    <div
      className="rounded-2xl p-4 mb-5"
      style={{
        background: "rgba(124,58,237,0.10)",
        border: "1px solid rgba(139,92,246,0.22)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center mt-0.5"
          style={{ background: "rgba(139,92,246,0.18)" }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: "#A78BFA" }} aria-hidden />
        </div>
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1"
            style={{ color: "#A78BFA" }}
          >
            Aurora · Modo Visual Seguro
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Tigrão, aqui é onde intenção vira execução. Estamos no modo visual seguro — nenhuma
            automação real está ativa. Defina o contrato KRATOS ↔ OMNIS antes de ligar o motor.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Summary Cards — 4 instrumentos do laboratório ────────────────────────────

interface SummaryCard {
  label: string;
  value: string;
  icon: React.ElementType;
}

function OmnisSummaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {cards.map((card) => (
        <IslandGlassCard key={card.label} padding="md" className="flex flex-col items-center text-center">
          <card.icon
            className="h-5 w-5 mb-2"
            style={{ color: "rgba(167,139,250,0.8)" }}
            aria-hidden
          />
          <div className="flex items-center gap-1.5 mb-1">
            <p
              className="kratos-num text-[22px] leading-none"
              style={{ color: "var(--kratos-text-primary)" }}
            >
              {card.value}
            </p>
            <MockBadge />
          </div>
          <p
            className="text-[10px] uppercase tracking-[0.1em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {card.label}
          </p>
        </IslandGlassCard>
      ))}
    </div>
  );
}

// ── Próxima Ação — card dominante ─────────────────────────────────────────────

function ProximaAcaoCard() {
  return (
    <IslandGlassCard
      padding="md"
      accentLine="linear-gradient(90deg, #7C3AED, #8B5CF6)"
      className="pt-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Target className="h-4 w-4" style={{ color: "#A78BFA" }} aria-hidden />
        <h3
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "#A78BFA" }}
        >
          Próxima Ação
        </h3>
      </div>
      <p
        className="text-[15px] font-semibold leading-snug mb-2"
        style={{ color: "var(--kratos-text-primary)" }}
      >
        Definir contrato KRATOS ↔ OMNIS antes de permitir execução real.
      </p>
      <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
        Especificar quais ações o OMNIS pode executar autonomamente, quais precisam de aprovação
        explícita e quais são sempre bloqueadas.
      </p>
    </IslandGlassCard>
  );
}

// ── Guardrail — não fazer agora ───────────────────────────────────────────────

const GUARDRAIL_ITEMS = [
  "Executar automação real",
  "Apagar arquivo ou dado",
  "Publicar conteúdo",
  "Commitar no repositório",
  "Conectar API sensível",
  "Mexer no backend",
];

function GuardrailCard() {
  return (
    <IslandGlassCard
      padding="md"
      accentLine="linear-gradient(90deg, rgba(245,158,11,0.8), rgba(251,191,36,0.5))"
      className="pt-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="h-4 w-4" style={{ color: "#F59E0B" }} aria-hidden />
        <h3
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "#F59E0B" }}
        >
          Não Fazer Agora
        </h3>
      </div>
      <div className="space-y-1.5">
        {GUARDRAIL_ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <XCircle className="h-3 w-3 flex-shrink-0" style={{ color: "#EF4444" }} aria-hidden />
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </IslandGlassCard>
  );
}

// ── Jobs Recentes ─────────────────────────────────────────────────────────────

function AutomationBoard({ jobs }: { jobs: OmnisJob[] }) {
  return (
    <IslandGlassCard padding="md">
      <h3
        className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3"
        style={{ color: "rgba(255,255,255,0.40)" }}
      >
        Jobs Recentes
      </h3>
      {jobs.length === 0 ? (
        <EmptyState title="Sem jobs" description="Nenhum job registrado." compact />
      ) : (
        <div className="space-y-1.5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-xl px-3 py-2"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span
                className="text-[12px] kratos-mono truncate max-w-[140px]"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {job.tipo}
              </span>
              <span className="text-[10px] kratos-mono uppercase tracking-[0.08em] flex-shrink-0">
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
    </IslandGlassCard>
  );
}

// ── Crews OMNIS ───────────────────────────────────────────────────────────────

function ActiveAgentsList({ crews }: { crews: OmnisCrew[] }) {
  return (
    <IslandGlassCard padding="md">
      <h3
        className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3"
        style={{ color: "rgba(255,255,255,0.40)" }}
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
                  className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `color-mix(in srgb, ${color} 12%, transparent)`,
                    border: `1.5px solid ${color}`,
                    boxShadow: `0 0 8px color-mix(in srgb, ${color} 20%, transparent)`,
                  }}
                >
                  <Activity className="h-3.5 w-3.5" style={{ color }} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[12px] font-medium truncate kratos-mono"
                    style={{ color: "var(--kratos-text-primary)" }}
                  >
                    {crew.nome}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
                    {crew.descricao ??
                      `${crew.jobsConcluidos} jobs · ${Math.round(crew.taxaSucesso * 100)}% sucesso`}
                  </p>
                </div>
                <div
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ background: crewStatusColor(crew.status) }}
                  aria-label={crew.status}
                />
              </div>
            );
          })}
        </div>
      )}
    </IslandGlassCard>
  );
}

// ── Últimas Execuções ─────────────────────────────────────────────────────────

function RecentExecutionsList({ jobs }: { jobs: OmnisJob[] }) {
  return (
    <IslandGlassCard padding="md">
      <h3
        className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3"
        style={{ color: "rgba(255,255,255,0.40)" }}
      >
        Últimas Execuções
      </h3>
      {jobs.length === 0 ? (
        <EmptyState title="Sem execuções" description="Nenhuma execução registrada." compact />
      ) : (
        <div className="space-y-1.5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {job.status === "done" ? (
                <CheckCircle2
                  className="h-3.5 w-3.5 flex-shrink-0"
                  style={{ color: "var(--kr-success)" }}
                  aria-label="Concluído"
                />
              ) : (
                <Circle
                  className="h-3.5 w-3.5 flex-shrink-0"
                  style={{
                    color:
                      job.status === "failed" ? "var(--kratos-critical)" : "var(--kr-warning)",
                  }}
                  aria-label={job.status}
                />
              )}
              <span
                className="flex-1 text-[12px] kratos-mono truncate"
                style={{ color: "var(--kratos-text-primary)" }}
              >
                {job.tipo}
              </span>
              <span
                className="kratos-mono text-[10px] flex-shrink-0 flex items-center gap-0.5"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                <Clock className="h-3 w-3" aria-hidden />
                {relativeTimeShort(job.criadoEm)}
              </span>
            </div>
          ))}
        </div>
      )}
    </IslandGlassCard>
  );
}

// ── Fluxo em Tempo Real — hardcoded + MOCK ────────────────────────────────────

function RealtimeFlowStepper() {
  return (
    <IslandGlassCard padding="md">
      <div className="flex items-center gap-2 mb-4">
        <h3
          className="text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "rgba(255,255,255,0.40)" }}
        >
          Fluxo em Tempo Real
        </h3>
        <MockBadge />
      </div>
      <div className="flex items-start">
        {FLOW_STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                  step.active && "kratos-pulse",
                )}
                style={{
                  background: step.done
                    ? "var(--kr-island-omnis)"
                    : step.active
                      ? "rgba(124,58,237,0.35)"
                      : "rgba(255,255,255,0.06)",
                  border: step.active
                    ? "2px solid rgba(167,139,250,0.8)"
                    : step.done
                      ? "2px solid var(--kr-island-omnis)"
                      : "2px solid rgba(255,255,255,0.12)",
                }}
              >
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4" style={{ color: "white" }} aria-hidden />
                ) : (
                  <span
                    className="text-[11px] font-bold"
                    style={{
                      color: step.active ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className="text-[9px] uppercase tracking-[0.06em] text-center leading-tight max-w-[52px]"
                style={{
                  color: step.done
                    ? "rgba(167,139,250,0.75)"
                    : step.active
                      ? "rgba(167,139,250,0.95)"
                      : "rgba(255,255,255,0.25)",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div
                className="flex-1 h-[1.5px] mx-1 mb-5"
                style={{
                  background: step.done
                    ? "rgba(124,58,237,0.5)"
                    : "rgba(255,255,255,0.08)",
                }}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </IslandGlassCard>
  );
}

// ── Export principal ──────────────────────────────────────────────────────────

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
  const navigate = useNavigate();
  const { data: omnis, isLoading: omLoading, isError: omError } = useOmnisStatus();
  const { data: crews, isLoading: crLoading } = useOmnisCrews();
  const { data: jobs, isLoading: jbLoading } = useOmnisJobs(5);
  const { missions } = useMissions(10);
  const { setData } = useIslandDock();

  // Auto-select first running mission for the event log (read-only, boundary preserved)
  const activeMissionId: string | null =
    missions.find((m) => m.status === "running")?.mission_id ??
    missions[0]?.mission_id ??
    null;

  const anyLoading = propLoading || omLoading || crLoading || jbLoading;

  useEffect(() => {
    if (!omLoading && omnis != null) {
      setData({
        islandId: "omnis",
        label: "OMNIS",
        value: `${omnis.workflows_registered ?? "—"} workflows · ${omnis.test_count?.toLocaleString("pt-BR") ?? "—"} testes`,
        progress:
          omnis.test_count != null
            ? Math.min(100, Math.round((omnis.test_count / 10000) * 100))
            : 72,
        progressColor: "var(--kr-island-omnis)",
        quickActions: [{ label: "Ver Sistema" }],
      });
    }
  }, [omLoading, omnis, setData]);

  const summaryCards: SummaryCard[] = [
    {
      label: "Testes OMNIS",
      value:
        omnis?.test_count != null
          ? omnis.test_count.toLocaleString("pt-BR")
          : omLoading
            ? "…"
            : "Aguardando",
      icon: FlaskConical,
    },
    {
      label: "Workflows",
      value:
        omnis?.workflows_registered != null
          ? String(omnis.workflows_registered)
          : omLoading
            ? "…"
            : "Visual",
      icon: Cpu,
    },
    {
      label: "Docs Akasha",
      value:
        omnis?.memoria?.totalDocs != null
          ? omnis.memoria.totalDocs.toLocaleString("pt-BR")
          : omLoading
            ? "…"
            : "Aguardando",
      icon: Workflow,
    },
    {
      label: "Último Run",
      value: omnis?.last_run_status ?? (omLoading ? "…" : "Pendente"),
      icon: Play,
    },
  ];

  const crewList = crews ?? [];
  const jobList = jobs ?? [];

  if (anyLoading) {
    return (
      <IslandDetailStage islandId="omnis">
        <LoadingState lines={6} />
      </IslandDetailStage>
    );
  }

  if (propError || omError) {
    return (
      <IslandDetailStage islandId="omnis">
        <ErrorState
          title="Erro ao carregar"
          description={propError ?? "Falha ao consultar OMNIS."}
          variant="external_unavailable"
        />
      </IslandDetailStage>
    );
  }

  if (isEmpty) {
    return (
      <IslandDetailStage islandId="omnis">
        <EmptyState title="Nada por aqui" description="Nenhum dado disponível neste momento." />
      </IslandDetailStage>
    );
  }

  return (
    <IslandDetailStage islandId="omnis">
      {/* 1. Localização: onde estou + voltar */}
      <IslandPageHeader
        title="OMNIS LAB"
        subtitle="Centro de IA, Automações e Inteligência de Execução"
        theme="omnis"
        onBack={() => navigate({ to: "/" })}
      />

      {/* 2. O que Aurora diz: modo seguro */}
      <AuroraCard />

      {/* 3. Estado visual do sistema: summary cards */}
      <OmnisSummaryCards cards={summaryCards} />

      {/* 3b. Health Score + Mission Runs — dados reais do OMNIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <HealthScoreCard />
        <MissionRunsCard />
      </div>

      {/* 3c. Mission Graph — estado das missões ativas */}
      <div className="mb-4">
        <MissionGraphCard />
      </div>

      {/* 3d. Guardrails + Custo (W7+W8) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GuardrailAlertCard />
        <CostSummaryCard />
      </div>

      {/* 3e-extra. Cost Dashboard — breakdown Ollama-First (W10-B7) */}
      <div className="mb-4">
        <ModelCostDashboard />
      </div>

      {/* 3e. Mission Event Log — drill-down read-only (W7) */}
      <div className="mb-4">
        <MissionEventLogCard missionId={activeMissionId} limit={12} />
      </div>

      {/* 3f. Execution Cockpit — W15 Live Monitor */}
      <div className="mb-4">
        <OmnisExecutionCockpit />
      </div>

      {/* 3f2. Mission Command Panel — W19 Dry-Run Write Bridge */}
      <div className="mb-4">
        <MissionCommandPanel />
      </div>

      {/* 3g. App Factory — W16 template catalog */}
      <div className="mb-4">
        <AppFactoryPanel />
      </div>

      {/* 4. Próxima ação (dominante) + guardrail (restrições) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ProximaAcaoCard />
        <GuardrailCard />
      </div>

      {/* 5. Jobs + Crews — dados reais da API */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <AutomationBoard jobs={jobList} />
        <ActiveAgentsList crews={crewList} />
      </div>

      {/* 6. Execuções + Fluxo */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <RecentExecutionsList jobs={jobList} />
        </div>
        <div className="lg:col-span-3">
          <RealtimeFlowStepper />
        </div>
      </div>
    </IslandDetailStage>
  );
}
