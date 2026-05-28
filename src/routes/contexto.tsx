import { createFileRoute } from "@tanstack/react-router";
import { ContextoView } from "@/components/kratos/views/ContextoView";
import { RouteErrorBoundary } from "@/components/kratos/base/RouteErrorBoundary";

export const Route = createFileRoute("/contexto")({
  head: () => ({
    meta: [
      { title: "Contexto · KRATOS" },
      {
        name: "description",
        content: "Onde você está, onde se perdeu e como voltar.",
      },
    ],
  }),
  component: ContextoView,
  errorComponent: RouteErrorBoundary,
});
