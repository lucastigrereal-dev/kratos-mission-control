---
name: motion-guardian
description: "Garante que animações respeitem prefers-reduced-motion, tenham duração controlada e não compitam por atenção."
metadata:
  type: skill
  tier: analytics
  project: kratos-mission-control
  scope: frontend
---

# motion-guardian

Garante que TODA animação no frontend KRATOS:
1. Respeite `prefers-reduced-motion: reduce`
2. Tenha duração controlada por tokens
3. Não compita com o foco do operador (TDAH-first)

## Tokens de movimento

| Token | Valor | Uso |
|-------|-------|-----|
| `--kr-duration-instant` | `0.08s` | Transições imperceptíveis |
| `--kr-duration-fast` | `0.15s` | Hover, focus, chips |
| `--kr-duration-normal` | `0.25s` | Abrir/fechar painéis |
| `--kr-duration-medium` | `0.4s` | Transições de página |
| `--kr-duration-slow` | `0.6s` | Revelações graduais |
| `--kr-duration-float` | `6s` | Ilhas flutuando |
| `--kr-duration-cloud` | `40s` | Nuvens passando |
| `--kr-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Elementos que "pulam" |
| `--kr-ease-smooth` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrada/saída suave |
| `--kr-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transições simétricas |

## Reduced motion (já implementado em kratos-tokens.css)
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --kr-duration-float: 0s;
    --kr-duration-cloud: 0s;
    --kr-duration-slow: 0s;
  }
}
```

## Regras para animações novas
- DURAÇÃO MÁXIMA: 0.6s (`--kr-duration-slow`). Nada acima disso.
- QUANTIDADE MÁXIMA: 2 animações simultâneas visíveis. Nunca 3+.
- SEMPRE adicionar a animação ao bloco `prefers-reduced-motion` em index.css
- NUNCA usar `animation: infinite` sem pausa — loops eternos cansam o cérebro TDAH
- NUNCA animar `width`, `height`, `top`, `left` — usar `transform` e `opacity` (GPU-composited)
- PREFERIR transições CSS a keyframes (mais fácil de desligar com reduced-motion)

## Exemplo correto
```css
.meu-elemento {
  transition: transform var(--kr-duration-fast) var(--kr-ease-smooth);
}
.meu-elemento:hover {
  transform: scale(1.02);
}

@media (prefers-reduced-motion: reduce) {
  .meu-elemento {
    transition: none;
  }
}
```
