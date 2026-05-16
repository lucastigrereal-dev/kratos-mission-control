import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { MentorRecommendationCard } from "@/components/kratos/mentor/MentorRecommendationCard";
import { ExecutionScoreCard } from "@/components/kratos/mentor/ExecutionScoreCard";
import { RiskProjectCard } from "@/components/kratos/mentor/RiskProjectCard";
import { TodayExecutionPanel, type TodayItem } from "@/components/kratos/agenda/TodayExecutionPanel";
import { DeadlineRadar, type RadarItem } from "@/components/kratos/agenda/DeadlineRadar";
import { OverduePanel, type OverdueItem } from "@/components/kratos/agenda/OverduePanel";
import { FinishLinePanel, type FinishLineItem } from "@/components/kratos/agenda/FinishLinePanel";
import { DoNotDoPanel } from "@/components/kratos/agenda/DoNotDoPanel";
import { WeekDetailList, type WeekItem } from "@/components/kratos/agenda/WeekDetailList";
import { useAppointments } from "@/hooks/useAppointments";
import type { Appointment } from "../../../api-contract/appointment.schema";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function mapTodayStatus(status: string): TodayItem["status"] {
  switch (status) {
    case "in_progress": return "now";
    case "pending": return "next";
    case "blocked": return "blocked";
    default: return "later";
  }
}

function toRadarBucket(data: string): RadarItem["bucket"] {
  const today = todayStr();
  if (data === today) return "today";
  const in3 = daysFromNow(3);
  if (data <= in3) return "next3";
  return "week";
}

function toWeekDay(iso: string): { day: string; date: string } {
  const d = new Date(iso + "T12:00:00");
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  return {
    day: days[d.getDay()],
    date: `${d.getDate()} ${d.toLocaleDateString("pt-BR", { month: "short" })}`,
  };
}

function deriveToday(appointments: Appointment[]): TodayItem[] {
  const today = todayStr();
  return appointments
    .filter((a) => a.data === today)
    .sort((a, b) => {
      const order = { in_progress: 0, pending: 1, blocked: 2, completed: 3 };
      return (order[a.status] ?? 4) - (order[b.status] ?? 4);
    })
    .map((a) => ({
      title: a.titulo,
      window: a.horario ? `${a.horario} · 45min` : "Hoje",
      project: a.projetoId ? "KRATOS" : "Pessoal",
      status: mapTodayStatus(a.status),
    }));
}

function deriveOverdue(appointments: Appointment[]): OverdueItem[] {
  const today = todayStr();
  return appointments
    .filter((a) => a.data < today && a.status !== "completed")
    .map((a) => {
      const diff = Math.floor((Date.now() - new Date(a.data + "T12:00:00").getTime()) / 86400000);
      return {
        title: a.titulo,
        daysLate: diff,
        project: a.projetoId ? "KRATOS" : "Pessoal",
        severity: diff > 5 ? "critical" as const : "warn" as const,
      };
    });
}

function deriveRadar(appointments: Appointment[]): RadarItem[] {
  const today = todayStr();
  const weekEnd = daysFromNow(7);
  return appointments
    .filter((a) => a.data >= today && a.data <= weekEnd && a.status !== "completed")
    .map((a) => ({
      title: a.titulo,
      project: a.projetoId ? "KRATOS" : "Pessoal",
      bucket: toRadarBucket(a.data),
    }));
}

function deriveWeek(appointments: Appointment[]): WeekItem[] {
  const today = todayStr();
  const weekEnd = daysFromNow(7);
  return appointments
    .filter((a) => a.data >= today && a.data <= weekEnd)
    .sort((a, b) => a.data.localeCompare(b.data))
    .map((a) => {
      const { day, date } = toWeekDay(a.data);
      return {
        day,
        date,
        title: a.titulo,
        project: a.projetoId ? "KRATOS" : "Pessoal",
      };
    });
}

// Mentor/score/risk are AI-derived — keep as structured constants for now
const MENTOR_MOCK = {
  recommendation: {
    recommendation: "Feche o Crédito 3 antes de abrir qualquer frente nova.",
    why: "Há duas frentes ativas e nenhuma fechada. Abrir uma terceira aumenta o risco de nada terminar.",
    impact: "Validar o Crédito 3 destrava a referência visual e libera o Crédito 4 com base estável.",
    nextStep: "Validar Crédito 3 (visual)",
  },
  score: [
    { label: "Foco", value: 78, tone: "ok" as const },
    { label: "Urgência", value: 62, tone: "warn" as const },
    { label: "Clareza", value: 84, tone: "info" as const },
    { label: "Risco", value: 41, tone: "warn" as const },
  ],
  risk: {
    project: "KRATOS · Handoff para Claude Code",
    risk: "Sem checkpoint",
    reason: "Esse projeto está parado há tempo demais e ainda não tem ponto de retomada formal.",
    suggestedAction: "Criar checkpoint mínimo hoje, mesmo que parcial.",
    severity: "warn" as const,
  },
  donotdo: [
    "Não abra Crédito 4 antes de validar o Crédito 3.",
    "Não mexa no KRATOS real enquanto o sandbox não for aprovado.",
    "Não abra nova frente sem checkpoint do dia.",
  ],
  finishline: [
    { title: "Shell visual KRATOS aprovado.", remaining: "1 polish final" },
    { title: "Tela /agora ultra-intuitiva validada.", remaining: "revisão de microcopy" },
  ],
};

export function AgendaView() {
  const { data: appointments, isLoading, isError, error, refetch } = useAppointments();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <SectionHeader
          eyebrow="Agenda"
          title="Plano do dia, prazos e decisões"
          description="Carregando compromissos..."
        />
        <LoadingState lines={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <SectionHeader
          eyebrow="Agenda"
          title="Plano do dia, prazos e decisões"
          description="Algo falhou ao carregar."
        />
        <ErrorState
          title="Não foi possível carregar a agenda"
          description={error?.message ?? "Erro ao buscar compromissos."}
          hint="Verifique a conexão e tente novamente."
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] kratos-mono uppercase tracking-[0.15em] kratos-focus-ring"
          style={{
            background: "var(--kratos-surface-3)",
            border: "1px solid var(--kratos-border)",
            color: "var(--kratos-text-primary)",
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const items = appointments ?? [];
  const today = deriveToday(items);
  const overdue = deriveOverdue(items);
  const radar = deriveRadar(items);
  const week = deriveWeek(items);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      <SectionHeader
        eyebrow="Agenda"
        title="Plano do dia, prazos e decisões"
        description="Conduza a execução. Reduza frentes em vez de abrir novas."
      />

      {items.length === 0 ? (
        <EmptyState
          title="Sem compromissos"
          description="Nenhum compromisso cadastrado. Use /agenda para criar o primeiro."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <MentorRecommendationCard
                data={MENTOR_MOCK.recommendation}
              />
            </div>
            <ExecutionScoreCard metrics={MENTOR_MOCK.score} />
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TodayExecutionPanel items={today} />
            </div>
            <DeadlineRadar items={radar} />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <OverduePanel items={overdue} />
            <FinishLinePanel items={MENTOR_MOCK.finishline} />
            <DoNotDoPanel items={MENTOR_MOCK.donotdo} />
          </div>

          <div className="mt-4">
            <RiskProjectCard data={MENTOR_MOCK.risk} />
          </div>

          <div className="mt-10">
            <div
              className="mb-3 text-[10px] kratos-mono uppercase tracking-[0.18em]"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              — Camada de detalhe —
            </div>
            <WeekDetailList items={week} />
          </div>
        </>
      )}
    </div>
  );
}
