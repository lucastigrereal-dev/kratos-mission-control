import {
  Activity,
  Calendar,
  FolderKanban,
  Layers,
  GitCommitHorizontal,
  Cpu,
  Crosshair,
  FolderGit2,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export interface KratosRoute {
  path: string;
  label: string;
  icon: Icon;
  section: "operacao" | "memoria" | "sistema";
  visibleInSidebar: boolean;
}

export const KRATOS_ROUTES: readonly KratosRoute[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: FolderGit2,
    section: "operacao",
    visibleInSidebar: false,
  },
  {
    path: "/agora",
    label: "Agora",
    icon: Activity,
    section: "operacao",
    visibleInSidebar: true,
  },
  {
    path: "/agenda",
    label: "Agenda",
    icon: Calendar,
    section: "operacao",
    visibleInSidebar: true,
  },
  {
    path: "/projetos",
    label: "Projetos",
    icon: FolderKanban,
    section: "operacao",
    visibleInSidebar: true,
  },
  {
    path: "/contexto",
    label: "Contexto",
    icon: Layers,
    section: "memoria",
    visibleInSidebar: true,
  },
  {
    path: "/checkpoints",
    label: "Checkpoints",
    icon: GitCommitHorizontal,
    section: "memoria",
    visibleInSidebar: true,
  },
  {
    path: "/sistema",
    label: "Sistema",
    icon: Cpu,
    section: "sistema",
    visibleInSidebar: true,
  },
] as const;

export const VISIBLE_ROUTES = KRATOS_ROUTES.filter((r) => r.visibleInSidebar);

export function getRouteBreadcrumb(path: string): string[] {
  const route = KRATOS_ROUTES.find((r) => r.path === path);
  if (!route) return [path];
  const sectionLabels: Record<string, string> = {
    operacao: "Operação",
    memoria: "Memória",
    sistema: "Sistema",
  };
  return [sectionLabels[route.section], route.label];
}
