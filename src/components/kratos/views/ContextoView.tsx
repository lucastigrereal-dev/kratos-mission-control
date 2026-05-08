import { SectionHeader } from "@/components/kratos/base/SectionHeader";
import { CurrentContextHero } from "@/components/kratos/contexto/CurrentContextHero";
import { FocusDriftCard } from "@/components/kratos/contexto/FocusDriftCard";
import { ActiveWindowCard } from "@/components/kratos/contexto/ActiveWindowCard";
import { ContextReasonCard } from "@/components/kratos/contexto/ContextReasonCard";
import { ContextActionStrip } from "@/components/kratos/contexto/ContextActionStrip";
import { BrowserContextList } from "@/components/kratos/contexto/BrowserContextList";
import { EmptyState } from "@/components/kratos/base/EmptyState";

const MOCK_CONTEXT = {
  hero: {
    project: "KRATOS · Lovable",
    mission: "Crédito 4 — Contexto, Checkpoints e Aurora visuais.",
    app: "Claude Code",
    window: "KRATOS Mission Control",
    status: "on_focus" as const,
    confidence: 86,
  },
  drift: { drift: "light" as const, minutes: 18 },
  activeWindow: {
    app: "Claude Code",
    window: "KRATOS Mission Control · /contexto",
    domain: "id-preview--cf5d1730.lovable.app",
    duration: "42 min",
  },
  reasons: [
    "Detectado pela rota /contexto e título da janela.",
    "Projeto KRATOS marcado como ativo na sessão.",
    "Última ação registrada foi no Crédito 3.",
  ],
  browser: [
    {
      title: "KRATOS Mission Control · /contexto",
      domain: "lovable.app",
      project: "KRATOS · Lovable",
      status: "active" as const,
    },
    {
      title: "Plano do Crédito 4 (rascunho)",
      domain: "notion.so",
      project: "KRATOS · Docs",
      status: "active" as const,
    },
    {
      title: "TanStack Router · file routing",
      domain: "tanstack.com",
      project: "KRATOS · Lovable",
      status: "stale" as const,
    },
    {
      title: "Twitter · timeline",
      domain: "twitter.com",
      project: "Fora de foco",
      status: "distraction" as const,
    },
    {
      title: "Inbox principal",
      domain: "mail.google.com",
      project: "Indefinido",
      status: "unknown" as const,
    },
  ],
};

export function ContextoView() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      <SectionHeader
        eyebrow="Contexto"
        title="Onde você está, onde se perdeu e como voltar."
        description="Save game mental do KRATOS. Sem reconstruir do zero."
      />

      {/* Linha 1 — Hero + Drift */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CurrentContextHero {...MOCK_CONTEXT.hero} />
        </div>
        <FocusDriftCard {...MOCK_CONTEXT.drift} />
      </div>

      {/* Linha 2 — Janela + Razão */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActiveWindowCard {...MOCK_CONTEXT.activeWindow} />
        <ContextReasonCard reasons={MOCK_CONTEXT.reasons} />
      </div>

      {/* Linha 3 — Ações */}
      <div className="mt-4">
        <ContextActionStrip />
      </div>

      {/* Camada de detalhe */}
      <div className="mt-10">
        <div
          className="mb-3 text-[10px] kratos-mono uppercase tracking-[0.18em]"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          — Camada de detalhe —
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <BrowserContextList items={MOCK_CONTEXT.browser} />
          </div>
          <EmptyState
            title="Sem outros sinais agora"
            description="Detectores adicionais entram nos próximos créditos."
          />
        </div>
      </div>
    </div>
  );
}
