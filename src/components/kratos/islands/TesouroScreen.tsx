import {
  Wallet,
  PiggyBank,
  PieChart,
  Target,
  ArrowUpRight,
  Landmark,
  BarChart3,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { ProgressRing } from "@/components/kratos/ui-primitives/ProgressRing";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { IslandPageHeader } from "./shared/IslandPageHeader";

const accent = "var(--kr-island-financas)";

interface Investimento {
  categoria: string;
  valor: string;
  pct: number;
  retorno: string;
  positivo: boolean;
}

const investimentos: Investimento[] = [
  { categoria: "Reserva Emergência", valor: "R$ 24.000", pct: 40, retorno: "+11.2%", positivo: true },
  { categoria: "Ações BR", valor: "R$ 15.600", pct: 26, retorno: "+8.7%", positivo: true },
  { categoria: "Fundos Imobiliários", valor: "R$ 10.200", pct: 17, retorno: "+6.4%", positivo: true },
  { categoria: "Cripto", valor: "R$ 9.000", pct: 15, retorno: "+14.3%", positivo: true },
  { categoria: "Cash Livre", valor: "R$ 1.200", pct: 2, retorno: "+0%", positivo: true },
];

const patrimonio = {
  total: "R$ 60.000",
  variacao: "+12.4%",
  mes: "+R$ 2.400",
};

interface MetaFinanceira {
  label: string;
  atual: number;
  meta: number;
  cor: string;
}

const metas: MetaFinanceira[] = [
  { label: "Reserva 6 meses", atual: 24000, meta: 36000, cor: "var(--kr-success)" },
  { label: "Viagem Internacional", atual: 4200, meta: 15000, cor: "var(--kr-sky)" },
  { label: "Apartamento (entrada)", atual: 18500, meta: 80000, cor: accent },
];

const orcamento = {
  ganho: 12500,
  gasto: 9800,
  economia: 2700,
  pctEconomia: 21.6,
};

export function TesouroScreen() {
  return (
    <div className="space-y-5">
      <IslandPageHeader
        title="TESOURO / FINANÇAS"
        subtitle="Finanças Pessoais e Investimentos"
        theme="akasha"
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
                R$ {orcamento.ganho.toLocaleString("pt-BR")}
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
                R$ {orcamento.gasto.toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "var(--kratos-surface-4)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${(orcamento.gasto / orcamento.ganho) * 100}%`, backgroundColor: "var(--kr-danger)" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <PiggyBank className="h-4 w-4" style={{ color: accent }} />
            <span className="text-[11px]" style={{ color: "var(--kratos-text-secondary)" }}>
              Economia:{" "}
              <span style={{ color: accent, fontFamily: "var(--kratos-font-mono)" }}>
                R$ {orcamento.economia.toLocaleString("pt-BR")} ({orcamento.pctEconomia}%)
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
                style={{ background: `${accent}18`, color: accent }}
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
  );
}
