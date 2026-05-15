import { NavLink } from "react-router-dom";

// TODO(microfase-1.1): Trocar unicode chars por SVG icons de navegação.
// O /public/icons.svg atual contém apenas ícones de redes sociais
// (Bluesky, Discord, GitHub, X). Criar symbols novos para cada item de nav.
// Manter unicode como fallback.

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: number | string;
}

const TOP_NAV: NavItem[] = [
  { to: "/visao-geral", label: "Mundo", icon: "◈" },
  { to: "/mission-lens", label: "Missão", icon: "◉" },
  { to: "/tarefas", label: "Ações", icon: "☰" },
  { to: "/projetos", label: "Iniciativas", icon: "⬡" },
  { to: "/contexto", label: "Contexto", icon: "◎" },
  { to: "/sistema", label: "Sistemas", icon: "⚙" },
  { to: "/checkpoints", label: "Checkpoints", icon: "◆" },
];

const BOTTOM_NAV: NavItem[] = [
  { to: "/omnis", label: "OMNIS Lab", icon: "◬" },
  { to: "/approvals", label: "Approvals", icon: "◷" },
];

interface KratosSidebarProps {
  collapsed?: boolean;
}

export default function KratosSidebar({ collapsed = false }: KratosSidebarProps) {
  return (
    <nav className="kr-sidebar" data-collapsed={collapsed}>
      <div className="kr-sidebar-section">
        {TOP_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `kr-sidebar-item${isActive ? " kr-sidebar-item--active" : ""}`
            }
          >
            <span className="kr-sidebar-item-icon">{item.icon}</span>
            {!collapsed && <span className="kr-sidebar-item-label">{item.label}</span>}
            {item.badge && !collapsed && (
              <span className="kr-sidebar-item-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="kr-sidebar-divider" />

      <div className="kr-sidebar-section">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `kr-sidebar-item${isActive ? " kr-sidebar-item--active" : ""}`
            }
          >
            <span className="kr-sidebar-item-icon">{item.icon}</span>
            {!collapsed && <span className="kr-sidebar-item-label">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
