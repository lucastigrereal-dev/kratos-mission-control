import { History } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { CheckpointItemCard, type CheckpointItem } from "./CheckpointItemCard";

interface Props {
  items: CheckpointItem[];
  onResume?: (id: string) => void;
  onDelete?: (id: string) => void;
  pendingId?: string | null;
}

export function CheckpointTimeline({
  items,
  onResume,
  onDelete,
  pendingId,
}: Props) {
  return (
    <StatusCard>
      <div className="flex items-center gap-2 mb-4">
        <History
          className="h-3.5 w-3.5"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span
          className="text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Timeline de retomada
        </span>
      </div>

      <ol className="relative space-y-4 pl-5">
        <span
          aria-hidden
          className="absolute left-1.5 top-1 bottom-1 w-px"
          style={{ background: "var(--kratos-border)" }}
        />
        {items.map((item) => (
          <li key={item.id} className="relative">
            <span
              aria-hidden
              className="absolute -left-[14px] top-4 inline-block h-2 w-2 rounded-full"
              style={{
                background: "var(--kratos-surface-0)",
                border: `2px solid var(--kratos-${item.age === "recente" ? "ok" : "text-muted"})`,
              }}
            />
            <CheckpointItemCard
              item={item}
              onResume={onResume}
              onDelete={onDelete}
              isPending={pendingId === item.id}
            />
          </li>
        ))}
      </ol>
    </StatusCard>
  );
}
