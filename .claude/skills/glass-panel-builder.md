---
name: glass-panel-builder
description: "Cria painéis com efeito glassmorphism seguindo o design system KRATOS (blur, transparência, bordas sutis)."
metadata:
  type: skill
  tier: core
  project: kratos-mission-control
  scope: frontend
  tokens: kratos-tokens.css
---

# glass-panel-builder

Constrói painéis glassmorphism consistentes com o KRATOS Design System.

## Tokens de vidro disponíveis

| Token | Valor padrão | Uso |
|-------|-------------|-----|
| `--kr-glass-bg` | `rgba(12, 18, 36, 0.55)` | Fundo de painel padrão |
| `--kr-glass-bg-strong` | `rgba(12, 18, 36, 0.78)` | Fundo mais opaco (hover, active) |
| `--kr-glass-bg-light` | `rgba(12, 18, 36, 0.3)` | Fundo mais translúcido (tooltips) |
| `--kr-glass-border` | `rgba(255, 255, 255, 0.08)` | Borda sutil |
| `--kr-glass-border-strong` | `rgba(255, 255, 255, 0.14)` | Borda mais visível |
| `--kr-glass-blur` | `12px` | Blur padrão |
| `--kr-glass-blur-strong` | `20px` | Blur mais intenso |
| `--kr-shadow-glass` | `0 4px 16px rgba(0,0,0,0.35)` | Sombra de vidro |

## Classes CSS reutilizáveis (já existem em index.css)
- `.glass-panel` — painel vidro completo (bg + blur + border + shadow)
- `.kr-card` — card padrão com hover
- `.kr-chip` — chip/badge inline

## Regras
- NUNCA usar `backdrop-filter: blur(...)` inline — usar os tokens `var(--kr-glass-blur)` ou a classe `.glass-panel`
- NUNCA usar opacidade explícita em rgba inline — usar tokens
- SEMPRE testar com `prefers-reduced-motion: reduce` (blur pode causar náusea em algumas pessoas)
- SEMPRE verificar contraste: texto sobre vidro precisa de `--kr-text-primary`, nunca `--kr-text-muted`

## Exemplo correto
```tsx
<div className="glass-panel" style={{ padding: "var(--kr-space-panel)" }}>
  <h6>TÍTULO</h6>
  <p style={{ color: "var(--kr-text-secondary)" }}>Conteúdo</p>
</div>
```
