import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Quote,
  X,
  Sparkles,
} from "lucide-react";
import { StatusDot } from "../base/StatusDot";

interface AuroraDrawerProps {
  open: boolean;
  onClose: () => void;
  topOffset?: number;
}

const MOCK_TASKS = [
  { id: "1", label: "Revisar pipeline de conteúdo", done: true },
  { id: "2", label: "Responder propostas pendentes", done: false },
  { id: "3", label: "1 check-in com equipe", done: false },
];

const MOCK_AGENDA = [
  { time: "10:00", label: "Reunião Omnis Lab", type: "work" as const },
  { time: "14:00", label: "Call Comercial", type: "work" as const },
  { time: "16:00", label: "Tempo livre", type: "break" as const },
];

const MOCK_QUOTE = {
  text: "Disciplina é a ponte entre metas e realizações.",
  author: "Jim Rohn",
};

const prefersReduced =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const DRAWER_DURATION = prefersReduced ? 0 : 0.25;

export function AuroraDrawer({
  open,
  onClose,
  topOffset = 90,
}: AuroraDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — clica fora fecha */}
          <motion.div
            key="aurora-backdrop"
            className="fixed inset-0 z-[85]"
            style={{ background: "rgba(0,0,0,0.25)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DRAWER_DURATION }}
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            key="aurora-drawer"
            className="fixed right-0 z-[90] flex flex-col overflow-hidden"
            style={{
              top: topOffset,
              bottom: 0,
              width: 300,
              background: "var(--kr-glass-strong-bg, rgba(15, 23, 42, 0.96))",
              borderLeft:
                "1px solid var(--kr-glass-strong-border, rgba(255,255,255,0.08))",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: DRAWER_DURATION, ease: "easeOut" }}
            aria-label="Painel Aurora"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                borderBottom:
                  "1px solid var(--kr-glass-strong-border, rgba(255,255,255,0.06))",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--kr-info,#3b82f6), var(--kr-ghost,#6366f1))",
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p
                    className="text-[12px] font-semibold leading-none"
                    style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
                  >
                    Aurora
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-widest mt-0.5"
                    style={{ color: "var(--kr-ok, #22c55e)" }}
                  >
                    online
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
                aria-label="Fechar Aurora"
              >
                <X
                  className="h-4 w-4"
                  style={{ color: "var(--kr-text-muted)" }}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Aurora context widget */}
              <div
                className="rounded-xl p-3 space-y-2"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.06))",
                  border:
                    "1px solid rgba(99,102,241,0.15)",
                }}
              >
                <div className="flex items-center gap-2">
                  <StatusDot severity="ok" size="xs" pulse />
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--kr-ghost, #6366f1)" }}
                  >
                    Contexto Atual
                  </span>
                </div>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: "var(--kr-text-secondary, #8a8a9a)" }}
                >
                  Você está em foco. Missão ativa há 47 min. Sem drift detectado.
                </p>
                <p
                  className="text-[11px] font-medium"
                  style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
                >
                  → Próxima ação: Finalizar HUD adaptativo
                </p>
              </div>

              <Divider />

              {/* Tasks */}
              <div className="space-y-2">
                <SectionLabel>Foco do Dia</SectionLabel>
                {MOCK_TASKS.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    {task.done ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--kr-ok, #22c55e)" }}
                      />
                    ) : (
                      <Circle
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
                      />
                    )}
                    <span
                      className="text-[12px] leading-snug"
                      style={{
                        color: task.done
                          ? "var(--kr-text-muted)"
                          : "var(--kr-text-secondary, #8a8a9a)",
                        textDecoration: task.done ? "line-through" : "none",
                      }}
                    >
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>

              <Divider />

              {/* Agenda */}
              <div className="space-y-2">
                <SectionLabel>Agenda de Hoje</SectionLabel>
                {MOCK_AGENDA.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 shrink-0 w-12">
                      <Clock
                        className="h-3 w-3"
                        style={{ color: "var(--kr-text-muted)" }}
                      />
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: "var(--kr-text-muted)" }}
                      >
                        {item.time}
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{
                        background:
                          item.type === "break"
                            ? "var(--kr-ok, #22c55e)"
                            : "var(--kr-info, #3b82f6)",
                      }}
                    />
                    <span
                      className="text-[12px]"
                      style={{ color: "var(--kr-text-secondary)" }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:text-[var(--kr-text-primary)] rounded-md px-1 py-0.5"
                  style={{ color: "var(--kr-text-muted)" }}
                >
                  Ver agenda completa
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <Divider />

              {/* Quote */}
              <div
                className="rounded-xl p-3 space-y-1.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Quote
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--kr-text-muted)" }}
                />
                <p
                  className="text-[11px] leading-relaxed italic"
                  style={{ color: "var(--kr-text-secondary)" }}
                >
                  "{MOCK_QUOTE.text}"
                </p>
                <p
                  className="text-[10px] font-medium"
                  style={{ color: "var(--kr-text-muted)" }}
                >
                  — {MOCK_QUOTE.author}
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Divider() {
  return (
    <div
      className="h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
      }}
      aria-hidden
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-semibold uppercase tracking-[0.15em]"
      style={{ color: "var(--kr-text-muted)" }}
    >
      {children}
    </p>
  );
}
