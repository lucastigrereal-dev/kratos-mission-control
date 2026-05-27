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

  const omnisConfigured = omnisConfig.data?.configured;
  const ghConfigured = ghConfig.data?.configured;
  const hasMissingConfig = !omnisConfigured || !ghConfigured;
  const degradedServices = services.filter((s) => s.health === "degraded" || s.health === "offline");
  const hasIssues = degradedServices.length > 0 || omError || crError || jbError;

  const nextAction = hasMissingConfig
    ? [
        !omnisConfigured && "configurar OMNIS",
        !ghConfigured && "configurar GitHub",
      ]
        .filter(Boolean)
        .join(" e ") + " para monitoramento completo"
    : hasIssues
      ? "Verifique os serviços com alerta abaixo"
      : "Todos os serviços operacionais";

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
              color: "var(--kratos-text-secondary)",
              borderColor:
                workerHealth.status === "ok"
                  ? "var(--kratos-ok)"
                  : workerHealth.status === "degraded"
                    ? "var(--kratos-warn)"
                    : "var(--kratos-critical)",
            }}
            role="status"
            aria-label={`Worker status: ${workerHealth.status}, version ${workerHealth.version}`}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  workerHealth.status === "ok"
                    ? "var(--kratos-ok)"
                    : workerHealth.status === "degraded"
                      ? "var(--kratos-warn)"
                      : "var(--kratos-critical)",
              }}
              aria-hidden
            />
            Worker: {workerHealth.status} · v{workerHealth.version}
          </span>
        )}
        {omnisConfig.data && !omnisConfig.data.configured && (
          <span
            className="text-[0.65rem] rounded-full border px-2 py-0.5"
            style={{
              color: "var(--kratos-text-muted)",
              borderColor: "var(--kratos-warn)",
              background: "color-mix(in oklab, var(--kratos-warn) 8%, transparent)",
            }}
          >
            OMNIS não configurado
          </span>
        )}
        {ghConfig.data && !ghConfig.data.configured && (
          <span
            className="text-[0.65rem] rounded-full border px-2 py-0.5"
            style={{
              color: "var(--kratos-text-muted)",
              borderColor: "var(--kratos-warn)",
              background: "color-mix(in oklab, var(--kratos-warn) 8%, transparent)",
            }}
          >
            GitHub não configurado
          </span>
        )}
      </div>

      {/* Source badge */}
      <SourceBadgeIndicator
        meta={{
          source: omError ? "error" : omLoading ? "cache" : "live",
          origin: "omnis",
          errors: omError ? [(omErr as Error)?.message ?? "Falha ao carregar status do OMNIS"] : [],
          stale: omError,
          updated_at: omnis?.atualizadoEm ?? new Date().toISOString(),
          confidence: omError ? 0 : 90,
        }}
        size="sm"
      />

      {/* Next action summary */}
      <div
        className="mb-6 text-[12px]"
        style={{ color: hasMissingConfig ? "var(--kratos-warn)" : "var(--kratos-text-secondary)" }}
      >
        Próxima ação: {nextAction}
      </div>

      {/* KRATOS service health */}
      <section>
        <div className="kratos-eyebrow mb-3">KRATOS — Serviços monitorados</div>
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
        <div className="kratos-eyebrow mb-3 flex items-center justify-between">
          <span>OMNIS — Serviços</span>
          {omnis?.test_count != null && (
            <span
              className="text-[10px] kratos-mono rounded px-1.5 py-0.5"
              style={{
                color: "var(--kratos-text-muted)",
                background: "color-mix(in oklab, var(--kratos-ok) 10%, transparent)",
                border: "1px solid color-mix(in oklab, var(--kratos-ok) 25%, transparent)",
              }}
            >
              {omnis.test_count.toLocaleString("pt-BR")} testes
            </span>
          )}
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
        <div className="kratos-eyebrow mb-3">OMNIS — Crews</div>
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
        <div className="kratos-eyebrow mb-3">OMNIS — Jobs recentes</div>
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
        <div className="kratos-eyebrow mb-3">Referência — 9 estados de live status</div>
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
        <div className="kratos-eyebrow mb-3">Referência — estados de painel</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <StatusCard>
            <div className="kratos-eyebrow mb-3">empty</div>
            <EmptyState
              title="Sem dados"
              description="Nenhum sinal capturado ainda."
              compact
            />
          </StatusCard>
          <StatusCard>
            <div className="kratos-eyebrow mb-3">loading</div>
            <LoadingState lines={4} compact />
          </StatusCard>
          <StatusCard>
            <div className="kratos-eyebrow mb-3">error</div>
            <ErrorState
              title="Coletor indisponível"
              description="Falha ao consultar /v1/events/status."
              hint="código 503"
            />
          </StatusCard>
        </div>
      </section>
    </div>
  );
}
