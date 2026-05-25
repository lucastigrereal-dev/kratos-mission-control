import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IslandPageHeader } from "./shared/IslandPageHeader";
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

// ── Cores para crews ─────────────────────────────────────────────────────────

const CREW_COLORS = [
  "var(--kr-success)",
  "var(--kr-accent-purple)",
  "var(--kr-sky)",
  "var(--kr-accent-cyan)",
  "var(--kr-island-agencia)",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

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

// ── Passos de fluxo — hardcoded ───────────────────────────────────────────────

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

// ── Stage: imagem da ilha como base ──────────────────────────────────────────
// Usa margin negativa para sangrar fora do padding do AppShell (24px top/bottom, 32px left/right)
// OMNIS Lab fica em ~x:24% y:23% da imagem completa (below the HUD zone at y<90px).
// Com zoom 260% e posição 28% 34%, o crop aterra na área da ilha, não no HUD "Bom dia Lucas".

function OmnisLabStage({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        margin: "-24px -32px",
        minHeight: "calc(100vh - 162px)",
      }}
    >
      {/* ── Layer 0: Crop da ilha OMNIS — zoom 260%, foco na área da ilha ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: "url('/assets/images/world-map-mockup.png')",
          backgroundSize: "260% auto",
          backgroundPosition: "28% 34%",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />

      {/* ── Layer 1: Overlay radial — centro claro, bordas escuras ── */}
      {/* Centro mais respirável (35%) para o mundo aparecer; bordas escuras (72%) para legibilidade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 35%, rgba(2,6,20,0.32) 0%, rgba(2,6,20,0.72) 100%)",
        }}
        aria-hidden
      />

      {/* ── Layer 2: Linha OMNIS no topo ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(124,58,237,0.6) 20%, rgba(139,92,246,0.6) 80%, transparent 95%)",
        }}
        aria-hidden
      />

      {/* ── Layer 3: Conteúdo (cards como hologramas) ── */}
      <div
        className="relative z-10 mx-auto max-w-[1100px]"
        style={{ padding: "28px 32px 56px" }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Cartão Aurora ─────────────────────────────────────────────────────────────

function AuroraCard() {
  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{
        background: "rgba(139,92,246,0.12)",
        border: "1px solid rgba(139,92,246,0.28)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(139,92,246,0.20)" }}
        >
          <Sparkles className="h-4 w-4" style={{ color: "#A78BFA" }} aria-hidden />
        </div>
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1"
            style={{ color: "#A78BFA" }}
          >
            Aurora · Modo Visual Seguro
          </p>
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.70)" }}
          >
            Tigrão, aqui é onde intenção vira execução. Por enquanto, estamos no modo visual
            seguro — nenhuma automação real está ativa. Defina o contrato KRATOS ↔ OMNIS antes
            de ligar o motor.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Cartão Próxima Ação ───────────────────────────────────────────────────────

function ProximaAcaoCard() {
  return (
    <GlassPanel padding="md">
      <div
        className="h-1 -mx-4 -mt-4 mb-4 rounded-t-2xl"
        style={{
          background: "linear-gradient(90deg, #7C3AED, #8B5CF6)",
        }}
        aria-hidden
      />
      <div className="flex items-center gap-2 mb-3">
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
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--kratos-text-secondary)" }}>
        Especificar quais ações o OMNIS pode executar autonomamente, quais precisam de
        aprovação explícita e quais são sempre bloqueadas.
      </p>
    </GlassPanel>
  );
}

// ── Cartão Guardrail ──────────────────────────────────────────────────────────

const GUARDRAIL_ITEMS = [
  "Executar automação real",
  "Apagar arquivo ou dado",
  "Publicar conteúdo",
  "Commitar no repositório",
  "Conectar API sensível",
];

function GuardrailCard() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="h-4 w-4" style={{ color: "#F59E0B" }} aria-hidden />
        <h3
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "#F59E0B" }}
        >
          Não Fazer Agora
        </h3>
      </div>
      <div className="space-y-2">
        {GUARDRAIL_ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <XCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#EF4444" }} aria-hidden />
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.65)" }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

// ── Cards de resumo com badge MOCK ────────────────────────────────────────────

interface SummaryCard {
  label: string;
  value: string;
  icon: React.ElementType;
}

function OmnisSummaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => (
        <GlassPanel key={card.label} padding="md" className="text-center">
          <card.icon
            className="h-5 w-5 mx-auto mb-2"
            style={{ color: "var(--kr-accent-purple-lighter)" }}
            aria-hidden
          />
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <p className="kratos-num text-xl">{card.value}</p>
            <MockBadge />
          </div>
          <p
            className="text-[10px] uppercase tracking-[0.1em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {card.label}
          </p>
        </GlassPanel>
      ))}
    </div>
  );
}

// ── Board de automações ───────────────────────────────────────────────────────

function AutomationBoard({ jobs }: { jobs: OmnisJob[] }) {
  return (
    <GlassPanel padding="md">
      <h3 className="kratos-eyebrow mb-3" style={{ color: "var(--kratos-text-secondary)" }}>
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
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span
                className="text-[13px] kratos-mono truncate max-w-[140px]"
                style={{ color: "var(--kratos-text-primary)" }}
              >
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

// ── Lista de crews ────────────────────────────────────────────────────────────

function ActiveAgentsList({ crews }: { crews: OmnisCrew[] }) {
  return (
    <GlassPanel padding="md">
      <h3 className="kratos-eyebrow mb-3" style={{ color: "var(--kratos-text-secondary)" }}>
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
                  <p
                    className="text-[13px] font-medium truncate kratos-mono"
                    style={{ color: "var(--kratos-text-primary)" }}
                  >
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

// ── Últimas execuções ─────────────────────────────────────────────────────────

function RecentExecutionsList({ jobs }: { jobs: OmnisJob[] }) {
  return (
    <GlassPanel padding="md">
      <h3 className="kratos-eyebrow mb-3" style={{ color: "var(--kratos-text-secondary)" }}>
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
              style={{ background: "rgba(255,255,255,0.04)" }}
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
                  style={{
                    color: job.status === "failed" ? "var(--kratos-critical)" : "var(--kr-warning)",
                  }}
                  aria-label={job.status}
                />
              )}
              <span
                className="flex-1 text-[13px] kratos-mono truncate"
                style={{ color: "var(--kratos-text-primary)" }}
              >
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

// ── Stepper de fluxo — hardcoded (badge MOCK) ─────────────────────────────────

function RealtimeFlowStepper() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="kratos-eyebrow" style={{ color: "var(--kratos-text-secondary)" }}>
          Fluxo em Tempo Real
        </h3>
        <MockBadge />
      </div>
      <div className="flex items-center justify-between">
        {FLOW_STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-0 flex-1">
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
                      ? "rgba(124,58,237,0.40)"
                      : "var(--kratos-surface-4)",
                  border: step.active
                    ? "2px solid var(--kr-accent-purple-lighter)"
                    : step.done
                      ? "2px solid var(--kr-island-omnis)"
                      : "2px solid var(--kratos-border)",
                }}
              >
                {step.done ? (
                  <CheckCircle2
                    className="h-4 w-4"
                    style={{ color: "white" }}
                    aria-hidden
                  />
                ) : (
                  <span
                    className="text-[11px] font-bold"
                    style={{
                      color: step.active
                        ? "var(--kr-accent-purple-lighter)"
                        : "var(--kratos-text-muted)",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] uppercase tracking-[0.08em] text-center"
                style={{
                  color: step.done
                    ? "var(--kr-accent-purple-light)"
                    : step.active
                      ? "var(--kr-accent-purple-lighter)"
                      : "var(--kratos-text-muted)",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div
                className="flex-1 h-[2px] mx-1 mb-5"
                style={{
                  background: step.done ? "var(--kr-island-omnis)" : "var(--kratos-surface-4)",
                }}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
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
  const { setData } = useIslandDock();

  const anyLoading = propLoading || omLoading || crLoading || jbLoading;

  useEffect(() => {
    if (!omLoading && omnis != null) {
      setData({
        islandId: "omnis",
        label: "OMNIS",
        value: `${omnis.workflows_registered ?? "—"} workflows · ${omnis.test_count?.toLocaleString("pt-BR") ?? "—"} testes`,
        progress: omnis.test_count != null ? Math.min(100, Math.round((omnis.test_count / 10000) * 100)) : 72,
        progressColor: "var(--kr-island-omnis)",
        quickActions: [{ label: "Ver Sistema" }],
      });
    }
  }, [omLoading, omnis, setData]);

  const summaryCards: SummaryCard[] = [
    {
      label: "Testes OMNIS",
      value: omnis?.test_count != null ? omnis.test_count.toLocaleString("pt-BR") : omLoading ? "…" : "Aguardando",
      icon: FlaskConical,
    },
    {
      label: "Workflows",
      value: omnis?.workflows_registered != null ? String(omnis.workflows_registered) : omLoading ? "…" : "Visual",
      icon: Cpu,
    },
    {
      label: "Docs Akasha",
      value: omnis?.memoria?.totalDocs != null ? omnis.memoria.totalDocs.toLocaleString("pt-BR") : omLoading ? "…" : "Aguardando",
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
      <OmnisLabStage>
        <LoadingState lines={6} />
      </OmnisLabStage>
    );
  }

  if (propError || omError) {
    return (
      <OmnisLabStage>
        <ErrorState
          title="Erro ao carregar"
          description={propError ?? "Falha ao consultar OMNIS."}
          variant="external_unavailable"
        />
      </OmnisLabStage>
    );
  }

  if (isEmpty) {
    return (
      <OmnisLabStage>
        <EmptyState title="Nada por aqui" description="Nenhum dado disponível neste momento." />
      </OmnisLabStage>
    );
  }

  return (
    <OmnisLabStage>
      {/* Header com botão Voltar ao mapa */}
      <IslandPageHeader
        title="OMNIS LAB"
        subtitle="Centro de IA, Automações e Inteligência de Execução"
        theme="omnis"
        onBack={() => navigate({ to: "/" })}
      />

      {/* Aurora — mensagem contextual */}
      <AuroraCard />

      {/* Cards de resumo — dados com badge MOCK */}
      <OmnisSummaryCards cards={summaryCards} />

      {/* Próxima Ação + Guardrail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ProximaAcaoCard />
        <GuardrailCard />
      </div>

      {/* Automações + Crews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <AutomationBoard jobs={jobList} />
        <ActiveAgentsList crews={crewList} />
      </div>

      {/* Execuções + Fluxo */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <RecentExecutionsList jobs={jobList} />
        </div>
        <div className="lg:col-span-3">
          <RealtimeFlowStepper />
        </div>
      </div>
    </OmnisLabStage>
  );
}
