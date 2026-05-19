import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Quote,
  Clock,
  ChevronRight,
  Send,
} from "lucide-react";
import { StatusDot } from "../base/StatusDot";
import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────*/

interface TaskItem {
  id: string;
  label: string;
  done: boolean;
}

interface AgendaItem {
  time: string;
  label: string;
  type: "work" | "personal" | "break";
}

interface RightRailV2Props {
  className?: string;
  topOffset?: number;
}

/* ── Mock data (replace with real hooks later) ─────*/

const MOCK_TASKS: TaskItem[] = [
  { id: "1", label: "Revisar pipeline de conteúdo", done: true },
  { id: "2", label: "Responder propostas pendentes", done: false },
  { id: "3", label: "1 check-in com equipe", done: false },
];

const MOCK_AGENDA: AgendaItem[] = [
  { time: "10:00", label: "Reunião Omnis Lab", type: "work" },
  { time: "14:00", label: "Call Comercial", type: "work" },
  { time: "16:00", label: "Tempo livre", type: "break" },
];

const MOCK_QUOTE = {
  text: "Disciplina é a ponte entre metas e realizações.",
  author: "Jim Rohn",
};

/* ── Sub-components ─────────────────────────────────*/

function AuroraWidget() {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background:
          "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.08))",
        border: "1px solid rgba(99,102,241,0.18)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background:
                "linear-gradient(135deg, var(--kr-info, #3b82f6), var(--kr-ghost, #6366f1))",
            }}
          >
            <Sparkles className="h-5 w-5" style={{ color: "var(--kratos-text-primary)" }} />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5">
            <StatusDot severity="ok" size="xs" pulse />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
            >
              AURORA
            </span>
            <span
              className="text-[9px] kratos-mono uppercase tracking-wider"
              style={{ color: "var(--kr-ok, #22c55e)" }}
            >
              ONLINE
            </span>
          </div>
          <p
            className="text-[10px] leading-tight mt-0.5"
            style={{ color: "var(--kr-text-secondary, #8a8a9a)" }}
          >
            Aqui para te ajudar com o foco no que realmente importa hoje.
          </p>
        </div>
      </div>
      <button
        type="button"
        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-150 hover:brightness-110 kratos-focus-ring"
        style={{
          background: "rgba(99,102,241,0.14)",
          border: "1px solid rgba(99,102,241,0.25)",
          color: "var(--kr-color-aurora, #818cf8)",
        }}
      >
        <Send className="h-3 w-3" />
        Falar com Aurora
      </button>
    </div>
  );
}

function FocusOfDayWidget() {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const toggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--kr-warn, #f59e0b)" }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
        >
          FOCO DO DIA
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggle(task.id)}
            className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.04] kratos-focus-ring"
          >
            {task.done ? (
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--kr-ok, #22c55e)" }}
              />
            ) : (
              <Circle
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
              />
            )}
            <span
              className="text-[11px] leading-tight"
              style={{
                color: task.done
                  ? "var(--kr-text-muted, #4a4a5a)"
                  : "var(--kr-text-secondary, #8a8a9a)",
                textDecoration: task.done ? "line-through" : "none",
              }}
            >
              {task.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgressWidget() {
  const progress = 78;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <div className="relative flex items-center justify-center">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="url(#progress-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 36 36)"
            style={{ transition: "stroke-dashoffset 500ms ease" }}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>
        <span
          className="absolute text-[15px] font-bold kratos-num"
          style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
        >
          {progress}%
        </span>
      </div>
      <span
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
      >
        PROGRESSO GERAL
      </span>
      <span
        className="text-[10px]"
        style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
      >
        Do mês concluído
      </span>
    </div>
  );
}

function QuoteWidget() {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start gap-2">
        <Quote
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: "var(--kr-gold, #FFD700)", opacity: 0.6 }}
        />
        <div className="min-w-0">
          <p
            className="text-[11px] italic leading-relaxed"
            style={{ color: "var(--kr-text-secondary, #8a8a9a)" }}
          >
            {MOCK_QUOTE.text}
          </p>
          <p
            className="mt-1 text-[10px] font-semibold"
            style={{ color: "var(--kr-gold, #FFD700)", opacity: 0.85 }}
          >
            — {MOCK_QUOTE.author}
          </p>
        </div>
      </div>
    </div>
  );
}

function AgendaWidget() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <Clock
          className="h-3.5 w-3.5"
          style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
        >
          AGENDA DE HOJE
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {MOCK_AGENDA.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <span
              className="text-[10px] kratos-mono font-semibold shrink-0"
              style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
            >
              {item.time}
            </span>
            <div
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{
                background:
                  item.type === "work"
                    ? "var(--kr-ghost, #6366f1)"
                    : item.type === "break"
                      ? "var(--kr-ok, #22c55e)"
                      : "var(--kr-warn, #f59e0b)",
              }}
            />
            <span
              className="text-[11px] truncate"
              style={{ color: "var(--kr-text-secondary, #8a8a9a)" }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:text-[var(--kr-text-primary)] kratos-focus-ring rounded-md px-1 py-0.5 self-start"
        style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
      >
        Ver agenda completa
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}

/* ── Main export ───────────────────────────────────*/

export function RightRailV2({ className, topOffset = 90 }: RightRailV2Props) {
  return (
    <aside
      className={cn(
        "fixed right-0 z-[80] flex h-full flex-col overflow-hidden",
        className,
      )}
      style={{
        width: 300,
        top: topOffset,
        background: "var(--kr-glass-strong-bg, rgba(15, 23, 42, 0.92))",
        borderLeft:
          "1px solid var(--kr-glass-strong-border, rgba(255, 255, 255, 0.08))",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
      aria-label="Painel direito"
    >
      <div className="flex-1 overflow-y-auto kratos-scrollbar p-3 space-y-4">
        <AuroraWidget />
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
          aria-hidden
        />
        <FocusOfDayWidget />
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
          aria-hidden
        />
        <ProgressWidget />
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
          aria-hidden
        />
        <QuoteWidget />
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
          aria-hidden
        />
        <AgendaWidget />
      </div>
    </aside>
  );
}
