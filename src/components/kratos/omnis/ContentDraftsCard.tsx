import { FileText, Clock, CheckCircle2, XCircle, Terminal } from "lucide-react";
import { GlassPanel } from "@/components/kratos/ui-primitives/GlassPanel";
import { useApprovalQueue } from "@/hooks/useApprovalQueue";
import type { CaptionDraft } from "../../../../api-contract/content-drafts.schema";

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  needs_review: { icon: Clock,         color: "var(--kr-warning)",        label: "Revisão"  },
  draft:        { icon: FileText,      color: "var(--kratos-text-muted)", label: "Rascunho" },
  approved:     { icon: CheckCircle2,  color: "var(--kr-success)",        label: "Aprovado" },
  rejected:     { icon: XCircle,       color: "var(--kratos-critical)",   label: "Rejeitado"},
} as const;

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}

// ── DraftRow ───────────────────────────────────────────────────────────────

function DraftRow({ draft }: { draft: CaptionDraft }) {
  const cfg = STATUS_CFG[draft.status] ?? STATUS_CFG.draft;
  const Icon = cfg.icon;

  return (
    <div
      className="flex items-start gap-2.5 py-2"
      style={{ borderBottom: "1px solid var(--kratos-border)" }}
    >
      <Icon
        className="h-3.5 w-3.5 shrink-0 mt-0.5"
        style={{ color: cfg.color }}
        aria-label={cfg.label}
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-[12px] leading-snug"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {truncate(draft.caption_text, 90)}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[10px] kratos-mono"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            @{draft.account_handle}
          </span>
          {draft.objective && (
            <span
              className="text-[10px] kratos-mono"
              style={{ color: "var(--kratos-text-muted)" }}
            >
              · {draft.objective}
            </span>
          )}
        </div>
      </div>
      <span
        className="text-[9px] kratos-mono shrink-0 mt-0.5 px-1 py-0.5 rounded"
        style={{
          background: `color-mix(in oklab, ${cfg.color} 12%, transparent)`,
          color: cfg.color,
        }}
      >
        v{draft.version}
      </span>
    </div>
  );
}

// ── StatusPill ─────────────────────────────────────────────────────────────

function StatusPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <span
      className="text-[10px] kratos-mono px-1.5 py-0.5 rounded"
      style={{
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
        color,
      }}
    >
      {count} {label}
    </span>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

export function ContentDraftsCard() {
  const { drafts, porStatus, isLoading } = useApprovalQueue(10);

  const accentColor = "var(--kr-warning)";

  if (isLoading) {
    return (
      <GlassPanel padding="md" className="animate-pulse space-y-2">
        <div className="h-3 w-40 rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-full rounded" style={{ background: "var(--kratos-surface-4)" }} />
        <div className="h-3 w-3/4 rounded" style={{ background: "var(--kratos-surface-4)" }} />
      </GlassPanel>
    );
  }

  if (!drafts.length) {
    return (
      <GlassPanel padding="md">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
          <span className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
            Nenhum draft aguardando revisão — fila limpa
          </span>
        </div>
      </GlassPanel>
    );
  }

  const needsReview = porStatus["needs_review"] ?? 0;
  const approved = porStatus["approved"] ?? 0;
  const rejected = porStatus["rejected"] ?? 0;

  return (
    <GlassPanel padding="md" className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <FileText className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
        <span
          className="text-[12px] font-semibold"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          Fila de Aprovação
        </span>
        <div className="ml-auto flex items-center gap-1.5 flex-wrap">
          {needsReview > 0 && (
            <StatusPill label="revisão" count={needsReview} color="var(--kr-warning)" />
          )}
          {approved > 0 && (
            <StatusPill label="OK" count={approved} color="var(--kr-success)" />
          )}
          {rejected > 0 && (
            <StatusPill label="rejeitado" count={rejected} color="var(--kratos-critical)" />
          )}
        </div>
      </div>

      {/* Draft list */}
      <div>
        {drafts.map((draft) => (
          <DraftRow key={draft.draft_id} draft={draft} />
        ))}
      </div>

      {/* CLI hint */}
      <div
        className="flex items-center gap-1.5 pt-1"
        style={{ borderTop: "1px solid var(--kratos-border)" }}
      >
        <Terminal className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} />
        <span
          className="text-[10px] kratos-mono select-all"
          style={{ color: "var(--kratos-text-muted)" }}
        >
          omnis content approve --batch
        </span>
      </div>
    </GlassPanel>
  );
}
