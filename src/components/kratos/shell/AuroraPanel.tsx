import { Sparkles, X } from "lucide-react";
import { AuroraPanelContent } from "@/components/kratos/aurora/AuroraPanelContent";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AuroraPanel({ open, onClose }: Props) {
  return (
    <aside
      className="kratos-aurora-glass flex h-full flex-col overflow-hidden"
      style={{
        width: open ? 320 : 0,
        borderLeft: open ? "1px solid var(--kratos-border-live)" : "none",
        transition: "width 220ms ease",
      }}
      aria-hidden={!open}
    >
      <div
        className="flex shrink-0 items-center justify-between px-4"
        style={{ height: 48, borderBottom: "1px solid var(--kratos-border)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles
            className="h-3.5 w-3.5"
            style={{ color: "var(--kratos-ghost)" }}
          />
          <span
            className="text-[11px] kratos-mono uppercase tracking-[0.18em]"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            Aurora · Mentor
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 transition-colors hover:bg-white/5 kratos-focus-ring"
          aria-label="Close Aurora panel"
        >
          <X className="h-3.5 w-3.5" style={{ color: "var(--kratos-text-muted)" }} />
        </button>
      </div>

      <AuroraPanelContent />
    </aside>
  );
}
