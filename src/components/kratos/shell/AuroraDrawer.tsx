/**
 * AuroraDrawer — W4.5
 * Painel lateral de inteligência Aurora.
 * Wired to real tasks (useTasksToday), appointments (useAppointments),
 * and mission lens (useMissionLens). MOCK_TASKS + MOCK_AGENDA removidos.
 * MOCK_QUOTE mantido (conteúdo estático editorial, não dado operacional).
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Quote,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { StatusDot } from "../base/StatusDot";
import { LoadingState } from "../base/LoadingState";
import { useTasksToday } from "@/hooks/useTasks";
import { useAppointments } from "@/hooks/useAppointments";
import { useMissionLens } from "@/hooks/useMissionLens";
import type { Appointment } from "../../../../api-contract/appointment.schema";

// ── Static quote (editorial, not operational data) ────────────────────────────

const STATIC_QUOTE = {
  text: "Disciplina é a ponte entre metas e realizações.",
  author: "Jim Rohn",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function appointmentTypeColor(tipo: Appointment["tipo"]): string {
  if (tipo === "deep_work") return "var(--kr-info, #3b82f6)";
  if (tipo === "checkpoint") return "var(--kr-ok, #22c55e)";
  if (tipo === "admin") return "var(--kr-warn, #f59e0b)";
  return "var(--kr-info, #3b82f6)";
}

function deriveAuroraAgenda(appointments: Appointment[]): Appointment[] {
  const today = todayStr();
  return appointments
    .filter((a) => a.data === today && a.status !== "completed")
    .sort((a, b) => (a.horario ?? "23:59").localeCompare(b.horario ?? "23:59"))
    .slice(0, 3);
}

function focusStateLabel(state: string | undefined): string {
  if (!state) return "contexto ativo";
  if (state === "on_focus" || state === "execution") return "em foco";
  if (state === "off_focus" || state === "standby") return "em standby";
  return state.replace(/_/g, " ");
}

// ── Motion config ─────────────────────────────────────────────────────────────

const prefersReduced =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const DRAWER_DURATION = prefersReduced ? 0 : 0.25;

// ── Component ─────────────────────────────────────────────────────────────────

interface AuroraDrawerProps {
  open: boolean;
  onClose: () => void;
  topOffset?: number;
}

export function AuroraDrawer({
  open,
  onClose,
  topOffset = 90,
}: AuroraDrawerProps) {
  // ── Real data hooks (always called — TanStack Query deduplicates) ─────────
  const { tasks, isLoading: tasksLoading } = useTasksToday();
  const { data: appointments, isLoading: apptLoading } = useAppointments();
  const { lens, isLoading: lensLoading } = useMissionLens();

  // ── Derive display data ───────────────────────────────────────────────────
  const urgentTasks = tasks?.urgent.slice(0, 3) ?? [];
  const agendaItems = deriveAuroraAgenda(appointments ?? []);

  const missionName  = lens?.mission_lens?.current_mission ?? "—";
  const focusState   = focusStateLabel(lens?.context?.focus_state);
  const nextAction   = lens?.next_best_action?.action ?? "Definir próxima ação";
  const isLensReady  = !lensLoading && lens !== null;

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

              {/* Aurora context widget — wired to MissionLens (W4.5) */}
              <div
                className="rounded-xl p-3 space-y-2"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.06))",
                  border: "1px solid rgba(99,102,241,0.15)",
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

                {lensLoading ? (
                  <LoadingState lines={2} compact />
                ) : isLensReady ? (
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: "var(--kr-text-secondary, #8a8a9a)" }}
                  >
                    {missionName !== "—"
                      ? `Missão: ${missionName}. Estado: ${focusState}.`
                      : `Estado: ${focusState}.`}
                  </p>
                ) : (
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: "var(--kr-text-muted)" }}
                  >
                    Contexto indisponível.
                  </p>
                )}

                <p
                  className="text-[11px] font-medium"
                  style={{ color: "var(--kr-text-primary, #f0f0f2)" }}
                >
                  → {nextAction}
                </p>
              </div>

              <Divider />

              {/* Tasks — wired to useTasksToday() (W4.5) */}
              <div className="space-y-2">
                <SectionLabel>Foco do Dia</SectionLabel>

                {tasksLoading ? (
                  <LoadingState lines={3} compact />
                ) : urgentTasks.length === 0 ? (
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--kr-text-muted)" }}
                  >
                    Sem tarefas urgentes agora.
                  </p>
                ) : (
                  urgentTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2">
                      {task.overdue ? (
                        <AlertCircle
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ color: "var(--kr-critical, #ef4444)" }}
                          aria-label="Atrasada"
                        />
                      ) : (
                        <Circle
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ color: "var(--kr-text-muted, #4a4a5a)" }}
                        />
                      )}
                      <span
                        className="text-[12px] leading-snug"
                        style={{
                          color: task.overdue
                            ? "var(--kr-critical, #ef4444)"
                            : "var(--kr-text-secondary, #8a8a9a)",
                        }}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <Divider />

              {/* Agenda — wired to useAppointments() (W4.5) */}
              <div className="space-y-2">
                <SectionLabel>Agenda de Hoje</SectionLabel>

                {apptLoading ? (
                  <LoadingState lines={3} compact />
                ) : agendaItems.length === 0 ? (
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--kr-text-muted)" }}
                  >
                    Sem compromissos hoje.
                  </p>
                ) : (
                  agendaItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1 shrink-0 w-12">
                        <Clock
                          className="h-3 w-3"
                          style={{ color: "var(--kr-text-muted)" }}
                        />
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: "var(--kr-text-muted)" }}
                        >
                          {item.horario ?? "dia"}
                        </span>
                      </div>
                      <div
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: appointmentTypeColor(item.tipo) }}
                      />
                      <span
                        className="text-[12px] truncate"
                        style={{ color: "var(--kr-text-secondary)" }}
                      >
                        {item.titulo}
                      </span>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:text-[var(--kr-text-primary)] rounded-md px-1 py-0.5"
                  style={{ color: "var(--kr-text-muted)" }}
                  onClick={() => {
                    window.location.href = "/agenda";
                  }}
                >
                  Ver agenda completa
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <Divider />

              {/* Quote — static editorial content */}
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
                  "{STATIC_QUOTE.text}"
                </p>
                <p
                  className="text-[10px] font-medium"
                  style={{ color: "var(--kr-text-muted)" }}
                >
                  — {STATIC_QUOTE.author}
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
