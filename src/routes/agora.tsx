import { createFileRoute } from "@tanstack/react-router";
import { AgoraView } from "@/components/kratos/views/AgoraView";
import { RouteErrorBoundary } from "@/components/kratos/base/RouteErrorBoundary";

export const Route = createFileRoute("/agora")({
  head: () => ({
    meta: [
      { title: "Agora · KRATOS" },
      {
        name: "description",
        content: "Foco atual, próxima ação, alertas e deadline em uma só tela.",
      },
    ],
  }),
  component: () => <AgoraView />,
  errorComponent: RouteErrorBoundary,
});
