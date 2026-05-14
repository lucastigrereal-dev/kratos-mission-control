---
name: token-enforcer
description: "Garante que todo componente visual use exclusivamente tokens CSS KRATOS (var(--kr-*)), nunca cores hex inline."
metadata:
  type: skill
  tier: strategy
  project: kratos-mission-control
  scope: frontend
  protected_files:
    - styles/kratos-tokens.css
    - index.css
---

# token-enforcer

Garante que o design system KRATOS seja a única fonte de verdade visual. Nenhuma cor, sombra, ou espaçamento hardcoded.

## Regra de ouro
**CSS custom properties (`var(--kr-*)`) sempre. `style={{ color: "#xxx" }}` nunca.**

## Tokens por categoria

### Cores de fundo
`--kr-bg-abyss`, `--kr-bg-deep`, `--kr-bg-primary`, `--kr-bg-secondary`, `--kr-bg-tertiary`, `--kr-bg-card`, `--kr-bg-card-hover`

### Cores de texto
`--kr-text-primary`, `--kr-text-secondary`, `--kr-text-muted`, `--kr-text-disabled`, `--kr-text-inverse`

### Cores de sistema
`--kr-blue-400/500/600`, `--kr-purple-400/500/600`, `--kr-cyan-400/500`, `--kr-teal-400/500`, `--kr-green-400/500/600`, `--kr-yellow-400/500`, `--kr-orange-400/500`, `--kr-red-400/500/600`

### Cores semânticas
`--kr-color-aurora` (purple), `--kr-color-energy` (cyan), `--kr-color-xp` (teal), `--kr-color-hp` (green), `--kr-color-mission` (blue), `--kr-color-risk` (red), `--kr-color-warning` (yellow), `--kr-color-info` (blue), `--kr-color-success` (green), `--kr-color-live` (green)

### Vidro
`--kr-glass-bg`, `--kr-glass-bg-strong`, `--kr-glass-bg-light`, `--kr-glass-border`, `--kr-glass-border-strong`, `--kr-glass-blur`, `--kr-glass-blur-strong`

### Espaçamento
`--kr-space-hud: 8px`, `--kr-space-section: 16px`, `--kr-space-panel: 20px`, `--kr-space-page: 32px`

### Tipografia
`--kr-text-xs: 0.6875rem`, `--kr-text-sm: 0.75rem`, `--kr-text-base: 0.8125rem`, `--kr-text-md: 0.875rem`, `--kr-text-lg: 1rem`, `--kr-text-xl: 1.125rem`, `--kr-text-2xl: 1.375rem`, `--kr-text-3xl: 1.75rem`
`--kr-font-sans: "Inter", system-ui, ...`, `--kr-font-mono: "JetBrains Mono", ...`

### Movimento
`--kr-duration-instant: 0.08s`, `--kr-duration-fast: 0.15s`, `--kr-duration-normal: 0.25s`, `--kr-duration-slow: 0.6s`
`--kr-ease-spring`, `--kr-ease-smooth`, `--kr-ease-in-out`

### Ilhas
`--kr-island-central-size`, `--kr-island-large-size`, `--kr-island-medium-size`, `--kr-island-small-size`
`--kr-isle-moss`, `--kr-isle-fern`, `--kr-isle-lime`, `--kr-isle-glow`
`--kr-earth-top`, `--kr-earth-mid`, `--kr-earth-base`, `--kr-earth-rock`
`--kr-castle-stone`, `--kr-castle-roof`, `--kr-castle-portal`

## Processo para adicionar token novo
1. Listar o token proposto com nome, valor, e motivo
2. Pedir aprovação explícita (NUNCA adicionar sem aprovação)
3. Adicionar em `kratos-tokens.css` no `:root`
4. Se precisar de classe CSS nova, adicionar em `index.css`
5. Atualizar esta doc com o novo token

## Validação
```bash
# Procurar cores hex inline (devem ser zero resultados em componentes)
grep -r "style.*#[0-9a-fA-F]" frontend/src/components/ frontend/src/pages/
```
