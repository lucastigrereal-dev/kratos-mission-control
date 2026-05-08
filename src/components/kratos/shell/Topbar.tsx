import { useRouterState, Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";
import { LiveStatusIndicator, type LiveState } from "../base/LiveStatusIndicator";

const ROUTE_LABEL: Record<string, string> = {
  "/": "Agora",
  "/agora": "Agora",
  "/contexto": "Contexto",
  "/checkpoints": "Checkpoints",
  "/projetos": "Projetos",
  "/agenda": "Agenda",
  "/sistema": "Sistema",
};

type Props = {
  liveState: LiveState;
  lastUpdate: string;
  onToggleAurora: () => void;
  auroraOpen: boolean;
};

export function Topbar({ liveState, lastUpdate, onToggleAurora, auroraOpen }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = ROUTE_LABEL[pathname] ?? "Mission Control";

  return (
    <header
      className="flex items-center justify-between px-5"
      style={{
        height: 48,
        background: "var(--kratos-surface-1)",
        borderBottom: "1px solid var(--kratos-border)",
      }}
    >
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[12px] kratos-mono"
      >
        <Link
          to="/agora"
          className="transition-colors hover:text-[var(--kratos-text-primary)]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          KRATOS
        </Link>
        <ChevronRight
          className="h-3 w-3"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <span style={{ color: "var(--kratos-text-primary)" }}>{current}</span>
      </nav>

      <div className="flex items-center gap-2">
        <LiveStatusIndicator state={liveState} lastUpdate={lastUpdate} />
        <button
          type="button"
          onClick={onToggleAurora}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] kratos-mono uppercase tracking-[0.15em] transition-colors duration-150 kratos-focus-ring"
          style={{
            background: auroraOpen
              ? "rgba(99,102,241,0.12)"
              : "var(--kratos-surface-2)",
            border: `1px solid ${
              auroraOpen ? "var(--kratos-border-live)" : "var(--kratos-border)"
            }`,
            color: auroraOpen
              ? "var(--kratos-ghost)"
              : "var(--kratos-text-secondary)",
          }}
          aria-pressed={auroraOpen}
        >
          <Sparkles className="h-3 w-3" />
          Aurora
        </button>
      </div>
    </header>
  );
}
