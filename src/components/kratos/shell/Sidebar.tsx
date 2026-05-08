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

const NAV = [
  { to: "/agora",       label: "Agora",       icon: Activity },
  { to: "/contexto",    label: "Contexto",    icon: Layers },
  { to: "/checkpoints", label: "Checkpoints", icon: GitCommitHorizontal },
  { to: "/projetos",    label: "Projetos",    icon: FolderKanban },
  { to: "/agenda",      label: "Agenda",      icon: Calendar },
  { to: "/sistema",     label: "Sistema",     icon: Cpu },
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
        width: collapsed ? 56 : 220,
        background: "var(--kratos-surface-1)",
        borderRight: "1px solid var(--kratos-border)",
        transition: "width 200ms ease",
      }}
    >
      <div
        className="flex items-center px-3"
        style={{
          height: 48,
          borderBottom: "1px solid var(--kratos-border)",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <KratosLogo collapsed={collapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto kratos-scrollbar p-2">
        <div className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <SidebarItem key={item.to} {...item} collapsed={collapsed} />
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
          className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-[11px] transition-colors duration-150 kratos-focus-ring"
          style={{
            color: "var(--kratos-text-muted)",
            background: "transparent",
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <>
              <PanelLeftClose className="h-3.5 w-3.5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
