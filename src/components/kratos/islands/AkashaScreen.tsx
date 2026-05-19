import { IslandPageHeader } from "./shared/IslandPageHeader";
import { IslandPageFrame } from "./shared/IslandPageFrame";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  TrendingUp,
  FileText,
  Lightbulb,
  BookOpen,
  Grid3X3,
  Sparkles,
  Search,
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────────────────────

const knowledgeStats = [
  { label: "Documentos", value: "20K", icon: FileText },
  { label: "Insights", value: "5.9K", icon: Lightbulb },
  { label: "Livros", value: "376", icon: BookOpen },
  { label: "Chunks", value: "606K", icon: Grid3X3 },
];

const recentDocs = [
  { title: "Estratégia de Conteúdo Q2", type: "doc", ago: "2h" },
  { title: "KRATOS Design System v3", type: "doc", ago: "5h" },
  { title: "Análise de Métricas Abril", type: "doc", ago: "1d" },
];

const savedPrompts = [
  "Resumir reunião de sprint em 3 bullet points",
  "Gerar legenda para post de agência no tom do Lucas",
  "Analisar sentimento dos últimos 50 feedbacks",
];

const activeResearch = [
  "Melhores práticas de UI para TDAH — 12 fontes",
  "Cloudflare Workers edge computing — 8 fontes",
  "Automação de conteúdo com IA — 5 fontes",
];

// ── Sub-components ─────────────────────────────────────────────────────────

function KnowledgeStatPanel() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-4"
        style={{ color: "var(--kr-accent-gold-light)" }}
      >
        Estatísticas do Conhecimento
      </h3>
      <div className="space-y-4">
        {knowledgeStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "color-mix(in srgb, var(--kr-island-akasha) 15%, transparent)" }}
            >
              <stat.icon className="h-4 w-4" style={{ color: "var(--kr-accent-green-light)" }} aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="kratos-num text-lg">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--kratos-text-muted)" }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function GoldBorderCard({ title, type, ago }: { title: string; type: string; ago: string }) {
  return (
    <div
      className="rounded-xl p-3 transition-colors kratos-card-hover"
      style={{
        background: "var(--kratos-surface-2)",
        borderLeft: "3px solid var(--kr-warning)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "color-mix(in srgb, var(--kr-warning) 15%, transparent)" }}
        >
          <FileText className="h-4 w-4" style={{ color: "var(--kr-accent-gold-light)" }} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium truncate" style={{ color: "var(--kratos-text-primary)" }}>
            {title}
          </p>
          <p className="text-[10px] kratos-mono uppercase tracking-[0.08em]" style={{ color: "var(--kratos-text-muted)" }}>
            {type} · {ago}
          </p>
        </div>
      </div>
    </div>
  );
}

function DocumentosRecentes() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Documentos Recentes
      </h3>
      <div className="space-y-2">
        {recentDocs.map((doc) => (
          <GoldBorderCard key={doc.title} {...doc} />
        ))}
      </div>
    </GlassPanel>
  );
}

function VaultIntegrityBadge() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--kr-island-akasha), var(--kr-accent-emerald))",
            boxShadow: "0 0 20px color-mix(in srgb, var(--kr-accent-emerald) 40%, transparent)",
          }}
        >
          <ShieldCheck className="h-5 w-5 text-white" aria-hidden />
        </div>
        <div>
          <p className="text-[15px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            100% Integridade
          </p>
          <p className="text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--kratos-text-muted)" }}>
            Vault seguro — sem corrupção
          </p>
        </div>
      </div>
      {/* Emerald bar */}
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: "100%", background: "var(--kr-accent-emerald)" }}
          aria-hidden
        />
      </div>
    </GlassPanel>
  );
}

function MemorySparkline() {
  return (
    <GlassPanel padding="md">
      <div className="flex items-center justify-between mb-3">
        <h3
          className="kratos-eyebrow mb-0"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          Memória
        </h3>
        <span
          className="kratos-mono text-[11px] font-medium"
          style={{ color: "var(--kr-success)" }}
        >
          +23.6% essa semana
        </span>
      </div>
      {/* SVG area chart */}
      <svg
        viewBox="0 0 200 48"
        className="w-full h-12"
        preserveAspectRatio="none"
        aria-label="Gráfico de crescimento da memória: +23.6%"
      >
        <defs>
          <linearGradient id="memGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--kr-accent-emerald)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--kr-accent-emerald)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,40 C20,35 40,28 60,30 C80,32 100,15 120,18 C140,21 160,8 180,5 C190,3 200,2 200,2 L200,48 L0,48 Z"
          fill="url(#memGrad)"
        />
        <path
          d="M0,40 C20,35 40,28 60,30 C80,32 100,15 120,18 C140,21 160,8 180,5 C190,3 200,2"
          fill="none"
          stroke="var(--kr-accent-emerald)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </GlassPanel>
  );
}

function VaultCrystal() {
  return (
    <div className="flex justify-center mb-2">
      <div
        className="relative"
        style={{ animation: "kratos-float-medium 5s ease-in-out infinite" }}
      >
        {/* Glow behind */}
        <div
          className="absolute -inset-6 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--kr-accent-emerald, #10B981) 30%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Diamond shape */}
        <div
          className="h-16 w-16 relative"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: "linear-gradient(135deg, var(--kr-accent-emerald), var(--kr-island-akasha), var(--kr-accent-green-light, #34D399))",
            boxShadow: "0 0 30px color-mix(in srgb, var(--kr-accent-cyan-bright) 50%, transparent), 0 0 60px color-mix(in srgb, var(--kr-accent-cyan) 20%, transparent)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function PromptsSalvos() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Prompts Salvos
      </h3>
      <div className="space-y-2">
        {savedPrompts.map((prompt, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg px-3 py-2 transition-colors kratos-card-hover"
            style={{ background: "var(--kratos-surface-2)" }}
          >
            <Sparkles
              className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--kr-accent-gold-light)" }}
              aria-hidden
            />
            <span className="text-[12px] leading-relaxed" style={{ color: "var(--kratos-text-secondary)" }}>
              {prompt}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function PesquisasAtivas() {
  return (
    <GlassPanel padding="md">
      <h3
        className="kratos-eyebrow mb-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        Pesquisas Ativas
      </h3>
      <div className="space-y-2">
        {activeResearch.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg px-3 py-2 transition-colors kratos-card-hover"
            style={{ background: "var(--kratos-surface-2)" }}
          >
            <Search
              className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--kr-accent-green-light)" }}
              aria-hidden
            />
            <span className="text-[12px] leading-relaxed" style={{ color: "var(--kratos-text-secondary)" }}>
              {r}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

interface AkashaScreenProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}

export function AkashaScreen({
  isLoading = false,
  error = null,
  isEmpty = false,
}: AkashaScreenProps) {
  return (
    <IslandPageFrame theme="akasha">
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
        <>
          <IslandPageHeader
            title="AKASHA / GRINGOTTS"
            subtitle="Banco de Conhecimento, Memória e Arquivos"
            theme="akasha"
          />

          {/* Crystal hero */}
          <VaultCrystal />

          {/* Stats + Integrity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <KnowledgeStatPanel />
            <div className="space-y-4">
              <VaultIntegrityBadge />
              <MemorySparkline />
            </div>
          </div>

          {/* Recent docs — full width */}
          <DocumentosRecentes />

          {/* Bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <PromptsSalvos />
            <PesquisasAtivas />
          </div>
        </>
      )}
    </IslandPageFrame>
  );
}
