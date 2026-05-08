import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { FocusCard } from "@/components/kratos/agora/FocusCard";
import { NextActionCard } from "@/components/kratos/agora/NextActionCard";
import { CriticalAlertCard } from "@/components/kratos/agora/CriticalAlertCard";
import { DeadlineCard } from "@/components/kratos/agora/DeadlineCard";
import { CheckpointCard } from "@/components/kratos/agora/CheckpointCard";
import { AuroraShortcutCard } from "@/components/kratos/agora/AuroraShortcutCard";
import { SystemPulseStrip } from "@/components/kratos/agora/SystemPulseStrip";
import { MiniAgenda } from "@/components/kratos/agora/MiniAgenda";

// Sandbox-only mock. Trocar por hooks reais no próximo crédito.
const MOCK = {
  focus: {
    project: "KRATOS · Mission Control",
    state: "on_focus" as const,
    headline: "Você está no foco certo.",
    subline: "Sessão ativa em ~/dev/kratos · branch main",
    duration: "47min",
  },
  nextAction: {
    title: "Finalizar validação do Crédito 1 antes de abrir nova frente.",
    rationale:
      "O próximo passo já está claro. Não abra outra frente antes de fechar isso.",
    score: 0.87,
  },
  criticalAlert: {
    title: "ActivityWatch offline",
    detail: "Coletor caiu há 4min · usando fallback mock.",
    badge: "P1",
  },
  warningsCount: 2,
  deadline: {
    title: "Entrega Crédito 1 — KRATOS Shell",
    remaining: "2d",
    due: "10 mai 2026",
    urgency: "soon" as const,
  },
  lastCheckpoint: "ontem · 21:14",
  liveState: "live" as const,
  liveUpdate: "12s ago",
  systems: [
    { name: "Docker", severity: "ok" as const, hint: "8 ctn" },
    { name: "Git", severity: "warn" as const, hint: "dirty" },
    { name: "OMNIS", severity: "ok" as const },
    { name: "ActivityWatch", severity: "critical" as const, hint: "offline" },
  ],
  agenda: [
    { time: "15:00", title: "Review Crédito 1 com Claude Code" },
    { time: "16:30", title: "Plano Crédito 2 — Tela Agora" },
    { time: "amanhã", title: "Entrega Crédito 1", hint: "deadline · 10 mai" },
  ],
};

export function AgoraView() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Agora · 14:32 BRT"
        title="Foco do operador"
        description="Uma tela, uma decisão. O resto espera."
      />

      {/* Dobra principal — 6 blocos */}
      <div className="space-y-4">
        {/* Linha 1: Foco + Próxima ação */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FocusCard {...MOCK.focus} />
          <NextActionCard {...MOCK.nextAction} />
        </div>

        {/* Linha 2: Alerta crítico + Deadline + Checkpoint */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CriticalAlertCard
            alert={MOCK.criticalAlert}
            warningsCount={MOCK.warningsCount}
          />
          <DeadlineCard deadline={MOCK.deadline} />
          <CheckpointCard lastCheckpoint={MOCK.lastCheckpoint} />
        </div>

        {/* Linha 3: Atalho Aurora */}
        <AuroraShortcutCard />
      </div>

      {/* Camada 2 — abaixo da dobra */}
      <div className="pt-2 space-y-4">
        <div
          className="flex items-center gap-3"
          aria-hidden
        >
          <div
            className="h-px flex-1"
            style={{ background: "var(--kratos-border)" }}
          />
          <span
            className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Contexto resumido
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "var(--kratos-border)" }}
          />
        </div>

        <SystemPulseStrip
          systems={MOCK.systems}
          liveState={MOCK.liveState}
          lastUpdate={MOCK.liveUpdate}
        />

        <MiniAgenda items={MOCK.agenda} />
      </div>
    </div>
  );
}
