import { createFileRoute } from "@tanstack/react-router";
import { KratosWorldPage } from "@/components/kratos/world/KratosWorldPage";
import { getCheckpoints } from "@/lib/checkpoint-server-fns";
import { getProjects } from "@/lib/project-server-fns";
import { getAppointments } from "@/lib/appointment-server-fns";
import { getContextSnapshot } from "@/lib/contexto-server-fns";
import type { Checkpoint } from "../../api-contract/checkpoint.schema";
import type { Project } from "../../api-contract/project.schema";
import type { Appointment } from "../../api-contract/appointment.schema";
import type { ContextSnapshot } from "../../api-contract/contexto.schema";
import type { DashboardLoaderData } from "@/hooks/useDashboard";

type Envelope<T> = { data: T | null; error: string | null };

export const Route = createFileRoute("/")({
  loader: async (): Promise<DashboardLoaderData> => {
    const results = await Promise.allSettled([
      getCheckpoints({}),
      getProjects({}),
      getAppointments({}),
      getContextSnapshot({ refresh: false }),
    ]) as [
      PromiseSettledResult<Envelope<Checkpoint[]>>,
      PromiseSettledResult<Envelope<Project[]>>,
      PromiseSettledResult<Envelope<Appointment[]>>,
      PromiseSettledResult<Envelope<ContextSnapshot>>,
    ];

    const extract = <T,>(result: PromiseSettledResult<Envelope<T>>): T[] => {
      if (result.status === "fulfilled") return result.value.data ?? [];
      return [];
    };

    const extractSnapshot = (result: PromiseSettledResult<Envelope<ContextSnapshot>>): ContextSnapshot | null => {
      if (result.status === "fulfilled") return result.value.data ?? null;
      return null;
    };

    const cpList = extract(results[0]);
    const prList = extract(results[1]);
    const apList = extract(results[2]);
    const snapshot = extractSnapshot(results[3]);

    const today = new Date().toISOString().slice(0, 10);

    return {
      checkpoints: {
        total: cpList.length,
        pending: cpList.filter((c) => c.status === "pending").length,
        inProgress: cpList.filter((c) => c.status === "in_progress").length,
        completed: cpList.filter((c) => c.status === "completed").length,
      },
      projects: {
        total: prList.length,
        active: prList.filter((p) => p.status === "active").length,
        paused: prList.filter((p) => p.status === "paused").length,
        completed: prList.filter((p) => p.status === "completed").length,
      },
      appointments: {
        today: apList.filter((a) => a.data === today).length,
        overdue: apList.filter((a) => a.data < today && a.status !== "completed").length,
        total: apList.length,
      },
      contexto: snapshot
        ? {
            focusStatus: snapshot.focusStatus,
            drift: snapshot.drift,
            project: snapshot.project,
          }
        : null,
    };
  },
  head: () => ({
    meta: [
      { title: "KRATOS · Mission Control" },
      {
        name: "description",
        content: "Visão consolidada de projetos, checkpoints, agenda e contexto.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const loaderData = Route.useLoaderData();
  return <KratosWorldPage ssrData={loaderData} />;
}
