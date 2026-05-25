import { BookOpen } from "lucide-react";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { EmptyState } from "@/components/kratos/base/EmptyState";

export function FilosofiaScreen() {
  return (
    <IslandPageFrame theme="filosofia">
      <IslandPageHeader
        title="FILOSOFIA"
        subtitle="Conhecimento, Leitura e Sabedoria"
        theme="filosofia"
      />
      <EmptyState
        icon={<BookOpen className="h-4 w-4" />}
        title="Sem insights registrados"
        description="Esta ilha exibirá leituras e insights da Biblioteca Sabedoria quando integrada."
      />
    </IslandPageFrame>
  );
}
