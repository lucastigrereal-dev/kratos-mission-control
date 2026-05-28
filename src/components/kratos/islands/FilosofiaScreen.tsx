import { useEffect } from "react";
import {
  BookOpen,
  Lightbulb,
  Target,
  Star,
  Library,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { useIslandDock } from "./shared/IslandDockContext";
import { InsightOfTheDay } from "@/components/kratos/akasha/InsightOfTheDay";

const accent = "var(--kr-island-filosofia)";

// ── Dados do Akasha — fatos reais da biblioteca (sem números inventados) ───
// Fonte: CLAUDE.md — "Biblioteca Sabedoria — 376 livros, 5.917 insights"

const AKASHA_STATS = {
  livros:   376,
  insights: 5_917,
} as const;

// ── Categorias de leitura ────────────────────────────────────────────────────

interface Categoria {
  label: string;
  descricao: string;
  exemplos: string;
}

const CATEGORIAS: Categoria[] = [
  { label: "Filosofia Estoica",  descricao: "Marco Aurélio, Epicteto, Sêneca",        exemplos: "Meditações · Enchiridion · Cartas" },
  { label: "Estratégia & Poder", descricao: "Princípios de tomada de decisão",         exemplos: "48 Leis · Arte da Guerra · Príncipe" },
  { label: "Psicologia",         descricao: "Mente, comportamento e performance",      exemplos: "Pensar Rápido e Devagar · Hábito" },
  { label: "Biologia & Saúde",   descricao: "Longevidade, sono e neurodesempenho",     exemplos: "Outlive · Por Que Dormimos" },
  { label: "Empreendedorismo",   descricao: "Negócios, escala e criação de valor",     exemplos: "Zero to One · A Startup Enxuta" },
];

// ── Metas de aprendizado (estrutura — sem datas inventadas) ─────────────────

interface MetaLeitura {
  label: string;
  progresso: number; // 0–100, 0 = não iniciado
}

const METAS: MetaLeitura[] = [
  { label: "1 livro/mês", progresso: 0 },
  { label: "3 insights/semana registrados", progresso: 0 },
  { label: "Reflexão semanal escrita", progresso: 0 },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function AkashaStatCard() {
  return (
    <GlassPanel padding="sm" className="!p-4">
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `color-mix(in oklab, ${accent} 12%, transparent)` }}
        >
          <Library className="h-5 w-5" style={{ color: accent }} aria-hidden />
        </div>
        <div>
          <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
            Biblioteca Sabedoria · Akasha
          </p>
          <div className="flex items-baseline gap-3 mt-0.5">
            <span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}
              >
                {AKASHA_STATS.livros.toLocaleString("pt-BR")}
              </span>
              <span className="text-[10px] ml-1" style={{ color: "var(--kratos-text-muted)" }}>livros</span>
            </span>
            <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>·</span>
            <span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}
              >
                {AKASHA_STATS.insights.toLocaleString("pt-BR")}
              </span>
              <span className="text-[10px] ml-1" style={{ color: "var(--kratos-text-muted)" }}>insights</span>
            </span>
          </div>
        </div>
      </div>
      <p className="text-[10px] mt-2" style={{ color: "var(--kratos-text-muted)" }}>
        Indexados via pgvector. Busca semântica disponível em W13.
      </p>
    </GlassPanel>
  );
}

function MetaRow({ meta }: { meta: MetaLeitura }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span style={{ color: "var(--kratos-text-secondary)" }}>{meta.label}</span>
        <span style={{ color: "var(--kratos-text-muted)", fontFamily: "var(--kratos-font-mono)" }}>
          {meta.progresso > 0 ? `${meta.progresso}%` : "não iniciado"}
        </span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "var(--kratos-surface-4)" }}>
        {meta.progresso > 0 && (
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${meta.progresso}%`, backgroundColor: accent }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────

export function FilosofiaScreen() {
  const { setData } = useIslandDock();

  useEffect(() => {
    setData({
      islandId: "filosofia",
      label: "Leitura",
      value: `${AKASHA_STATS.livros} livros`,
      progress: 0,
      progressColor: accent,
      quickActions: [{ label: "Novo Insight" }, { label: "Meta" }],
    });
    return () => setData(null);
  }, [setData]);

  return (
    <IslandPageFrame theme="filosofia">
      <div className="space-y-5">
        <IslandPageHeader
          title="FILOSOFIA & SABEDORIA"
          subtitle="Aprendizado, Filosofia e Evolução Pessoal"
          theme="filosofia"
        />

        {/* Akasha stat */}
        <AkashaStatCard />

        {/* Leitura Atual */}
        <KratosCard header={<SectionTitle icon={BookOpen} title="Leitura Atual" />}>
          <EmptyState
            compact
            icon={<BookOpen className="h-4 w-4" />}
            title="Nenhum livro em andamento"
            description="Registre o livro atual para acompanhar progresso e extrair insights."
          />
        </KratosCard>

        {/* Insight do Dia — W14 auto-learning via Akasha */}
        <KratosCard
          header={<SectionTitle icon={Lightbulb} title="Insight do Dia" />}
        >
          <InsightOfTheDay accent={accent} />
        </KratosCard>

        {/* Categorias */}
        <KratosCard header={<SectionTitle icon={Library} title="Categorias na Biblioteca" />}>
          <div className="space-y-1.5">
            {CATEGORIAS.map((cat) => (
              <div
                key={cat.label}
                className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 kratos-card-hover"
              >
                <div
                  className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)` }}
                >
                  <Star className="h-3.5 w-3.5" style={{ color: accent }} aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
                    {cat.label}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
                    {cat.exemplos}
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
              </div>
            ))}
          </div>
        </KratosCard>

        {/* Metas de Aprendizado */}
        <KratosCard header={<SectionTitle icon={Target} title="Metas de Aprendizado" />}>
          <div className="space-y-3">
            {METAS.map((meta) => (
              <MetaRow key={meta.label} meta={meta} />
            ))}
          </div>
        </KratosCard>

        {/* Próxima reflexão */}
        <KratosCard header={<SectionTitle icon={Sparkles} title="Reflexão Semanal" />}>
          <EmptyState
            compact
            icon={<Sparkles className="h-4 w-4" />}
            title="Nenhuma reflexão registrada esta semana"
            description="Escreva sua reflexão semanal para fechar o ciclo de aprendizado."
          />
        </KratosCard>
      </div>
    </IslandPageFrame>
  );
}
