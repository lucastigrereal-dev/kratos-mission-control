import { useMemo } from "react";
import { CheckCircle2, Circle, Quote, CalendarDays, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKratosContext } from "./KratosContext";

interface WorldRightPanelProps {
  className?: string;
}

export function WorldRightPanel({ className }: WorldRightPanelProps) {
  const ctx = useKratosContext();

  const focusItems = useMemo(() => {
    const lens = ctx.lens;
    if (!lens?.mission_lens?.current_mission) {
      return [
        { done: false, text: "Definir foco do dia" },
        { done: false, text: "Revisar checkpoints" },
      ];
    }
    return [
      { done: true, text: lens.mission_lens.current_mission },
      { done: false, text: lens.next_best_action?.action ?? "Próxima ação" },
      { done: false, text: "Revisar mentor signals" },
    ];
  }, [ctx.lens]);

  const progress = ctx.checkpointProgress ?? 0;

  const agendaItems = useMemo(() => {
    // Stub — would come from real appointment data
    return [
      { time: "10:30", title: "Reunião Growth Lab", done: false },
      { time: "14:00", title: "Call Comercial", done: false },
      { time: "16:00", title: "Tempo Livre: Lazer & Aprender", done: false },
    ];
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-y-auto select-none",
        className,
      )}
      style={{
        background: "linear-gradient(180deg, #02265D 0%, #043C8F 40%, #0651B4 100%)",
        borderLeft: "1px solid color-mix(in oklab, white 10%, transparent)",
      }}
    >
      {/* Aurora Header */}
      <div className="flex items-start gap-3 p-6 pb-5">
        <div
          className="relative shrink-0 overflow-hidden rounded-xl"
          style={{ width: 72, height: 72, background: "linear-gradient(135deg, #60A5FA, #3B82F6)" }}
        >
          {/* Simple avatar illustration fallback */}
          <div className="flex h-full w-full items-center justify-center">
            <Sparkles className="h-9 w-9" style={{ color: "#E0F2FE" }} />
          </div>
          {/* Online dot */}
          <div
            className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-white"
            style={{ background: "#22C55E" }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold" style={{ color: "#E0F2FE" }}>
              AURORA
            </p>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
              style={{ background: "color-mix(in oklab, #22C55E 20%, transparent)", color: "#22C55E" }}
            >
              Online
            </span>
          </div>
          <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "color-mix(in oklab, white 60%, transparent)" }}>
            E aí, o que me realiza a foco no que realmente importa hoje.
          </p>
          <button
            type="button"
            className="mt-1 text-[11px] font-medium transition-colors hover:brightness-110"
            style={{ color: "#60A5FA" }}
          >
            Falar com Aurora →
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: "color-mix(in oklab, white 12%, transparent)" }} />

      {/* Foco do Dia */}
      <div className="p-6 py-5">
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "color-mix(in oklab, white 50%, transparent)" }}
        >
          Foco do Dia
        </p>
        <div className="space-y-3">
          {focusItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#22C55E" }} />
              ) : (
                <Circle className="h-4 w-4 shrink-0" style={{ color: "color-mix(in oklab, white 30%, transparent)" }} />
              )}
              <span
                className="text-xs"
                style={{
                  color: item.done ? "color-mix(in oklab, white 60%, transparent)" : "#E5E7EB",
                  textDecoration: item.done ? "line-through" : undefined,
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: "color-mix(in oklab, white 12%, transparent)" }} />

      {/* Progresso Geral */}
      <div className="p-6 py-5">
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "color-mix(in oklab, white 50%, transparent)" }}
        >
          Progresso Geral
        </p>
        <div className="flex items-center gap-3">
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 56,
              height: 56,
              background: `conic-gradient(#22C55E ${progress * 3.6}deg, color-mix(in oklab, white 10%, transparent) 0deg)`,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 48,
                height: 48,
                background: "#02265D",
              }}
            >
              <span className="text-sm font-bold" style={{ color: "#22C55E" }}>
                {progress}%
              </span>
            </div>
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium" style={{ color: "#E5E7EB" }}>
              Do mês concluído
            </p>
            <p className="text-[10px]" style={{ color: "color-mix(in oklab, white 50%, transparent)" }}>
              Continue assim!
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: "color-mix(in oklab, white 12%, transparent)" }} />

      {/* Citação do Dia */}
      <div className="p-6 py-5">
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: "color-mix(in oklab, white 50%, transparent)" }}
        >
          Citação do Dia
        </p>
        <div
          className="rounded-xl p-3"
          style={{
            background: "color-mix(in oklab, white 6%, transparent)",
            border: "1px solid color-mix(in oklab, white 10%, transparent)",
          }}
        >
          <Quote className="mb-1 h-4 w-4" style={{ color: "#60A5FA" }} />
          <p className="text-xs italic leading-relaxed" style={{ color: "#E5E7EB" }}>
            "Disciplina é a ponte entre metas e realizações."
          </p>
          <p className="mt-1 text-[10px] font-medium" style={{ color: "#93C5FD" }}>
            — Jim Rohn
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: "color-mix(in oklab, white 12%, transparent)" }} />

      {/* Agenda de Hoje */}
      <div className="flex-1 p-6 pt-5">
        <div className="mb-2 flex items-center justify-between">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "color-mix(in oklab, white 50%, transparent)" }}
          >
            Agenda de Hoje
          </p>
          <CalendarDays className="h-3.5 w-3.5" style={{ color: "color-mix(in oklab, white 40%, transparent)" }} />
        </div>
        <div className="space-y-3">
          {agendaItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5"
              style={{
                background: "color-mix(in oklab, white 4%, transparent)",
              }}
            >
              <span className="text-[10px] font-bold tabular-nums" style={{ color: "#60A5FA" }}>
                {item.time}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs" style={{ color: "#E5E7EB" }}>
                {item.title}
              </span>
              {item.done && <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: "#22C55E" }} />}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-2 flex items-center gap-1 text-[11px] font-medium transition-colors hover:brightness-110"
          style={{ color: "#60A5FA" }}
        >
          Ver agenda completa
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
