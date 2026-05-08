import { createFileRoute } from "@tanstack/react-router";
import { CheckpointsView } from "@/components/kratos/views/CheckpointsView";

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
});
