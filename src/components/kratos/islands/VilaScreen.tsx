import { Home } from "lucide-react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { EmptyState } from "@/components/kratos/base/EmptyState";

export function VilaScreen() {
  return (
    <IslandPageFrame theme="vila">
      <IslandPageHeader
        title="VILA"
        subtitle="Rotina, Família e Bem-Estar"
        theme="vila"
      />
      <EmptyState
        icon={<Home className="h-4 w-4" />}
        title="Sem rotina configurada"
        description="Esta ilha exibirá rotina diária e bem-estar quando integrada a um tracker."
      />
    </IslandPageFrame>
  );
}
