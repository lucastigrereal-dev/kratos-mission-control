import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { EmptyState } from "@/components/kratos/base/EmptyState";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function PlaceholderRoute({
  eyebrow,
  title,
  description,
  emptyTitle = "Conteúdo virá no próximo crédito",
  emptyDescription = "Esta tela faz parte do shell visual. A camada de dados será conectada pelo Claude Code no repositório KRATOS.",
}: Props) {
  return (
    <div className="space-y-8">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <StatusCard>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </StatusCard>
    </div>
  );
}
