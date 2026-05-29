/**
 * AkashaSearchPanel — W13
 *
 * Semantic memory search UI for the Akasha vault.
 * Debounced auto-search + manual submit.
 * Results show source, score badge, and snippet.
 * Gracefully handles: backend offline, empty results, searching state.
 */
import { useRef, type KeyboardEvent } from "react";
import { Search, X, Loader2, Database, Sparkles, AlertTriangle, Filter } from "lucide-react";
import type { UseAkashaSearchState } from "@/hooks/useAkasha";
import type { AkashaSearchResult, AkashaCollection } from "../../../../api-contract/akasha.schema";

const accent = "var(--kr-island-akasha)";

// ── Score badge ───────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 85 ? "var(--kratos-ok)" :
    pct >= 60 ? "var(--kratos-warn)" :
    "var(--kratos-text-muted)";
  return (
    <span
      className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold"
      style={{
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
        color,
      }}
    >
      {pct}%
    </span>
  );
}

// ── Single result row ─────────────────────────────────────────────────────────

function ResultRow({ result }: { result: AkashaSearchResult }) {
  return (
    <div
      className="rounded-lg px-3 py-2.5 transition-colors"
      style={{
        background: "color-mix(in oklab, var(--kratos-surface-3) 60%, transparent)",
        border: "1px solid color-mix(in oklab, var(--kratos-text-muted) 8%, transparent)",
      }}
    >
      <div className="flex items-start gap-2 mb-1.5">
        <Database className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: accent }} aria-hidden />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {result.collection && (
            <span
              className="text-[9px] font-bold uppercase tracking-[0.05em] shrink-0"
              style={{ color: accent }}
            >
              {result.collection}
            </span>
          )}
          {result.source && (
            <span
              className="text-[10px] truncate"
              style={{ color: "var(--kratos-text-muted)" }}
              title={result.source}
            >
              {result.source.length > 40 ? `…${result.source.slice(-38)}` : result.source}
            </span>
          )}
          <div className="ml-auto">
            <ScoreBadge score={result.score} />
          </div>
        </div>
      </div>
      <p
        className="text-[12px] leading-relaxed line-clamp-3"
        style={{ color: "var(--kratos-text-secondary)" }}
      >
        {result.content}
      </p>
    </div>
  );
}

// ── Collection filter chips ───────────────────────────────────────────────────

interface CollectionChipsProps {
  collections: AkashaCollection[];
  selected: string | undefined;
  onChange: (name: string | undefined) => void;
}

function CollectionChips({ collections, selected, onChange }: CollectionChipsProps) {
  if (collections.length === 0) return null;
  const shown = collections.slice(0, 6); // max 6 chips (TDAH limit)

  return (
    <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filtrar por coleção">
      <Filter className="h-3 w-3 shrink-0" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className="rounded-full px-2 py-0.5 text-[9px] kratos-mono font-medium transition-all"
        style={{
          background: selected == null
            ? "color-mix(in oklab, var(--kr-island-akasha) 18%, transparent)"
            : "var(--kratos-surface-3)",
          color: selected == null ? accent : "var(--kratos-text-muted)",
          border: selected == null
            ? "1px solid color-mix(in oklab, var(--kr-island-akasha) 35%, transparent)"
            : "1px solid var(--kratos-border)",
        }}
        aria-pressed={selected == null}
      >
        todas
      </button>
      {shown.map((col) => (
        <button
          key={col.name}
          type="button"
          onClick={() => onChange(selected === col.name ? undefined : col.name)}
          className="rounded-full px-2 py-0.5 text-[9px] kratos-mono font-medium transition-all"
          style={{
            background: selected === col.name
              ? "color-mix(in oklab, var(--kr-island-akasha) 18%, transparent)"
              : "var(--kratos-surface-3)",
            color: selected === col.name ? accent : "var(--kratos-text-muted)",
            border: selected === col.name
              ? "1px solid color-mix(in oklab, var(--kr-island-akasha) 35%, transparent)"
              : "1px solid var(--kratos-border)",
          }}
          aria-pressed={selected === col.name}
          title={`${col.description ?? col.name} · ${col.count.toLocaleString()} chunks`}
        >
          {col.name}
        </button>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface AkashaSearchPanelProps {
  searchState: UseAkashaSearchState;
  collections?: AkashaCollection[];
  selectedCollection?: string;
  onCollectionChange?: (name: string | undefined) => void;
  placeholder?: string;
  maxHeight?: string;
}

export function AkashaSearchPanel({
  searchState,
  collections,
  selectedCollection,
  onCollectionChange,
  placeholder = "Busca semântica no vault… ex: 'estoicismo', 'receita', 'meta financeira'",
  maxHeight = "460px",
}: AkashaSearchPanelProps) {
  const { query, results, isSearching, error, hasSearched, latencyMs, setQuery, search, clear } =
    searchState;
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      search();
    }
    if (e.key === "Escape") {
      clear();
      inputRef.current?.blur();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Collection filter chips — shown when collections are available */}
      {collections && collections.length > 0 && onCollectionChange && (
        <CollectionChips
          collections={collections}
          selected={selectedCollection}
          onChange={onCollectionChange}
        />
      )}

      {/* Search input */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-150"
        style={{
          background: "color-mix(in oklab, var(--kratos-surface-3) 80%, transparent)",
          border: `1px solid color-mix(in oklab, ${accent} 20%, var(--kratos-text-muted) 8%)`,
          boxShadow: query ? `0 0 0 2px color-mix(in oklab, ${accent} 15%, transparent)` : "none",
        }}
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" style={{ color: accent }} aria-hidden />
        ) : (
          <Search className="h-4 w-4 shrink-0" style={{ color: accent }} aria-hidden />
        )}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[13px]"
          style={{
            color: "var(--kratos-text-primary)",
          }}
          aria-label="Busca no vault Akasha"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="shrink-0 rounded transition-opacity hover:opacity-70"
            aria-label="Limpar busca"
          >
            <X className="h-3.5 w-3.5" style={{ color: "var(--kratos-text-muted)" }} />
          </button>
        )}
      </div>

      {/* Results area */}
      <div
        className="overflow-y-auto rounded-xl"
        style={{ maxHeight }}
        aria-live="polite"
        aria-label="Resultados da busca Akasha"
      >
        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[12px]"
            style={{
              background: "color-mix(in oklab, var(--kratos-critical) 8%, transparent)",
              border: "1px solid color-mix(in oklab, var(--kratos-critical) 20%, transparent)",
              color: "var(--kratos-critical)",
            }}
          >
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              {error.includes("5100") || error.includes("connect")
                ? "Akasha offline — inicie o backend Python em localhost:5100"
                : error}
            </span>
          </div>
        )}

        {/* Searching skeleton */}
        {isSearching && !error && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg"
                style={{ background: "color-mix(in oklab, var(--kratos-surface-3) 50%, transparent)" }}
              />
            ))}
          </div>
        )}

        {/* Results */}
        {!isSearching && !error && results.length > 0 && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" style={{ color: accent }} aria-hidden />
                <span className="text-[11px] font-semibold" style={{ color: accent }}>
                  {results.length} resultado{results.length !== 1 ? "s" : ""}
                </span>
              </div>
              {latencyMs != null && (
                <span className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
                  {latencyMs}ms
                </span>
              )}
            </div>
            <div className="space-y-2">
              {results.map((r) => (
                <ResultRow key={r.id} result={r} />
              ))}
            </div>
          </>
        )}

        {/* Empty results */}
        {!isSearching && !error && hasSearched && results.length === 0 && (
          <div
            className="flex flex-col items-center gap-2 rounded-xl py-8 text-center"
            style={{
              background: "color-mix(in oklab, var(--kratos-surface-3) 40%, transparent)",
              border: "1px dashed color-mix(in oklab, var(--kratos-text-muted) 20%, transparent)",
            }}
          >
            <Database className="h-6 w-6" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
            <p className="text-[12px]" style={{ color: "var(--kratos-text-muted)" }}>
              Nenhum resultado para "{query}"
            </p>
            <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
              Tente outros termos ou verifique se o vault está carregado.
            </p>
          </div>
        )}

        {/* Idle prompt */}
        {!hasSearched && !isSearching && (
          <div
            className="flex flex-col items-center gap-2 rounded-xl py-6 text-center"
            style={{
              background: "color-mix(in oklab, var(--kratos-surface-3) 30%, transparent)",
              border: "1px dashed color-mix(in oklab, var(--kr-island-akasha) 12%, transparent)",
            }}
          >
            <Search className="h-5 w-5" style={{ color: "var(--kratos-text-muted)" }} aria-hidden />
            <p className="text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
              Digite pelo menos 3 caracteres para busca automática
            </p>
            <p className="text-[10px]" style={{ color: "var(--kratos-text-muted)" }}>
              ou pressione{" "}
              <kbd
                className="rounded px-1 py-0.5 text-[9px] font-mono"
                style={{
                  background: "color-mix(in oklab, var(--kratos-surface-3) 80%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--kratos-text-muted) 20%, transparent)",
                  color: "var(--kratos-text-secondary)",
                }}
              >
                Enter
              </kbd>{" "}
              para buscar agora
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
