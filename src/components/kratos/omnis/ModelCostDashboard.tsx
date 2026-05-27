/**
 * ModelCostDashboard — W10-B7
 *
 * Mostra breakdown de custo por modelo (Ollama-First policy).
 * Calcula economia vs cenário hipotético 100% Anthropic.
 *
 * Fonte futura: /omnis/cost-breakdown (OMNIS W22-B9 budget enforcement).
 * Por enquanto usa dados das missões ativas + mock de modelo.
 *
 * Boundary: lê dados — NUNCA comanda modelos.
 * Secrets: NUNCA exibe API keys — só métricas de uso.
 */
import { DollarSign, TrendingDown, Cpu, Zap, AlertTriangle } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useMissions } from "@/hooks/useMissions";

// ── Preços de referência (USD por 1M tokens) — Maio 2026 ─────────────────
// Ollama local = $0 (custo infra própria, não contado aqui)
// Anthropic oficial (simplificado para cálculo de economia)
const ANTHROPIC_PRICE_PER_1M_TOKENS_USD = 3.0; // sonnet médio input+output

// ── Mock de breakdown por modelo ─────────────────────────────────────────
// Fonte futura: /omnis/cost-breakdown
// Hoje: derivado das missões ativas + política Ollama-First

interface ModelUsage {
  name: string;
  label: string;
  provider: "ollama" | "anthropic";
  tokens_used: number;
  cost_usd: number;
  pct: number;
}

const MOCK_MODEL_USAGE: ModelUsage[] = [
  {
    name: "deepseek-v4-pro",
    label: "DeepSeek-V4 Pro",
    provider: "ollama",
    tokens_used: 284_000,
    cost_usd: 0.0,
    pct: 61,
  },
  {
    name: "glm-5.1",
    label: "GLM-5.1",
    provider: "ollama",
    tokens_used: 98_000,
    cost_usd: 0.0,
    pct: 21,
  },
  {
    name: "kimi-k2.6",
    label: "Kimi-K2.6",
    provider: "ollama",
    tokens_used: 63_000,
    cost_usd: 0.0,
    pct: 13,
  },
  {
    name: "claude-sonnet",
    label: "Claude Sonnet",
    provider: "anthropic",
    tokens_used: 23_500,
    cost_usd: 0.071,
    pct: 5,
  },
];

const MONTHLY_BUDGET_USD = 10.0;

// ── Helpers ───────────────────────────────────────────────────────────────

function fmtUsd(v: number): string {
  if (v === 0) return "$0";
  if (v < 0.001) return `$${(v * 1000).toFixed(2)}m`;
  return `$${v.toFixed(3)}`;
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ── Sub-components ────────────────────────────────────────────────────────

function ModelRow({ m }: { m: ModelUsage }) {
  const isOllama = m.provider === "ollama";
  const barColor = isOllama ? "var(--kr-success, var(--kratos-ok))" : "var(--kratos-warn)";

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        {/* Provider dot */}
        <span
          className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
          style={{ background: barColor }}
          aria-hidden
        />
        {/* Name */}
        <span className="flex-1 text-[11px] kratos-mono truncate" style={{ color: "var(--kratos-text-primary)" }}>
          {m.label}
        </span>
        {/* Tokens */}
        <span className="text-[10px] kratos-mono shrink-0" style={{ color: "var(--kratos-text-muted)" }}>
          {fmtTokens(m.tokens_used)} tok
        </span>
        {/* Cost */}
        <span
          className="text-[10px] kratos-mono w-12 text-right shrink-0 font-medium"
          style={{ color: isOllama ? "var(--kr-success, var(--kratos-ok))" : "var(--kratos-warn)" }}
        >
          {fmtUsd(m.cost_usd)}
        </span>
      </div>
      {/* Mini bar */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 shrink-0" />
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${m.pct}%`, background: barColor, opacity: 0.7 }}
          />
        </div>
        <span className="text-[9px] kratos-mono w-7 text-right shrink-0" style={{ color: "var(--kratos-text-muted)" }}>
          {m.pct}%
        </span>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────

export function ModelCostDashboard() {
  const { missions } = useMissions(20);

  const accent = "var(--kr-accent-cyan, var(--kratos-accent))";

  // Real cost from missions
  const realCostUsd = missions.reduce((s, m) => s + (m.cumulative_cost_usd ?? 0), 0);

  // Total tokens (mock, since missions don't track tokens yet)
  const totalTokensMock = MOCK_MODEL_USAGE.reduce((s, m) => s + m.tokens_used, 0);
  const ollamaTokens = MOCK_MODEL_USAGE.filter((m) => m.provider === "ollama").reduce((s, m) => s + m.tokens_used, 0);
  const ollamaPct = totalTokensMock > 0 ? Math.round((ollamaTokens / totalTokensMock) * 100) : 0;

  // Hypothetical cost if 100% Anthropic
  const hypotheticalUsd = (totalTokensMock / 1_000_000) * ANTHROPIC_PRICE_PER_1M_TOKENS_USD;

  // Savings
  const actualMockCost = MOCK_MODEL_USAGE.reduce((s, m) => s + m.cost_usd, 0);
  const savingsUsd = hypotheticalUsd - actualMockCost;
  const savingsPct = hypotheticalUsd > 0 ? Math.round((savingsUsd / hypotheticalUsd) * 100) : 0;

  // Budget remaining
  const budgetUsedPct = Math.min(100, Math.round((actualMockCost / MONTHLY_BUDGET_USD) * 100));
  const budgetColor =
    budgetUsedPct > 80 ? "var(--kratos-critical)" :
    budgetUsedPct > 50 ? "var(--kratos-warn)" :
    "var(--kr-success, var(--kratos-ok))";

  // Check for policy violation (any Claude Opus usage → should be 0%)
  const opusUsage = MOCK_MODEL_USAGE.filter((m) => m.name.includes("opus"));
  const policyViolation = opusUsage.length > 0;

  return (
    <GlassPanel padding="md" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 shrink-0" style={{ color: accent }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Cost Dashboard
        </span>
        <span
          className="ml-auto text-[9px] kratos-mono px-1.5 py-0.5 rounded font-bold"
          style={{
            background: "color-mix(in oklab, var(--kratos-warn) 15%, transparent)",
            border: "1px solid color-mix(in oklab, var(--kratos-warn) 30%, transparent)",
            color: "var(--kratos-warn)",
          }}
        >
          DEMO
        </span>
      </div>

      {/* Policy violation alert */}
      {policyViolation && (
        <div
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px]"
          style={{
            background: "color-mix(in oklab, var(--kratos-critical) 10%, transparent)",
            border: "1px solid color-mix(in oklab, var(--kratos-critical) 25%, transparent)",
            color: "var(--kratos-critical)",
          }}
        >
          <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden />
          Opus detectado — viola política Ollama-First. Verificar config.
        </div>
      )}

      {/* KPIs row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Cpu,          label: "Ollama",      value: `${ollamaPct}%`,    color: "var(--kr-success, var(--kratos-ok))" },
          { icon: TrendingDown, label: "Economia",    value: `${savingsPct}%`,   color: accent },
          { icon: Zap,          label: "Budget uso",  value: `${budgetUsedPct}%`, color: budgetColor },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-lg p-2 text-center"
            style={{ background: "var(--kratos-surface-4)" }}
          >
            <div className="flex justify-center mb-0.5">
              <Icon className="h-3 w-3" style={{ color }} aria-hidden />
            </div>
            <div className="text-[13px] font-bold kratos-mono" style={{ color }}>
              {value}
            </div>
            <div className="text-[9px] mt-0.5 leading-tight" style={{ color: "var(--kratos-text-muted)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Savings callout */}
      <div
        className="flex items-center gap-3 rounded-lg px-3 py-2"
        style={{ background: "color-mix(in oklab, var(--kr-success, var(--kratos-ok)) 8%, var(--kratos-surface-3))" }}
      >
        <TrendingDown className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kr-success, var(--kratos-ok))" }} aria-hidden />
        <div>
          <div className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
            Economia este mês: ~{fmtUsd(savingsUsd)}
          </div>
          <div className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
            vs. cenário 100% Anthropic ({fmtUsd(hypotheticalUsd)})
          </div>
        </div>
      </div>

      {/* Budget progress */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
            Budget mensal ${MONTHLY_BUDGET_USD.toFixed(0)}
          </span>
          <span className="text-[10px] kratos-mono font-medium" style={{ color: budgetColor }}>
            {fmtUsd(actualMockCost)} usado
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--kratos-surface-4)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${budgetUsedPct}%`, background: budgetColor }}
            role="progressbar"
            aria-valuenow={budgetUsedPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Model breakdown */}
      <div>
        <div className="text-[10px] kratos-mono uppercase tracking-wider mb-2" style={{ color: "var(--kratos-text-muted)" }}>
          Breakdown por modelo
        </div>
        <div className="space-y-2">
          {MOCK_MODEL_USAGE.map((m) => (
            <ModelRow key={m.name} m={m} />
          ))}
        </div>
      </div>

      {/* Real cost from missions */}
      {missions.length > 0 && realCostUsd > 0 && (
        <div
          className="pt-3"
          style={{ borderTop: "1px solid var(--kratos-border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
              Custo real (missões ativas)
            </span>
            <span className="text-[11px] kratos-mono font-semibold" style={{ color: accent }}>
              {fmtUsd(realCostUsd)}
            </span>
          </div>
        </div>
      )}

      <p className="text-[9px]" style={{ color: "var(--kratos-text-muted)" }}>
        Fonte futura: <span className="kratos-mono">/omnis/cost-breakdown</span> via OMNIS W22-B9.
        Política:{" "}
        <a
          href="https://www.notion.so/36d22eba8f0881519268f05675380a8c"
          target="_blank"
          rel="noreferrer"
          className="underline"
          style={{ color: "var(--kratos-accent)" }}
        >
          Ollama-First v2.0 ↗
        </a>
      </p>
    </GlassPanel>
  );
}
