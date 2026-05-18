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

const SOURCE_LABEL: Record<string, string> = {
  live: "Ao vivo",
  mock: "Simulado",
  cache: "Cache",
  stale: "Desatualizado",
  partial: "Parcial",
};

const SOURCE_SEVERITY: Record<string, string> = {
  live: "var(--kratos-ok)",
  mock: "var(--kratos-warn)",
  cache: "var(--kratos-info)",
  stale: "var(--kratos-critical)",
  partial: "var(--kratos-warn)",
};

export function SourceBadgeIndicator({ meta, className = "" }: Props) {
  if (!meta) return null;

  const isError = meta.stale || meta.errors.length > 0;
  const colorVar = isError
    ? "var(--kratos-critical)"
    : (SOURCE_SEVERITY[meta.source] ?? "var(--kratos-text-muted)");

  const label = SOURCE_LABEL[meta.source] ?? meta.source;
  const timeAgo = `há ${relativeTime(meta.updated_at)}`;
  const originSuffix = meta.origin ? ` · ${meta.origin}` : "";

  const ariaParts: string[] = [`Fonte: ${label}`];
  if (meta.origin) ariaParts.push(`origem: ${meta.origin}`);
  ariaParts.push(`atualizado ${timeAgo}`);
  if (meta.stale) ariaParts.push("dados desatualizados");
  if (meta.errors.length > 0) ariaParts.push(`${meta.errors.length} erro(s)`);
  if (meta.confidence != null) ariaParts.push(`confiança: ${meta.confidence}%`);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.65rem] leading-none ${className}`}
      style={{
        borderColor: colorVar,
        color: "var(--kratos-text-secondary)",
        background: `color-mix(in oklab, ${colorVar} 10%, transparent)`,
      }}
      role="status"
      aria-label={ariaParts.join(", ")}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
        style={{ background: colorVar }}
        aria-hidden
      />
      <span className="font-medium" style={{ color: "var(--kratos-text-primary)" }}>
        {label}
      </span>
      {meta.origin && (
        <span className="opacity-50 kratos-mono" style={{ fontSize: "0.6rem" }}>
          {meta.origin}
        </span>
      )}
      <span className="opacity-60">{timeAgo}</span>
      {meta.stale && (
        <span
          className="inline-flex items-center justify-center rounded-full h-3.5 w-3.5 text-[9px] font-bold"
          style={{
            background: "var(--kratos-critical)",
            color: "#fff",
          }}
          aria-hidden
        >
          !
        </span>
      )}
      {meta.errors.length > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full h-3.5 min-w-[14px] px-0.5 text-[9px] font-bold kratos-mono"
          style={{
            background: "var(--kratos-critical)",
            color: "#fff",
          }}
          aria-hidden
        >
          {meta.errors.length}
        </span>
      )}
    </span>
  );
}
