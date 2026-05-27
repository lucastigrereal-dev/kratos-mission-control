import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { FocusCard } from "@/components/kratos/agora/FocusCard";
import { NextActionCard } from "@/components/kratos/agora/NextActionCard";
import { CriticalAlertCard } from "@/components/kratos/agora/CriticalAlertCard";
import { DeadlineCard } from "@/components/kratos/agora/DeadlineCard";
import { CheckpointCard } from "@/components/kratos/agora/CheckpointCard";
import { AuroraShortcutCard } from "@/components/kratos/agora/AuroraShortcutCard";
import { SystemPulseStrip } from "@/components/kratos/agora/SystemPulseStrip";
import { MiniAgenda, type AgendaItem } from "@/components/kratos/agora/MiniAgenda";
import { useCheckpoints, useCreateCheckpoint, useUpdateCheckpoint } from "@/hooks/useCheckpoints";
import { useAppointments } from "@/hooks/useAppointments";
import { useLiveStatus } from "@/hooks/useLiveStatus";
import { useDriftDetection } from "@/hooks/useDriftDetection";
import { useMissionLens } from "@/hooks/useMissionLens";
import { DriftIndicator } from "@/components/kratos/shell/DriftIndicator";
import { ZombieBadge } from "@/components/kratos/base/ZombieBadge";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import type { Checkpoint } from "../../../../api-contract/checkpoint.schema";
import type { Appointment } from "../../../../api-contract/appointment.schema";
import type { CriticalAlert } from "@/components/kratos/agora/CriticalAlertCard";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function findInProgress(items: Checkpoint[]): Checkpoint | undefined {
  return items.find((c) => c.status === "in_progress");
}

function findBlocked(items: Checkpoint[]): Checkpoint[] {
  return items.filter((c) => c.status === "blocked");
}

function findNearestDeadline(items: Checkpoint[]): Checkpoint | undefined {
  const withDeadline = items.filter(
    (c) => c.deadline && c.status !== "completed" && c.status !== "cancelled",
  );
  withDeadline.sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  return withDeadline[0];
}

function deadlineUrgency(deadline: string): "calm" | "soon" | "urgent" {
  const diff = new Date(deadline).getTime() - Date.now();
  const hours = diff / 3_600_000;
  if (hours <= 4) return "urgent";
  if (hours <= 24) return "soon";
  return "calm";
}

function deadlineRemaining(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  const hours = diff / 3_600_000;
  if (hours <= 0) return "atrasado";
  if (hours < 1) return `${Math.floor(diff / 60_000)}min`;
  if (hours < 24) return `${Math.floor(hours)}h`;
  return `${Math.floor(hours / 24)}d`;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function agendaTimeLabel(item: Appointment): string {
  const today = todayStr();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const time = item.horario ?? "dia";

  if (item.data === today) return time;
  if (item.data === tomorrowStr) return `Amanhã ${time}`;
  return `${new Date(`${item.data}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })} ${time}`;
}

function deriveMiniAgenda(appointments: Appointment[]): AgendaItem[] {
  const today = todayStr();
  return appointments
    .filter((item) => item.data >= today && item.status !== "completed")
    .sort(
      (a, b) =>
        a.data.localeCompare(b.data) || (a.horario ?? "23:59").localeCompare(b.horario ?? "23:59"),
    )
    .slice(0, 4)
    .map((item) => ({
      time: agendaTimeLabel(item),
      title: item.titulo,
      hint: item.descricao ?? (item.status === "blocked" ? "Bloqueado" : undefined),
    }));
}

export function AgoraView() {
  const { data: checkpoints, isLoading, isError, error, refetch } = useCheckpoints();
  const { data: appointments } = useAppointments();
  const createMutation = useCreateCheckpoint();
  const updateMutation = useUpdateCheckpoint();
  const items = checkpoints ?? [];
  const liveStatus = useLiveStatus(items.length);
  const miniAgendaItems = deriveMiniAgenda(appointments ?? []);
  const drift = useDriftDetection();
  const { sourceType: lensSourceType, lastUpdatedAt: lensUpdatedAt } = useMissionLens();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
        <SectionHeader
          eyebrow="Agora"
          title="Você está aqui."
          description="Carregando seu foco..."
        />
        <LoadingState lines={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
        <SectionHeader
          eyebrow="Agora"
          title="Você está aqui."
          description="Algo falhou ao carregar."
        />
        <ErrorState
          title="Não foi possível carregar o Agora"
          description={error?.message ?? "Erro ao buscar checkpoints."}
          hint="Verifique a conexão e tente novamente."
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] kratos-mono uppercase tracking-[0.15em] kratos-focus-ring"
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

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
        <SectionHeader
          eyebrow="Agora"
          title="Você está aqui."
          description="Nenhum checkpoint ainda. Crie o primeiro para ativar o foco."
        />
        <EmptyState
          title="Sem checkpoints"
          description="Crie um checkpoint em /checkpoints para ver seu foco aqui."
        />
        <button
          type="button"
          onClick={() => {
            createMutation.mutate({
              titulo: "Checkpoint inicial",
              descricao: "Defina seu foco atual",
            });
          }}
          disabled={createMutation.isPending}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium kratos-focus-ring"
          style={{
            background: "var(--kratos-accent)",
            color: "var(--kratos-surface-0)",
          }}
        >
          Criar primeiro checkpoint
        </button>
      </div>
    );
  }

  const inProgress = findInProgress(items);
  const blocked = findBlocked(items);
  const nearestDeadline = findNearestDeadline(items);
  const mostRecent = [...items].sort(
    (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
  )[0];

  // Drift-aware focus: qualquer drift desliga o foco visual
  const focusState =
    drift.driftState !== "on-mission" || !inProgress
      ? ("off_focus" as const)
      : ("on_focus" as const);

  const criticalAlert: CriticalAlert | undefined =
    blocked.length > 0
      ? {
          title: blocked[0].titulo,
          detail: blocked[0].descricao ?? "Checkpoint bloqueado — requer ação.",
          badge: `P${blocked.length}`,
        }
      : undefined;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
      {/* DriftIndicator: full-width alert bar when off-mission */}
      <DriftIndicator
        driftState={drift.driftState}
        minutesOff={drift.minutesOff}
        nudgeMessage={drift.nudgeMessage}
        originalMission={drift.originalMission}
        onResume={() => refetch()}
      />

      <SectionHeader
        eyebrow={`Agora · ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })} BRT`}
        title="Você está aqui."
        description="Uma tela, uma decisão. O resto espera."
        right={
          <div className="flex items-center gap-2">
            <SourceBadgeIndicator
              meta={{
                source: lensSourceType,
                origin: "mission-lens",
                errors: [],
                stale: lensSourceType === "error" || lensSourceType === "stale",
                updated_at: lensUpdatedAt ?? new Date().toISOString(),
                confidence: lensSourceType === "live" ? 95 : 60,
              }}
              size="sm"
            />
            <ZombieBadge
              driftState={drift.driftState}
              minutesOff={drift.minutesOff}
              onResume={() => refetch()}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <FocusCard
            project={inProgress?.titulo ?? "KRATOS · Mission Control"}
            state={focusState}
            headline={inProgress ? "Você está no foco certo." : "Nenhum checkpoint em progresso."}
            subline={
              inProgress
                ? `Atualizado ${relativeTime(inProgress.atualizadoEm)} · ${inProgress.progresso}% concluído`
                : "Inicie um checkpoint em /checkpoints"
            }
          />
        </div>
        <div className="lg:col-span-2">
          <NextActionCard
            title={inProgress?.descricao ?? "Inicie um checkpoint para ver sua próxima ação."}
            rationale={
              inProgress
                ? "O próximo passo já está claro. Não abra outra frente antes de fechar isso."
                : "Sem ação definida. Vá para /checkpoints e inicie uma."
            }
            score={inProgress ? inProgress.progresso / 100 : undefined}
            onPrimary={
              inProgress
                ? () =>
                    updateMutation.mutate({
                      id: inProgress.id,
                      input: { progresso: Math.min(100, inProgress.progresso + 10) },
                    })
                : undefined
            }
            primaryLabel={inProgress ? "Avançar +10%" : "Ir para Checkpoints"}
            secondaryLabel="Abrir Mentor"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CriticalAlertCard
          alert={criticalAlert}
          warningsCount={blocked.length > 1 ? blocked.length - 1 : 0}
        />
        <DeadlineCard
          deadline={
            nearestDeadline
              ? {
                  title: nearestDeadline.titulo,
                  remaining: deadlineRemaining(nearestDeadline.deadline!),
                  due: new Date(nearestDeadline.deadline!).toLocaleDateString("pt-BR"),
                  urgency: deadlineUrgency(nearestDeadline.deadline!),
                }
              : undefined
          }
        />
        <CheckpointCard
          lastCheckpoint={
            mostRecent
              ? `${relativeTime(mostRecent.atualizadoEm)} · ${mostRecent.titulo}`
              : undefined
          }
          onSave={() => {
            createMutation.mutate({
              titulo: `Checkpoint de ${new Date().toLocaleDateString("pt-BR")}`,
              descricao: inProgress?.descricao ?? "Checkpoint salvo do Agora",
            });
          }}
          isPending={createMutation.isPending}
        />
      </div>

      <AuroraShortcutCard
        onOpen={() => {
          const event = new CustomEvent("kratos:open-aurora");
          window.dispatchEvent(event);
        }}
      />

      <div className="pt-4 space-y-5">
        <div className="flex items-center gap-3" aria-hidden>
          <div className="kratos-divider-soft flex-1" />
          <span className="kratos-eyebrow">Contexto resumido</span>
          <div className="kratos-divider-soft flex-1" />
        </div>

        <SystemPulseStrip
          systems={liveStatus.systems}
          liveState={liveStatus.liveState}
          lastUpdate={liveStatus.lastUpdate}
        />

        <MiniAgenda items={miniAgendaItems} />
      </div>
    </div>
  );
}
