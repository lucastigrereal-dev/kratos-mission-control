import { useEffect } from "react";
import {
  Wallet,
  PiggyBank,
  PieChart,
  Target,
  ArrowUpRight,
  Landmark,
  BarChart3,
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
import { IslandPageFrame } from "./shared/IslandPageFrame";

const accent = "var(--kr-island-financas)";

interface Investimento {
  categoria: string;
  valor: string;
  pct: number;
  retorno: string;
  positivo: boolean;
}

const investimentos: Investimento[] = [];

const patrimonio: { total: string | undefined; variacao: string | undefined; mes: string | undefined } = {
  total: undefined,
  variacao: undefined,
  mes: undefined,
};

interface MetaFinanceira {
  label: string;
  atual: number;
  meta: number;
  cor: string;
}

const metas: MetaFinanceira[] = [];

const orcamento: {
  ganho: number | undefined;
  gasto: number | undefined;
  economia: number | undefined;
  pctEconomia: number | undefined;
} = {
  ganho: undefined,
  gasto: undefined,
  economia: undefined,
  pctEconomia: undefined,
};

// Sem dado real = sem número inventado. Auto-detecta estado vazio.
const hasData =
  patrimonio.total != null ||
  metas.length > 0 ||
  investimentos.length > 0 ||
  orcamento.ganho != null;

interface TesouroScreenProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}

export function TesouroScreen({
  isLoading = false,
  error = null,
  isEmpty = false,
}: TesouroScreenProps) {
  const { setData } = useIslandDock();

  useEffect(() => {
    setData({
      islandId: "tesouro",
      label: "Finanças",
      value: patrimonio.total ?? "—",
      progress: 0,
      progressColor: "var(--kr-island-tesouro)",
      quickActions: [{ label: "Registrar" }, { label: "Meta" }],
    });
    return () => setData(null);
  }, [setData]);

  return (
    <IslandPageFrame theme="tesouro">
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
          title="Tesouro sem dados"
          description="Nenhum dado financeiro disponível. Conecte a fonte de dados para ver patrimônio, orçamento e metas."
        />
      ) : (
        <div className="space-y-5">
          <IslandPageHeader
            title="TESOURO / FINANÇAS"
            subtitle="Finanças Pessoais e Investimentos"
            theme="tesouro"
          />

          {/* Patrimônio */}
          <KratosCard header={<SectionTitle icon={Wallet} title="Patrimônio Total" />}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                  {patrimonio.total}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-semibold" style={{ color: "var(--kr-success)" }}>
                    {patrimonio.variacao}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                    no ano
                  </span>
                </div>
              </div>
              <GlassPanel padding="sm" className="!px-3 !py-2 text-center">
                <p className="text-[10px] mb-0.5" style={{ color: "var(--kratos-text-muted)" }}>Este mês</p>
                <p className="text-sm font-bold" style={{ color: "var(--kr-success)", fontFamily: "var(--kratos-font-mono)" }}>
                  {patrimonio.mes}
                </p>
              </GlassPanel>
            </div>
          </KratosCard>

          {/* Orçamento Mensal */}
          <KratosCard header={<SectionTitle icon={BarChart3} title="Orçamento Mensal" />}>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span style={{ color: "var(--kratos-text-secondary)" }}>Ganho</span>
                  <span style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                    {orcamento.ganho != null ? `R$ ${orcamento.ganho.toLocaleString("pt-BR")}` : "—"}
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "var(--kratos-surface-4)" }}>
                  <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: "var(--kr-success)" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span style={{ color: "var(--kratos-text-secondary)" }}>Gasto</span>
                  <span style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}>
                    {orcamento.gasto != null ? `R$ ${orcamento.gasto.toLocaleString("pt-BR")}` : "—"}
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "var(--kratos-surface-4)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: orcamento.gasto != null && orcamento.ganho != null ? `${(orcamento.gasto / orcamento.ganho) * 100}%` : "0%", backgroundColor: "var(--kr-danger)" }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <PiggyBank className="h-4 w-4" style={{ color: accent }} />
                <span className="text-[11px]" style={{ color: "var(--kratos-text-secondary)" }}>
                  Economia:{" "}
                  <span style={{ color: accent, fontFamily: "var(--kratos-font-mono)" }}>
                    {orcamento.economia != null && orcamento.pctEconomia != null
                      ? `R$ ${orcamento.economia.toLocaleString("pt-BR")} (${orcamento.pctEconomia}%)`
                      : "—"}
                  </span>
                </span>
              </div>
            </div>
          </KratosCard>

          {/* Distribuição de Investimentos */}
          <KratosCard header={<SectionTitle icon={PieChart} title="Distribuição de Investimentos" />}>
            <div className="space-y-2">
              {investimentos.map((inv) => (
                <div key={inv.categoria} className="flex items-center gap-3 rounded px-2 py-1.5 -mx-2">
                  <div
                    className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `color-mix(in oklab, ${accent} 10%, transparent)`, color: accent }}
                  >
                    {inv.pct}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium" style={{ color: "var(--kratos-text-primary)" }}>
                      {inv.categoria}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                        {inv.valor}
                      </p>
                      <span
                        className="text-[10px] font-semibold flex items-center gap-0.5"
                        style={{ color: inv.positivo ? "var(--kr-success)" : "var(--kr-danger)" }}
                      >
                        <ArrowUpRight className="h-3 w-3" />
                        {inv.retorno}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KratosCard>

          {/* Metas Financeiras */}
          <KratosCard header={<SectionTitle icon={Target} title="Metas Financeiras" />}>
            <div className="space-y-3">
              {metas.map((meta) => {
                const pct = Math.round((meta.atual / meta.meta) * 100);
                return (
                  <div key={meta.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span style={{ color: "var(--kratos-text-secondary)" }}>{meta.label}</span>
                      <span style={{ color: "var(--kratos-text-muted)", fontFamily: "var(--kratos-font-mono)" }}>
                        R$ {meta.atual.toLocaleString("pt-BR")} / R$ {meta.meta.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "var(--kratos-surface-4)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: meta.cor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </KratosCard>
        </div>
      )}
    </IslandPageFrame>
  );
}
