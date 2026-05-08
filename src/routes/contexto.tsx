import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderRoute } from "@/components/kratos/views/PlaceholderRoute";

export const Route = createFileRoute("/contexto")({
  head: () => ({
    meta: [
      { title: "Contexto · KRATOS" },
      {
        name: "description",
        content: "Janelas, abas e sessões — onde sua atenção esteve.",
      },
    ],
  }),
  component: () => (
    <PlaceholderRoute
      eyebrow="Contexto"
      title="Janelas, abas e sessões"
      description="Visão consolidada do contexto ativo do operador."
    />
  ),
});
