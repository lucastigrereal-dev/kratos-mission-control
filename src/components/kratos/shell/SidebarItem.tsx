import { Link, useRouterState } from "@tanstack/react-router";
import type { ComponentType, SVGProps } from "react";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type Props = {
  to: string;
  label: string;
  icon: Icon;
  collapsed: boolean;
};

export function SidebarItem({ to, label, icon: Icon, collapsed }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to || (to !== "/" && pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[12px] transition-colors duration-150 kratos-focus-ring ${
        active ? "kratos-nav-item-active" : ""
      }`}
      style={{
        color: active
          ? "var(--kratos-text-primary)"
          : "var(--kratos-text-secondary)",
      }}
      title={collapsed ? label : undefined}
    >
      <Icon
        className="h-4 w-4 shrink-0"
        style={{
          color: active ? "var(--kratos-accent)" : "var(--kratos-text-secondary)",
        }}
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {!active && !collapsed && (
        <span
          aria-hidden
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          ›
        </span>
      )}
    </Link>
  );
}
