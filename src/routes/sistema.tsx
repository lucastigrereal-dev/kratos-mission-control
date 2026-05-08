import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import {
  LiveStatusIndicator,
  type LiveState,
} from "@/components/kratos/base/LiveStatusIndicator";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";

const STATES: LiveState[] = [
  "live",
  "degraded",
  "reconnecting",
  "cached",
  "fallback",
  "offline",
  "loading",
  "empty",
  "error",
];

export const Route = createFileRoute("/sistema")({
  head: () => ({
    meta: [
      { title: "Sistema · KRATOS" },
      {
        name: "description",
        content: "Status detalhado do sistema e referência visual de estados.",
      },
    ],
  }),
  component: SistemaPage,
});

function SistemaPage() {
  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Sistema"
        title="Status detalhado e referência visual"
        description="Visão técnica do sistema. Os 9 estados de live data abaixo servem de referência para o Claude Code mapear ao motor real."
      />

      <section>
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Live status — 9 estados
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STATES.map((state) => (
            <StatusCard key={state}>
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-[12px] font-medium kratos-mono"
                  style={{ color: "var(--kratos-text-primary)" }}
                >
                  {state}
                </span>
                <LiveStatusIndicator state={state} />
              </div>
            </StatusCard>
          ))}
        </div>
      </section>

      <section>
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Estados de painel
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <StatusCard>
            <div
              className="text-[10px] kratos-mono uppercase tracking-[0.15em] mb-3"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              empty
            </div>
            <EmptyState
              title="Sem dados"
              description="Nenhum sinal capturado ainda."
              compact
            />
          </StatusCard>
          <StatusCard>
            <div
              className="text-[10px] kratos-mono uppercase tracking-[0.15em] mb-3"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              loading
            </div>
            <LoadingState lines={4} compact />
          </StatusCard>
          <StatusCard>
            <div
              className="text-[10px] kratos-mono uppercase tracking-[0.15em] mb-3"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              error
            </div>
            <ErrorState
              title="Coletor indisponível"
              description="Falha ao consultar /live/stream."
              hint="código 503"
            />
          </StatusCard>
        </div>
      </section>
    </div>
  );
}
