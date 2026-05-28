import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { IslandPageFrame } from "@/components/kratos/islands/shared/IslandPageFrame";
import { IslandPageHeader } from "@/components/kratos/islands/shared/IslandPageHeader";
import { useIslandDock, type IslandDockData } from "@/components/kratos/islands/shared/IslandDockContext";

const ISLAND_THEMES: Record<string, string> = {
  omnis: "var(--kr-island-omnis)",
  agencia: "var(--kr-island-agencia)",
  akasha: "var(--kr-island-akasha)",
  nimbus: "var(--kr-island-nimbus)",
  arena: "var(--kr-island-arena)",
  vila: "var(--kr-island-vila)",
  forja: "var(--kr-island-forja)",
  observatorio: "var(--kr-island-observatorio)",
  filosofia: "var(--kr-island-filosofia)",
  tesouro: "var(--kr-island-tesouro)",
};

const ISLAND_TITLES: Record<string, { title: string; subtitle: string }> = {
  omnis: { title: "OMNIS LAB", subtitle: "Centro de IA, Automações e Inteligência de Execução" },
  agencia: {
    title: "AGÊNCIA / ESTÚDIO",
    subtitle: "Conteúdo, Marca e Comunicação que constroem autoridade e geram impacto",
  },
  akasha: {
    title: "AKASHA / GRINGOTTS",
    subtitle: "Banco de Conhecimento, Memória e Arquivos",
  },
  nimbus: { title: "NIMBUS ACADEMY", subtitle: "Sua vassoura mágica. Vá para onde precisar." },
  arena: { title: "ARENA COMERCIAL", subtitle: "Vendas, Negociação e Conquistas" },
  vila: { title: "VILA VIVA", subtitle: "Família, Filhos e Vida Real" },
  forja: { title: "FORJA / CORPO", subtitle: "Treino, Saúde e Disciplina" },
  observatorio: { title: "OBSERVATÓRIO", subtitle: "Ideias, Visão e Estratégia" },
  filosofia: {
    title: "FILOSOFIA & SABEDORIA",
    subtitle: "Aprendizado, Filosofia e Evolução Pessoal",
  },
  tesouro: { title: "TESOURO / FINANÇAS", subtitle: "Finanças Pessoais e Investimentos" },
};

// Dock defaults — screens with real data sources override these via useIslandDock().setData().
// Islands without a real data source use value: undefined + progress: 0 (honest empty).
// Financial values are NEVER hardcoded here (arena, tesouro).
const ISLAND_DOCK_DATA: Record<string, IslandDockData> = {
  omnis: { islandId: "omnis", label: "Agents Ativos", progressColor: "var(--kr-island-omnis)", quickActions: [{ label: "Run Crew" }, { label: "Stop All" }] },
  agencia: { islandId: "agencia", label: "Alcance", progressColor: "var(--kr-island-agencia)", quickActions: [{ label: "Criar Conteúdo" }, { label: "Agendar" }] },
  akasha: { islandId: "akasha", label: "Vault", progressColor: "var(--kr-island-akasha)", quickActions: [{ label: "Buscar" }, { label: "Sync" }] },
  nimbus: { islandId: "nimbus", label: "Viagens", progressColor: "var(--kr-island-nimbus)", quickActions: [{ label: "+ Destino" }, { label: "Checklist" }] },
  arena: { islandId: "arena", label: "Pipeline", progressColor: "var(--kr-island-arena)", quickActions: [{ label: "Novo Lead" }, { label: "Follow-up" }] },
  vila: { islandId: "vila", label: "Rotina", progressColor: "var(--kr-island-vila)", quickActions: [{ label: "Nova Tarefa" }, { label: "Evento" }] },
  forja: { islandId: "forja", label: "Treino", progressColor: "var(--kr-island-forja)", quickActions: [{ label: "Registrar Treino" }, { label: "+ Água" }] },
  observatorio: { islandId: "observatorio", label: "Projetos", progressColor: "var(--kr-island-observatorio)", quickActions: [{ label: "Ver Todos" }] },
  filosofia: { islandId: "filosofia", label: "Leitura", progressColor: "var(--kr-island-filosofia)", quickActions: [{ label: "Novo Insight" }, { label: "Meta" }] },
  tesouro: { islandId: "tesouro", label: "Finanças", progressColor: "var(--kr-island-tesouro)", quickActions: [{ label: "Registrar" }, { label: "Meta" }] },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ISLAND_SCREENS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  omnis: lazy(() =>
    import("@/components/kratos/islands/OmnisLabScreen").then((m) => ({ default: m.OmnisLabScreen })),
  ),
  agencia: lazy(() =>
    import("@/components/kratos/islands/AgenciaScreen").then((m) => ({
      default: m.AgenciaScreen,
    })),
  ),
  akasha: lazy(() =>
    import("@/components/kratos/islands/AkashaScreen").then((m) => ({ default: m.AkashaScreen })),
  ),
  nimbus: lazy(() =>
    import("@/components/kratos/islands/NimbusScreen").then((m) => ({ default: m.NimbusScreen })),
  ),
  arena: lazy(() =>
    import("@/components/kratos/islands/ArenaScreen").then((m) => ({ default: m.ArenaScreen })),
  ),
  vila: lazy(() =>
    import("@/components/kratos/islands/VilaScreen").then((m) => ({ default: m.VilaScreen })),
  ),
  forja: lazy(() =>
    import("@/components/kratos/islands/ForjaScreen").then((m) => ({ default: m.ForjaScreen })),
  ),
  observatorio: lazy(() =>
    import("@/components/kratos/islands/ObservatorioScreen").then((m) => ({
      default: m.ObservatorioScreen,
    })),
  ),
  filosofia: lazy(() =>
    import("@/components/kratos/islands/FilosofiaScreen").then((m) => ({
      default: m.FilosofiaScreen,
    })),
  ),
  tesouro: lazy(() =>
    import("@/components/kratos/islands/TesouroScreen").then((m) => ({
      default: m.TesouroScreen,
    })),
  ),
};

function IslandRoute() {
  const { islandId } = Route.useParams();
  const navigate = Route.useNavigate();
  const { setData } = useIslandDock();
  const theme = ISLAND_THEMES[islandId] ?? "var(--kratos-accent)";
  const meta = ISLAND_TITLES[islandId] ?? {
    title: islandId.toUpperCase(),
    subtitle: "Ilha desconhecida",
  };
  const Screen = ISLAND_SCREENS[islandId];

  useEffect(() => {
    const dockData = ISLAND_DOCK_DATA[islandId];
    if (dockData) setData(dockData);
    return () => setData(null);
  }, [islandId, setData]);

  if (!Screen) {
    return (
      <IslandPageFrame theme={theme}>
        <IslandPageHeader
          title={meta.title}
          subtitle={meta.subtitle}
          theme={theme}
          onBack={() => navigate({ to: "/" })}
        />
        <div
          className="flex items-center justify-center py-20"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Ilha ainda não mapeada.
        </div>
      </IslandPageFrame>
    );
  }

  return (
    <Suspense
      fallback={
        <IslandPageFrame theme={theme}>
          <IslandPageHeader
            title={meta.title}
            subtitle={meta.subtitle}
            theme={theme}
            onBack={() => navigate({ to: "/" })}
          />
          <div className="p-6">
            <LoadingState lines={8} />
          </div>
        </IslandPageFrame>
      }
    >
      <Screen />
    </Suspense>
  );
}

export const Route = createFileRoute("/ilhas/$islandId")({
  head: ({ params }) => ({
    meta: [
      {
        title: `${ISLAND_TITLES[params.islandId]?.title ?? params.islandId.toUpperCase()} · KRATOS`,
      },
    ],
  }),
  component: IslandRoute,
});
