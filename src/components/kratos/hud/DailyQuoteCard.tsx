import { Quote } from "lucide-react";

interface DailyQuoteCardProps {
  quote?: string;
  author?: string;
}

const defaultQuote =
  "A disciplina e a ponte entre metas e realizacoes.";

const defaultAuthor = "Jim Rohn";

export function DailyQuoteCard({
  quote = defaultQuote,
  author = defaultAuthor,
}: DailyQuoteCardProps) {
  return (
    <div
      className="rounded-2xl px-4 py-3.5"
      style={{
        background: "var(--kr-glass-bg)",
        border: "1px solid var(--kr-glass-border)",
        backdropFilter: "blur(var(--kr-glass-blur))",
        WebkitBackdropFilter: "blur(var(--kr-glass-blur))",
      }}
    >
      <div className="flex items-start gap-2">
        <Quote
          className="h-3.5 w-3.5 shrink-0 mt-0.5"
          style={{ color: "var(--kr-text-muted)" }}
          aria-hidden
        />
        <div className="flex flex-col gap-1">
          <p
            className="text-[11px] italic leading-relaxed"
            style={{ color: "var(--kr-text-muted)" }}
          >
            {quote}
          </p>
          <span
            className="text-[10px] uppercase tracking-[0.1em] font-medium"
            style={{ color: "var(--kr-gold)" }}
          >
            — {author}
          </span>
        </div>
      </div>
    </div>
  );
}
