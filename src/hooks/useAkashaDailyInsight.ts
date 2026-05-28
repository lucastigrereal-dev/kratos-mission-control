/**
 * useAkashaDailyInsight — W14 Auto-Learning
 *
 * Surfaces a relevant daily insight from Akasha memory vault.
 * Topic rotates by day-of-week. Cache: 30min within session.
 * Falls back to curated static insights when Akasha is offline.
 *
 * Different from useAuroraInsight (which fetches from OMNIS /aurora/insight):
 * this hook queries Akasha directly via semantic search.
 */

import { useQuery } from "@tanstack/react-query";
import { searchAkasha } from "@/lib/akasha-server-fns";

export interface AkashaDailyInsight {
  content: string;
  source: string | null;
  collection: string | null;
  score: number;
  isStatic: boolean; // true = offline fallback, false = live from Akasha
}

// ── Static fallback insights ──────────────────────────────────────────────────
// Real quotes — never invented. Used when Akasha backend is offline.

const STATIC_INSIGHTS: AkashaDailyInsight[] = [
  {
    content: "Você tem poder sobre sua mente, não sobre os eventos externos. Perceba isso e encontrará sua força.",
    source: "Marco Aurélio · Meditações",
    collection: "filosofia",
    score: 1,
    isStatic: true,
  },
  {
    content: "Não busques que os acontecimentos sejam como desejas, mas deseja os acontecimentos tal como são e encontrarás tranquilidade.",
    source: "Epicteto · Enchiridion",
    collection: "filosofia",
    score: 1,
    isStatic: true,
  },
  {
    content: "Cada manhã ao levantar, pense no privilégio que é estar vivo: respirar, pensar, desfrutar, amar.",
    source: "Marco Aurélio · Meditações",
    collection: "filosofia",
    score: 1,
    isStatic: true,
  },
  {
    content: "Concentre-se em pequenas melhorias diárias. 1% melhor a cada dia = 37× melhor ao fim de um ano.",
    source: "James Clear · Hábitos Atômicos",
    collection: "performance",
    score: 1,
    isStatic: true,
  },
  {
    content: "A sorte é o que acontece quando a preparação encontra a oportunidade.",
    source: "Sêneca",
    collection: "filosofia",
    score: 1,
    isStatic: true,
  },
  {
    content: "Não é que tenhamos pouco tempo, mas que desperdiçamos muito. A vida é longa o suficiente para quem a usa bem.",
    source: "Sêneca · De Brevitate Vitae",
    collection: "filosofia",
    score: 1,
    isStatic: true,
  },
  {
    content: "A excelência não é um ato, mas um hábito. O que fazemos repetidamente — isso é o que somos.",
    source: "Aristóteles",
    collection: "filosofia",
    score: 1,
    isStatic: true,
  },
];

// ── Topic rotation ────────────────────────────────────────────────────────────

const DAILY_TOPICS = [
  "foco e execução de tarefas importantes",
  "estoicismo e controle do que está ao alcance",
  "liderança tomada de decisão",
  "produtividade e construção de hábitos",
  "família filhos relacionamentos",
  "saúde física disciplina treino corpo",
  "estratégia visão longo prazo objetivos",
];

function getDailyTopic(): string {
  const dayOfWeek = new Date().getDay(); // 0=Dom … 6=Sáb
  return DAILY_TOPICS[dayOfWeek] ?? DAILY_TOPICS[0];
}

function getStaticFallback(): AkashaDailyInsight {
  const start = new Date(new Date().getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  return STATIC_INSIGHTS[dayOfYear % STATIC_INSIGHTS.length];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseAkashaDailyInsightResult {
  insight: AkashaDailyInsight;
  isLoading: boolean;
  isFromAkasha: boolean;
  topic: string;
}

export function useAkashaDailyInsight(): UseAkashaDailyInsightResult {
  const topic = getDailyTopic();
  const dateKey = new Date().toISOString().slice(0, 10); // "2026-05-28"

  const query = useQuery<AkashaDailyInsight, Error>({
    queryKey: ["akasha-daily-insight", dateKey],
    queryFn: async (): Promise<AkashaDailyInsight> => {
      const result = await searchAkasha({
        data: { query: topic, limit: 3 },
      });

      if (result.error || !result.data || result.data.results.length === 0) {
        return getStaticFallback();
      }

      // Highest-scoring result wins
      const best = [...result.data.results].sort((a, b) => b.score - a.score)[0];
      return {
        content: best.content,
        source: best.source ?? null,
        collection: best.collection ?? null,
        score: best.score,
        isStatic: false,
      };
    },
    staleTime: 30 * 60_000, // 30 min
    retry: false,
    placeholderData: getStaticFallback,
  });

  return {
    insight: query.data ?? getStaticFallback(),
    isLoading: query.isLoading && !query.data,
    isFromAkasha: query.data?.isStatic === false,
    topic,
  };
}
