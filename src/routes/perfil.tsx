import { createFileRoute } from "@tanstack/react-router";
import { UserProfileScreen } from "@/components/kratos/pro/UserProfileScreen";
import { RouteErrorBoundary } from "@/components/kratos/base/RouteErrorBoundary";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil · KRATOS" },
      {
        name: "description",
        content: "Perfil do operador, conexões do sistema e setup KRATOS.",
      },
    ],
  }),
  component: PerfilPage,
  errorComponent: RouteErrorBoundary,
});

function PerfilPage() {
  return (
    <div
      className="flex-1 overflow-y-auto kratos-scrollbar"
      style={{ padding: "var(--kr-space-4, 1rem)" }}
    >
      <UserProfileScreen />
    </div>
  );
}
