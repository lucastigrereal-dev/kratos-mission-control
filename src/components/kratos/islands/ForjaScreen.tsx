import {
  Dumbbell,
  Flame,
  Trophy,
  Zap,
  Activity,
  Moon,
  Droplets,
  Apple,
  Scale,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { ProgressRing } from "@/components/kratos/ui-primitives/ProgressRing";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { IslandPageHeader } from "./shared/IslandPageHeader";

const accent = "#D97706";

interface MetricCard {
  icon: typeof Dumbbell;
  label: string;
  value: string;
  target: string;
  pct: number;
}

const saudeMetrics: MetricCard[] = [
  { icon: Scale, label: "Peso", value: "82 kg", target: "78 kg", pct: 60 },
  { icon: Moon, label: "Sono", value: "6.5 h", target: "8 h", pct: 55 },
  { icon: Droplets, label: "Água", value: "1.8 L", target: "3 L", pct: 72 },
  { icon: Apple, label: "Alimentação", value: "Limpa", target: "Limpa", pct: 85 },
];

const disciplinaScore = 78;
const streakDias = 47;

const exercicios = [
  "Supino",
  "Agachamento",
  "Remada",
  "Desenvolvimento",
  "Rosca",
  "Tríceps",
  "Abdominal",
];

const disciplinaItems = [
  { label: "Treinos completos", pct: 85 },
  { label: "Alimentação limpa", pct: 72 },
  { label: "Sono regular", pct: 68 },
  { label: "Hidratação", pct: 82 },
];

export function ForjaScreen() {
  return (
    <div className="space-y-5">
      <IslandPageHeader
        title="FORJA / CORPO"
        subtitle="Treino, Saúde e Disciplina"
        theme="agencia"
      />

      {/* Streak + Disciplina */}
      <div className="grid grid-cols-2 gap-3">
        <KratosCard>
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
            >
              <Flame className="h-5 w-5" style={{ color: "#EF4444" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--kratos-text-muted)" }}>Streak</p>
              <p className="text-xl font-bold" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                {streakDias} <span className="text-xs" style={{ color: "var(--kratos-text-muted)" }}>dias</span>
              </p>
            </div>
          </div>
        </KratosCard>

        <KratosCard>
          <div className="flex items-center gap-3">
            <ProgressRing value={disciplinaScore} size={44} strokeWidth={4} color={accent} glow label={`${disciplinaScore}%`} />
            <div>
              <p className="text-xs" style={{ color: "var(--kratos-text-muted)" }}>Disciplina</p>
              <p className="text-sm font-semibold" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                Nível Ferro
              </p>
            </div>
          </div>
        </KratosCard>
      </div>

      {/* Treino de Hoje */}
      <KratosCard header={<SectionTitle icon={Zap} title="Treino de Hoje" />}>
        <GlassPanel padding="sm" className="!p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" style={{ color: accent }} />
              <p className="text-sm font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
                Full Body — Hipertrofia
              </p>
            </div>
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: `${accent}20`, color: accent }}
            >
              Alta Intensidade
            </span>
          </div>
          <div className="flex gap-3 text-[11px]">
            <span style={{ color: "var(--kratos-text-muted)" }}>Duração: 55 min</span>
            <span style={{ color: "var(--kratos-text-muted)" }}>Exercícios: 7</span>
            <span style={{ color: "var(--kratos-text-muted)" }}>Séries: 24</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {exercicios.map((ex) => (
              <span
                key={ex}
                className="rounded-md px-2 py-0.5 text-[10px]"
                style={{ background: "var(--kratos-surface-3)", color: "var(--kratos-text-secondary)" }}
              >
                {ex}
              </span>
            ))}
          </div>
        </GlassPanel>
      </KratosCard>

      {/* Métricas de Saúde */}
      <KratosCard header={<SectionTitle icon={Activity} title="Métricas de Saúde" />}>
        <div className="grid grid-cols-2 gap-2">
          {saudeMetrics.map((m) => (
            <GlassPanel key={m.label} padding="sm" className="!p-3">
              <div className="flex items-center justify-between mb-1">
                <m.icon className="h-3.5 w-3.5" style={{ color: accent }} />
                <ProgressRing value={m.pct} size={28} strokeWidth={3} color={m.pct > 70 ? "#22C55E" : accent} />
              </div>
              <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                {m.label}
              </p>
              <p className="text-sm font-bold mt-0.5" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                {m.value}
              </p>
              <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
                Meta: {m.target}
              </p>
            </GlassPanel>
          ))}
        </div>
      </KratosCard>

      {/* Escore de Disciplina */}
      <KratosCard header={<SectionTitle icon={Trophy} title="Escore de Disciplina" />}>
        <div className="flex items-center gap-4">
          <ProgressRing value={disciplinaScore} size={64} strokeWidth={5} color={accent} glow label={`${disciplinaScore}%`} />
          <div className="flex-1 space-y-2">
            {disciplinaItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span style={{ color: "var(--kratos-text-secondary)" }}>{item.label}</span>
                  <span style={{ color: "var(--kratos-text-muted)", fontFamily: "var(--kratos-font-mono)" }}>{item.pct}%</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: "var(--kratos-surface-4)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.pct}%`, backgroundColor: accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </KratosCard>
    </div>
  );
}
