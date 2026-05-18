# KRATOS Visual Bible — Paleta, Glassmorphism, Tipografia, Motion, Estados, Proibições

> **Para MANUS:** Toda decisão visual segue este documento. Tokens primeiro, hex nunca. Dark mode only.

---

## 1. Paleta de Cores Completa

### 1.1 Fundo Oceano-Céu (mundo 3D)

```
--kr-ocean-deep: #051024        (abismo oceânico)
--kr-ocean: #0A1E3F             (oceano médio)
--kr-ocean-surface: rgba(14, 165, 233, 0.06)  (superfície)
--kr-sky: #60A5FA               (céu azul)
--kr-sky-light: #93C5FD         (céu claro)
```

### 1.2 Terreno das Ilhas

```
--kr-grass: #22C55E             (grama)
--kr-grass-light: #4ADE80       (grama clara)
--kr-earth: #92400E             (terra)
--kr-earth-dark: #78350F        (terra escura)
--kr-wood: #A16207              (madeira)
--kr-wood-light: #CA8A04        (madeira clara)
```

### 1.3 Castelo Central

```
--kr-castle-stone: #78716C      (pedra)
--kr-castle-roof: #1E40AF       (telhado)
--kr-castle-wall: #A8A29E       (muralha)
```

### 1.4 Cores Semânticas

```
--kr-azure: #1E90FF             (azul celestial - links, info)
--kr-gold: #FFD700              (ouro - destaque, conquista)
--kr-aurora: #8B5CF6            (Aurora AI - mentor)
--kr-success: #22C55E           (sucesso, missão ativa)
--kr-danger: #EF4444            (perigo, alerta crítico)
--kr-warning: #F59E0B           (aviso, drift)
```

### 1.5 Cores por Ilha (10 ilhas)

```
--kr-island-omnis: #7C3AED          (Omnis Lab - roxo IA)
--kr-island-agencia: #F97316        (Agência - laranja conteúdo)
--kr-island-akasha: #059669         (Akasha - verde memória)
--kr-island-nimbus: #0EA5E9         (Nimbus - azul sonhos)
--kr-island-arena: #E11D48          (Arena - vermelho vendas)
--kr-island-vila: #16A34A           (Vila - verde família)
--kr-island-forja: #DC2626          (Forja - vermelho disciplina)
--kr-island-observatorio: #4F46E5   (Observatório - índigo visão)
--kr-island-filosofia: #D97706      (Filosofia - âmbar sabedoria)
--kr-island-financas: #CA8A04       (Tesouro - ouro riqueza)
```

### 1.6 Acentos Claros/Escuros (15 variantes)

```
--kr-accent-cyan: #06B6D4
--kr-accent-cyan-bright: #22D3EE
--kr-accent-indigo: #6366F1
--kr-accent-emerald: #10B981
--kr-accent-green-light: #6EE7B7
--kr-accent-gold-light: #FCD34D
--kr-accent-gold-pale: #FDE68A
--kr-accent-orange-light: #FDBA74
--kr-accent-orange-lighter: #FB923C
--kr-accent-amber-bright: #FBBF24
--kr-accent-purple: #A855F7
--kr-accent-purple-light: #C4B5FD
--kr-accent-purple-lighter: #A78BFA
--kr-accent-blue-light: #7DD3FC
--kr-accent-blue-cyan: #67E8F9
```

### 1.7 Superfícies (Shadcn/ui kratos-surface)

```
--kratos-surface-0: #0c0c0e     (fundo base)
--kratos-surface-1: #111114     (1 nível acima)
--kratos-surface-2: #17171b     (cards)
--kratos-surface-3: #1e1e24     (hover)
--kratos-surface-4: #26262f     (elevado)
```

### 1.8 Texto

```
--kr-text-primary: #E5E7EB      (texto principal)
--kr-text-secondary: #9CA3AF    (texto secundário)
--kr-text-muted: #6B7280        (texto muted)
--kr-hud-text: #E5E7EB          (texto HUD)
```

---

## 2. Glassmorphism System

### 2.1 Tokens Base

```css
--kr-glass-bg: rgba(11, 18, 32, 0.78);
--kr-glass-border: rgba(255, 255, 255, 0.12);
--kr-glass-blur: 16px;
--kr-panel-blur: 24px;

/* HUD overlays - mais opaco */
--kr-glass-strong-bg: rgba(15, 23, 42, 0.94);
--kr-glass-strong-border: rgba(255, 255, 255, 0.15);

/* Highlight sutil na borda superior */
--kr-glass-highlight: rgba(255, 255, 255, 0.04);
```

### 2.2 Classes Utilitárias

```css
.kr-glass {
  background: var(--kr-glass-bg);
  border: 1px solid var(--kr-glass-border);
  backdrop-filter: blur(var(--kr-glass-blur));
  -webkit-backdrop-filter: blur(var(--kr-glass-blur));
  box-shadow: var(--kr-shadow-inner-glow);
}

.kr-glass-strong {
  background: var(--kr-glass-strong-bg);
  border: 1px solid var(--kr-glass-strong-border);
  backdrop-filter: blur(var(--kr-panel-blur));
  -webkit-backdrop-filter: blur(var(--kr-panel-blur));
  box-shadow: var(--kr-shadow-card);
}
```

### 2.3 Aurora Glass (painel direito)

```css
.kratos-aurora-glass {
  background: linear-gradient(
    180deg,
    rgba(99, 102, 241, 0.1),
    rgba(23, 23, 27, 0.62) 36%,
    rgba(17, 17, 20, 0.88)
  );
  backdrop-filter: blur(22px) saturate(150%);
}
```

### 2.4 Regras do Vidro

- **Sempre** usar `backdrop-filter` + `-webkit-backdrop-filter` juntos
- Glass forte (strong) para HUD elements (topbar, sidebar, statusbar)
- Glass normal para cards e painéis flutuantes
- Aurora glass só no painel direito da Aurora

---

## 3. Tipografia

### 3.1 Fontes

| Token | Font Stack | Uso |
|---|---|---|
| `--kr-font-sans` | "Poppins", "Inter", system-ui, -apple-system, sans-serif | Headings, corpo |
| `--kr-font-mono` | "JetBrains Mono", ui-monospace, monospace | Dados, métricas, labels |
| `--kratos-font-sans` | "Inter", "Inter Variable", system-ui, -apple-system, sans-serif | Shell UI |
| `--kratos-font-mono` | "JetBrains Mono", ui-monospace, SFMono-Regular, monospace | Números |

### 3.2 Classes de Texto

| Classe | Font | Weight | Size | Letter-spacing | Uso |
|---|---|---|---|---|---|
| `.kr-text-display` | Poppins/Inter | 800 | inherit | -0.02em | Títulos grandes |
| `.kr-text-heading` | Poppins/Inter | 700 | inherit | -0.01em | Headings |
| `.kr-text-body` | Inter | 400 | inherit | normal | Corpo |
| `.kr-text-caption` | Inter | 500 | 0.75rem | 0.01em | Captions |
| `.kratos-eyebrow` | JetBrains Mono | normal | 10px | 0.18em | Labels mono |
| `.kratos-display` | Inter | 600 | inherit | -0.015em | Números grandes |
| `.kratos-num` | JetBrains Mono | normal | inherit | -0.01em | Métricas |
| `.kratos-mono` | JetBrains Mono | normal | inherit | normal | Dados mono |

### 3.3 Tamanhos por Contexto

| Elemento | Font | Tamanho |
|---|---|---|
| Título de seção | `kratos-mono` | 10px |
| Dados/métricas | `kratos-mono` | 11-12px |
| Corpo de texto | Inter | 12-14px |
| Labels | Inter | 10-11px |
| Aurora messages | Inter | 11px |
| Eyebrow | `kratos-mono` | 10px |

---

## 4. Motion & Animações

### 4.1 Tokens de Duração

```css
--kr-duration-micro: 150ms;
--kr-duration-fast: 200ms;
--kr-duration-normal: 300ms;
--kr-duration-slow: 500ms;
--kr-duration-glacial: 1000ms;
```

### 4.2 Easings

```css
--kr-ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
--kr-ease-spring-fast: cubic-bezier(0.22, 1, 0.28, 1);
--kr-ease-drift: linear;
--kr-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--kr-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### 4.3 Animações Disponíveis (NUNCA criar novas)

| Keyframe | Duração | Easing | Uso |
|---|---|---|---|
| `kr-float-slow` | 6s | ease-spring | Ilhas flutuando |
| `kr-float-medium` | 5s | ease-spring | Labels, elementos pequenos |
| `kr-cloud-drift` | 120s | linear | Nuvens atravessando tela |
| `kr-pulse-glow` | 4s | ease-spring | Brilho ambiente das ilhas |
| `kr-spin-slow` | 10s | linear | Elementos girando |
| `kr-bridge-glow` | 3s | ease-spring | Pontes conectando |
| `kr-ocean-shimmer` | 6s | ease-spring | Reflexo no oceano |
| `kr-island-rise` | 600ms | ease-spring | Entrada da ilha |
| `kratos-pulse` | 2s | ease-in-out | Indicadores pulsando |
| `kratos-blink` | 1.2s | ease-in-out | Piscando |
| `kratos-fade-in` | 300ms | ease-out | Fade in + slide up |
| `kratos-critical-glow` | 2.4s | ease-in-out | Glow de alerta crítico |

### 4.4 Classes de Animação

```css
.kr-animate-float-slow       /* ilhas */
.kr-animate-float-medium     /* labels */
.kr-animate-cloud-drift      /* nuvens */
.kr-animate-pulse-glow       /* aura */
.kr-animate-spin-slow        /* rotação */
.kr-animate-bridge-glow      /* pontes */
.kr-animate-ocean-shimmer    /* oceano */
.kr-animate-island-rise      /* entrada */
.kratos-pulse                /* indicador */
.kratos-blink                /* piscar */
.kratos-fadein               /* fade-in */
.kratos-critical-signal      /* alerta */
```

### 4.5 Regras de Animação

- **Máximo 2 animações simultâneas** na tela
- **Duração máxima 0.6s** para animações de UI (exceto nuvens = 120s)
- **NUNCA loop infinito** em elemento de UI
- **NUNCA criar keyframe novo**
- Hover: `transform: translateY(-2px)` + `scale(1.02)`

---

## 5. Sombras

### 5.1 Cards e Painéis

```css
--kr-shadow-card: 0 16px 40px rgba(0, 0, 0, 0.28);
--kr-shadow-island: 0 24px 70px rgba(3, 7, 18, 0.35);
--kr-shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.32);
--kr-shadow-inner-glow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
```

### 5.2 Glows por Ilha

```css
--kr-shadow-glow-omnis: 0 0 30px rgba(124, 58, 237, 0.4);
--kr-shadow-glow-agencia: 0 0 30px rgba(249, 115, 22, 0.4);
--kr-shadow-glow-akasha: 0 0 30px rgba(5, 150, 105, 0.4);
--kr-shadow-glow-nimbus: 0 0 30px rgba(14, 165, 233, 0.4);
--kr-shadow-glow-arena: 0 0 30px rgba(225, 29, 72, 0.4);
--kr-shadow-glow-vila: 0 0 30px rgba(22, 163, 74, 0.4);
--kr-shadow-glow-forja: 0 0 30px rgba(220, 38, 38, 0.4);
--kr-shadow-glow-observatorio: 0 0 30px rgba(79, 70, 229, 0.4);
--kr-shadow-glow-filosofia: 0 0 30px rgba(217, 119, 6, 0.4);
--kr-shadow-glow-financas: 0 0 30px rgba(202, 138, 4, 0.4);
--kr-shadow-glow-castle: 0 0 36px rgba(30, 64, 175, 0.45);
```

### 5.3 Utilitários de Glow

```css
.kr-glow-omnis { box-shadow: var(--kr-shadow-glow-omnis); }
.kr-glow-agencia { box-shadow: var(--kr-shadow-glow-agencia); }
/* ... uma classe por ilha ... */
.kr-glow-castle { box-shadow: var(--kr-shadow-glow-castle); }
```

---

## 6. Z-Index Hierarchy (12 camadas)

| z-index | Token | Componente |
|---|---|---|
| 0 | `--kr-z-ocean-backdrop` | OceanBackdrop |
| 10 | `--kr-z-sky-layer` | SkyLayer |
| 15 | `--kr-z-ghost-islands` | Ilhas distantes |
| 20 | `--kr-z-cloud-layer` | CloudLayer |
| 30 | `--kr-z-bridge-system` | BridgeSystem |
| 40 | `--kr-z-floating-island` | FloatingIsland |
| 50 | `--kr-z-central-castle` | CentralCastle |
| 60 | `--kr-z-island-label` | IslandLabel |
| 70 | `--kr-z-mission-banner` | MissionBanner |
| 90 | `--kr-z-bottom-dock` | BottomDock |
| 100 | `--kr-z-topbar / sidebar / right-rail` | Shell chrome |

---

## 7. Estados Obrigatórios (toda tela com dados)

### 7.1 Ordem de Verificação

```
1. isLoading === true  → <LoadingState lines={N} />
2. error !== null      → <ErrorState title="..." onRetry={refetch} />
3. isEmpty === true    → <EmptyState title="..." description="..." />
4. Dados prontos       → Conteúdo real
```

### 7.2 Componentes de Estado

| Estado | Componente | Props |
|---|---|---|
| Loading | `LoadingState` | `lines?: number` |
| Loading 2 | `LoadingSkeleton` | shimmer placeholder |
| Empty | `EmptyState` | `title`, `description`, `icon?`, `action?` |
| Error | `ErrorState` | `title`, `description`, `onRetry` |
| Offline | `ZombieBadge` | indicador offline |

### 7.3 Skeleton Specification

```
LoadingState:
- N linhas horizontais com shimmer animation
- Cada linha: altura 16px, border-radius 8px
- Largura varia: 100%, 75%, 50% alternando
- Background: var(--kr-surface-mid)
- Shimmer: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)
```

---

## 8. Proibições Visuais Absolutas

| PROIBIDO | USE ISSO |
|---|---|
| `style={{ color: "#..." }}` hex inline | `style={{ color: "var(--kr-text-primary)" }}` |
| `style={{ background: "#..." }}` | `className="kr-glass"` ou token CSS |
| `export default` | `export function Nome() {}` |
| `props: any` | `interface NomeProps { ... }` |
| `useEffect + fetch()` | `useApi<T>()` ou `useQuery()` |
| Criar card/panel novo | `GlassPanel` ou `KratosCard` |
| Criar animação nova | Usar as 12 existentes |
| Criar empty/error/loading novo | `EmptyState`, `ErrorState`, `LoadingState` |
| Emoji como ícone | `lucide-react` |
| `console.log` no commit | Remover antes |
| Botão sem handler | Nada decorativo |
| Cor vibrante em elemento não-crítico | Só alertas usam vermelho/laranja |
| Mock parecendo real | Usar `SourceBadgeIndicator` |
| Editar `routeTree.gen.ts` | É auto-gerado |
| Editar shell components | Protegidos |
| Adicionar Three.js/WebGL | Proibido |
| Usar `fetch()` raw | `useApi<T>()` |

---

## 9. Responsividade

### 9.1 Breakpoints

| Nome | Largura |
|---|---|
| Mobile | 375px+ |
| Tablet | 768px+ |
| Desktop | 1280px+ |

### 9.2 Mobile 375px — Regras

- Sidebar colapsa para ícones (60px → 48px)
- AuroraPanel fecha (toggle no topo)
- Cards empilham verticalmente
- Sem overflow horizontal
- Touch targets mínimos 44px

---

## 10. HUD Layout (KratosWorldPage)

```
┌─────────────────────────────────────────────────────────┐
│ Topbar (h:52, z-100, kr-glass-strong)                    │
│ [OperatorWelcome] [StatusDot] [SourceBadge] [AuroraBtn]  │
├────┬──────────────────────────────────────┬──────────────┤
│ SB │  KratosWorldMap (z-0..70)           │ Aurora       │
│    │  Ocean + Sky + Clouds                │ Panel        │
│ 60 │  Ilhas + Castelo + Bridges           │ (z-100)      │
│ px │                                      │ w:340px      │
│    │  WorldCharacterMarker (z-75)         │              │
│    │                                      │ Aurora       │
│    │                                      │ ChatDock     │
├────┴──────────────────────────────────────┴──────────────┤
│ DriftIndicator (z-85, condicional)                       │
│ CurrentMissionBar + Restore CTA (z-89)                   │
│ StatusBarDock (z-90, fixed bottom)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 11. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Sempre testar com `prefers-reduced-motion: reduce` antes de commit.**
