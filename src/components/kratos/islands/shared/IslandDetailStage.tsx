import { type ReactNode } from "react";

// ── Island Config ─────────────────────────────────────────────────────────────

export type IslandTheme =
  | "omnis"
  | "akasha"
  | "arena"
  | "agencia"
  | "nimbus"
  | "vila"
  | "observatorio"
  | "filosofia"
  | "forja"
  | "tesouro";

export interface IslandConfig {
  id: string;
  title: string;
  subtitle: string;
  asset?: string;
  theme: IslandTheme;
  accentColor: string;
  lineColor: string;
}

export const ISLAND_CONFIGS: Record<string, IslandConfig> = {
  omnis: {
    id: "omnis",
    title: "OMNIS LAB",
    subtitle: "Centro de IA, Automações e Inteligência de Execução",
    asset: "/assets/images/islands/omnis-lab.png",
    theme: "omnis",
    accentColor: "rgba(139,92,246,0.6)",
    lineColor: "rgba(124,58,237,0.6)",
  },
  akasha: {
    id: "akasha",
    title: "AKASHA / GRINGOTTS",
    subtitle: "Banco de conhecimento, memória e arquivos",
    asset: "/assets/images/islands/akasha.png",
    theme: "akasha",
    accentColor: "rgba(59,130,246,0.6)",
    lineColor: "rgba(37,99,235,0.6)",
  },
  arena: {
    id: "arena",
    title: "ARENA COMERCIAL",
    subtitle: "Vendas, negociação, metas e conquistas",
    asset: "/assets/images/islands/arena.png",
    theme: "arena",
    accentColor: "rgba(249,115,22,0.6)",
    lineColor: "rgba(234,88,12,0.6)",
  },
  agencia: {
    id: "agencia",
    title: "AGÊNCIA / ESTÚDIO",
    subtitle: "Conteúdo, campanhas, marca e comunicação",
    asset: "/assets/images/islands/agencia.png",
    theme: "agencia",
    accentColor: "rgba(236,72,153,0.6)",
    lineColor: "rgba(219,39,119,0.6)",
  },
  nimbus: {
    id: "nimbus",
    title: "NIMBUS",
    subtitle: "Sonhos, viagens e expansão",
    asset: "/assets/images/islands/nimbus.png",
    theme: "nimbus",
    accentColor: "rgba(34,211,238,0.6)",
    lineColor: "rgba(6,182,212,0.6)",
  },
  vila: {
    id: "vila",
    title: "VILA VIVA",
    subtitle: "Rotina, família e vida real",
    asset: "/assets/images/islands/vila.png",
    theme: "vila",
    accentColor: "rgba(52,211,153,0.6)",
    lineColor: "rgba(16,185,129,0.6)",
  },
  observatorio: {
    id: "observatorio",
    title: "OBSERVATÓRIO",
    subtitle: "Ideias, visão, estratégia e inspiração",
    asset: "/assets/images/islands/observatorio.png",
    theme: "observatorio",
    accentColor: "rgba(96,165,250,0.6)",
    lineColor: "rgba(59,130,246,0.6)",
  },
  filosofia: {
    id: "filosofia",
    title: "FILOSOFIA & SABEDORIA",
    subtitle: "Princípios, valores e visão de mundo",
    asset: "/assets/images/islands/filosofia.png",
    theme: "filosofia",
    accentColor: "rgba(167,139,250,0.6)",
    lineColor: "rgba(139,92,246,0.6)",
  },
  forja: {
    id: "forja",
    title: "FORJA / CORPO",
    subtitle: "Treino, energia, saúde e disciplina",
    // sem asset ainda
    theme: "forja",
    accentColor: "rgba(239,68,68,0.6)",
    lineColor: "rgba(220,38,38,0.6)",
  },
  tesouro: {
    id: "tesouro",
    title: "TESOURO / FINANÇAS",
    subtitle: "Finanças pessoais, caixa e investimentos",
    // sem asset ainda
    theme: "tesouro",
    accentColor: "rgba(251,191,36,0.6)",
    lineColor: "rgba(245,158,11,0.6)",
  },
};

// ── IslandDetailStage ─────────────────────────────────────────────────────────
//
// Camadas (de baixo para cima):
//   Layer 0 — imagem da ilha: blur(2.5px) + brightness(0.75) apaga UI fake do mockup
//              scale(1.02) evita bordas brancas do blur; overflow:hidden no pai faz clip
//   Layer 1 — scrim radial: centro 52% → bordas 85%, preserva atmosfera, mata ruído
//   Layer 2 — máscara de topo: gradiente 95→0% nos primeiros 80px, cobre HUD fake
//   Layer 3 — linha temática no topo (acento da ilha)
//   Layer 4 — conteúdo React

interface IslandDetailStageProps {
  islandId: string;
  children: ReactNode;
}

export function IslandDetailStage({ islandId, children }: IslandDetailStageProps) {
  const config = ISLAND_CONFIGS[islandId];
  const imageSrc = config?.asset;
  const lineColor = config?.lineColor ?? "rgba(100,200,255,0.5)";

  return (
    <div
      className="relative overflow-hidden"
      style={{
        margin: "-24px -32px",
        minHeight: "calc(100vh - 162px)",
      }}
    >
      {/* Layer 0: imagem da ilha — blur apaga UI fake, preserva cores e atmosfera */}
      {imageSrc ? (
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            backgroundImage: `url('${imageSrc}')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            filter: "blur(2.5px) brightness(0.75)",
            transform: "scale(1.02)",
            transformOrigin: "center center",
          }}
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "#040d1a" }}
          aria-hidden
        />
      )}

      {/* Layer 1: scrim radial — preserva atmosfera, mata competição com cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(2,6,20,0.52) 0%, rgba(2,6,20,0.85) 100%)",
        }}
        aria-hidden
      />

      {/* Layer 2: máscara de topo — apaga HUD fake do mockup */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{
          height: "80px",
          background:
            "linear-gradient(to bottom, rgba(2,6,20,0.95) 0%, rgba(2,6,20,0.0) 100%)",
        }}
        aria-hidden
      />

      {/* Layer 3: linha temática no topo */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${lineColor} 25%, ${lineColor} 75%, transparent 95%)`,
        }}
        aria-hidden
      />

      {/* Layer 4: conteúdo React */}
      <div
        className="relative z-10 mx-auto max-w-[1100px]"
        style={{ padding: "28px 32px 56px" }}
      >
        {children}
      </div>
    </div>
  );
}
