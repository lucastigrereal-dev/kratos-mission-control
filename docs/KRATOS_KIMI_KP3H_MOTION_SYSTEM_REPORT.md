# KRATOS KIMI K-P3H MOTION SYSTEM CSS REPORT

**Data:** 2026-05-14 | **Branch:** `feature/kratos-kimi-visual-wave-2`

---

## 1. Objetivo

Criar um sistema de motion CSS reutilizável — animações utilitárias com keyframes consistentes, durações padronizadas, easing uniforme, e respeito total a `prefers-reduced-motion`.

---

## 2. Material Kimi Usado

| Documento | Uso |
|-----------|-----|
| `ANTI_SAAS_RULES.md` | "Motion com propósito" — cada animação tem função clara, nunca decorativa |
| `VISUAL_BIBLE.md` | Escala de durações, easing consistente, stagger patterns |

---

## 3. Arquivos Alterados

| Arquivo | Mudança |
|---------|---------|
| `frontend/src/index.css` | ~90 linhas de motion system + reduced-motion coverage |

---

## 4. Sistema de Motion

### Keyframes (5 novos)

| Keyframe | Propósito | Duração |
|----------|-----------|---------|
| `kr-motion-breathe` | Opacidade respirando (estados idle) | 3s infinite |
| `kr-motion-attention` | Scale bounce sutil (CTAs, badges) | 0.8s once |
| `kr-motion-slide-in-right` | Entrada lateral (painéis, drawers) | 0.3s once |
| `kr-motion-slide-in-up` | Entrada inferior (cards, toasts) | 0.3s once |
| `kr-motion-fade-in` | Fade simples (imagens, overlays) | 0.3s once |
| `kr-motion-glow-pulse` | Box-shadow breathing (destaques) | 2.5s infinite |

### Classes Utilitárias

| Classe | Keyframe | Uso Típico |
|--------|----------|------------|
| `.kr-motion-enter` | `kr-state-enter` | Entrada padrão de componentes |
| `.kr-motion-breathe` | `kr-motion-breathe` | Indicadores idle, dots passivos |
| `.kr-motion-attention` | `kr-motion-attention` | CTAs, badges novos, alertas |
| `.kr-motion-slide-in-right` | `kr-motion-slide-in-right` | Painéis laterais, drawers |
| `.kr-motion-slide-in-up` | `kr-motion-slide-in-up` | Cards entrando, toasts |
| `.kr-motion-fade-in` | `kr-motion-fade-in` | Imagens, overlays modais |
| `.kr-motion-glow-pulse` | `kr-motion-glow-pulse` | Destaques pulsantes |

### Stagger System
- `.kr-motion-stagger > *` — aplica delays progressivos (0s → 0.3s)
- Cobre 5 filhos com incrementos de 60ms; 6+ filhos em 0.3s
- Útil para listas de cards, sinais Aurora, filas de tarefas

### Motion Tokens (já existentes)
- `--kr-duration-fast: 150ms` — micro-interações
- `--kr-duration-motion: 300ms` — entradas padrão
- `--kr-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)` — easing consistente

### Animação por Duração

| Duração | Keyframes |
|---------|-----------|
| 150ms (fast) | Transições hover/focus |
| 300ms (motion) | slide-in-right, slide-in-up, fade-in, state-enter |
| 600ms+ (slow) | attention (800ms), breathe (3s), glow-pulse (2.5s) |
| Infinite | breathe, glow-pulse, orb-float (5s), orb-ring (3-4s) |

---

## 5. Reduced Motion Coverage

Todas as 7 classes utilitárias + stagger são zeradas em `prefers-reduced-motion: reduce`:
```css
.kr-motion-enter, .kr-motion-breathe, .kr-motion-attention,
.kr-motion-slide-in-right, .kr-motion-slide-in-up,
.kr-motion-fade-in, .kr-motion-glow-pulse { animation: none; }
.kr-motion-stagger > * { animation-delay: 0s; }
```

---

## 6. Build

| Métrica | Antes (K-P3G) | Depois |
|---------|---------------|--------|
| Módulos | 68 | 68 |
| Erros | 0 | 0 |
| Tempo | 624ms | 641ms |
| CSS | 64.38 KB | 66.04 KB (+1.66 KB) |
| JS | 206.97 KB | 206.97 KB (inalterado) |

---

## 7. Backend Diff

**VAZIO.** Zero arquivos backend alterados.

---

## 8. Próxima Microfase Recomendada

**K-P3I — Responsive Layout** (breakpoints para tablet, mobile, ajustes de grid shell)
