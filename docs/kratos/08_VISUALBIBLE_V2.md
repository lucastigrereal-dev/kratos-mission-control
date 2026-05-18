# KRATOS — Visual Bible v1.0

> Este documento é a lei visual do projeto. Nenhuma decisão de cor, espaçamento,
> tipografia, blur ou motion pode contradizê-lo. A Manus deve ler este arquivo
> inteiro antes de escrever qualquer linha de código.

---

## 1. IDENTIDADE VISUAL

**Conceito:** Centro de comando militar-orgânico. Não é SaaS corporativo.
Não é dashboard de startup. É uma sala de guerra viva, com peso e presença.

**Palavras que guiam cada decisão:**
- Gravidade
- Foco
- Controle
- Organicidade (não robótico)
- Urgência silenciosa

---

## 2. PALETA DE CORES

### Superfícies (Dark-first obrigatório)

| Token | Hex | Uso |
|---|---|---|
| `--kratos-bg` | `#0a0a0f` | Fundo absoluto da página |
| `--kratos-surface` | `#111118` | Cards e painéis base |
| `--kratos-surface-2` | `#17171f` | Camada elevada de cards |
| `--kratos-surface-3` | `#1e1e28` | Hover states, tooltips |
| `--kratos-glass` | `rgba(17,17,24,0.72)` | Glassmorphism base |
| `--kratos-border` | `rgba(255,255,255,0.06)` | Bordas sutis |
| `--kratos-divider` | `rgba(255,255,255,0.04)` | Divisores internos |

### Acento Primário (Roxo-Missão)

| Token | Hex | Uso |
|---|---|---|
| `--kratos-primary` | `#7c3aed` | CTA principal, missão ativa |
| `--kratos-primary-glow` | `rgba(124,58,237,0.20)` | Glow aura em torno do elemento ativo |
| `--kratos-primary-muted` | `rgba(124,58,237,0.12)` | Background de badges de missão |
| `--kratos-primary-hover` | `#6d28d9` | Hover no primário |

### Semântica de Status

| Token | Hex | Quando usar |
|---|---|---|
| `--kratos-success` | `#10b981` | Missão concluída, XP ganho |
| `--kratos-warning` | `#f59e0b` | Prazo próximo, alerta moderado |
| `--kratos-danger` | `#ef4444` | Prazo crítico, falha, bloqueio |
| `--kratos-info` | `#3b82f6` | Informação neutra, tooltips |
| `--kratos-ghost` | `rgba(255,255,255,0.35)` | Texto desabilitado, placeholders |

### Aurora / Ambient (uso restrito)

| Token | Valor | Onde |
|---|---|---|
| `--kratos-aurora-a` | `#7c3aed` | Blob de fundo TopBar/Hero |
| `--kratos-aurora-b` | `#0ea5e9` | Blob secundário, movimento lento |
| `--kratos-aurora-c` | `#10b981` | Pulso de missão concluída |

> ⚠️ Aurora NUNCA cobre conteúdo. Sempre `z-index: 0`, `opacity: 0.12 máximo`,
> `filter: blur(80px)`, `pointer-events: none`.

---

## 3. TIPOGRAFIA

### Fontes Obrigatórias

```css
/* Carregar via Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

--font-body: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Hierarquia Tipográfica

| Elemento | Font | Size | Weight | Color |
|---|---|---|---|---|
| Título de missão ativa | Inter | 22px | 700 | `#ffffff` |
| Heading de seção | Inter | 16px | 600 | `rgba(255,255,255,0.90)` |
| Body padrão | Inter | 14px | 400 | `rgba(255,255,255,0.75)` |
| Label secundária | Inter | 12px | 500 | `rgba(255,255,255,0.50)` |
| Micro-label / badge | Inter | 11px | 600 uppercase | `rgba(255,255,255,0.40)` |
| Código / ID / stats | JetBrains Mono | 13px | 400 | `#7c3aed` |

> ⚠️ Tamanho mínimo absoluto: 11px. Nunca abaixo disso.
> Body text NUNCA em branco puro `#ffffff` — sempre `rgba(255,255,255,0.75)`.

---

## 4. GLASSMORPHISM — REGRAS EXATAS

```css
/* Card glass padrão */
.glass-card {
  background: rgba(17, 17, 24, 0.72);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}

/* Card glass elevado (hover / ativo) */
.glass-card-elevated {
  background: rgba(30, 30, 40, 0.80);
  backdrop-filter: blur(24px) saturate(1.6);
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.40);
  border-radius: 16px;
}

/* Glass crítico (alerta / missão urgente) */
.glass-card-critical {
  background: rgba(239, 68, 68, 0.08);
  backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid rgba(239, 68, 68, 0.20);
  border-radius: 16px;
}
```

> ⚠️ `backdrop-filter` SEMPRE precisa de `-webkit-backdrop-filter` junto.
> NUNCA use `blur()` acima de 32px — vira borrão ilegível.
> NUNCA sobreponha dois elementos com `backdrop-filter` na mesma stack sem testar.

---

## 5. ESPAÇAMENTO — SISTEMA 4PX

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

**Regras de uso:**
- `--space-1` a `--space-3`: ícones, badges, gaps internos
- `--space-4` a `--space-6`: padding de cards, gaps de seção
- `--space-8` a `--space-12`: separação entre módulos
- `--space-16`+: padding de página, margens de layout

---

## 6. BORDER RADIUS

```css
--radius-sm: 6px;    /* badges, chips, inputs */
--radius-md: 10px;   /* botões, small cards */
--radius-lg: 16px;   /* cards padrão, painéis */
--radius-xl: 24px;   /* modais, drawers grandes */
--radius-full: 9999px; /* avatares, status dots */
```

> Regra de nesting: inner-radius = outer-radius - padding.
> Card de 16px com 12px de padding → elemento interno: 4px radius.

---

## 7. SOMBRAS

```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.30);
--shadow-md: 0 4px 16px rgba(0,0,0,0.40);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.50);
--shadow-glow-primary: 0 0 20px rgba(124,58,237,0.25);
--shadow-glow-success: 0 0 20px rgba(16,185,129,0.20);
--shadow-glow-danger: 0 0 20px rgba(239,68,68,0.20);
```

---

## 8. MOTION — REGRAS DE ANIMAÇÃO

### Curvas e Durações

```css
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);   /* entrada de elementos */
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);     /* saída de elementos */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    /* transições de estado */

--duration-fast: 120ms;    /* hover, focus */
--duration-normal: 220ms;  /* entrada de cards */
--duration-slow: 380ms;    /* modais, drawers */
--duration-aurora: 8000ms; /* animação de background aurora */
```

### Regras Inegociáveis

- NUNCA `display: none` → `display: block` sem transição
- SEMPRE usar `opacity` + `transform` para animações (GPU)
- NUNCA animar `width`, `height`, `top`, `left` (causa layout thrash)
- Aurora SEMPRE com `animation-duration` > 6s para parecer orgânica
- `prefers-reduced-motion`: todas as animações param, sem exceção

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. ESTADOS DE COMPONENTES

Todo componente interativo DEVE ter todos estes estados implementados:

| Estado | Regra visual |
|---|---|
| `default` | Glass base, border 0.06 opacity |
| `hover` | `translateY(-2px)`, border 0.10, shadow-md |
| `active/pressed` | `translateY(0)`, shadow-sm, brightness 0.90 |
| `focus-visible` | outline 2px `--kratos-primary`, offset 3px |
| `disabled` | `opacity: 0.38`, `cursor: not-allowed`, sem hover |
| `loading` | skeleton shimmer substituindo o conteúdo |
| `error` | border `--kratos-danger` 0.30, background danger 0.06 |
| `success` | border `--kratos-success` 0.30, background success 0.06 |

---

## 10. SKELETON LOADERS

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
```

> Todo estado de loading usa skeleton. NUNCA spinner centralizado na tela toda.

---

## 11. ESTADOS VAZIOS (EMPTY STATES)

Todo empty state deve ter:
1. Ícone (Lucide, 40px, `--kratos-ghost`)
2. Título (16px, semibold, `rgba(255,255,255,0.70)`)
3. Descrição (14px, `rgba(255,255,255,0.45)`, max 2 linhas)
4. CTA quando aplicável

NUNCA deixar apenas texto "Nenhum item encontrado".

---

## 12. PROIBIÇÕES ABSOLUTAS

❌ Gradientes em botões (use cor sólida)
❌ Colored side-borders em cards (é visual de SaaS 2015)
❌ Background branco ou cinza claro em qualquer elemento
❌ Blur acima de 32px
❌ Mais de 2 fontes diferentes
❌ Cores hardcoded fora dos tokens CSS
❌ `box-shadow` com cor preta pura `rgba(0,0,0,1)`
❌ Ícones decorativos em círculos coloridos
❌ Emoji como elemento de design
❌ Qualquer coisa que pareça Notion, Linear ou dashboard SaaS genérico
❌ Aurora cobrindo conteúdo ou com opacity > 0.15
❌ Animações acima de 600ms (exceto aurora de fundo)
