import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { MentorRecommendationCard } from "@/components/kratos/mentor/MentorRecommendationCard";
import { ExecutionScoreCard } from "@/components/kratos/mentor/ExecutionScoreCard";
import { RiskProjectCard } from "@/components/kratos/mentor/RiskProjectCard";
import { TodayExecutionPanel } from "@/components/kratos/agenda/TodayExecutionPanel";
import { DeadlineRadar } from "@/components/kratos/agenda/DeadlineRadar";
import { OverduePanel } from "@/components/kratos/agenda/OverduePanel";
import { FinishLinePanel } from "@/components/kratos/agenda/FinishLinePanel";
import { DoNotDoPanel } from "@/components/kratos/agenda/DoNotDoPanel";
import { WeekDetailList } from "@/components/kratos/agenda/WeekDetailList";

// Sandbox-only mock. Sem hooks, sem fetch.
const MOCK_AGENDA = {
  recommendation: {
    recommendation:
      "Feche o Crédito 3 antes de abrir qualquer frente nova.",
    why: "Há duas frentes ativas e nenhuma fechada. Abrir uma terceira aumenta o risco de nada terminar.",
    impact:
      "Validar o Crédito 3 destrava a referência visual e libera o Crédito 4 com base estável.",
    nextStep: "Validar Crédito 3 (visual)",
  },
  score: [
    { label: "Foco", value: 78, tone: "ok" as const },
    { label: "Urgência", value: 62, tone: "warn" as const },
    { label: "Clareza", value: 84, tone: "info" as const },
    { label: "Risco", value: 41, tone: "warn" as const },
  ],
  today: [
    {
      title: "Validar visual do Crédito 3 no sandbox.",
      window: "Agora · 90min",
      project: "KRATOS · Lovable",
      status: "now" as const,
    },
    {
      title: "Revisar microcopy da /agenda com Mentor.",
      window: "11:30 · 30min",
      project: "KRATOS · Mentor",
      status: "next" as const,
    },
    {
      title: "Anotar pontos de adaptação para o Claude Code.",
      window: "14:00 · 45min",
      project: "KRATOS · Handoff",
      status: "later" as const,
    },
    {
      title: "Subir checkpoint visual do dia.",
      window: "18:00 · 10min",
      project: "KRATOS · Checkpoints",
      status: "later" as const,
    },
    {
      title: "Aprovar release de OMNIS v2.",
      window: "Aguardando QA",
      project: "OMNIS",
      status: "blocked" as const,
    },
  ],
  overdue: [
    {
      title: "Documentar tokens KRATOS no README interno.",
      daysLate: 3,
      project: "KRATOS · Docs",
      severity: "warn" as const,
    },
    {
      title: "Revisar política de fallback do ActivityWatch.",
      daysLate: 6,
      project: "KRATOS · Sistema",
      severity: "critical" as const,
    },
  ],
  radar: [
    {
      title: "Entrega Crédito 3 — Agenda + Mentor",
      project: "KRATOS · Lovable",
      bucket: "today" as const,
    },
    {
      title: "Checkpoint semanal de contexto",
      project: "KRATOS · Checkpoints",
      bucket: "next3" as const,
    },
    {
      title: "Reunião de handoff com Claude Code",
      project: "KRATOS · Handoff",
      bucket: "next3" as const,
    },
    {
      title: "Fechamento Crédito 4 — Contexto",
      project: "KRATOS · Lovable",
      bucket: "week" as const,
    },
  ],
  donotdo: [
    "Não abra Crédito 4 antes de validar o Crédito 3.",
    "Não mexa no KRATOS real enquanto o sandbox não for aprovado.",
    "Não abra nova frente sem checkpoint do dia.",
    "Não toque em backend, hooks ou types neste sandbox.",
  ],
  finishline: [
    {
      title: "Shell visual KRATOS aprovado.",
      remaining: "1 polish final",
    },
    {
      title: "Tela /agora ultra-intuitiva validada.",
      remaining: "revisão de microcopy",
    },
  ],
  risk: {
    project: "KRATOS · Handoff para Claude Code",
    risk: "Sem checkpoint",
    reason:
      "Esse projeto está parado há tempo demais e ainda não tem ponto de retomada formal.",
    suggestedAction: "Criar checkpoint mínimo hoje, mesmo que parcial.",
    severity: "warn" as const,
  },
  week: [
    {
      day: "Seg",
      date: "11 mai",
      title: "Validar Crédito 3 e abrir plano do Crédito 4.",
      project: "KRATOS · Lovable",
    },
    {
      day: "Ter",
      date: "12 mai",
      title: "Reunião de handoff com Claude Code.",
      project: "KRATOS · Handoff",
    },
    {
      day: "Qua",
      date: "13 mai",
      title: "Revisar política de fallback do ActivityWatch.",
      project: "KRATOS · Sistema",
    },
    {
      day: "Qui",
      date: "14 mai",
      title: "Fechar Crédito 4 — Contexto.",
      project: "KRATOS · Lovable",
    },
    {
      day: "Sex",
      date: "15 mai",
      title: "Checkpoint semanal e leitura de risco.",
      project: "KRATOS · Checkpoints",
    },
  ],
};

export function AgendaView() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      <SectionHeader
        eyebrow="Agenda"
        title="Plano do dia, prazos e decisões"
        description="Conduza a execução. Reduza frentes em vez de abrir novas."
      />

      {/* Linha 1 — Mentor + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MentorRecommendationCard data={MOCK_AGENDA.recommendation} />
        </div>
        <ExecutionScoreCard metrics={MOCK_AGENDA.score} />
      </div>

      {/* Linha 2 — Hoje + Radar */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TodayExecutionPanel items={MOCK_AGENDA.today} />
        </div>
        <DeadlineRadar items={MOCK_AGENDA.radar} />
      </div>

      {/* Linha 3 — Atrasados / Quase prontos / Não fazer (DoNotDo na 1ª dobra) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverduePanel items={MOCK_AGENDA.overdue} />
        <FinishLinePanel items={MOCK_AGENDA.finishline} />
        <DoNotDoPanel items={MOCK_AGENDA.donotdo} />
      </div>

      {/* Linha 4 — Risco resumido (faixa) */}
      <div className="mt-4">
        <RiskProjectCard data={MOCK_AGENDA.risk} />
      </div>

      {/* Camada de detalhe */}
      <div className="mt-10">
        <div
          className="mb-3 text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          — Camada de detalhe —
        </div>
        <WeekDetailList items={MOCK_AGENDA.week} />
      </div>
    </div>
  );
}
