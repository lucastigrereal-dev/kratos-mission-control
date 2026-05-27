import { Dumbbell } from "lucide-react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { EmptyState } from "@/components/kratos/base/EmptyState";

export function ForjaScreen() {
  return (
    <IslandPageFrame theme="forja">
      <IslandPageHeader
        title="FORJA"
        subtitle="Corpo, Treino e Saúde Física"
        theme="forja"
      />
      <EmptyState
        icon={<Dumbbell className="h-4 w-4" />}
        title="Sem dados de treino"
        description="Esta ilha exibirá métricas de treino e saúde quando integrada a um tracker."
      />
    </IslandPageFrame>
  );
}
