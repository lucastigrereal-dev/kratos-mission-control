# VISUAL BIBLE — KRATOS Mission Control
## Fonte de Verdade Visual Canônica

**Versão:** 3.1-FINAL | **Stack:** React + Vite + TypeScript + Tailwind + Framer Motion

---

## 1. FILOSOFIA VISUAL

### O que o KRATOS É
- Cockpit operacional vivo — não dashboard corporativo
- Mundo habitável de produtividade: ilhas flutuantes, castelo central, HUD glassmorphism
- Neurocompatível: reduced motion, hierarquia clara, zero clutter
- Emocional: Nintendo-like alma + Apple-like precisão + Sci-fi leve

### Referência Fixa
- **Nintendo hub worlds** — calor, legibilidade, personagem no centro
- **Apple clean UI** — glassmorphism, springs, tipografia impecável
- **Sci-fi command center** — glow, profundidade, sem cyberpunk exagerado

### Regra de Ouro Visual
> "Em 10 segundos, o operador deve ver: **Missão Atual, Próxima Ação, Foco do Dia e seu lugar no mundo.**"

---

## 2. O QUE O KRATOS **NÃO** É

- SaaS genérico azul de startup
- Notion com skin
- CRM
- Dashboard corporativo
- Grafana bonito
- Chatbot
- App de tarefas comum
- LinkedIn produtividade
- Cyberpunk poluído
- Fantasia infantil

---

## 3. AS 11 ILHAS CANÔNICAS

| # | Ilha | Temática | Cor Primária | Função |
|---|---|---|---|---|
| 0 | **Palco Central** (Castelo) | Hub, foco, missão | Azul/cinza/dourado | Missão atual, visão geral, foco do dia |
| 1 | **OMNIS Lab** | Tech, IA, agentes | Roxo `#7C3AED` + Ciano `#06B6D4` | Automações, workflows, agentes |
| 2 | **Akasha / Gringotts** | Vault, memória | Esmeralda `#059669` + Ouro `#F59E0B` | Conhecimento, prompts, arquivos |
| 3 | **Arena Comercial** | Impacto, vendas | Vermelho `#DC2626` + Dourado | Vendas, negociação, metas, CRM |
| 4 | **Agência / Estúdio** | Criativa, conteúdo | Laranja `#F97316` | Conteúdo, campanha, marca |
| 5 | **Vila Viva** | Vida, família | Verde `#16A34A` + Terra | Família, rotina, vida real |
| 6 | **Observatório** | Estratégia, visão | Azul-marinho `#1E3A8A` + Ciano | Estratégia, filosofia, decisões |
| 7 | **Nimbus Academy** | Mística, sonhos | Azul-ciano `#0EA5E9` | Navegação, viagens, sonhos |
| 8 | **Tesouro / Finanças** | Vault, elegância | Verde-escuro `#166534` + Ouro `#FACC15` | Finanças, patrimônio, metas |
| 9 | **Forja / Corpo** | Físico, disciplina | Cinza `#475569` + Laranja `#EA580C` | Treino, saúde, disciplina |
| 10 | **Filosofia & Sabedoria** | Mística, conhecimento | Violeta `#7C3AED` + Lilás `#C4B5FD` | Reflexões, leituras, princípios |

---

## 4. ARQUITETURA DO SHELL

### Layout Principal (16:9 Desktop-first)

```
┌────────────────────────────────────────────────────────────────┐
│  TOP BAR — 64px fixed z-100 (glass)                            │
│  Avatar + Saudação | Energia | Nível | Escudo K | XP | Relógio │
├───────────┬──────────────────────────────────────┬─────────────┤
│           │                                      │             │
│ SIDEBAR   │      MUNDO DE ILHAS (16:9)           │ RIGHT RAIL  │
│  220px    │     OceanBackdrop + Ilhas            │   340px     │
│  fixed    │     + Castelo Central                │   fixed     │
│  z-100    │     + Clouds + Bridges               │   z-100     │
│           │                                      │             │
├───────────┴──────────────────────────────────────┴─────────────┤
│  BOTTOM DOCK — 80px fixed z-90 (glass adaptativo)              │
│  [Audio] | [Missão + Foco + Próxima Ação] | [Squads]           │
└────────────────────────────────────────────────────────────────┘
```

### Z-Index System (Imutável)

```
z-0   OceanBackdrop
z-10  SkyLayer
z-15  GhostIslands (decorativas)
z-20  CloudLayer
z-30  BridgeSystem (SVGs)
z-40  FloatingIsland
z-50  CentralCastleMission
z-60  IslandLabel
z-70  MissionBanner
z-90  BottomDock
z-100 TopBar + Sidebar + RightRail (HUD)
```

---

## 5. DESIGN TOKENS GLOBAIS

### 5.1 Paleta Completa

```typescript
// tailwind.config.ts → theme.extend.colors
kratos: {
  ocean:   { DEFAULT: "#2563EB", deep: "#1E40AF", dark: "#1E3A8A" },
  sky:     { DEFAULT: "#60A5FA", light: "#DBEAFE" },
  island:  { grass: "#22C55E", earth: "#D97706" },
  castle:  { stone: "#E2E8F0", roof: "#EF4444", gold: "#F59E0B", shield: "#1E3A8A" },
  hud:     { glass: "rgba(15,23,42,0.75)", border: "rgba(255,255,255,0.10)" },
  accent:  { energy: "#FACC15", xp: "#A855F7", online: "#4ADE80", progress: "#06B6D4" },
  // Ilhas temáticas
  omnis:        { DEFAULT: "#7C3AED", glow: "#8B5CF6", label: "#C4B5FD", neon: "#06B6D4" },
  agencia:      { DEFAULT: "#F97316", glow: "#FB923C", label: "#FDBA74" },
  akasha:       { DEFAULT: "#059669", glow: "#10B981", label: "#6EE7B7", gold: "#F59E0B", goldLight: "#FCD34D" },
  filosofia:    { DEFAULT: "#7C3AED", glow: "#A855F7", label: "#C4B5FD" },
  financas:     { DEFAULT: "#166534", glow: "#FACC15", label: "#4ADE80" },
  forja:        { DEFAULT: "#475569", glow: "#EA580C", label: "#94A3B8" },
  observatorio: { DEFAULT: "#1E3A8A", glow: "#3B82F6", label: "#60A5FA" },
  vila:         { DEFAULT: "#16A34A", glow: "#86EFAC", label: "#BBF7D0", warm: "#FEF3C7" },
  arena:        { DEFAULT: "#DC2626", glow: "#F87171", label: "#FCA5A5" },
  nimbus:       { DEFAULT: "#0EA5E9", glow: "#7DD3FC", label: "#BAE6FD", crystal: "#22D3EE" },
}
```

### 5.2 Sombras

```typescript
boxShadow: {
  "kratos-glass":       "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
  "kratos-glass-hover": "0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
  "kratos-island":      "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
  "kratos-hud":         "0 4px 24px rgba(0,0,0,0.5)",
  "glow-omnis":         "0 0 40px rgba(139,92,246,0.3)",
  "glow-agencia":       "0 0 40px rgba(249,115,22,0.25)",
  "glow-akasha":        "0 0 40px rgba(16,185,129,0.3)",
  "glow-nimbus":        "0 0 40px rgba(14,165,233,0.3)",
  "glow-arena":         "0 0 40px rgba(220,38,38,0.25)",
  "glow-forja":         "0 0 40px rgba(234,88,12,0.25)",
  "glow-vila":          "0 0 40px rgba(22,163,74,0.25)",
}
```

### 5.3 Blur e Border Radius

```typescript
backdropBlur: { glass: "16px", panel: "24px" },
borderRadius: { glass: "16px", island: "24px", card: "20px", tech: "8px" },
```

### 5.4 Motion Tokens (CSS Keyframes)

```typescript
keyframes: {
  "float-slow":   { "0%,100%": { transform: "translateY(0) rotateX(10deg)" }, "50%": { transform: "translateY(-12px) rotateX(10deg)" } },
  "float-medium": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
  "cloud-drift":  { "0%": { transform: "translateX(-10vw)" }, "100%": { transform: "translateX(110vw)" } },
  "pulse-glow":   { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "0.7" } },
  "spin-slow":    { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
  "shimmer":      { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
},
animation: {
  "float-slow":   "float-slow 6s ease-in-out infinite",
  "float-medium": "float-medium 5s ease-in-out infinite",
  "cloud-drift":  "cloud-drift 120s linear infinite",
  "pulse-glow":   "pulse-glow 4s ease-in-out infinite",
  "spin-slow":    "spin-slow 10s linear infinite",
  "shimmer":      "shimmer 3s ease-in-out infinite",
}
```

### 5.5 Tipografia

```
Display:  text-2xl font-bold tracking-tight            → títulos de ilha, valores grandes
Módulo:   text-xs font-bold uppercase tracking-[0.15em] → headers de card, badges
Corpo:    text-sm font-medium                           → labels, descrições
Dados:    text-3xl font-bold tabular-nums               → métricas, porcentagens
Caption:  text-[10px] font-medium uppercase tracking-wider text-white/50 → sublabels
```

---

## 6. POSICIONAMENTO DAS ILHAS

| Ilha | left | top | Tamanho |
|---|---|---|---|
| OMNIS Lab | 10% | 8% | lg |
| Agência / Estúdio | 8% | 38% | lg |
| Vila Viva | 12% | 62% | lg |
| Arena Comercial | 22% | 78% | lg |
| Akasha | 75% | 10% | lg |
| Filosofia | 82% | 38% | lg |
| Finanças / Tesouro | 78% | 65% | lg |
| Forja | 45% | 72% | lg |
| Observatório | 65% | 82% | lg |
| Nimbus | 48% | 92% | md |
| **Castelo Central** | **50%** | **45%** | **xl** |

---

## 7. RESPONSIVIDADE

- **≥ 1280px:** Layout nativo 16:9
- **1024–1279px:** Mapa `transform: scale(0.9)`, RightRail 300px
- **< 1024px:** Modo lista com `IslandMiniCard` ou scroll horizontal `min-w-[1280px]`
- **Reduced Motion:** Desativar `float-slow`, `cloud-drift`, `pulse-glow`. Manter apenas opacity transitions.

---

## 8. PERFORMANCE

- **Lazy Load:** Todos os interiores de ilha em `React.lazy()` + Suspense com LoadingSkeleton
- **GPU:** `will-change: transform` em ilhas e nuvens
- **Blur Limit:** Máximo 5-8 elementos simultâneos com `backdrop-blur` real
- **Não animar:** `width`, `height`, `top`, `left` — apenas `transform` e `opacity`
- **Bundle inicial:** < 200KB (sem contar ilhas lazy)
- **SVG Partículas:** Máximo 10 por ilha
