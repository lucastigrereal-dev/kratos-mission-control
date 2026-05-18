import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Trophy,
  Handshake,
  ChevronRight,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { ProgressRing } from "@/components/kratos/ui-primitives/ProgressRing";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { LoadingState } from "@/components/kratos/base/LoadingState";
import { ErrorState } from "@/components/kratos/base/ErrorState";
import { EmptyState } from "@/components/kratos/base/EmptyState";
import { IslandPageHeader } from "./shared/IslandPageHeader";

const accent = "var(--kr-island-arena)";

interface DealStage {
  label: string;
  count: number;
  value: string;
}

const pipeline: DealStage[] = [
  { label: "Prospecção", count: 12, value: "R$ 24.500" },
  { label: "Negociação", count: 5, value: "R$ 18.200" },
  { label: "Fechamento", count: 3, value: "R$ 9.800" },
  { label: "Ganhos", count: 8, value: "R$ 8.700" },
];

interface Lead {
  nome: string;
  hotel: string;
  valor: string;
  status: "quente" | "morno" | "frio";
}

const leads: Lead[] = [
  { nome: "Carlos Mendes", hotel: "Serhs Natal Grand", valor: "R$ 4.200", status: "quente" },
  { nome: "Ana Ribeiro", hotel: "Ponta Negra Beach", valor: "R$ 3.150", status: "quente" },
  { nome: "Paulo Torres", hotel: "Majestic Ponta Negra", valor: "R$ 2.800", status: "morno" },
  { nome: "Julia Costa", hotel: "D Beach Resort", valor: "R$ 2.400", status: "morno" },
  { nome: "Rafael Lima", hotel: "Villa Park Hotel", valor: "R$ 1.950", status: "frio" },
];

interface Conquista {
  cliente: string;
  pacote: string;
  valor: string;
  data: string;
}

const conquistas: Conquista[] = [
  { cliente: "Hotel Ocean Palace", pacote: "Growth 3 meses", valor: "R$ 2.970", data: "14/05" },
  { cliente: "Restaurante Mangai", pacote: "Starter", valor: "R$ 350", data: "10/05" },
  { cliente: "Pousada Villa do Sol", pacote: "Growth 1 mês", valor: "R$ 990", data: "08/05" },
];

const statusColors: Record<Lead["status"], string> = {
  quente: "var(--kr-danger)",
  morno: "var(--kr-warning)",
  frio: "var(--kratos-text-muted)",
};

const statusLabels: Record<Lead["status"], string> = {
  quente: "Quente",
  morno: "Morno",
  frio: "Frio",
};

const metaAtual = 8700;
const metaTotal = 12000;
const metaPct = Math.round((metaAtual / metaTotal) * 100);

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
      ) : isEmpty ? (
        <EmptyState
          title="Nada por aqui"
          description="Nenhum dado disponível neste momento."
        />
      ) : (
        <div className="space-y-5">
          <IslandPageHeader
            title="ARENA COMERCIAL"
            subtitle="Vendas, Negociação e Conquistas"
            theme="agencia"
          />

          {/* Meta Mensal */}
          <KratosCard header={<SectionTitle icon={Target} title="Meta Mensal" />}>
            <div className="flex items-center gap-4">
              <ProgressRing value={metaPct} size={72} strokeWidth={5} color={accent} glow label={`${metaPct}%`} />
              <div>
                <p className="text-lg font-bold" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                  R$ 8.700 <span className="text-xs" style={{ color: "var(--kratos-text-muted)" }}>/ R$ 12.000</span>
                </p>
                <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
                  Faltam R$ 3.300 — 9 dias restantes
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
                  className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 transition-colors hover:bg-white/[0.02]"
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
                  className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 transition-colors hover:bg-white/[0.02]"
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
