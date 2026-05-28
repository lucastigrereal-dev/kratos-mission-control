/**
 * AppFactoryPanel — W16 App Factory UI
 *
 * Template-based mini-app creation interface for OMNIS.
 * Shows available automation templates across categories.
 * Instantiation requires OMNIS W28 — all deploy CTAs are disabled.
 *
 * Read-only: KRATOS exibe, OMNIS executa.
 */
import { useState } from "react";
import {
  Package,
  Zap,
  Users,
  BarChart2,
  Settings2,
  MessageSquare,
  TrendingUp,
  FileText,
  Mail,
  ChevronRight,
  PlusCircle,
  Lock,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { EmptyState } from "@/components/kratos/base/EmptyState";

const accent = "var(--kr-island-omnis)";

// ── Template catalog ──────────────────────────────────────────────────────────

type TemplateCategory = "todos" | "conteudo" | "crm" | "analytics" | "operacoes";
type TemplateStatus   = "stable" | "beta" | "draft";
type Complexity       = "baixa" | "média" | "alta";

interface AppTemplate {
  id: string;
  name: string;
  description: string;
  category: Exclude<TemplateCategory, "todos">;
  icon: typeof Package;
  status: TemplateStatus;
  complexity: Complexity;
  skills: string[];
}

const TEMPLATES: AppTemplate[] = [
  {
    id: "daily_brief",
    name: "Daily Brief Bot",
    description: "Gera briefing diário com métricas, agenda e prioridades do dia.",
    category: "conteudo",
    icon: Zap,
    status: "stable",
    complexity: "baixa",
    skills: ["jarvis-morning", "akasha-search", "content-formatter"],
  },
  {
    id: "lead_qualifier",
    name: "Lead Qualifier",
    description: "Qualifica leads de hotéis e restaurantes com score IA.",
    category: "crm",
    icon: TrendingUp,
    status: "stable",
    complexity: "média",
    skills: ["lead-qualifier", "crm-sync", "notify-slack"],
  },
  {
    id: "content_queue",
    name: "Content Queue Manager",
    description: "Gerencia fila de posts por perfil com status e aprovação.",
    category: "conteudo",
    icon: MessageSquare,
    status: "stable",
    complexity: "média",
    skills: ["content-queue", "argos-enqueue", "media-formatter"],
  },
  {
    id: "client_report",
    name: "Client Report Generator",
    description: "Gera relatório de resultados para clientes publi/collab.",
    category: "analytics",
    icon: FileText,
    status: "beta",
    complexity: "alta",
    skills: ["metrics-collector", "report-builder", "pdf-export"],
  },
  {
    id: "weekly_analytics",
    name: "Weekly Analytics",
    description: "Compila analytics semanal dos 6 perfis em um único painel.",
    category: "analytics",
    icon: BarChart2,
    status: "beta",
    complexity: "alta",
    skills: ["instagram-analytics", "data-aggregator", "insight-generator"],
  },
  {
    id: "inbox_triage",
    name: "Inbox Triage",
    description: "Classifica e prioriza DMs e e-mails por urgência e tipo.",
    category: "operacoes",
    icon: Mail,
    status: "beta",
    complexity: "média",
    skills: ["inbox-reader", "classifier", "triage-responder"],
  },
  {
    id: "collab_radar",
    name: "Collab Radar",
    description: "Monitora oportunidades de collab com hotéis e restaurantes.",
    category: "crm",
    icon: Users,
    status: "draft",
    complexity: "alta",
    skills: ["web-scraper", "opportunity-scorer", "crm-sync"],
  },
  {
    id: "ops_health",
    name: "Ops Health Check",
    description: "Verifica saúde operacional dos containers e serviços OMNIS.",
    category: "operacoes",
    icon: Settings2,
    status: "stable",
    complexity: "baixa",
    skills: ["health-check", "alert-dispatcher", "status-report"],
  },
];

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  todos:     "Todos",
  conteudo:  "Conteúdo",
  crm:       "CRM",
  analytics: "Analytics",
  operacoes: "Operações",
};

const STATUS_CFG: Record<TemplateStatus, { label: string; color: string; bg: string }> = {
  stable: { label: "Estável", color: "var(--kr-success)",          bg: "color-mix(in oklab, var(--kr-success) 10%, transparent)"          },
  beta:   { label: "Beta",    color: "var(--kr-warning)",          bg: "color-mix(in oklab, var(--kr-warning) 10%, transparent)"          },
  draft:  { label: "Rascunho",color: "var(--kratos-text-muted)",   bg: "color-mix(in oklab, var(--kratos-text-muted) 8%, transparent)"    },
};

const COMPLEXITY_COLOR: Record<Complexity, string> = {
  baixa: "var(--kr-success)",
  média: "var(--kr-warning)",
  alta:  "var(--kratos-critical)",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: TemplateCategory;
  onChange: (c: TemplateCategory) => void;
  counts: Record<TemplateCategory, number>;
}) {
  const cats = Object.keys(CATEGORY_LABELS) as TemplateCategory[];
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {cats.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-150"
            style={{
              background: isActive
                ? `color-mix(in oklab, ${accent} 18%, transparent)`
                : "color-mix(in oklab, var(--kratos-surface-3) 60%, transparent)",
              border: isActive
                ? `1px solid color-mix(in oklab, ${accent} 40%, transparent)`
                : "1px solid color-mix(in oklab, var(--kratos-text-muted) 8%, transparent)",
              color: isActive ? accent : "var(--kratos-text-muted)",
            }}
          >
            {CATEGORY_LABELS[cat]}
            {" "}
            <span
              className="text-[9px] ml-0.5"
              style={{ color: isActive ? accent : "var(--kratos-text-muted)", opacity: 0.7 }}
            >
              {counts[cat]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TemplateCard({ template }: { template: AppTemplate }) {
  const Icon   = template.icon;
  const status = STATUS_CFG[template.status];

  return (
    <GlassPanel padding="sm" className="!p-3 flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-start gap-2.5">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)` }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
              {template.name}
            </p>
            {/* Status badge */}
            <span
              className="text-[9px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded shrink-0"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>
          <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "var(--kratos-text-secondary)" }}>
            {template.description}
          </p>
        </div>
      </div>

      {/* Skills chips */}
      <div className="flex flex-wrap gap-1">
        {template.skills.map((s) => (
          <span
            key={s}
            className="text-[9px] px-1.5 py-0.5 rounded"
            style={{
              background: "color-mix(in oklab, var(--kratos-surface-4) 60%, transparent)",
              color: "var(--kratos-text-muted)",
              fontFamily: "var(--kratos-font-mono)",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Footer — complexity + deploy */}
      <div className="flex items-center justify-between mt-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[9px] uppercase tracking-[0.06em]" style={{ color: "var(--kratos-text-muted)" }}>
            Complexidade:
          </span>
          <span
            className="text-[9px] font-bold uppercase tracking-[0.05em]"
            style={{ color: COMPLEXITY_COLOR[template.complexity] }}
          >
            {template.complexity}
          </span>
        </div>

        <button
          type="button"
          disabled
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold opacity-50 cursor-not-allowed"
          style={{
            background: `color-mix(in oklab, ${accent} 8%, transparent)`,
            border: `1px solid color-mix(in oklab, ${accent} 15%, transparent)`,
            color: accent,
          }}
          title="Deploy requer OMNIS W28"
          aria-label={`Deploy ${template.name} (indisponível)`}
        >
          <Lock className="h-2.5 w-2.5" aria-hidden />
          Deploy
        </button>
      </div>
    </GlassPanel>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function AppFactoryPanel() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("todos");

  const filtered =
    activeCategory === "todos"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const counts: Record<TemplateCategory, number> = {
    todos:     TEMPLATES.length,
    conteudo:  TEMPLATES.filter((t) => t.category === "conteudo").length,
    crm:       TEMPLATES.filter((t) => t.category === "crm").length,
    analytics: TEMPLATES.filter((t) => t.category === "analytics").length,
    operacoes: TEMPLATES.filter((t) => t.category === "operacoes").length,
  };

  return (
    <div className="space-y-4">
      {/* Template Catalog */}
      <KratosCard
        header={
          <div className="flex items-center gap-2">
            <SectionTitle icon={Package} title="Catálogo de Templates" />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded"
              style={{
                background: "color-mix(in oklab, var(--kr-warning) 12%, transparent)",
                color: "var(--kr-warning)",
              }}
            >
              W28
            </span>
          </div>
        }
      >
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} counts={counts} />

        {filtered.length === 0 ? (
          <EmptyState
            compact
            icon={<Package className="h-4 w-4" />}
            title="Nenhum template nesta categoria"
            description="Selecione outra categoria ou crie um template personalizado."
          />
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        )}
      </KratosCard>

      {/* My Apps — empty until W28 deploy is available */}
      <KratosCard
        header={
          <div className="flex items-center gap-2">
            <SectionTitle icon={PlusCircle} title="Meus Apps" />
          </div>
        }
      >
        <EmptyState
          compact
          icon={<Package className="h-4 w-4" />}
          title="Nenhum app instanciado"
          description="Faça deploy de um template acima para criar seu primeiro mini-app no OMNIS."
        />
        <p
          className="text-[10px] text-center mt-2"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          Apps ativos, logs e configurações aparecerão aqui após W28
        </p>
      </KratosCard>
    </div>
  );
}
