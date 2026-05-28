import { createFileRoute } from "@tanstack/react-router";
import { ProjetosView } from "@/components/kratos/views/ProjetosView";
import { RouteErrorBoundary } from "@/components/kratos/base/RouteErrorBoundary";

export const Route = createFileRoute("/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos · KRATOS" },
      { name: "description", content: "Projetos conhecidos e seu estado." },
    ],
  }),
  component: () => <ProjetosView />,
  errorComponent: RouteErrorBoundary,
});
