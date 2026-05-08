import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderRoute } from "@/components/kratos/views/PlaceholderRoute";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda · KRATOS" },
      { name: "description", content: "Eventos, prazos e calendário do operador." },
    ],
  }),
  component: () => (
    <PlaceholderRoute
      eyebrow="Agenda"
      title="Calendário e prazos"
      description="Próximos compromissos e deadlines em ordem de urgência."
    />
  ),
});
