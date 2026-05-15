# DESIGN TOKENS KRATOS

Este arquivo contém tokens de design derivados das especificações do Kimi.  Os valores aqui definidos devem ser incorporados ao `tailwind.config.ts` ou às classes utilitárias do KRATOS.  Ao aplicar tokens, preserve a nomenclatura e evite duplicar paletas existentes.

## Paleta cromática

```
colors: {
  kratos: {
    ocean: { DEFAULT: "#2563EB", deep: "#1E40AF", dark: "#1E3A8A" },
    sky: { DEFAULT: "#60A5FA", light: "#DBEAFE" },
    island: { grass: "#22C55E", earth: "#D97706" },
    castle: { stone: "#E2E8F0", roof: "#EF4444", gold: "#F59E0B", shield: "#1E3A8A" },
    hud: { glass: "rgba(15,23,42,0.75)", border: "rgba(255,255,255,0.10)" },
    accent: { energy: "#FACC15", xp: "#A855F7", online: "#4ADE80", progress: "#06B6D4" },
    omnis: { DEFAULT: "#7C3AED", glow: "#8B5CF6", label: "#C4B5FD", neon: "#06B6D4" },
    agencia: { DEFAULT: "#F97316", glow: "#FB923C", label: "#FDBA74" },
    akasha: { DEFAULT: "#059669", glow: "#10B981", label: "#6EE7B7", gold: "#F59E0B" },
    filosofia: { DEFAULT: "#7C3AED", glow: "#A855F7", label: "#C4B5FD" },
    financas: { DEFAULT: "#166534", glow: "#FACC15", label: "#4ADE80" },
    forja: { DEFAULT: "#475569", glow: "#EA580C", label: "#94A3B8" },
    observatorio: { DEFAULT: "#1E3A8A", glow: "#3B82F6", label: "#60A5FA" },
    vila: { DEFAULT: "#16A34A", glow: "#86EFAC", label: "#BBF7D0", warm: "#FEF3C7" },
    arena: { DEFAULT: "#DC2626", glow: "#F87171", label: "#FCA5A5" },
    nimbus: { DEFAULT: "#0EA5E9", glow: "#7DD3FC", label: "#BAE6FD", crystal: "#22D3EE" },
  }
}
```

## Glassmorphism

```
boxShadow: {
  "kratos-glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
  "kratos-glass-hover": "0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
  "kratos-island": "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
  "kratos-hud": "0 4px 24px rgba(0,0,0,0.5)",
  "glow-omnis": "0 0 40px rgba(139,92,246,0.3)",
  "glow-agencia": "0 0 40px rgba(249,115,22,0.25)",
  "glow-akasha": "0 0 40px rgba(16,185,129,0.3)",
  "glow-nimbus": "0 0 40px rgba(14,165,233,0.3)",
}
backdropBlur: { glass: "16px", panel: "24px" }
borderRadius: { glass: "16px", island: "24px", card: "20px", tech: "8px" }
```

## Motion & Keyframes

Definições de animação para flutuação e nuvens.  Preserve estas chaves ao ajustar Tailwind:

```
keyframes: {
  "float-slow": { "0%,100%": { transform: "translateY(0) rotateX(10deg)" }, "50%": { transform: "translateY(-12px) rotateX(10deg)" } },
  "float-medium": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
  "cloud-drift": { "0%": { transform: "translateX(-10vw)" }, "100%": { transform: "translateX(110vw)" } },
  "pulse-glow": { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "0.7" } },
  "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
},
animation: {
  "float-slow": "float-slow 6s ease-in-out infinite",
  "float-medium": "float-medium 5s ease-in-out infinite",
  "cloud-drift": "cloud-drift 120s linear infinite",
  "pulse-glow": "pulse-glow 4s ease-in-out infinite",
  "spin-slow": "spin-slow 10s linear infinite",
}
```

## Z-Index Hierarchy

| Layer | z-index | Elemento |
|---|---|---|
| Ocean | 0 | fixed |
| Sky | 10 | absolute |
| Ghost Islands | 15 | decorativas |
| Clouds | 20 | pointer-events-none |
| Bridges | 30 | SVG |
| Floating Islands | 40 | absolute |
| Central Castle | 50 | absolute |
| Island Labels | 60 | GlassPanel |
| Mission Banner | 70 | HTML overlay |
| Bottom Dock | 90 | fixed |
| HUD | 100 | fixed |

## Reduced Motion

Para acessibilidade, respeite `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-float-slow, .animate-float-medium, .animate-cloud-drift,
  .animate-pulse-glow, .animate-spin-slow {
    animation: none !important;
    transition: opacity 150ms ease !important;
  }
}
```

## Notas

* Tokens são seguros para modificar o visual, mas não altere propriedades de missão, backend ou qualquer lógica de negócios.
* Ao introduzir novas cores ou sombras, adicione primeiro aqui e atualize o Tailwind.