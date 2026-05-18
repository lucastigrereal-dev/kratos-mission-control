import { Target, FolderKanban, Calendar, Crosshair } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";

interface FocusTodayCardProps {
  tasks?: string[];
  projects?: string[];
  meeting?: string;
  mainFocus?: string;
}

const defaultTasks = [
  "Revisar pipeline comercial — 150 influenciadores SP",
  "Gravar stories @lucastigrereal — 3 collabs pendentes",
  "Checkpoint KRATOS: revisar PACK 3 build",
];

const defaultProjects = [
  "KRATOS 3D — HUD Shell",
  "JARVIS — Skill lead-qualifier",
];

const defaultMeeting = "14:00 — Reuniao com hotel Serhs Natal";

const defaultMainFocus = "Avancar KRATOS 3D Mission Control";

export function FocusTodayCard({
  tasks = defaultTasks,
  projects = defaultProjects,
  meeting = defaultMeeting,
  mainFocus = defaultMainFocus,
}: FocusTodayCardProps) {
  return (
    <GlassPanel padding="md" blur="panel">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Crosshair
          className="h-4 w-4"
          style={{ color: "var(--kr-azure)" }}
          aria-hidden
        />
        <span
          className="text-[13px] font-semibold"
          style={{ color: "var(--kr-text-primary)" }}
        >
          Foco do Dia
        </span>
      </div>

      {/* Main Focus */}
      <div
        className="rounded-xl p-3 mb-3"
        style={{
          background: "var(--kratos-surface-3)",
          border: "1px solid var(--kratos-border)",
        }}
      >
        <span
          className="block text-[10px] uppercase tracking-[0.12em] mb-1"
          style={{ color: "var(--kr-azure)" }}
        >
          Prioridade
        </span>
        <span
          className="text-[13px] font-semibold"
          style={{ color: "var(--kr-text-primary)" }}
        >
          {mainFocus}
        </span>
      </div>

      {/* Tasks */}
      <SectionBlock
        icon={Target}
        label="Tarefas (3)"
        color="var(--kr-success)"
      >
        <ul className="flex flex-col gap-1.5">
          {tasks.map((task, i) => (
            <li
              key={i}
              className="text-[12px] leading-relaxed flex items-start gap-2"
              style={{ color: "var(--kr-text-secondary)" }}
            >
              <span
                className="mt-1.5 h-1 w-1 rounded-full shrink-0"
                style={{ background: "var(--kr-success)" }}
                aria-hidden
              />
              {task}
            </li>
          ))}
        </ul>
      </SectionBlock>

      {/* Projects */}
      <SectionBlock
        icon={FolderKanban}
        label="Projetos (2)"
        color="var(--kr-aurora)"
      >
        <ul className="flex flex-col gap-1.5">
          {projects.map((project, i) => (
            <li
              key={i}
              className="text-[12px] leading-relaxed flex items-start gap-2"
              style={{ color: "var(--kr-text-secondary)" }}
            >
              <span
                className="mt-1.5 h-1 w-1 rounded-full shrink-0"
                style={{ background: "var(--kr-aurora)" }}
                aria-hidden
              />
              {project}
            </li>
          ))}
        </ul>
      </SectionBlock>

      {/* Meeting */}
      <SectionBlock
        icon={Calendar}
        label="Reuniao"
        color="var(--kr-warning)"
        isLast
      >
        <span
          className="text-[12px] leading-relaxed"
          style={{ color: "var(--kr-text-secondary)" }}
        >
          {meeting}
        </span>
      </SectionBlock>
    </GlassPanel>
  );
}

/* --- Internal sub-component --- */

interface SectionBlockProps {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  color: string;
  children: React.ReactNode;
  isLast?: boolean;
}

function SectionBlock({ icon: Icon, label, color, children, isLast = false }: SectionBlockProps) {
  return (
    <div className={isLast ? "" : "mb-3"}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="h-3 w-3" style={{ color }} aria-hidden />
        <span
          className="text-[10px] uppercase tracking-[0.12em] font-semibold"
          style={{ color: "var(--kr-text-muted)" }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
