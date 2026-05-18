import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { cn } from "@/lib/utils";
import {
  Eye,
  Heart,
  MousePointerClick,
  Users,
  FileText,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────────────────────

const kpiCards = [
  {
    label: "Alcance",
    value: "128K",
    delta: "+12%",
    deltaPositive: true,
    icon: Eye,
  },
  {
    label: "Engajamento",
    value: "8.4%",
    delta: "+2.1%",
    deltaPositive: true,
    icon: Heart,
  },
  {
    label: "Seguidores",
    value: "+342",
    delta: "+5%",
    deltaPositive: true,
    icon: Users,
  },
  {
    label: "Publicações",
    value: "18",
    delta: "-2",
    deltaPositive: false,
    icon: FileText,
  },
];

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const postDays = [0, 2, 3, 5]; // index of days with posts this week
const todayIdx = 1; // Tuesday (index 1)

const contentPipeline = [
  { stage: "Ideias", count: 24, color: "var(--kr-island-agencia)" },
  { stage: "Roteiros", count: 8, color: "var(--kr-accent-orange-lighter)" },
  { stage: "Produção", count: 5, color: "var(--kr-accent-amber-bright)" },
  { stage: "Edição", count: 3, color: "var(--kr-accent-gold-light)" },
  { stage: "Publicação", count: 2, color: "var(--kr-success)" },
];

const ideas = [
  { name: "Tour pelo KRATOS 3D", progress: 85 },
  { name: "Bastidores da Sprint", progress: 40 },
  { name: "Review de ferramentas IA", progress: 10 },
];

const squads = [
  { name: "Direção", members: 1 },
  { name: "Roteiristas", members: 2 },
  { name: "Designers", members: 1 },
  { name: "Editores", members: 2 },
  { name: "Gestão", members: 1 },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function KpiQuadPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpiCards.map((kpi) => (
        <GlassPanel key={kpi.label} padding="sm" className="text-center">
          <kpi.icon
            className="h-5 w-5 mx-auto mb-1.5"
            style={{ color: "var(--kr-accent-orange-lighter)" }}
            aria-hidden
          />
          <p className="kratos-num text-xl">{kpi.value}</p>
          <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--kratos-text-muted)" }}>
            {kpi.label}
          </p>
          <span
            className={cn(
              "inline-block mt-1 text-[11px] kratos-mono font-medium",
              kpi.deltaPositive ? "" : "",
            )}
            style={{
              color: kpi.deltaPositive ? "var(--kr-success)" : "var(--kr-danger)",
            }}
          >
            {kpi.delta}
          </span>
        </GlassPanel>
      ))}
    </div>
  );
}

function ContentCalendar() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Calendário de Conteúdo
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--kratos-text-muted)" }}>
              {day}
            </span>
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                i === todayIdx && "",
              )}
              style={{
                background:
                  i === todayIdx
                    ? "var(--kr-island-agencia)"
                    : postDays.includes(i)
                      ? "var(--kratos-surface-3)"
                      : "var(--kratos-surface-2)",
                border:
                  i === todayIdx
                    ? "2px solid var(--kr-accent-orange-light)"
                    : "1px solid var(--kratos-border)",
              }}
            >
              {postDays.includes(i) && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: i === todayIdx ? "#fff" : "var(--kr-island-agencia)" }}
                  aria-label="Post agendado"
                />
              )}
              {!postDays.includes(i) && (
                <span
                  className="text-[11px] kratos-mono"
                  style={{ color: i === todayIdx ? "#fff" : "var(--kratos-text-muted)" }}
                >
                  {i + 1}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function CampaignMainCard() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className="kratos-eyebrow block mb-1"
            style={{ color: "var(--kr-accent-orange-light)" }}
          >
            Campanha Principal
          </span>
          <h3 className="text-[15px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            KRATOS 1.0 — Lançamento
          </h3>
        </div>
        <span
          className="kratos-chip"
          style={{ color: "var(--kr-accent-orange-light)", borderColor: "rgba(249, 115, 22, 0.3)" }}
        >
          68%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: "68%",
              background: "linear-gradient(90deg, var(--kr-island-agencia), var(--kr-accent-orange-lighter))",
            }}
            aria-hidden
          />
        </div>
      </div>

      {/* Phases */}
      <div className="flex gap-2">
        {["Pré-lançamento", "Lançamento", "Pós-lançamento"].map((phase, i) => (
          <span
            key={phase}
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              background: i === 1 ? "rgba(249, 115, 22, 0.2)" : "var(--kratos-surface-3)",
              color: i === 1 ? "var(--kr-accent-orange-light)" : "var(--kratos-text-muted)",
            }}
          >
            {phase}
          </span>
        ))}
      </div>
    </GlassPanel>
  );
}

function ContentPipeline() {
  const maxCount = Math.max(...contentPipeline.map((s) => s.count));

  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Pipeline de Conteúdo
      </h3>
      <div className="space-y-3">
        {contentPipeline.map((s) => (
          <div key={s.stage} className="flex items-center gap-3">
            <span
              className="text-[11px] font-medium w-20 flex-shrink-0"
              style={{ color: "var(--kratos-text-secondary)" }}
            >
              {s.stage}
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(s.count / maxCount) * 100}%`,
                  background: s.color,
                }}
                aria-hidden
              />
            </div>
            <span
              className="kratos-mono text-[11px] w-6 text-right flex-shrink-0"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              {s.count}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function IdeaTracker() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Ideias em Desenvolvimento
      </h3>
      <div className="space-y-3">
        {ideas.map((idea) => (
          <div key={idea.name} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ color: "var(--kratos-text-primary)" }}>
                {idea.name}
              </span>
              <span className="kratos-mono text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
                {idea.progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${idea.progress}%`,
                  background:
                    idea.progress >= 70
                      ? "var(--kr-success)"
                      : idea.progress >= 30
                        ? "var(--kr-accent-amber-bright)"
                        : "var(--kr-island-agencia)",
                }}
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function StudioSquads() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Studio Squads
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {squads.map((sq) => (
          <div
            key={sq.name}
            className="flex flex-col items-center gap-1.5 rounded-lg py-2.5 text-center"
            style={{ background: "var(--kratos-surface-2)" }}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(249, 115, 22, 0.15)" }}
            >
              <Users className="h-4 w-4" style={{ color: "var(--kr-accent-orange-lighter)" }} aria-hidden />
            </div>
            <span className="text-[10px] leading-tight" style={{ color: "var(--kratos-text-primary)" }}>
              {sq.name}
            </span>
            <span className="kratos-mono text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
              {sq.members}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function AuroraMiniChat() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #A855F7, #06B6D4)",
            boxShadow: "0 0 12px rgba(168, 85, 247, 0.4)",
          }}
        >
          <MessageCircle className="h-4 w-4 text-white" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "var(--kr-accent-purple-light)" }}>
            Aurora
          </p>
          <p className="text-[13px]" style={{ color: "var(--kratos-text-primary)" }}>
            Precisa de ajuda com o conteúdo de hoje?
          </p>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
      </div>
    </GlassPanel>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

export function AgenciaScreen() {
  return (
    <IslandPageFrame theme="agencia">
      <IslandPageHeader
        title="AGÊNCIA / ESTÚDIO"
        subtitle="Conteúdo, Marca e Comunicação que constroem autoridade"
        theme="agencia"
      />

      {/* KPI row */}
      <KpiQuadPanel />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 space-y-4">
          <CampaignMainCard />
          <ContentCalendar />
        </div>
        <div className="space-y-4">
          <ContentPipeline />
          <IdeaTracker />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
        <div className="lg:col-span-3">
          <StudioSquads />
        </div>
        <div className="lg:col-span-2">
          <AuroraMiniChat />
        </div>
      </div>
    </IslandPageFrame>
  );
}
