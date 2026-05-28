/**
 * BillingScreen — W18 Billing UI
 *
 * Stripe Elements placeholder for KRATOS Pro upgrade.
 * No secret keys here — VITE_STRIPE_PUBLISHABLE_KEY would go in env.
 * Actual Stripe.js integration wires in after W18 backend (omnis-server).
 *
 * Boundary: UI-only. No actual payment processing in this component.
 * Per security rules: STRIPE_SECRET_KEY stays server-side only.
 */
import {
  CreditCard,
  Lock,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { EmptyState } from "@/components/kratos/base/EmptyState";

const accent = "var(--kr-accent-cyan)";
const accentPro = "oklch(0.72 0.18 85)"; // gold

// ── Pricing plans ─────────────────────────────────────────────────────────────

interface PricingPlan {
  id: string;
  label: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  isCurrent: boolean;
  isPopular: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: "personal",
    label: "Personal",
    price: "Grátis",
    period: "para sempre",
    description: "Cockpit local-first completo para um operador.",
    features: [
      "10 ilhas de contexto",
      "Akasha search",
      "PWA instalável",
      "OMNIS read-only",
      "App Factory (visualização)",
    ],
    cta: "Plano Atual",
    isCurrent: true,
    isPopular: false,
  },
  {
    id: "pro",
    label: "Pro",
    price: "R$ 97",
    period: "/mês",
    description: "Para criadores que querem automação real e escala.",
    features: [
      "Tudo do Personal",
      "OMNIS write — deploy real",
      "App Factory ilimitada",
      "Alertas WhatsApp",
      "Relatórios automáticos PDF",
      "Suporte prioritário",
    ],
    cta: "Upgrade para Pro",
    isCurrent: false,
    isPopular: true,
  },
];

// ── Invoice history (empty state — awaits W18 backend) ────────────────────────

// ── Sub-components ────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: PricingPlan }) {
  const isActive = plan.isCurrent;
  const borderColor = plan.isPopular
    ? `color-mix(in oklab, ${accentPro} 40%, transparent)`
    : "color-mix(in oklab, var(--kratos-text-muted) 12%, transparent)";

  return (
    <GlassPanel
      padding="sm"
      className="!p-4 flex flex-col relative"
      style={{ border: `1px solid ${borderColor}` }}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-0.5 rounded-full"
          style={{
            background: accentPro,
            color: "var(--kratos-surface-0)",
          }}
        >
          Recomendado
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          {isActive ? (
            <CheckCircle2 className="h-4 w-4" style={{ color: "var(--kr-success)" }} aria-hidden />
          ) : (
            <Star className="h-4 w-4" style={{ color: accentPro }} aria-hidden />
          )}
          <p
            className="text-[13px] font-bold"
            style={{ color: plan.isPopular ? accentPro : "var(--kratos-text-primary)" }}
          >
            KRATOS {plan.label}
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className="text-[22px] font-bold leading-none"
            style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}
          >
            {plan.price}
          </span>
          <span className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
            {plan.period}
          </span>
        </div>
        <p className="text-[11px] mt-1" style={{ color: "var(--kratos-text-muted)" }}>
          {plan.description}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-1.5 flex-1">
        {plan.features.map((f) => (
          <div key={f} className="flex items-center gap-2">
            <CheckCircle2
              className="h-3 w-3 shrink-0"
              style={{ color: isActive ? "var(--kr-success)" : accentPro }}
              aria-hidden
            />
            <span className="text-[11px]" style={{ color: "var(--kratos-text-secondary)" }}>
              {f}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={isActive}
        className="mt-4 w-full py-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-150"
        style={
          isActive
            ? {
                background: "color-mix(in oklab, var(--kr-success) 10%, transparent)",
                border: "1px solid color-mix(in oklab, var(--kr-success) 20%, transparent)",
                color: "var(--kr-success)",
                cursor: "default",
              }
            : {
                background: `color-mix(in oklab, ${accentPro} 15%, transparent)`,
                border: `1px solid color-mix(in oklab, ${accentPro} 30%, transparent)`,
                color: accentPro,
                cursor: "not-allowed",
                opacity: 0.75,
              }
        }
        title={isActive ? undefined : "Requer W18 backend (Stripe)"}
        aria-label={plan.cta}
      >
        {isActive ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {plan.cta}
          </>
        ) : (
          <>
            {plan.cta}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </>
        )}
      </button>
    </GlassPanel>
  );
}

function StripeElementsPlaceholder() {
  return (
    <GlassPanel padding="sm" className="!p-4">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="h-4 w-4" style={{ color: accent }} aria-hidden />
        <p className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          Informações de Pagamento
        </p>
        <div className="ml-auto flex items-center gap-1">
          <Lock className="h-3 w-3" style={{ color: "var(--kr-success)" }} aria-hidden />
          <span className="text-[9px] font-semibold" style={{ color: "var(--kr-success)" }}>
            Stripe SSL
          </span>
        </div>
      </div>

      {/* Stripe Elements mount point (placeholder) */}
      <div
        className="rounded-lg p-3 mb-3 space-y-3"
        style={{
          background: "color-mix(in oklab, var(--kratos-surface-4) 40%, transparent)",
          border: "1px solid color-mix(in oklab, var(--kratos-text-muted) 12%, transparent)",
        }}
      >
        {/* Card number field placeholder */}
        <div>
          <p className="text-[9px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--kratos-text-muted)" }}>
            Número do Cartão
          </p>
          <div
            className="h-9 rounded-md px-3 flex items-center"
            style={{ background: "var(--kratos-surface-2)", border: "1px solid var(--kratos-border)" }}
          >
            <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
              •••• •••• •••• ••••
            </span>
          </div>
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--kratos-text-muted)" }}>
              Validade
            </p>
            <div
              className="h-9 rounded-md px-3 flex items-center"
              style={{ background: "var(--kratos-surface-2)", border: "1px solid var(--kratos-border)" }}
            >
              <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>MM / AA</span>
            </div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--kratos-text-muted)" }}>
              CVC
            </p>
            <div
              className="h-9 rounded-md px-3 flex items-center"
              style={{ background: "var(--kratos-surface-2)", border: "1px solid var(--kratos-border)" }}
            >
              <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>•••</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disabled submit */}
      <button
        type="button"
        disabled
        className="w-full py-2.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
        style={{
          background: accentPro,
          color: "var(--kratos-surface-0)",
        }}
        title="Requer VITE_STRIPE_PUBLISHABLE_KEY — W18 backend"
        aria-label="Assinar Pro (indisponível)"
      >
        <Lock className="h-3.5 w-3.5" aria-hidden />
        Assinar KRATOS Pro · R$ 97/mês
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        <Shield className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
        <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
          Processado pelo Stripe · Cancele quando quiser
        </p>
      </div>

      <p
        className="text-[10px] text-center mt-1.5"
        style={{ color: "var(--kratos-text-muted)" }}
      >
        Ativo após configurar{" "}
        <code
          className="px-1 py-0.5 rounded"
          style={{ background: "var(--kratos-surface-4)", fontFamily: "var(--kratos-font-mono)" }}
        >
          VITE_STRIPE_PUBLISHABLE_KEY
        </code>
        {" "}+ backend W18
      </p>
    </GlassPanel>
  );
}

function SecurityBadges() {
  const badges = [
    { icon: Shield, label: "SSL 256-bit" },
    { icon: Lock,   label: "PCI DSS"    },
    { icon: Zap,    label: "Stripe v3"  },
  ];
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {badges.map((b) => {
        const Icon = b.icon;
        return (
          <div key={b.label} className="flex items-center gap-1">
            <Icon className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
            <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
              {b.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function BillingScreen() {
  return (
    <div className="space-y-4">
      {/* Pricing plans */}
      <KratosCard header={<SectionTitle icon={Star} title="Planos KRATOS" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
      </KratosCard>

      {/* Stripe Elements (placeholder) */}
      <KratosCard
        header={
          <div className="flex items-center gap-2">
            <SectionTitle icon={CreditCard} title="Checkout" />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded"
              style={{
                background: "color-mix(in oklab, var(--kr-warning) 12%, transparent)",
                color: "var(--kr-warning)",
              }}
            >
              W18
            </span>
          </div>
        }
      >
        <StripeElementsPlaceholder />
        <SecurityBadges />
      </KratosCard>

      {/* Invoice history */}
      <KratosCard header={<SectionTitle icon={Receipt} title="Histórico de Faturas" />}>
        <EmptyState
          compact
          icon={<Receipt className="h-4 w-4" />}
          title="Nenhuma fatura"
          description="Faturas aparecem aqui após a primeira cobrança via Stripe."
        />
      </KratosCard>
    </div>
  );
}
