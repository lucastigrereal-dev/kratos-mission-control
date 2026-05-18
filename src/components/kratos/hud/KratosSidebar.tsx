import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Target,
  FolderKanban,
  Calendar,
  Users,
  Package,
  BarChart3,
  GraduationCap,
  Settings,
  BrainCircuit,
} from "lucide-react";
import { KratosLogo } from "@/components/kratos/icons/KratosLogo";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  route: string;
}

interface KratosSidebarProps {
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

const mainNavItems: NavItem[] = [
  { id: "overview", label: "Visao Geral", icon: LayoutDashboard, route: "/" },
  { id: "missions", label: "Missoes", icon: Target, route: "/missoes" },
  { id: "projects", label: "Projetos", icon: FolderKanban, route: "/projetos" },
  { id: "agenda", label: "Agenda", icon: Calendar, route: "/agenda" },
  { id: "people", label: "Pessoas", icon: Users, route: "/pessoas" },
  { id: "resources", label: "Recursos", icon: Package, route: "/recursos" },
  { id: "analytics", label: "Analises", icon: BarChart3, route: "/analises" },
  { id: "academy", label: "Academy", icon: GraduationCap, route: "/academy" },
  { id: "settings", label: "Configuracoes", icon: Settings, route: "/configuracoes" },
];

const OmnisNavItem: NavItem = {
  id: "omnis",
  label: "OMNIS",
  icon: BrainCircuit,
  route: "/omnis",
};

export function KratosSidebar({ activeRoute = "/", onNavigate }: KratosSidebarProps) {
  const navigate = useNavigate();

  const handleNavClick = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
    void navigate({ to: route });
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = activeRoute === item.route;
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNavClick(item.route)}
        className={cn(
          "kratos-focus-ring flex items-center w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
          isActive
            ? "kratos-nav-item-active"
            : "hover:bg-[var(--kratos-surface-3)]",
        )}
        style={{
          color: isActive ? "var(--kratos-text-primary)" : "var(--kratos-text-secondary)",
        }}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon
          className="h-4 w-4 shrink-0"
          aria-hidden
        />
        <span className="text-[13px] font-medium leading-none truncate">
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-100 flex flex-col w-[220px]"
      style={{
        background: "var(--kr-hud-bg)",
        borderRight: `1px solid var(--kr-hud-border)`,
        backdropFilter: "blur(var(--kr-glass-blur))",
        WebkitBackdropFilter: "blur(var(--kr-glass-blur))",
      }}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-5 shrink-0">
        <KratosLogo collapsed={false} />
      </div>

      {/* Divider */}
      <div
        className="mx-4"
        style={{ height: 1, background: "var(--kr-hud-border)" }}
      />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 kr-scrollbar-thin" aria-label="Navegacao principal">
        <div className="flex flex-col gap-1">
          {mainNavItems.map(renderNavItem)}
        </div>
      </nav>

      {/* Bottom divider + Omnis */}
      <div className="shrink-0">
        <div
          className="mx-4"
          style={{ height: 1, background: "var(--kr-hud-border)" }}
        />
        <div className="px-3 py-4">
          {renderNavItem(OmnisNavItem)}
        </div>
      </div>

      {/* Bottom spacer for StatusBar overlap */}
      <div className="h-8 shrink-0" />
    </aside>
  );
}
