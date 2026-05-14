import { useApi } from "../hooks/useApi";
import SourceBadge, { type SourceType } from "../components/SourceBadge";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { EmptyState, ErrorState } from "../components/ui";

interface Task {
  id: string;
  title: string;
  project_id: string;
  status: string;
  priority: string;
  source: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

function chipColor(status: string) {
  switch (status) {
    case "done": return "kr-chip-healthy";
    case "doing": return "kr-chip-info";
    case "inbox": return "kr-chip-neutral";
    case "next": return "kr-chip-info";
    default: return "kr-chip-neutral";
  }
}

function priorityColor(priority: string) {
  switch (priority) {
    case "high": return "kr-chip-critical";
    case "medium": return "kr-chip-degraded";
    default: return "kr-chip-neutral";
  }
}

export default function TarefasPage() {
  const { data, source, loading, error } = useApi<Task[]>("/tasks");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <h2>Tarefas</h2>
        <SourceBadge source={(source as SourceType) || "unknown"} />
      </div>

      {loading && <LoadingSkeleton type="card" count={4} />}

      {error && <ErrorState title="Erro ao carregar tarefas" description={error} />}

      {data && data.length === 0 && (
        <EmptyState title="Nenhuma tarefa encontrada" description="Crie uma tarefa para começar." />
      )}

      {data && data.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.map((task) => (
            <div key={task.id} className="kr-card" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600, flex: 1 }}>{task.title}</span>
                <span className={`kr-chip ${chipColor(task.status)}`}>{task.status}</span>
                <span className={`kr-chip ${priorityColor(task.priority)}`}>{task.priority}</span>
              </div>
              <div style={{ fontSize: "var(--kr-text-xs)", color: "var(--kr-text-muted)", display: "flex", gap: 12 }}>
                <span>ID: {task.id}</span>
                {task.project_id && <span>Projeto: {task.project_id}</span>}
                {task.due_date && <span>Prazo: {task.due_date}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
