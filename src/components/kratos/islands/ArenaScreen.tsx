import { useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Trophy,
  Handshake,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useIslandDock } from "./shared/IslandDockContext";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { ProgressRing } from "@/components/kratos/ui-primitives/ProgressRing";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { IslandPageHeader } from "./shared/IslandPageHeader";

const accent = "var(--kr-island-arena)";

// ── W10-B2: Pipeline Board mock data ─────────────────────────────────────
// Fonte futura: /arena/pipeline (crm-tigre-backend)

interface DealStage {
  label: string;
  count: number;
  value: string;
}

const pipeline: DealStage[] = [
  { label: "Prospecção",  count: 8, value: "R$4.800" },
  { label: "Proposta",    count: 5, value: "R$5.990" },
  { label: "Negociação",  count: 3, value: "R$2.970" },
  { label: "Fechado",     count: 2, value: "R$2.180" },
];

// ── W10-B3: CRM Board mock data ───────────────────────────────────────────
// Fonte futura: /arena/leads (crm-tigre-backend + ManyChat webhook)

interface Lead {
  nome: string;
  hotel: string;
  valor: string;
  status: "quente" | "morno" | "frio";
}

const leads: Lead[] = [
  { nome: "Gerente Comercial",  hotel: "Hotel Serhs Natal Grand",  valor: "R$990/mês", status: "quente" },
  { nome: "Resp. Marketing",    hotel: "Pousada dos Búzios",       valor: "R$350",     status: "quente" },
  { nome: "Sócio Gerente",      hotel: "Soho Gastrobar",           valor: "R$350",     status: "morno" },
  { nome: "Gerência",           hotel: "Mangai Natal",             valor: "R$990/mês", status: "morno" },
  { nome: "Chef/Dono",          hotel: "Tiê Bistrô",               valor: "R$350",     status: "frio" },
];

interface Conquista {
  cliente: string;
  pacote: string;
  valor: string;
  data: string;
}

const conquistas: Conquista[] = [
  { cliente: "Hotel Araruna",  pacote: "Starter",    valor: "R$350",     data: "12 Mai" },
  { cliente: "Pongá Bistrô",   pacote: "Growth",     valor: "R$990/mês", data: "08 Mai" },
  { cliente: "Taberna do Mar", pacote: "Premium",    valor: "R$1.200",   data: "02 Mai" },
];

const statusColors: Record<Lead["status"], string> = {
  quente: "var(--kr-danger, var(--kratos-critical))",
  morno:  "var(--kr-warning, var(--kratos-warn))",
  frio:   "var(--kratos-text-muted)",
};

const statusLabels: Record<Lead["status"], string> = {
  quente: "Quente",
  morno:  "Morno",
  frio:   "Frio",
};

// Meta mensal (mock — W10-B3)
const metaAtual = 5_340;
const metaTotal = 9_900;
const metaPct = Math.round((metaAtual / metaTotal) * 100);

// Mock ativo: hasData sempre true neste bloco
const hasData = true;

interface ArenaScreenProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}

export function ArenaScreen({
  isLoading = false,
  error = null,
  isEmpty = false,
}: ArenaScreenProps) {
  const { setData } = useIslandDock();
  const totalDeals = pipeline.reduce((sum, s) => sum + s.count, 0);

  useEffect(() => {
    setData({
      islandId: "arena",
      label: "Pipeline",
      value: totalDeals > 0 ? `${totalDeals} deals` : "—",
      progress: metaPct,
      progressColor: "var(--kr-island-arena)",
      quickActions: [{ label: "Novo Lead" }, { label: "Follow-up" }],
    });
    return () => setData(null);
  }, [setData, totalDeals]);

  return (
    <>
      {isLoading ? (
        <LoadingState lines={6} />
      ) : error ? (
        <ErrorState
          title="Erro ao carregar"
          description={error}
          variant="external_unavailable"
        />
      ) : isEmpty || !hasData ? (
        <EmptyState
          title="Arena sem dados"
          description="Nenhum dado de vendas disponível. Conecte o CRM para ver pipeline, leads e metas."
        />
      ) : (
        <div className="space-y-5">
          <IslandPageHeader
            title="ARENA COMERCIAL"
            subtitle="Vendas, Negociação e Conquistas"
            theme="arena"
          />

          {/* Demo banner */}
          <div
            className="rounded-lg px-3 py-2 flex items-center gap-2 text-[11px]"
            style={{
              background: "color-mix(in oklab, var(--kratos-warn) 8%, var(--kratos-surface-3))",
              border: "1px solid color-mix(in oklab, var(--kratos-warn) 20%, transparent)",
            }}
          >
            <Zap className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-warn)" }} aria-hidden />
            <span style={{ color: "var(--kratos-warn)" }} className="font-medium">DEMO</span>
            <span style={{ color: "var(--kratos-text-muted)" }}>
              — dados simulados. Pipeline real via crm-tigre-backend (W10-B3).
            </span>
          </div>

          {/* Meta Mensal */}
          <KratosCard header={<SectionTitle icon={Target} title="Meta Mensal" />}>
            <div className="flex items-center gap-4">
              <ProgressRing value={metaPct} size={72} strokeWidth={5} color={accent} glow label={`${metaPct}%`} />
              <div>
                <p className="text-lg font-bold" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                  R$ {metaAtual.toLocaleString("pt-BR")}
                  <span className="text-xs ml-1" style={{ color: "var(--kratos-text-muted)" }}>
                    / R$ {metaTotal.toLocaleString("pt-BR")}
                  </span>
                </p>
                <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
                  {metaPct}% da meta de Maio
                </p>
              </div>
            </div>
          </KratosCard>

          {/* Deal Pipeline */}
          <KratosCard header={<SectionTitle icon={Handshake} title="Deal Pipeline" />}>
            <div className="grid grid-cols-4 gap-2">
              {pipeline.map((stage) => (
                <GlassPanel key={stage.label} padding="sm" className="!p-2 text-center">
                  <p className="text-lg font-bold" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                    {stage.count}
                  </p>
                  <p className="text-[10px] leading-tight" style={{ color: accent }}>
                    {stage.label}
                  </p>
                  <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--kratos-text-secondary)" }}>
                    {stage.value}
                  </p>
                </GlassPanel>
              ))}
            </div>
          </KratosCard>

          {/* Leads */}
          <KratosCard header={<SectionTitle icon={Users} title="Top 5 Leads Ativos" />}>
            <div className="space-y-1">
              {leads.map((lead) => (
                <div
                  key={lead.hotel}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 transition-colors kratos-card-hover"
                >
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: statusColors[lead.status] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--kratos-text-primary)" }}>
                      {lead.nome}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
                      {lead.hotel}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                      {lead.valor}
                    </p>
                    <p className="text-[10px]" style={{ color: statusColors[lead.status] }}>
                      {statusLabels[lead.status]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </KratosCard>

          {/* Conquistas Recentes */}
          <KratosCard header={<SectionTitle icon={Trophy} title="Conquistas Recentes" />}>
            <div className="space-y-1">
              {conquistas.map((c) => (
                <div
                  key={c.cliente}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 transition-colors kratos-card-hover"
                >
                  <DollarSign className="h-4 w-4 shrink-0" style={{ color: "var(--kr-success)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--kratos-text-primary)" }}>
                      {c.cliente}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
                      {c.pacote}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--kr-success)", fontFamily: "var(--kratos-font-mono)" }}>
                      {c.valor}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                      {c.data}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
                </div>
              ))}
            </div>
          </KratosCard>
        </div>
      )}
    </>
  );
}
