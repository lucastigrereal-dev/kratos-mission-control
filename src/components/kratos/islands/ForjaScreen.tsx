import { useEffect } from "react";
import {
  Dumbbell,
  Flame,
  Trophy,
  Activity,
  Target,
  Zap,
  Circle,
  ChevronRight,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { useIslandDock } from "./shared/IslandDockContext";

const accent = "var(--kr-island-forja)";

// ── Tipos de treino disponíveis (estrutura fixa — sem dados reais ainda) ────

interface TipoTreino {
  label: string;
  descricao: string;
  diasSemana: string;
  tag: string;
}

const TIPOS_TREINO: TipoTreino[] = [
  { label: "Musculação",   descricao: "Força e hipertrofia",          diasSemana: "3–4x/semana", tag: "FORÇA"    },
  { label: "Cardio",       descricao: "Condicionamento aeróbico",     diasSemana: "2–3x/semana", tag: "CARDIO"   },
  { label: "Flexibilidade",descricao: "Mobilidade e recuperação",     diasSemana: "diário",      tag: "RECOVERY" },
];

// ── Métricas corporais placeholder ──────────────────────────────────────────
// Regra: nenhum número inventado. Todos undefined até integração real.

const metricas: Array<{ label: string; valor: string | undefined; unidade: string; icone: typeof Activity }> = [
  { label: "Peso",           valor: undefined, unidade: "kg",  icone: Activity },
  { label: "IMC",            valor: undefined, unidade: "",    icone: Target   },
  { label: "BF%",            valor: undefined, unidade: "%",   icone: Flame    },
  { label: "VO₂ máx",        valor: undefined, unidade: "ml",  icone: Zap      },
];

// ── Próximos treinos — estrutura canônica (sem dados de hoje) ──────────────

interface TreinoAgendado {
  dia: string;
  tipo: string;
  foco: string;
}

const SEMANA: TreinoAgendado[] = [
  { dia: "Seg", tipo: "Musculação", foco: "Peito + Tríceps" },
  { dia: "Ter", tipo: "Cardio",     foco: "HIIT 30min"      },
  { dia: "Qua", tipo: "Musculação", foco: "Costas + Bíceps" },
  { dia: "Qui", tipo: "Recuperação",foco: "Mobilidade"      },
  { dia: "Sex", tipo: "Musculação", foco: "Pernas"          },
  { dia: "Sáb", tipo: "Cardio",     foco: "Corrida leve"   },
  { dia: "Dom", tipo: "Descanso",   foco: "—"              },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function MetricaCell({ label, valor, unidade, icone: Icon }: typeof metricas[number]) {
  return (
    <GlassPanel padding="sm" className="!p-3 text-center">
      <Icon className="h-4 w-4 mx-auto mb-1.5" style={{ color: accent }} aria-hidden />
      <p
        className="text-lg font-bold leading-none"
        style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}
      >
        {valor != null ? `${valor}${unidade}` : "—"}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
        {label}
      </p>
    </GlassPanel>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────

export function ForjaScreen() {
  const { setData } = useIslandDock();

  // Streak começa em 0 — real streak virá de tracker externo (W14+)
  const streakAtual = 0;

  useEffect(() => {
    setData({
      islandId: "forja",
      label: "Treino",
      value: streakAtual > 0 ? `${streakAtual} dias` : "—",
      progress: 0,
      progressColor: accent,
      quickActions: [{ label: "Registrar Treino" }, { label: "+ Água" }],
    });
    return () => setData(null);
  }, [setData]);

  return (
    <IslandPageFrame theme="forja">
      <div className="space-y-5">
        <IslandPageHeader
          title="FORJA / CORPO"
          subtitle="Treino, Saúde e Disciplina"
          theme="forja"
        />

        {/* Aviso integração */}
        <div
          className="rounded-lg px-3 py-2 flex items-center gap-2 text-[11px]"
          style={{
            background: "color-mix(in oklab, var(--kratos-text-muted) 6%, var(--kratos-surface-3))",
            border: "1px solid color-mix(in oklab, var(--kratos-text-muted) 15%, transparent)",
          }}
        >
          <Dumbbell className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
          <span style={{ color: "var(--kratos-text-muted)" }}>
            Estrutura de treino visível — métricas reais via tracker de saúde (W14+).
          </span>
        </div>

        {/* Streak + Métricas */}
        <div className="grid grid-cols-[1fr_1fr] gap-3">
          {/* Streak */}
          <GlassPanel padding="sm" className="!p-4 flex flex-col items-center justify-center text-center">
            <Flame
              className="h-8 w-8 mb-1"
              style={{ color: streakAtual > 0 ? "var(--kr-warning)" : "var(--kratos-text-muted)" }}
              aria-hidden
            />
            <p
              className="text-3xl font-bold leading-none"
              style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}
            >
              {streakAtual > 0 ? streakAtual : "—"}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
              dias de streak
            </p>
          </GlassPanel>

          {/* Trophy */}
          <GlassPanel padding="sm" className="!p-4 flex flex-col items-center justify-center text-center">
            <Trophy className="h-8 w-8 mb-1" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
            <p
              className="text-3xl font-bold leading-none"
              style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}
            >
              —
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
              treinos no mês
            </p>
          </GlassPanel>
        </div>

        {/* Métricas Corporais */}
        <KratosCard header={<SectionTitle icon={Activity} title="Métricas Corporais" />}>
          <div className="grid grid-cols-4 gap-2">
            {metricas.map((m) => (
              <MetricaCell key={m.label} {...m} />
            ))}
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: "var(--kratos-text-muted)" }}>
            Conecte Apple Health / Garmin / Smart Scale para preencher
          </p>
        </KratosCard>

        {/* Semana de Treinos */}
        <KratosCard header={<SectionTitle icon={Dumbbell} title="Grade Semanal" />}>
          <div className="space-y-1">
            {SEMANA.map((t) => (
              <div
                key={t.dia}
                className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 kratos-card-hover"
              >
                <span
                  className="text-[11px] font-bold w-7 shrink-0 text-center"
                  style={{ color: accent, fontFamily: "var(--kratos-font-mono)" }}
                >
                  {t.dia}
                </span>
                <Circle className="h-2.5 w-2.5 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-medium" style={{ color: "var(--kratos-text-secondary)" }}>
                    {t.tipo}
                  </span>
                  {t.foco !== "—" && (
                    <span className="text-[11px] ml-1.5" style={{ color: "var(--kratos-text-muted)" }}>
                      · {t.foco}
                    </span>
                  )}
                </div>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
              </div>
            ))}
          </div>
        </KratosCard>

        {/* Tipos de Treino */}
        <KratosCard header={<SectionTitle icon={Zap} title="Modalidades" />}>
          <div className="space-y-2">
            {TIPOS_TREINO.map((t) => (
              <GlassPanel key={t.label} padding="sm" className="!p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
                        {t.label}
                      </p>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: `color-mix(in oklab, ${accent} 12%, transparent)`,
                          color: accent,
                        }}
                      >
                        {t.tag}
                      </span>
                    </div>
                    <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                      {t.descricao} · {t.diasSemana}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </KratosCard>

        {/* Último Treino */}
        <KratosCard header={<SectionTitle icon={Trophy} title="Último Treino Registrado" />}>
          <EmptyState
            compact
            icon={<Dumbbell className="h-4 w-4" />}
            title="Nenhum treino registrado"
            description="Registre seu primeiro treino para começar o histórico."
          />
        </KratosCard>
      </div>
    </IslandPageFrame>
  );
}
