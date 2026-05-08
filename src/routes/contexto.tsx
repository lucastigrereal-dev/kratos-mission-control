import { createFileRoute } from "@tanstack/react-router";
import { ContextoView } from "@/components/kratos/views/ContextoView";

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
});
