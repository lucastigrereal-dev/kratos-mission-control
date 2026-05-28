import { createFileRoute } from "@tanstack/react-router";
import { CheckpointsView } from "@/components/kratos/views/CheckpointsView";
import { RouteErrorBoundary } from "@/components/kratos/base/RouteErrorBoundary";

export const Route = createFileRoute("/checkpoints")({
  head: () => ({
    meta: [
      { title: "Checkpoints · KRATOS" },
      {
        name: "description",
        content: "Seu save game mental para retomar sem se perder.",
      },
    ],
  }),
  component: CheckpointsView,
  errorComponent: RouteErrorBoundary,
});
