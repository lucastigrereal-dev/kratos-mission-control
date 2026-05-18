import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { CurrentContextHero } from "@/components/kratos/contexto/CurrentContextHero";
import { FocusDriftCard } from "@/components/kratos/contexto/FocusDriftCard";
import { ActiveWindowCard } from "@/components/kratos/contexto/ActiveWindowCard";
import { ContextReasonCard } from "@/components/kratos/contexto/ContextReasonCard";
import { ContextActionStrip } from "@/components/kratos/contexto/ContextActionStrip";
import { BrowserContextList } from "@/components/kratos/contexto/BrowserContextList";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { SourceBadgeIndicator } from "@/components/kratos/base/SourceBadgeIndicator";
import { useContextSnapshot, useContextoMissionSnapshot } from "@/hooks/useContexto";
import type { BrowserTab } from "../../../api-contract/contexto.schema";

type BrowserItemStatus = "active" | "stale" | "distraction" | "unknown";

function mapTabStatus(status: BrowserTab["status"]): BrowserItemStatus {
  switch (status) {
    case "active": return "active";
    case "idle": return "stale";
    case "closed": return "unknown";
  }
}

function mapTabs(tabs: BrowserTab[]) {
  return tabs.slice(0, 5).map((t) => ({
    title: t.title,
    domain: t.domain,
    project: t.project ?? "Indefinido",
    status: mapTabStatus(t.status),
  }));
}

export function ContextoView() {
  const { snapshot, isLoading, isError, error, refetch } = useContextSnapshot();
  const mission = useContextoMissionSnapshot();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <SectionHeader
          eyebrow="Contexto"
          title="Onde você está, onde se perdeu e como voltar."
          description="Carregando snapshot de contexto..."
        />
        <LoadingState lines={6} />
      </div>
    );
  }

  if (isError || !snapshot) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <SectionHeader
          eyebrow="Contexto"
          title="Onde você está, onde se perdeu e como voltar."
          description="Algo falhou ao carregar."
        />
        <ErrorState
          title="Não foi possível carregar o contexto"
          description={error ?? "Snapshot indisponível."}
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

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      <SectionHeader
        eyebrow="Contexto"
        title="Onde você está, onde se perdeu e como voltar."
        description="Save game mental do KRATOS. Sem reconstruir do zero."
      />
      <div className="mb-4">
        <SourceBadgeIndicator meta={mission.meta} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CurrentContextHero
            project={snapshot.project}
            mission={snapshot.mission}
            app={snapshot.app}
            window={snapshot.window}
            status={snapshot.focusStatus}
            confidence={snapshot.confidence}
          />
        </div>
        <FocusDriftCard
          drift={snapshot.drift}
          minutes={snapshot.driftMinutes}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActiveWindowCard
          app={snapshot.activeWindowApp}
          window={snapshot.activeWindowTitle}
          domain={snapshot.activeWindowDomain ?? ""}
          duration={snapshot.activeWindowDuration}
        />
        <ContextReasonCard reasons={snapshot.reasons} />
      </div>

      <div className="mt-4">
        <ContextActionStrip />
      </div>

      <div className="mt-10">
        <div
          className="mb-3 text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          — Camada de detalhe —
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {snapshot.browserTabs.length > 0 ? (
              <BrowserContextList items={mapTabs(snapshot.browserTabs)} />
            ) : (
              <EmptyState
                title="Sem abas detectadas"
                description="O coletor de contexto não encontrou abas ativas."
              />
            )}
          </div>
          <EmptyState
            title="Sem outros sinais agora"
            description="Detectores adicionais entram nos próximos créditos."
          />
        </div>
      </div>
    </div>
  );
}
