/**
 * UserProfileScreen — W17 KRATOS Pro Foundation
 *
 * Operator identity, tier display, system connections, and onboarding checklist.
 * Data: static (operator profile from CLAUDE.md) + live system connection status.
 *
 * Boundary: read-only. No mutations here.
 */
import {
  User,
  Instagram,
  CheckCircle2,
  Circle,
  Lock,
  Zap,
  Database,
  GitBranch,
  Activity,
  Star,
  Shield,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { KratosCard } from "@/components/kratos/ui-primitives/KratosCard";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { SectionTitle } from "@/components/kratos/ui-primitives/SectionTitle";
import { useOmnisStatus } from "@/hooks/useOmnis";
import { useAkashaStatus } from "@/hooks/useAkasha";

const accent = "var(--kr-accent-cyan)";

// ── Operator identity ─────────────────────────────────────────────────────────
// Source of truth: CLAUDE.md

interface Profile {
  name: string;
  handle: string;
  role: string;
  mode: string;
  totalFollowers: string;
}

const OPERATOR: Profile = {
  name: "Lucas Tigre",
  handle: "@lucastigrereal",
  role: "Criador de Conteúdo & Operador",
  mode: "Sobrevivência — gera caixa AGORA",
  totalFollowers: "2.320.000+",
};

interface InstagramProfile {
  handle: string;
  followers: string;
  niche: string;
}

const INSTAGRAM_PROFILES: InstagramProfile[] = [
  { handle: "@lucastigrereal",    followers: "690K",  niche: "Autoridade, lifestyle" },
  { handle: "@oinatalrn",         followers: "630K",  niche: "Turismo Natal/RN"      },
  { handle: "@agenteviajabrasil", followers: "452K",  niche: "Viagens Brasil"        },
  { handle: "@afamiliatigrereal", followers: "320K",  niche: "Família"               },
  { handle: "@oquecomernatalrn",  followers: "249K",  niche: "Gastronomia Natal"     },
  { handle: "@natalaivoueu",      followers: "240K",  niche: "Guia Natal, praias"    },
];

// ── Tier definition ───────────────────────────────────────────────────────────

interface Tier {
  id: string;
  label: string;
  isCurrent: boolean;
  features: string[];
  locked: boolean;
}

const TIERS: Tier[] = [
  {
    id: "personal",
    label: "Personal",
    isCurrent: true,
    locked: false,
    features: [
      "Cockpit local-first",
      "10 ilhas de contexto",
      "Akasha search",
      "PWA instalável",
      "OMNIS read-only",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    isCurrent: false,
    locked: true,
    features: [
      "OMNIS write (deploy apps)",
      "App Factory ilimitada",
      "Alertas WhatsApp",
      "Relatórios automáticos",
      "Múltiplos operadores",
    ],
  },
];

// ── Onboarding steps ──────────────────────────────────────────────────────────

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  done: boolean;
  wave?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "shell",      label: "Shell do cockpit ativo",          description: "AppShell, Topbar, Sidebar, StatusBar",               done: true },
  { id: "islands",    label: "10 ilhas configuradas",           description: "AgenciaScreen, Arena, Akasha, Omnis, etc.",           done: true },
  { id: "akasha",     label: "Akasha search conectado",         description: "pgvector + semantic search UI",                      done: true,  wave: "W13" },
  { id: "pwa",        label: "PWA instalável",                  description: "Service Worker + manifest + offline fallback",       done: true,  wave: "W14" },
  { id: "sentry",     label: "Sentry + Web Vitals",             description: "Error tracking e performance monitoring",            done: true,  wave: "W11" },
  { id: "omnis_read", label: "OMNIS leitura em tempo real",     description: "Health, missions, runs, costs",                      done: true,  wave: "W15" },
  { id: "factory",    label: "App Factory ativa",               description: "Catálogo de 8 templates OMNIS",                      done: true,  wave: "W16" },
  { id: "billing",    label: "Billing configurado",             description: "Stripe Elements — upgrade para Pro",                 done: false, wave: "W18" },
  { id: "oauth_meta", label: "OAuth Meta conectado",            description: "META_APP_ID/SECRET para analytics",                  done: false },
  { id: "notion",     label: "Notion integrado",                description: "NOTION_TOKEN para sincronização",                    done: false },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function OperatorCard() {
  return (
    <GlassPanel padding="sm" className="!p-4">
      <div className="flex items-start gap-4">
        {/* Avatar placeholder */}
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: `color-mix(in oklab, ${accent} 15%, transparent)`,
            border: `2px solid color-mix(in oklab, ${accent} 30%, transparent)`,
          }}
        >
          <User className="h-7 w-7" style={{ color: accent }} aria-hidden />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              className="text-[16px] font-bold leading-none"
              style={{ color: "var(--kratos-text-primary)" }}
            >
              {OPERATOR.name}
            </h2>
            {/* Tier badge */}
            <span
              className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
              style={{
                background: `color-mix(in oklab, ${accent} 12%, transparent)`,
                border: `1px solid color-mix(in oklab, ${accent} 25%, transparent)`,
                color: accent,
              }}
            >
              Personal
            </span>
          </div>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
            {OPERATOR.handle} · {OPERATOR.role}
          </p>
          <p className="text-[11px] mt-1 italic" style={{ color: "var(--kratos-text-muted)" }}>
            {OPERATOR.mode}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p
            className="text-[22px] font-bold leading-none"
            style={{ color: "var(--kratos-text-primary)", fontFamily: "var(--kratos-font-mono)" }}
          >
            {OPERATOR.totalFollowers}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--kratos-text-muted)" }}>
            seguidores totais
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}

function ProfilesList() {
  return (
    <div className="space-y-1.5">
      {INSTAGRAM_PROFILES.map((p) => (
        <div
          key={p.handle}
          className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 kratos-card-hover"
        >
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "color-mix(in oklab, var(--kr-island-agencia) 10%, transparent)" }}
          >
            <Instagram className="h-3.5 w-3.5" style={{ color: "var(--kr-island-agencia)" }} aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
              {p.handle}
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
              {p.niche}
            </p>
          </div>
          <p
            className="text-[12px] font-bold shrink-0"
            style={{ color: "var(--kratos-text-secondary)", fontFamily: "var(--kratos-font-mono)" }}
          >
            {p.followers}
          </p>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
        </div>
      ))}
    </div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const isActive = tier.isCurrent;
  const borderColor = isActive
    ? `color-mix(in oklab, ${accent} 35%, transparent)`
    : "color-mix(in oklab, var(--kratos-text-muted) 10%, transparent)";

  return (
    <GlassPanel
      padding="sm"
      className="!p-4 flex flex-col"
      style={{ border: `1px solid ${borderColor}` }}
    >
      <div className="flex items-center gap-2 mb-3">
        {isActive ? (
          <Star className="h-4 w-4" style={{ color: accent }} aria-hidden />
        ) : (
          <Lock className="h-4 w-4" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
        )}
        <p
          className="text-[13px] font-bold"
          style={{ color: isActive ? accent : "var(--kratos-text-muted)" }}
        >
          KRATOS {tier.label}
        </p>
        {isActive && (
          <span
            className="text-[9px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded ml-auto"
            style={{
              background: `color-mix(in oklab, ${accent} 12%, transparent)`,
              color: accent,
            }}
          >
            Atual
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {tier.features.map((f) => (
          <div key={f} className="flex items-center gap-2">
            {isActive ? (
              <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: "var(--kr-success)" }} aria-hidden />
            ) : (
              <Lock className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
            )}
            <span
              className="text-[11px]"
              style={{ color: isActive ? "var(--kratos-text-secondary)" : "var(--kratos-text-muted)" }}
            >
              {f}
            </span>
          </div>
        ))}
      </div>

      {tier.locked && (
        <button
          type="button"
          disabled
          className="mt-3 w-full py-1.5 rounded-md text-[11px] font-semibold opacity-50 cursor-not-allowed"
          style={{
            background: `color-mix(in oklab, ${accent} 8%, transparent)`,
            border: `1px solid color-mix(in oklab, ${accent} 15%, transparent)`,
            color: accent,
          }}
          title="Upgrade disponível em W18"
          aria-label="Upgrade para Pro (indisponível)"
        >
          Upgrade · W18
        </button>
      )}
    </GlassPanel>
  );
}

function SystemConnectionRow({
  icon: Icon,
  label,
  status,
  detail,
  color,
}: {
  icon: typeof Database;
  label: string;
  status: "online" | "offline" | "unknown";
  detail: string;
  color: string;
}) {
  const statusColor =
    status === "online"  ? "var(--kr-success)" :
    status === "offline" ? "var(--kratos-critical)" :
    "var(--kratos-text-muted)";

  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 kratos-card-hover">
      <div
        className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `color-mix(in oklab, ${color} 10%, transparent)` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold" style={{ color: "var(--kratos-text-primary)" }}>
          {label}
        </p>
        <p className="text-[10px] truncate" style={{ color: "var(--kratos-text-muted)" }}>
          {detail}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <div
          className={`h-1.5 w-1.5 rounded-full ${status === "online" ? "animate-pulse" : ""}`}
          style={{ backgroundColor: statusColor }}
          aria-hidden
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: statusColor }}>
          {status === "online" ? "Online" : status === "offline" ? "Offline" : "—"}
        </span>
      </div>
    </div>
  );
}

function OnboardingRow({ step }: { step: OnboardingStep }) {
  return (
    <div className="flex items-start gap-3 rounded-lg px-2 py-2 -mx-2">
      <div className="shrink-0 mt-0.5">
        {step.done ? (
          <CheckCircle2 className="h-4 w-4" style={{ color: "var(--kr-success)" }} aria-hidden />
        ) : (
          <Circle className="h-4 w-4" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p
            className={`text-[12px] font-semibold ${step.done ? "" : "opacity-60"}`}
            style={{ color: "var(--kratos-text-primary)" }}
          >
            {step.label}
          </p>
          {step.wave && (
            <span
              className="text-[9px] font-bold uppercase tracking-[0.05em] px-1 py-px rounded"
              style={{
                background: step.done
                  ? "color-mix(in oklab, var(--kr-success) 8%, transparent)"
                  : "color-mix(in oklab, var(--kratos-text-muted) 8%, transparent)",
                color: step.done ? "var(--kr-success)" : "var(--kratos-text-muted)",
              }}
            >
              {step.wave}
            </span>
          )}
        </div>
        <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
          {step.description}
        </p>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function UserProfileScreen() {
  const { data: omnisStatus } = useOmnisStatus();
  const { data: akashaData, isError: akashaError } = useAkashaStatus();
  const akashaOnline = akashaData != null && !akashaError;

  const doneCount   = ONBOARDING_STEPS.filter((s) => s.done).length;
  const totalSteps  = ONBOARDING_STEPS.length;
  const progressPct = Math.round((doneCount / totalSteps) * 100);

  return (
    <div className="space-y-4">
      {/* Operator Identity */}
      <KratosCard header={<SectionTitle icon={User} title="Operador" />}>
        <OperatorCard />
      </KratosCard>

      {/* Instagram Profiles */}
      <KratosCard header={<SectionTitle icon={Instagram} title="Perfis Instagram" />}>
        <ProfilesList />
      </KratosCard>

      {/* Tier */}
      <KratosCard header={<SectionTitle icon={Star} title="Plano KRATOS" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIERS.map((t) => (
            <TierCard key={t.id} tier={t} />
          ))}
        </div>
      </KratosCard>

      {/* System Connections */}
      <KratosCard header={<SectionTitle icon={Activity} title="Conexões do Sistema" />}>
        <div className="space-y-0.5">
          <SystemConnectionRow
            icon={Database}
            label="Akasha"
            status={akashaOnline ? "online" : "offline"}
            detail="pgvector · 20K docs · 606K chunks"
            color="var(--kr-island-akasha)"
          />
          <SystemConnectionRow
            icon={Cpu}
            label="OMNIS"
            status={omnisStatus != null ? "online" : "unknown"}
            detail={`${omnisStatus?.workflows_registered ?? "—"} workflows · ${omnisStatus?.test_count?.toLocaleString("pt-BR") ?? "—"} testes`}
            color="var(--kr-island-omnis)"
          />
          <SystemConnectionRow
            icon={GitBranch}
            label="GitHub"
            status="online"
            detail="kratos-mission-control + repos rastreados"
            color="var(--kratos-text-secondary)"
          />
          <SystemConnectionRow
            icon={Zap}
            label="OAuth Meta"
            status="offline"
            detail="META_APP_ID/SECRET pendentes"
            color="var(--kr-island-agencia)"
          />
          <SystemConnectionRow
            icon={Shield}
            label="Notion"
            status="offline"
            detail="NOTION_TOKEN pendente"
            color="var(--kratos-text-muted)"
          />
        </div>
      </KratosCard>

      {/* Onboarding Checklist */}
      <KratosCard header={<SectionTitle icon={CheckCircle2} title="Setup KRATOS" />}>
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span style={{ color: "var(--kratos-text-secondary)" }}>
              {doneCount}/{totalSteps} etapas concluídas
            </span>
            <span
              style={{ color: progressPct === 100 ? "var(--kr-success)" : accent, fontFamily: "var(--kratos-font-mono)" }}
            >
              {progressPct}%
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "var(--kratos-surface-4)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: progressPct === 100 ? "var(--kr-success)" : accent }}
            />
          </div>
        </div>

        <div className="space-y-0.5">
          {ONBOARDING_STEPS.map((s) => (
            <OnboardingRow key={s.id} step={s} />
          ))}
        </div>
      </KratosCard>
    </div>
  );
}
