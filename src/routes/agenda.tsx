import { createFileRoute } from "@tanstack/react-router";
import { AgendaView } from "@/components/kratos/views/AgendaView";
import { RouteErrorBoundary } from "@/components/kratos/base/RouteErrorBoundary";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda · KRATOS" },
      {
        name: "description",
        content:
          "Plano do dia, prazos, atrasados e recomendação do Mentor Operacional.",
      },
    ],
  }),
  component: AgendaView,
  errorComponent: RouteErrorBoundary,
});
