import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderRoute } from "@/components/kratos/views/PlaceholderRoute";

export const Route = createFileRoute("/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos · KRATOS" },
      { name: "description", content: "Projetos conhecidos e seu estado." },
    ],
  }),
  component: () => (
    <PlaceholderRoute
      eyebrow="Projetos"
      title="Projetos conhecidos"
      description="Repositórios, branches ativos e foco recente."
    />
  ),
});
