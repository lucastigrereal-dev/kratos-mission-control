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
import { ServiceHealthCard } from "@/components/kratos/sistema/ServiceHealthCard";
import { useServices } from "@/hooks/useServices";

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
  const { services, isLoading } = useServices();

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
      <SectionHeader
        eyebrow="Sistema"
        title="Saúde dos serviços e referência visual"
        description="Serviços monitorados pelo KRATOS. Os estados abaixo servem de referência para o Claude Code mapear ao motor real."
      />

      {/* Real service health */}
      <section>
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Serviços monitorados
        </div>
        {isLoading ? (
          <LoadingState lines={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {services.map((s) => (
              <ServiceHealthCard key={s.id} {...s} />
            ))}
          </div>
        )}
      </section>

      {/* Reference gallery */}
      <section>
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Referência — 9 estados de live status
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
          Referência — estados de painel
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
