import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import {
  MentorRecommendationCard,
  type MentorRecommendation,
} from "@/components/kratos/mentor/MentorRecommendationCard";
import {
  ExecutionScoreCard,
  type ScoreMetric,
} from "@/components/kratos/mentor/ExecutionScoreCard";
import { RiskProjectCard } from "@/components/kratos/mentor/RiskProjectCard";
import {
  TodayExecutionPanel,
  type TodayItem,
} from "@/components/kratos/agenda/TodayExecutionPanel";
import { DeadlineRadar, type RadarItem } from "@/components/kratos/agenda/DeadlineRadar";
import { OverduePanel, type OverdueItem } from "@/components/kratos/agenda/OverduePanel";
import { FinishLinePanel, type FinishLineItem } from "@/components/kratos/agenda/FinishLinePanel";
import { DoNotDoPanel } from "@/components/kratos/agenda/DoNotDoPanel";
import { WeekDetailList, type WeekItem } from "@/components/kratos/agenda/WeekDetailList";
import { useAppointments } from "@/hooks/useAppointments";
import { useCheckpointSuggestion } from "@/hooks/useCheckpointSuggestion";
import type { RiskProject } from "@/components/kratos/mentor/RiskProjectCard";
import type { Appointment } from "../../../../api-contract/appointment.schema";

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
    case "in_progress":
      return "now";
    case "pending":
      return "next";
    case "blocked":
      return "blocked";
    default:
      return "later";
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
        severity: diff > 5 ? ("critical" as const) : ("warn" as const),
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

function deriveRecommendation(
  today: TodayItem[],
  overdue: OverdueItem[],
  radar: RadarItem[],
): MentorRecommendation {
  const blocked = today.find((item) => item.status === "blocked");
  const next =
    today.find((item) => item.status === "now") ?? today.find((item) => item.status === "next");
  const urgent =
    radar.find((item) => item.bucket === "today") ?? radar.find((item) => item.bucket === "next3");

  if (overdue.length > 0) {
    return {
      recommendation: `Resolver atraso: ${overdue[0].title}`,
      why: `${overdue.length} item(ns) estão vencidos e competem com a execução do dia.`,
      impact: "Fechar ou remarcar atrasos reduz ruído e evita decisões paralelas.",
      nextStep: "Revisar atraso",
    };
  }

  if (blocked) {
    return {
      recommendation: `Desbloquear: ${blocked.title}`,
      why: "Item bloqueado impede sequência limpa da agenda.",
      impact: "Remover o bloqueio estabiliza a execução antes de avançar para novos compromissos.",
      nextStep: "Desbloquear item",
    };
  }

  if (next) {
    return {
      recommendation: `Executar agora: ${next.title}`,
      why:
        next.status === "now"
          ? "Esse item já está em andamento."
          : "Esse é o próximo item pendente do dia.",
      impact: "Manter uma frente por vez reduz troca de contexto.",
      nextStep: "Focar item",
    };
  }

  if (urgent) {
    return {
      recommendation: `Preparar prazo: ${urgent.title}`,
      why: "Há prazo próximo no radar da semana.",
      impact: "Antecipar o prazo evita virar urgência operacional.",
      nextStep: "Ver prazo",
    };
  }

  return {
    recommendation: "Manter agenda limpa e revisar próximos compromissos.",
    why: "Não há atraso nem item em execução para priorizar automaticamente.",
    impact: "A próxima decisão pode ser tomada a partir do detalhe semanal.",
    nextStep: "Revisar semana",
  };
}

function scoreTone(value: number): ScoreMetric["tone"] {
  if (value >= 75) return "ok";
  if (value >= 45) return "warn";
  return "critical";
}

function deriveScore(
  appointments: Appointment[],
  today: TodayItem[],
  overdue: OverdueItem[],
  radar: RadarItem[],
): ScoreMetric[] {
  const activeToday = today.filter(
    (item) => item.status === "now" || item.status === "next",
  ).length;
  const blockedToday = today.filter((item) => item.status === "blocked").length;
  const completed = appointments.filter((item) => item.status === "completed").length;
  const completion =
    appointments.length === 0 ? 100 : Math.round((completed / appointments.length) * 100);
  const focus = Math.max(0, 100 - Math.max(0, activeToday - 1) * 20 - blockedToday * 25);
  const urgency = Math.min(
    100,
    overdue.length * 30 + radar.filter((item) => item.bucket === "today").length * 20,
  );
  const clarity = Math.max(0, 100 - appointments.filter((item) => !item.horario).length * 12);
  const risk = Math.min(100, overdue.length * 35 + blockedToday * 30);

  return [
    { label: "Foco", value: focus, tone: scoreTone(focus) },
    {
      label: "Urgência",
      value: urgency,
      tone: urgency >= 70 ? "critical" : urgency >= 35 ? "warn" : "ok",
    },
    { label: "Clareza", value: clarity, tone: scoreTone(clarity) },
    { label: "Conclusão", value: completion, tone: scoreTone(completion) },
    { label: "Risco", value: risk, tone: risk >= 70 ? "critical" : risk >= 35 ? "warn" : "ok" },
  ];
}

function deriveFinishLine(appointments: Appointment[]): FinishLineItem[] {
  return appointments
    .filter((item) => item.status === "in_progress" || item.status === "pending")
    .sort(
      (a, b) =>
        a.data.localeCompare(b.data) || (a.horario ?? "23:59").localeCompare(b.horario ?? "23:59"),
    )
    .slice(0, 2)
    .map((item) => ({
      title: item.titulo,
      remaining:
        item.status === "in_progress" ? "concluir item em andamento" : "executar próximo passo",
    }));
}

function deriveDoNotDo(today: TodayItem[], overdue: OverdueItem[]): string[] {
  const items = ["Não abrir nova frente sem fechar ou remarcar o próximo compromisso."];

  if (overdue.length > 0) {
    items.push("Não ignorar compromissos vencidos antes de planejar a semana.");
  }

  if (today.some((item) => item.status === "blocked")) {
    items.push("Não avançar sobre item bloqueado sem registrar o desbloqueador.");
  }

  if (today.filter((item) => item.status === "now" || item.status === "next").length > 1) {
    items.push("Não executar duas frentes de agenda ao mesmo tempo.");
  }

  return items.slice(0, 3);
}

export function AgendaView() {
  const { data: appointments, isLoading, isError, error, refetch } = useAppointments();
  const suggestion = useCheckpointSuggestion();

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

  function derivedRisk(): RiskProject | undefined {
    if (suggestion) {
      return {
        project: suggestion.affectedProject ?? suggestion.affectedCheckpoint?.titulo ?? "KRATOS",
        risk: suggestion.severity === "critical" ? "Checkpoint bloqueado" : "Sem checkpoint ativo",
        reason: suggestion.reason,
        suggestedAction: suggestion.suggestedAction,
        severity: suggestion.severity === "critical" ? "critical" : "warn",
      };
    }
    if (overdue.length > 0) {
      return {
        project: overdue[0].project,
        risk: "Compromisso atrasado",
        reason: `${overdue[0].title} está atrasado há ${overdue[0].daysLate} dia(s).`,
        suggestedAction: "Reagendar, concluir ou remover bloqueio hoje.",
        severity: overdue[0].severity === "critical" ? "critical" : "warn",
      };
    }

    return undefined;
  }

  const recommendation = deriveRecommendation(today, overdue, radar);
  const score = deriveScore(items, today, overdue, radar);
  const finishline = deriveFinishLine(items);
  const donotdo = deriveDoNotDo(today, overdue);

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
              <MentorRecommendationCard data={recommendation} />
            </div>
            <ExecutionScoreCard metrics={score} />
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TodayExecutionPanel items={today} />
            </div>
            <DeadlineRadar items={radar} />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <OverduePanel items={overdue} />
            <FinishLinePanel items={finishline} />
            <DoNotDoPanel items={donotdo} />
          </div>

          <div className="mt-4">
            <RiskProjectCard data={derivedRisk()} />
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
