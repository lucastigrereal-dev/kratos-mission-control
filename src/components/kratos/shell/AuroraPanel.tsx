import { Sparkles, X } from "lucide-react";

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

      <div className="flex-1 overflow-y-auto kratos-scrollbar p-4 space-y-4">
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          Espaço reservado para sinais do Mentor, sugestões contextuais e
          conversação Aurora.
        </p>

        <div
          className="rounded-md p-3"
          style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid var(--kratos-border-live)",
          }}
        >
          <div
            className="text-[10px] kratos-mono uppercase tracking-[0.15em] mb-1.5"
            style={{ color: "var(--kratos-ghost)" }}
          >
            Sinal sugerido
          </div>
          <div
            className="text-[12px] leading-relaxed"
            style={{ color: "var(--kratos-text-primary)" }}
          >
            Painel visual em construção. Conexão com o motor real será feita
            no próximo crédito.
          </div>
        </div>
      </div>

      <div
        className="shrink-0 p-3"
        style={{ borderTop: "1px solid var(--kratos-border)" }}
      >
        <div
          className="rounded-md px-3 py-2 text-[11px] kratos-mono"
          style={{
            background: "var(--kratos-surface-3)",
            color: "var(--kratos-text-muted)",
            border: "1px solid var(--kratos-border)",
          }}
        >
          Pergunte algo ao Mentor…
        </div>
      </div>
    </aside>
  );
}
