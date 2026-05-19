import {
  Telescope,
  Lightbulb,
  Compass,
  Sparkles,
  Quote,
  Map,
  Layers,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";

const accent = "var(--kr-island-observatorio)";

interface Ideia {
  titulo: string;
  descricao: string;
  tags: string[];
}

const ideias: Ideia[] = [
  {
    titulo: "KRATOS Mobile App",
    descricao: "Versão PWA do Mission Control com notificações push",
    tags: ["Produto", "Tech"],
  },
  {
    titulo: "Pipeline Automático SDR",
    descricao: "Bot no Instagram que qualifica leads automaticamente",
    tags: ["Comercial", "Automação"],
  },
  {
    titulo: "Clube de Conteúdo RN",
    descricao: "Networking mensal com criadores de conteúdo do estado",
    tags: ["Comunidade", "RN"],
  },
];

interface Visao {
  titulo: string;
  descricao: string;
  horizonte: string;
}

const visao: Visao[] = [
  { titulo: "10M seguidores", descricao: "Ecossistema de mídia líder no Nordeste", horizonte: "2027" },
  { titulo: "Independência de plataforma", descricao: "Receita diversificada além do Instagram", horizonte: "2026" },
  { titulo: "Time enxuto de elite", descricao: "3 especialistas-chave + automação pesada", horizonte: "2025" },
];

interface Inspiracao {
  texto: string;
  autor: string;
}

const inspiracoes: Inspiracao[] = [
  { texto: "Você não precisa ser grande para começar, mas precisa começar para ser grande.", autor: "Zig Ziglar" },
  { texto: "Disciplina é a ponte entre metas e realizações.", autor: "Jim Rohn" },
];

interface ProjetoFuturo {
  nome: string;
  desc: string;
  prioridade: number;
}

const projetosFuturos: ProjetoFuturo[] = [
  { nome: "Sistema de CRM próprio", desc: "Pipeline de vendas integrado ao Instagram", prioridade: 1 },
  { nome: "Curso para criadores RN", desc: "Monetização para micro-influenciadores", prioridade: 2 },
  { nome: "Revista digital RN", desc: "Guia turístico premium do estado", prioridade: 3 },
];

interface ObservatorioScreenProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}

export function ObservatorioScreen({
  isLoading = false,
  error = null,
  isEmpty = false,
}: ObservatorioScreenProps) {
  return (
    <IslandPageFrame theme="observatorio">
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
            title="OBSERVATÓRIO"
            subtitle="Ideias, Visão e Estratégia"
            theme="observatorio"
          />

          {/* Mural da Visão */}
          <KratosCard header={<SectionTitle icon={Map} title="Mural da Visão" />}>
            <div className="grid grid-cols-3 gap-2">
              {visao.map((v) => (
                <GlassPanel key={v.titulo} padding="sm" className="!p-3 text-center">
                  <Compass className="h-5 w-5 mx-auto mb-1" style={{ color: accent }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
                    {v.titulo}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
                    {v.descricao}
                  </p>
                  <span
                    className="inline-block mt-2 rounded-md px-2 py-0.5 text-[9px] font-semibold"
                    style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)`, color: accent }}
                  >
                    {v.horizonte}
                  </span>
                </GlassPanel>
              ))}
            </div>
          </KratosCard>

          {/* Ideias Recentes */}
          <KratosCard header={<SectionTitle icon={Lightbulb} title="Ideias Recentes" />}>
            <div className="space-y-2">
              {ideias.map((ideia) => (
                <GlassPanel key={ideia.titulo} padding="sm" className="!p-3">
                  <div className="flex items-start gap-2 mb-1.5">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5" style={{ color: accent }} />
                    <p className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
                      {ideia.titulo}
                    </p>
                  </div>
                  <p className="text-[11px] mb-2" style={{ color: "var(--kratos-text-secondary)" }}>
                    {ideia.descricao}
                  </p>
                  <div className="flex gap-1">
                    {ideia.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md px-2 py-0.5 text-[9px] font-medium"
                        style={{ background: "var(--kratos-surface-3)", color: "var(--kratos-text-muted)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassPanel>
              ))}
            </div>
          </KratosCard>

          {/* Inspirações */}
          <KratosCard header={<SectionTitle icon={Quote} title="Inspirações" />}>
            <div className="space-y-2">
              {inspiracoes.map((insp) => (
                <GlassPanel key={insp.autor} padding="sm" className="!p-3 flex gap-2">
                  <Quote className="h-4 w-4 shrink-0 mt-0.5" style={{ color: accent }} />
                  <div>
                    <p className="text-[12px] italic" style={{ color: "var(--kratos-text-secondary)" }}>
                      "{insp.texto}"
                    </p>
                    <p className="text-[10px] mt-0.5 font-medium" style={{ color: accent }}>
                      — {insp.autor}
                    </p>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </KratosCard>

          {/* Projetos Futuros */}
          <KratosCard header={<SectionTitle icon={Layers} title="Projetos Futuros" />}>
            <div className="space-y-1">
              {projetosFuturos.map((p) => (
                <div
                  key={p.nome}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 transition-colors kratos-card-hover"
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                    style={{ background: "var(--kratos-surface-3)", color: accent }}
                  >
                    P{p.prioridade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
                      {p.nome}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </KratosCard>
        </div>
      )}
    </IslandPageFrame>
  );
}
