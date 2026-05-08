import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderRoute } from "@/components/kratos/views/PlaceholderRoute";

export const Route = createFileRoute("/checkpoints")({
  head: () => ({
    meta: [
      { title: "Checkpoints · KRATOS" },
      {
        name: "description",
        content: "Timeline de checkpoints salvos pelo operador.",
      },
    ],
  }),
  component: () => (
    <PlaceholderRoute
      eyebrow="Checkpoints"
      title="Timeline de estados salvos"
      description="Pontos de retorno seguros por sessão e por projeto."
    />
  ),
});
