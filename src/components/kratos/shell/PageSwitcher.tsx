/**
 * PageSwitcher — W12
 * Mini-seletor das 6 páginas do Instagram.
 * Usado no cockpit da Agência para filtrar/focar em uma página.
 *
 * Props:
 *  - selected: PageSlug | "all"
 *  - onChange: (slug: PageSlug | "all") => void
 *
 * Design: TDAH-first — avatares compactos com initial + tooltip de handle.
 * Shortcut: teclas 1-6 (+ 0 = "todas") quando o componente está mounted.
 */

import { useEffect, useCallback } from "react";
import { PAGE_PROFILES, PAGE_SLUGS } from "../../../../api-contract/marketing.schema";
import type { PageSlug } from "../../../../api-contract/marketing.schema";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PageSelection = PageSlug | "all";

export interface PageSwitcherProps {
  selected: PageSelection;
  onChange: (s: PageSelection) => void;
  /** Compact mode: show only initials, no follower count */
  compact?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PageSwitcher({ selected, onChange, compact = false }: PageSwitcherProps) {
  const accent = "var(--kr-island-agencia)";

  // Keyboard shortcuts: 0 = all, 1-6 = pages in order
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // Only trigger if no input/textarea/contenteditable is focused
      const el = e.target as HTMLElement;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable) return;

      if (e.key === "0") { onChange("all"); return; }
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < PAGE_SLUGS.length) {
        const slug = PAGE_SLUGS[idx];
        if (slug) onChange(slug);
      }
    },
    [onChange],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      className="flex items-center gap-1.5 flex-wrap"
      role="group"
      aria-label="Filtrar por página"
    >
      {/* "Todas" button */}
      <button
        type="button"
        onClick={() => onChange("all")}
        className="flex items-center gap-1 rounded-lg px-2 py-1 transition-all"
        style={{
          background:
            selected === "all"
              ? `color-mix(in oklab, ${accent} 18%, transparent)`
              : "var(--kratos-surface-3)",
          border:
            selected === "all"
              ? `1px solid color-mix(in oklab, ${accent} 40%, transparent)`
              : "1px solid var(--kratos-border)",
          color: selected === "all" ? accent : "var(--kratos-text-muted)",
        }}
        aria-pressed={selected === "all"}
        title="Todas as páginas (0)"
      >
        <span className="text-[10px] kratos-mono font-medium">Todas</span>
        {!compact && (
          <span
            className="text-[9px] kratos-mono"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            6
          </span>
        )}
      </button>

      {/* Per-page buttons */}
      {PAGE_SLUGS.map((slug, idx) => {
        const profile = PAGE_PROFILES[slug];
        const isActive = selected === slug;
        const initial = getInitial(profile.name);

        return (
          <button
            key={slug}
            type="button"
            onClick={() => onChange(slug)}
            className="flex items-center gap-1.5 rounded-lg transition-all"
            style={{
              padding: compact ? "4px" : "4px 8px 4px 4px",
              background: isActive
                ? `color-mix(in oklab, ${accent} 15%, transparent)`
                : "var(--kratos-surface-3)",
              border: isActive
                ? `1px solid color-mix(in oklab, ${accent} 35%, transparent)`
                : "1px solid var(--kratos-border)",
              boxShadow: isActive
                ? `0 0 8px color-mix(in oklab, ${accent} 12%, transparent)`
                : "none",
            }}
            aria-pressed={isActive}
            title={`${profile.handle} — ${fmtFollowers(profile.followers)} seguidores (${idx + 1})`}
          >
            {/* Avatar initial */}
            <div
              className="rounded-full flex items-center justify-center shrink-0 font-bold text-white"
              style={{
                width: 22,
                height: 22,
                fontSize: 10,
                background: isActive
                  ? accent
                  : "linear-gradient(135deg, var(--kr-island-agencia), color-mix(in oklab, var(--kr-island-agencia) 50%, var(--kr-ghost, #333)))",
                opacity: isActive ? 1 : 0.6,
              }}
              aria-hidden
            >
              {initial}
            </div>

            {/* Name + followers (non-compact mode) */}
            {!compact && (
              <div className="min-w-0">
                <p
                  className="text-[10px] font-medium leading-tight truncate max-w-[72px]"
                  style={{ color: isActive ? "var(--kratos-text-primary)" : "var(--kratos-text-secondary)" }}
                >
                  {profile.name.split(" ")[0]}
                </p>
                <p className="text-[9px] kratos-mono" style={{ color: "var(--kratos-text-muted)" }}>
                  {fmtFollowers(profile.followers)}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
