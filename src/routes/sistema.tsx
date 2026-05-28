import { createFileRoute } from "@tanstack/react-router";
import { SistemaView } from "@/components/kratos/views/SistemaView";
import { RouteErrorBoundary } from "@/components/kratos/base/RouteErrorBoundary";

export const Route = createFileRoute("/sistema")({
  head: () => ({
    meta: [
      { title: "Sistema · KRATOS" },
      {
        name: "description",
        content: "Status detalhado do sistema e referência visual de estados.",
      },
    ],
  }),
  component: SistemaPage,
  errorComponent: RouteErrorBoundary,
});

function SistemaPage() {
  return <SistemaView />;
}
