import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { LiveStatusIndicator, type LiveState } from "@/components/kratos/base/LiveStatusIndicator";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { ServiceHealthCard } from "@/components/kratos/sistema/ServiceHealthCard";
import { OmnisServiceStatusCard } from "@/components/kratos/sistema/OmnisServiceStatusCard";
import { OmnisCrewCard } from "@/components/kratos/sistema/OmnisCrewCard";
import { OmnisJobItem } from "@/components/kratos/sistema/OmnisJobItem";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import { useServices, useWorkerHealth } from "@/hooks/useServices";
import { useOmnisStatus, useOmnisCrews, useOmnisJobs, useOmnisConfig } from "@/hooks/useOmnis";
import { useGithubConfig } from "@/hooks/useGithub";

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

export function SistemaView() {
  const { services, isLoading: krLoading } = useServices();
  const { health: workerHealth, isLoading: whLoading } = useWorkerHealth();
  const omnisConfig = useOmnisConfig();
  const ghConfig = useGithubConfig();
  const { data: omnis, isLoading: omLoading, isError: omError, error: omErr } = useOmnisStatus();
  const { data: crews, isLoading: crLoading, isError: crError, error: crErr } = useOmnisCrews();
  const { data: jobs, isLoading: jbLoading, isError: jbError, error: jbErr } = useOmnisJobs(5);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8 space-y-10">
      <SectionHeader
        eyebrow="Sistema"
        title="Saúde dos serviços e referência visual"
        description="Serviços monitorados pelo KRATOS e OMNIS. Os estados abaixo servem de referência para o Claude Code mapear ao motor real."
      />

      {/* Worker Health + Config badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {!whLoading && workerHealth && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.65rem]"
            style={{
              color: "var(--kr-color-text-secondary)",
              borderColor:
                workerHealth.status === "ok"
                  ? "var(--kr-color-mission)"
                  : workerHealth.status === "degraded"
                    ? "var(--kr-color-amber)"
                    : "var(--kr-color-risk)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  workerHealth.status === "ok"
                    ? "var(--kr-color-mission)"
                    : workerHealth.status === "degraded"
                      ? "var(--kr-color-amber)"
                      : "var(--kr-color-risk)",
              }}
            />
            Worker: {workerHealth.status} · v{workerHealth.version}
          </span>
        )}
        {omnisConfig.data && !omnisConfig.data.configured && (
          <span
            className="text-[0.65rem] rounded-full border px-2 py-0.5"
            style={{
              color: "var(--kr-color-text-muted)",
              borderColor: "var(--kr-color-amber)",
              background: "color-mix(in oklab, var(--kr-color-amber) 8%, transparent)",
            }}
          >
            OMNIS não configurado
          </span>
        )}
        {ghConfig.data && !ghConfig.data.configured && (
          <span
            className="text-[0.65rem] rounded-full border px-2 py-0.5"
            style={{
              color: "var(--kr-color-text-muted)",
              borderColor: "var(--kr-color-amber)",
              background: "color-mix(in oklab, var(--kr-color-amber) 8%, transparent)",
            }}
          >
            GitHub não configurado
          </span>
        )}
      </div>

      {/* KRATOS service health */}
      <section>
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          KRATOS — Serviços monitorados
        </div>
        {krLoading ? (
          <LoadingState lines={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {services.map((s) => (
              <ServiceHealthCard key={s.id} {...s} />
            ))}
          </div>
        )}
      </section>

      {/* OMNIS — services */}
      <section>
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          OMNIS — Serviços
        </div>
        {omLoading ? (
          <LoadingState lines={4} />
        ) : omError ? (
          <ErrorState
            title="OMNIS indisponível"
            description={omErr?.message ?? "Falha ao consultar status do OMNIS."}
            hint="bridge /api/omnis/status"
          />
        ) : !omnis || omnis.servicos.length === 0 ? (
          <EmptyState title="OMNIS sem sinal" description="Nenhum serviço OMNIS reportando." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {omnis.servicos.map((svc) => (
              <OmnisServiceStatusCard key={svc.nome} service={svc} />
            ))}
          </div>
        )}
      </section>

      {/* OMNIS — crews */}
      <section>
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          OMNIS — Crews
        </div>
        {crLoading ? (
          <LoadingState lines={3} />
        ) : crError ? (
          <ErrorState
            title="Crews indisponíveis"
            description={crErr?.message ?? "Falha ao listar crews OMNIS."}
          />
        ) : !crews || crews.length === 0 ? (
          <EmptyState title="Nenhuma crew ativa" description="Nenhuma crew registrada no OMNIS." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {crews.map((crew) => (
              <OmnisCrewCard key={crew.nome} crew={crew} />
            ))}
          </div>
        )}
      </section>

      {/* OMNIS — jobs */}
      <section>
        <div
          className="text-[10px] kratos-mono uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          OMNIS — Jobs recentes
        </div>
        {jbLoading ? (
          <LoadingState lines={4} />
        ) : jbError ? (
          <ErrorState
            title="Jobs indisponíveis"
            description={jbErr?.message ?? "Falha ao listar jobs OMNIS."}
          />
        ) : !jobs || jobs.length === 0 ? (
          <EmptyState title="Nenhum job recente" description="Fila de jobs OMNIS vazia." />
        ) : (
          <div className="space-y-1.5">
            {jobs.map((job) => (
              <OmnisJobItem key={job.id} job={job} />
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
