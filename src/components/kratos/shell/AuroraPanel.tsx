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
        width: open ? 340 : 0,
        borderLeft: open ? "1px solid var(--kratos-border-live)" : "none",
        transition: "width 220ms ease",
      }}
      aria-hidden={!open}
      aria-label="Painel Aurora"
    >
      <div
        className="flex shrink-0 items-center justify-between px-4"
        style={{ height: 52 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid var(--kratos-border-live)",
            }}
            aria-hidden
          >
            <Sparkles
              className="h-3 w-3"
              style={{ color: "var(--kratos-ghost)" }}
            />
          </div>
          <span className="kratos-eyebrow" style={{ color: "var(--kratos-text-secondary)" }}>
            Aurora · Mentor
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 transition-colors hover:bg-white/5 kratos-focus-ring"
          aria-label="Fechar painel Aurora"
        >
          <X className="h-3.5 w-3.5" style={{ color: "var(--kratos-text-muted)" }} />
        </button>
      </div>
      <div className="kratos-aurora-divider" aria-hidden />

      <AuroraPanelContent />
    </aside>
  );
}
