import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { IslandPageFrame } from "@/components/kratos/islands/shared/IslandPageFrame";
import { IslandPageHeader } from "@/components/kratos/islands/shared/IslandPageHeader";

const ISLAND_THEMES: Record<string, string> = {
  omnis: "#7C3AED",
  agencia: "#F97316",
  akasha: "#059669",
  nimbus: "#0EA5E9",
  arena: "#EF4444",
  vila: "#16A34A",
  forja: "#F59E0B",
  observatorio: "#3B82F6",
  filosofia: "#6366F1",
  tesouro: "#F59E0B",
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

const ISLAND_SCREENS: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
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
  const theme = ISLAND_THEMES[islandId] ?? "var(--kratos-accent)";
  const meta = ISLAND_TITLES[islandId] ?? {
    title: islandId.toUpperCase(),
    subtitle: "Ilha desconhecida",
  };
  const Screen = ISLAND_SCREENS[islandId];

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
