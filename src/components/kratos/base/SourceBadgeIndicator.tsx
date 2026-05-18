import type { SourceBadgeMeta } from "../../../api-contract/source-badge.schema";

type Props = {
  meta: SourceBadgeMeta | null;
  className?: string;
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  return `${Math.floor(hr / 24)}d`;
}

export function SourceBadgeIndicator({ meta, className = "" }: Props) {
  if (!meta) return null;

  const sourceSeverity =
    meta.stale || meta.errors.length > 0
      ? "var(--kr-color-risk)"
      : meta.source === "mock"
        ? "var(--kr-color-amber)"
        : meta.source === "live"
          ? "var(--kr-color-mission)"
          : "var(--kr-color-text-muted)";

  const label =
    meta.source === "mock"
      ? "Simulado"
      : meta.source === "live"
        ? "Ao vivo"
        : meta.source === "partial"
          ? "Parcial"
          : meta.source === "stale"
            ? "Desatualizado"
            : meta.source;

  const timeAgo = `há ${relativeTime(meta.updated_at)}`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.65rem] leading-none ${className}`}
      style={{
        borderColor: sourceSeverity,
        color: "var(--kr-color-text-secondary)",
        background: `color-mix(in oklab, ${sourceSeverity} 10%, transparent)`,
      }}
      title={`Fonte: ${label} · Atualizado ${timeAgo}${meta.errors.length > 0 ? ` · ${meta.errors.length} erro(s)` : ""}`}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: sourceSeverity }}
        aria-hidden
      />
      {label}
      <span className="opacity-60">{timeAgo}</span>
      {meta.stale && (
        <span className="opacity-80" style={{ color: "var(--kr-color-risk)" }}>
          !
        </span>
      )}
    </span>
  );
}
