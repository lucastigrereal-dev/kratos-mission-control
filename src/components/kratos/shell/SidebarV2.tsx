import {
  Eye,
  Flag,
  ClipboardList,
  Calendar,
  Users,
  Briefcase,
  BarChart3,
  GraduationCap,
  Bot,
  Settings,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { KratosLogo } from "../icons/KratosLogo";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  activeColor: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "VISÃO GERAL",
    icon: Eye,
    color: "var(--kr-island-vision)",
    activeColor: "var(--kr-island-vision)",
  },
  {
    to: "/agora",
    label: "MISSÕES",
    icon: Flag,
    color: "var(--kr-island-mission)",
    activeColor: "var(--kr-island-mission)",
  },
  {
    to: "/projetos",
    label: "PROJETOS",
    icon: ClipboardList,
    color: "var(--kr-island-project)",
    activeColor: "var(--kr-island-project)",
  },
  {
    to: "/agenda",
    label: "AGENDA",
    icon: Calendar,
    color: "var(--kr-island-agenda)",
    activeColor: "var(--kr-island-agenda)",
  },
  {
    to: "/contexto",
    label: "PESSOAS",
    icon: Users,
    color: "var(--kr-island-people)",
    activeColor: "var(--kr-island-people)",
  },
  {
    to: "/",
    label: "RECURSOS",
    icon: Briefcase,
    color: "var(--kr-island-resource)",
    activeColor: "var(--kr-island-resource)",
  },
  {
    to: "/",
    label: "ANÁLISES",
    icon: BarChart3,
    color: "var(--kr-island-analytics)",
    activeColor: "var(--kr-island-analytics)",
  },
  {
    to: "/",
    label: "ACADEMY",
    icon: GraduationCap,
    color: "var(--kr-island-academy)",
    activeColor: "var(--kr-island-academy)",
  },
  {
    to: "/ilhas/omnis",
    label: "OMNIS LAB",
    icon: Bot,
    color: "var(--kr-island-omnis)",
    activeColor: "var(--kr-island-omnis)",
  },
  {
    to: "/sistema",
    label: "CONFIGURAÇÕES",
    icon: Settings,
    color: "var(--kr-island-settings)",
    activeColor: "var(--kr-island-settings)",
  },
];

interface SidebarV2Props {
  collapsed: boolean;
  onToggle: () => void;
}

function SidebarItemV2({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active =
    pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));

  return (
    <Link
      to={item.to}
      className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-150 kratos-focus-ring ${
        active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
      }`}
      style={{
        color: active ? item.activeColor : "var(--kr-text-secondary, #8a8a9a)",
      }}
      title={collapsed ? item.label : undefined}
    >
      <item.icon
        className="h-[18px] w-[18px] shrink-0"
        style={{ color: active ? item.activeColor : item.color }}
        strokeWidth={active ? 2.5 : 2}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {active && (
        <span
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
          style={{
            background: item.activeColor,
            boxShadow: `0 0 8px ${item.activeColor}`,
          }}
          aria-hidden
        />
      )}
    </Link>
  );
}

export function SidebarV2({ collapsed, onToggle }: SidebarV2Props) {
  return (
    <aside
      className="fixed left-0 top-0 z-[80] flex h-full flex-col"
      style={{
        width: collapsed ? 60 : 232,
        background: "var(--kr-glass-strong-bg, rgba(10, 22, 40, 0.95))",
        borderRight:
          "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "width 200ms ease",
      }}
      aria-label="Navegação principal"
    >
      {/* Logo area */}
      <div
        className="flex items-center px-3"
        style={{
          height: 90,
          borderBottom:
            "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <KratosLogo collapsed={collapsed} />
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto kratos-scrollbar p-2">
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItemV2
              key={item.label}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div
        className="p-2"
        style={{
          borderTop:
            "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-[10px] kratos-mono uppercase tracking-[0.15em] transition-colors duration-150 kratos-focus-ring"
          style={{
            color: "var(--kr-text-muted, #4a4a5a)",
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
