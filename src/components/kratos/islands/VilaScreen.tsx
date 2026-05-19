import {
  Home,
  Heart,
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";

const accent = "var(--kr-island-vila)";

interface RoutineItem {
  label: string;
  done: boolean;
}

const rotina: { periodo: string; items: RoutineItem[] }[] = [
  {
    periodo: "Manhã",
    items: [
      { label: "Café da manhã em família", done: true },
      { label: "Levar crianças na escola", done: true },
      { label: "Treino matinal", done: false },
    ],
  },
  {
    periodo: "Tarde",
    items: [
      { label: "Almoço com as crianças", done: false },
      { label: "Ajudar com dever de casa", done: false },
      { label: "Tempo livre no parque", done: false },
    ],
  },
  {
    periodo: "Noite",
    items: [
      { label: "Jantar juntos", done: false },
      { label: "História antes de dormir", done: false },
      { label: "Planejar dia seguinte", done: false },
    ],
  },
];

interface TarefaCasa {
  label: string;
  done: boolean;
}

const tarefas: TarefaCasa[] = [
  { label: "Supermercado da semana", done: true },
  { label: "Pagar contas da casa", done: true },
  { label: "Organizar quarto das crianças", done: false },
  { label: "Consertar torneira do banheiro", done: false },
  { label: "Lavar roupas", done: false },
];

interface Evento {
  titulo: string;
  data: string;
  tipo: string;
}

const eventos: Evento[] = [
  { titulo: "Apresentação escola — Miguel", data: "20/05", tipo: "Escola" },
  { titulo: "Aniversário Sofia (amiga)", data: "23/05", tipo: "Social" },
  { titulo: "Passeio Parque das Dunas", data: "27/05", tipo: "Família" },
];

interface Humor {
  icon: typeof Smile;
  label: string;
  value: number;
  color: string;
}

const humorFamilia: Humor[] = [
  { icon: Smile, label: "Lucas", value: 78, color: "var(--kr-success)" },
  { icon: Smile, label: "Parceira", value: 82, color: "var(--kr-success)" },
  { icon: Meh, label: "Miguel", value: 55, color: "var(--kr-warning)" },
  { icon: Smile, label: "Helena", value: 90, color: "var(--kr-success)" },
];

interface VilaScreenProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}

export function VilaScreen({
  isLoading = false,
  error = null,
  isEmpty = false,
}: VilaScreenProps) {
  return (
    <IslandPageFrame theme="vila">
      {isLoading ? (
        <LoadingState lines={6} />
      ) : error ? (
        <ErrorState
          title="Erro ao carregar"
          description={error}
          variant="external_unavailable"
        />
      ) : isEmpty ? (
        <EmptyState
          title="Nada por aqui"
          description="Nenhum dado disponível neste momento."
        />
      ) : (
        <div className="space-y-5">
          <IslandPageHeader
            title="VILA VIVA"
            subtitle="Família, Filhos e Vida Real"
            theme="vila"
          />

          {/* Humor Familiar */}
          <KratosCard header={<SectionTitle icon={Smile} title="Humor da Família" />}>
            <div className="grid grid-cols-4 gap-2">
              {humorFamilia.map((h) => (
                <div
                  key={h.label}
                  className="flex flex-col items-center gap-1 rounded-xl p-2"
                  style={{ background: "var(--kratos-surface-3)" }}
                >
                  <h.icon className="h-5 w-5" style={{ color: h.color }} aria-hidden />
                  <p className="text-[10px] font-medium" style={{ color: "var(--kratos-text-secondary)" }}>
                    {h.label}
                  </p>
                  <div className="w-full h-1 rounded-full mt-0.5" style={{ background: "var(--kratos-surface-4)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${h.value}%`,
                        backgroundColor: h.value > 70 ? "var(--kr-success)" : h.value > 40 ? "var(--kr-warning)" : "var(--kr-danger)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </KratosCard>

          {/* Rotina Familiar */}
          <KratosCard header={<SectionTitle icon={Clock} title="Rotina Familiar" />}>
            <div className="space-y-3">
              {rotina.map((periodo) => (
                <div key={periodo.periodo}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: accent }}>
                    {periodo.periodo}
                  </p>
                  <div className="space-y-0.5">
                    {periodo.items.map((item) => (
                      <div key={item.label} className="flex items-center gap-2 rounded px-2 py-1.5 -mx-2">
                        {item.done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--kr-success)" }} />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
                        )}
                        <p
                          className="text-[12px]"
                          style={{
                            color: item.done ? "var(--kratos-text-muted)" : "var(--kratos-text-primary)",
                            textDecoration: item.done ? "line-through" : "none",
                          }}
                        >
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </KratosCard>

          {/* Checklist da Casa */}
          <KratosCard header={<SectionTitle icon={Home} title="Checklist da Casa" />}>
            <div className="space-y-0.5">
              {tarefas.map((t) => (
                <div key={t.label} className="flex items-center gap-2 rounded px-2 py-1.5 -mx-2">
                  {t.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--kr-success)" }} />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
                  )}
                  <p
                    className="text-[12px]"
                    style={{
                      color: t.done ? "var(--kratos-text-muted)" : "var(--kratos-text-primary)",
                      textDecoration: t.done ? "line-through" : "none",
                    }}
                  >
                    {t.label}
                  </p>
                </div>
              ))}
            </div>
          </KratosCard>

          {/* Próximos Eventos */}
          <KratosCard header={<SectionTitle icon={CalendarDays} title="Próximos Eventos" />}>
            <div className="space-y-1">
              {eventos.map((e) => {
                const [dia, mes] = e.data.split("/");
                return (
                  <GlassPanel key={e.titulo} padding="sm" className="!p-2 flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold"
                      style={{
                        background: `color-mix(in oklab, ${accent} 10%, transparent)`,
                        color: accent,
                        fontFamily: "var(--kratos-font-mono)",
                      }}
                    >
                      {dia}
                      <span className="text-[7px]">/{mes}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate" style={{ color: "var(--kratos-text-primary)" }}>
                        {e.titulo}
                      </p>
                      <p className="text-[10px]" style={{ color: accent }}>
                        {e.tipo}
                      </p>
                    </div>
                  </GlassPanel>
                );
              })}
            </div>
          </KratosCard>
        </div>
      )}
    </IslandPageFrame>
  );
}
