import {
  BookOpen,
  Lightbulb,
  Library,
  Brain,
  GraduationCap,
  Sparkles,
  BookMarked,
  TrendingUp,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { IslandPageHeader } from "./shared/IslandPageHeader";

const accent = "#6366F1";

interface Insight {
  texto: string;
  fonte: string;
  data: string;
}

const insights: Insight[] = [
  {
    texto: "A clareza de propósito elimina 90% das decisões desnecessárias.",
    fonte: "Essentialism — Greg McKeown",
    data: "15/05",
  },
  {
    texto: "Sistemas superam força de vontade. Design de ambiente é tudo.",
    fonte: "Atomic Habits — James Clear",
    data: "12/05",
  },
  {
    texto: "O que você mede, você melhora. O que você não mede, se deteriora.",
    fonte: "Notas pessoais",
    data: "10/05",
  },
];

interface Livro {
  titulo: string;
  autor: string;
  progresso: number;
  capa: string;
}

const leituraAtual: Livro = {
  titulo: "The Almanack of Naval Ravikant",
  autor: "Eric Jorgenson",
  progresso: 64,
  capa: "📘",
};

const bibliotecaStats = {
  total: 376,
  lidos: 214,
  lendo: 3,
  metaAnual: 24,
  lidosAno: 11,
};

interface Aprendizado {
  titulo: string;
  resumo: string;
}

const aprendizados: Aprendizado[] = [
  {
    titulo: "Negociação baseada em valor",
    resumo: "Precificar pelo ROI do cliente, não pelo custo do serviço",
  },
  {
    titulo: "Delegação com clareza",
    resumo: "Descrever o resultado esperado, não o processo",
  },
  {
    titulo: "Energia > Tempo",
    resumo: "Gerenciar picos de energia é mais importante que horas trabalhadas",
  },
];

const libCards = [
  { label: "Total", value: bibliotecaStats.total, icon: BookMarked },
  { label: "Lidos", value: bibliotecaStats.lidos, icon: GraduationCap },
  { label: "Lendo", value: bibliotecaStats.lendo, icon: BookOpen },
  {
    label: "Meta 2026",
    value: `${bibliotecaStats.lidosAno}/${bibliotecaStats.metaAnual}`,
    icon: TrendingUp,
  },
];

export function FilosofiaScreen() {
  return (
    <div className="space-y-5">
      <IslandPageHeader
        title="FILOSOFIA & SABEDORIA"
        subtitle="Aprendizado, Filosofia e Evolução Pessoal"
        theme="omnis"
      />

      {/* Leitura Atual */}
      <KratosCard header={<SectionTitle icon={BookOpen} title="Leitura Atual" />}>
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
          >
            {leituraAtual.capa}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--kratos-text-primary)" }}>
              {leituraAtual.titulo}
            </p>
            <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
              {leituraAtual.autor}
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex-1 h-1.5 rounded-full mr-3" style={{ background: "var(--kratos-surface-4)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${leituraAtual.progresso}%`, backgroundColor: accent }}
                />
              </div>
              <span
                className="text-[10px] font-semibold"
                style={{ color: accent, fontFamily: "var(--kratos-font-mono)" }}
              >
                {leituraAtual.progresso}%
              </span>
            </div>
          </div>
        </div>
      </KratosCard>

      {/* Biblioteca */}
      <KratosCard header={<SectionTitle icon={Library} title="Biblioteca" />}>
        <div className="grid grid-cols-4 gap-2">
          {libCards.map((s) => (
            <GlassPanel key={s.label} padding="sm" className="!p-2 text-center">
              <s.icon className="h-3.5 w-3.5 mx-auto mb-1" style={{ color: accent }} />
              <p className="text-sm font-bold" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                {s.value}
              </p>
              <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
                {s.label}
              </p>
            </GlassPanel>
          ))}
        </div>
      </KratosCard>

      {/* Insights Recentes */}
      <KratosCard header={<SectionTitle icon={Lightbulb} title="Insights Recentes" />}>
        <div className="space-y-2">
          {insights.map((ins, i) => (
            <GlassPanel key={i} padding="sm" className="!p-3 flex gap-2">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5" style={{ color: accent }} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px]" style={{ color: "var(--kratos-text-secondary)" }}>
                  "{ins.texto}"
                </p>
                <div className="flex justify-between mt-1">
                  <p className="text-[10px]" style={{ color: accent }}>{ins.fonte}</p>
                  <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>{ins.data}</p>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </KratosCard>

      {/* Aprendizados do Mês */}
      <KratosCard header={<SectionTitle icon={GraduationCap} title="Aprendizados do Mês" />}>
        <div className="space-y-2">
          {aprendizados.map((a) => (
            <div key={a.titulo} className="flex gap-2 rounded-lg px-2 py-1.5 -mx-2">
              <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accent }} />
              <div>
                <p className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
                  {a.titulo}
                </p>
                <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                  {a.resumo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </KratosCard>
    </div>
  );
}
