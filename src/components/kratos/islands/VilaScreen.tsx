import { useEffect } from "react";
import {
  Home,
  Sun,
  Sunset,
  Moon,
  Heart,
  Calendar,
  CheckCircle2,
  Circle,
  Baby,
  Users,
  Flame,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { useIslandDock } from "./shared/IslandDockContext";

const accent = "var(--kr-island-vila)";

// ── Rotina placeholder — estrutura fixa, dados futuros via backend ──────────
// W12: nenhum número inventado. Blocos de rotina são estrutura canônica.

interface RotinaBlocItem {
  label: string;
  done: boolean;
}

interface RotinaBloco {
  label: string;
  icon: typeof Sun;
  items: RotinaBlocItem[];
}

const ROTINA_BLOCOS: RotinaBloco[] = [
  {
    label: "Manhã",
    icon: Sun,
    items: [
      { label: "Meditação / respiração", done: false },
      { label: "Revisar prioridades do dia", done: false },
      { label: "Café com família", done: false },
    ],
  },
  {
    label: "Tarde",
    icon: Sunset,
    items: [
      { label: "Bloco de trabalho profundo", done: false },
      { label: "Almoço em família", done: false },
    ],
  },
  {
    label: "Noite",
    icon: Moon,
    items: [
      { label: "Jantar em família", done: false },
      { label: "Review do dia", done: false },
      { label: "Desconexão digital", done: false },
    ],
  },
];

// ── Pillares da vida real ────────────────────────────────────────────────────

interface Pilar {
  label: string;
  descricao: string;
  icon: typeof Heart;
}

const PILARES: Pilar[] = [
  { label: "Família",     descricao: "Tempo presente com filhos e cônjuge",         icon: Home    },
  { label: "Saúde",       descricao: "Energia para sustentar a operação",             icon: Heart   },
  { label: "Presença",    descricao: "Qualidade > quantidade em cada momento",        icon: Baby    },
  { label: "Comunidade",  descricao: "Relações que importam fora do trabalho",        icon: Users   },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function RotinaCard({ bloco }: { bloco: RotinaBloco }) {
  const Icon = bloco.icon;
  return (
    <GlassPanel padding="sm" className="!p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-3.5 w-3.5" style={{ color: accent }} aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: accent }}>
          {bloco.label}
        </span>
      </div>
      <div className="space-y-1.5">
        {bloco.items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            {item.done ? (
              <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: "var(--kr-success)" }} aria-hidden />
            ) : (
              <Circle className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
            )}
            <span
              className="text-[12px]"
              style={{
                color: item.done ? "var(--kratos-text-muted)" : "var(--kratos-text-secondary)",
                textDecoration: item.done ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────

export function VilaScreen() {
  const { setData } = useIslandDock();

  const totalItems = ROTINA_BLOCOS.reduce((sum, b) => sum + b.items.length, 0);
  const doneItems = ROTINA_BLOCOS.reduce((sum, b) => sum + b.items.filter((i) => i.done).length, 0);

  useEffect(() => {
    setData({
      islandId: "vila",
      label: "Rotina",
      value: doneItems > 0 ? `${doneItems}/${totalItems} feitos` : "—",
      progress: totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0,
      progressColor: accent,
      quickActions: [{ label: "Nova Tarefa" }, { label: "Evento" }],
    });
    return () => setData(null);
  }, [setData, doneItems, totalItems]);

  return (
    <IslandPageFrame theme="vila">
      <div className="space-y-5">
        <IslandPageHeader
          title="VILA VIVA"
          subtitle="Família, Filhos e Vida Real"
          theme="vila"
        />

        {/* Aviso de integração */}
        <div
          className="rounded-lg px-3 py-2 flex items-center gap-2 text-[11px]"
          style={{
            background: "color-mix(in oklab, var(--kratos-text-muted) 6%, var(--kratos-surface-3))",
            border: "1px solid color-mix(in oklab, var(--kratos-text-muted) 15%, transparent)",
          }}
        >
          <Home className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
          <span style={{ color: "var(--kratos-text-muted)" }}>
            Estrutura da rotina visível — dados em tempo real via tracker de hábitos (W14+).
          </span>
        </div>

        {/* Rotina de Hoje */}
        <KratosCard header={<SectionTitle icon={Flame} title="Rotina de Hoje" />}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {ROTINA_BLOCOS.map((bloco) => (
              <RotinaCard key={bloco.label} bloco={bloco} />
            ))}
          </div>
          <p
            className="text-[10px] mt-2 text-center"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            {doneItems}/{totalItems} itens concluídos hoje
          </p>
        </KratosCard>

        {/* Pilares */}
        <KratosCard header={<SectionTitle icon={Heart} title="Pilares da Vila" />}>
          <div className="grid grid-cols-2 gap-2">
            {PILARES.map((pilar) => {
              const Icon = pilar.icon;
              return (
                <GlassPanel key={pilar.label} padding="sm" className="!p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: accent }} aria-hidden />
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
                      {pilar.label}
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: "var(--kratos-text-muted)" }}>
                    {pilar.descricao}
                  </p>
                </GlassPanel>
              );
            })}
          </div>
        </KratosCard>

        {/* Próximos Eventos */}
        <KratosCard header={<SectionTitle icon={Calendar} title="Próximos Eventos" />}>
          <EmptyState
            compact
            icon={<Calendar className="h-4 w-4" />}
            title="Nenhum evento próximo"
            description="Conecte agenda/Google Calendar para sincronizar eventos familiares."
          />
        </KratosCard>
      </div>
    </IslandPageFrame>
  );
}
