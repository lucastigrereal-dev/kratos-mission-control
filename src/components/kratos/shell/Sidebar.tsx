import {
  Activity,
  Layers,
  GitCommitHorizontal,
  FolderKanban,
  Calendar,
  Cpu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { KratosLogo } from "../icons/KratosLogo";

const NAV_GROUPS = [
  {
    label: "Operação",
    items: [
      { to: "/agora", label: "Agora", icon: Activity },
      { to: "/agenda", label: "Agenda", icon: Calendar },
      { to: "/projetos", label: "Projetos", icon: FolderKanban },
    ],
  },
  {
    label: "Memória",
    items: [
      { to: "/contexto", label: "Contexto", icon: Layers },
      { to: "/checkpoints", label: "Checkpoints", icon: GitCommitHorizontal },
    ],
  },
  {
    label: "Sistema",
    items: [{ to: "/sistema", label: "Sistema", icon: Cpu }],
  },
];

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <aside
      className="flex h-full flex-col"
      style={{
        width: collapsed ? 60 : 232,
        background: "var(--kratos-surface-1)",
        borderRight: "1px solid var(--kratos-border)",
        transition: "width 200ms ease",
      }}
      aria-label="Navegação principal"
    >
      <div
        className="flex items-center px-3"
        style={{
          height: 52,
          borderBottom: "1px solid var(--kratos-border)",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <KratosLogo collapsed={collapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto kratos-scrollbar p-2">
        <div className="flex flex-col gap-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              {!collapsed && (
                <div className="kratos-eyebrow px-2.5 mb-1.5">
                  {group.label}
                </div>
              )}
              {collapsed && (
                <div
                  className="mx-auto mb-1.5 h-px w-5"
                  style={{ background: "var(--kratos-border)" }}
                  aria-hidden
                />
              )}
              {group.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  {...item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          ))}
        </div>
      </nav>

      <div
        className="p-2"
        style={{ borderTop: "1px solid var(--kratos-border)" }}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-[10px] kratos-mono uppercase tracking-[0.15em] transition-colors duration-150 kratos-focus-ring"
          style={{
            color: "var(--kratos-text-muted)",
            background: "transparent",
          }}
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <>
              <PanelLeftClose className="h-3.5 w-3.5" />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
