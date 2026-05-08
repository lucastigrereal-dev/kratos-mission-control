import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { ResumeFromHereCard } from "@/components/kratos/checkpoints/ResumeFromHereCard";
import { CheckpointSummaryCard } from "@/components/kratos/checkpoints/CheckpointSummaryCard";
import { CheckpointFilterBar } from "@/components/kratos/checkpoints/CheckpointFilterBar";
import { CheckpointTimeline } from "@/components/kratos/checkpoints/CheckpointTimeline";
import type { CheckpointItem } from "@/components/kratos/checkpoints/CheckpointItemCard";

const MOCK_CHECKPOINTS: {
  resume: {
    project: string;
    time: string;
    summary: string;
    nextAction: string;
  };
  summary: {
    lastCheckpoint: string;
    todayCount: number;
    recentProject: string;
    risk: { label: string; severity: "ok" | "warn" | "critical" | "muted" };
  };
  timeline: CheckpointItem[];
} = {
  resume: {
    project: "KRATOS · Lovable",
    time: "há 18 min",
    summary: "Plano do Crédito 4 aprovado, antes do Build.",
    nextAction: "Validar /contexto e /checkpoints no sandbox.",
  },
  summary: {
    lastCheckpoint: "há 18 min",
    todayCount: 4,
    recentProject: "KRATOS · Lovable",
    risk: { label: "Baixo", severity: "ok" },
  },
  timeline: [
    {
      id: "cp-1",
      time: "10:42",
      project: "KRATOS · Lovable",
      summary: "Plano do Crédito 4 aprovado.",
      nextAction: "Iniciar Build de /contexto.",
      tags: ["plano", "crédito-4"],
      type: "manual",
      age: "recente",
    },
    {
      id: "cp-2",
      time: "09:55",
      project: "KRATOS · Agenda",
      summary: "Crédito 3 validado no sandbox.",
      nextAction: "Abrir plano do Crédito 4.",
      tags: ["agenda", "validação"],
      type: "contexto",
      age: "recente",
    },
    {
      id: "cp-3",
      time: "Ontem · 18:10",
      project: "KRATOS · Mentor",
      summary: "Microcopy do Mentor revisada.",
      nextAction: "Aplicar no painel da /agenda.",
      tags: ["microcopy", "mentor"],
      type: "manual",
      age: "antigo",
    },
    {
      id: "cp-4",
      time: "Ontem · 14:20",
      project: "KRATOS · Sistema",
      summary: "Política de fallback do ActivityWatch em rascunho.",
      nextAction: "Decidir entre cached / fallback / offline.",
      tags: ["sistema", "fallback"],
      type: "sistema",
      age: "antigo",
    },
  ],
};

export function CheckpointsView() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      <SectionHeader
        eyebrow="Checkpoints"
        title="Seu save game mental para retomar sem se perder."
        description="Não reconstrua do zero. Retome."
      />

      {/* Linha 1 — Retomar + Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ResumeFromHereCard {...MOCK_CHECKPOINTS.resume} />
        </div>
        <CheckpointSummaryCard {...MOCK_CHECKPOINTS.summary} />
      </div>

      {/* Linha 2 — Filtros visuais */}
      <div className="mt-4">
        <CheckpointFilterBar />
      </div>

      {/* Linha 3 — Timeline */}
      <div className="mt-4">
        <CheckpointTimeline items={MOCK_CHECKPOINTS.timeline} />
      </div>
    </div>
  );
}
