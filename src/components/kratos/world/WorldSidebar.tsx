import { useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  FolderKanban,
  CalendarDays,
  Users,
  Library,
  BarChart3,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface WorldSidebarProps {
  className?: string;
  collapsed: boolean;
  onToggle: () => void;
}

const MENU_ITEMS = [
  { id: "visao",     label: "VISÃO GERAL",    icon: LayoutDashboard, path: "/" as const },
  { id: "missoes",   label: "MISSÕES",         icon: Target,          path: "/agora" as const },
  { id: "projetos",  label: "PROJETOS",        icon: FolderKanban,    path: "/projetos" as const },
  { id: "agenda",    label: "AGENDA",          icon: CalendarDays,    path: "/agenda" as const },
  { id: "pessoas",   label: "PESSOAS",         icon: Users,           path: "/contexto" as const },
  { id: "recursos",  label: "RECURSOS",        icon: Library,         path: "/sistema" as const },
  { id: "analises",  label: "ANÁLISES",        icon: BarChart3,       path: "/sistema" as const },
  { id: "academy",   label: "ACADEMY",         icon: GraduationCap,   path: "/sistema" as const },
  { id: "config",    label: "CONFIGURAÇÕES",   icon: Settings,        path: "/sistema" as const },
];

export function WorldSidebar({ className, collapsed, onToggle }: WorldSidebarProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full select-none transition-all duration-300",
        className,
      )}
      style={{
        background: "linear-gradient(180deg, #043C8F 0%, #02265D 100%)",
        borderRight: "1px solid color-mix(in oklab, white 10%, transparent)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-lg shrink-0"
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)",
              }}
            >
              <span className="text-sm font-black" style={{ color: "#02265D" }}>K</span>
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-xs font-bold" style={{ color: "#FFD700" }}>KRATOS</p>
              <p className="text-[10px] font-medium" style={{ color: "color-mix(in oklab, white 60%, transparent)" }}>
                CONTROL
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="ml-auto inline-flex items-center justify-center rounded-md p-1 transition-colors hover:bg-white/10"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" style={{ color: "#93C5FD" }} />
          ) : (
            <ChevronLeft className="h-4 w-4" style={{ color: "#93C5FD" }} />
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: "color-mix(in oklab, white 12%, transparent)" }} />

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3" aria-label="Navegação principal">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate({ to: item.path })}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon
                className="shrink-0"
                size={collapsed ? 22 : 18}
                style={{ color: "#93C5FD" }}
                strokeWidth={2}
              />
              {!collapsed && (
                <span className="text-xs font-semibold tracking-wide truncate" style={{ color: "#DBEAFE" }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer avatar */}
      {!collapsed && (
        <div className="flex items-center gap-2 px-4 py-4">
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 28, height: 28, background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" }}
          >
            <span className="text-[10px] font-bold text-white">L</span>
          </div>
          <span className="text-xs font-medium" style={{ color: "#93C5FD" }}>Lucas</span>
        </div>
      )}
    </div>
  );
}
