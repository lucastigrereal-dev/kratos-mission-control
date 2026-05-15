import { ReactNode } from "react";

interface KratosVisualShellProps {
  topHud: ReactNode;
  sidebar: ReactNode;
  rightRail: ReactNode;
  bottomDock: ReactNode;
  children: ReactNode;
}

export default function KratosVisualShell({
  topHud,
  sidebar,
  rightRail,
  bottomDock,
  children,
}: KratosVisualShellProps) {
  return (
    <div className="kr-shell">
      <header className="kr-shell-top-hud">{topHud}</header>
      <aside className="kr-shell-sidebar">{sidebar}</aside>
      <main className="kr-shell-main">{children}</main>
      <aside className="kr-shell-right-rail">{rightRail}</aside>
      <footer className="kr-shell-bottom-dock">{bottomDock}</footer>
    </div>
  );
}
