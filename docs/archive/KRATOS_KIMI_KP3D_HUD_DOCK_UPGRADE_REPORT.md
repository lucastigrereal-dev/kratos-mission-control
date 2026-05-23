# KRATOS KIMI K-P3D HUD/DOCK UPGRADE REPORT

**Data:** 2026-05-14 | **Branch:** `feature/kratos-kimi-visual-wave-2`

---

## 1. Objetivo

Refinar a shell de comando: TopHud mais presente, Sidebar com navegação tátil, Bottom Dock com chips integrados ao glass system, estados de conexão com feedback visual imediato.

---

## 2. Material Kimi Usado

| Documento | Uso |
|-----------|-----|
| `VISUAL_BIBLE.md` | Glass hierarchy, glow de navegação ativa, transições sutis |
| `ANTI_SAAS_RULES.md` | "Navegação que respira" — hover com propósito, sem poluição |
| `KIMI_COMPONENT_MAP.md` | "Patch mínimo, zero novos componentes" |

---

## 3. Arquivos Alterados

| Arquivo | Mudança |
|---------|---------|
| `frontend/src/index.css` | ~40 linhas de CSS (TopHud, Sidebar, BottomDock, connection states) |

**Nenhum componente novo ou TSX alterado. Zero dependências novas.**

---

## 4. Melhorias Visuais

### TopHud
- Glass mais forte: `--kr-glass-blur` → `--kr-glass-blur-strong`
- Brand badge: border com azure tint (12%) + box-shadow glow sutil (6%)
- Greeting: `font-weight: 500` → `600`
- Transição em `border-bottom-color` para troca suave entre estados

### Sidebar
- Hover: adicionado `transform: translateX(2px)` para sensação tátil de navegação
- Item ativo: box-shadow interno mais visível (8% → 12% azure)
- Indicador ativo (`::before`): altura 18px → 20px, double glow (10px + 20px radius)
- Divider: gradiente horizontal com fade nas pontas (transparent → border → transparent)

### Bottom Dock
- Squad chips: background `--kr-glass-bg-light` + border sutil
- Hover nos chips: border mais forte + background `--kr-glass-bg`

### Estados de Conexão
- Offline: border-bottom coral 50% opacity + box-shadow glow
- Reconnecting: border-bottom gold 50% + box-shadow glow
- Polling/Fallback: border-bottom yellow 30% (novo seletor)
- Transição suave entre estados via `transition` no `.kr-top-hud`

---

## 5. Dados Reais Preservados

| Hook/Contrato | Status |
|---------------|--------|
| `useLiveKratos` | Intocado |
| `useApi` | Intocado |
| SSE `/live/stream` | Intocado |
| `SourceBadge` | Intocado |
| `KratosContext` | Intocado |
| `AuroraPanel` | Intocado |
| `KratosTopHud` | Intocado |
| `KratosSidebar` | Intocado |

---

## 6. Build

| Métrica | Antes (K-P3C) | Depois |
|---------|---------------|--------|
| Módulos | 68 | 68 |
| Erros | 0 | 0 |
| Tempo | 660ms | 654ms |
| CSS | 55.34 KB | 57.55 KB (+2.21 KB) |
| JS | 206.97 KB | 206.97 KB (inalterado) |

---

## 7. Backend Diff

**VAZIO.** Zero arquivos backend alterados.

---

## 8. Próxima Microfase Recomendada

**K-P3E — Island Cards / System Worlds** (cards de contexto das ilhas, mini-dashboards)
