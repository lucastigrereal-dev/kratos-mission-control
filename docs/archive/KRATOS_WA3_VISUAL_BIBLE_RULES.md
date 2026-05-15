# KRATOS WA3 — VISUAL BIBLE RULES EXTRACTION

**Date:** 2026-05-15 | **Block:** A3 | **Status:** COMPLETE

---

## Regras visuais canônicas extraídas do Kimi Pack

### R1 — Fundo Oceano Abissal
- Fundo SEMPRE escuro: `#06060d` → `#0a1020` → `#0e1830` → `#060d1a` → `#040810`
- NUNCA branco, cinza claro, ou gradiente claro
- Céu com 5 stops até near-black no horizonte

### R2 — Glassmorphism Canônico
- Base: `rgba(15, 23, 42, X)` onde X = 0.35 (light), 0.55 (normal), 0.75 (strong)
- Blur: 12px (normal), 20px (strong), 24px (HUD max)
- Borda: `rgba(255, 255, 255, 0.08)` default, 0.14 strong, 0.18 accent
- Inset highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.05-0.08)`

### R3 — Identidade por Ilha
- Cada ilha tem cor primária + glow + label color
- 11 ilhas canônicas (Visual Bible §3)
- Glow: `0 0 40px rgba(cor, 0.25)` por ilha
- Island top gradient: `color-mix(in srgb, accent 25%, fern) → moss → earth`

### R4 — Profundidade 3D sem 3D
- Ilhas: `rotateX(10-12deg)` pseudo-3D
- Sombras de profundidade multi-camada
- 3 camadas atmosféricas: ocean → horizon band → depth gradient
- Vignette no fundo do canvas

### R5 — Z-Index Imutável
- 0: World/Ocean → 10: Islands → 100: HUD → 200: Sidebar/Rail → 300: Dock → 400: Overlay
- Nunca inverter hierarquia z-index
- Aurora: z-350 (entre dock e overlay)

### R6 — Motion com Propósito
- float-slow: 6s, translateY(-12px), rotateX(10deg)
- float-medium: 5s, translateY(-8px)
- cloud-drift: 40-120s linear
- pulse-glow: 4s, opacity 0.4→0.7
- shimmer: 2-3s loading skeleton
- SEMPRE respect `prefers-reduced-motion`

### R7 — Tipografia Operacional
- 5 níveis: Display (1.5rem/700) → Headline (1.25rem/600) → Title (1rem) → Body (0.8125rem) → Label (0.75rem/500) → Caption (0.625rem)
- Font: Inter (sans), JetBrains Mono (mono/data)
- Labels: UPPERCASE, tracking 0.08em
- Métricas: tabular-nums, font-bold

### R8 — Anti-SaaS Identity
- NUNCA: fundo claro, cards sem glass, sidebar plana, header gradiente roxo-rosa
- NUNCA: breadcrumbs, tabs como navegação principal, 20+ cards iguais
- NUNCA: "Bem-vindo ao Dashboard", "Carregando..." genérico
- SEMPRE: glassmorphism, ilhas temáticas, Aurora presente, mundo vivo

### R9 — Neurocompatibilidade TDAH
- Missão atual SEMPRE visível (10-seg rule)
- Próxima ação óbvia e clicável
- Empty states amigáveis (sem culpa)
- Uma coisa por vez
- Hierarquia clara, zero clutter

### R10 — Performance Gates
- Apenas `transform` + `opacity` nas animações
- Máx 5-8 elementos com backdrop-blur simultâneo
- `will-change: transform` em ilhas e nuvens
- Lazy load páginas de ilha
- Bundle < 200KB

## Próximo bloco

A4 — Anti-SaaS Rules Enforcement Plan
