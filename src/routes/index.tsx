import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/components/kratos/views/DashboardView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRATOS · Mission Control" },
      {
        name: "description",
        content: "Visão consolidada de projetos, checkpoints, agenda e contexto.",
      },
    ],
  }),
  component: () => <DashboardView />,
});
