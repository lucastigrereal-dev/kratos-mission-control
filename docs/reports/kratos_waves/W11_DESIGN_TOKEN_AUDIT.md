# W11 — Design Token Audit

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE (sem alterações)

---

## Objetivo

Auditar o design system de tokens: cobertura, uso, tokens órfãos,
consistência de nomenclatura.

---

## Tokens definidos (22)

### Superfícies (5)
| Token | Hex | Uso |
|---|---|---|
| `--kratos-surface-0` | #0C0C0E | 12 |
| `--kratos-surface-1` | #111114 | 3 |
| `--kratos-surface-2` | #17171B | 11 |
| `--kratos-surface-3` | #1E1E24 | 40 |
| `--kratos-surface-4` | #26262F | 4 |

### Texto (3)
| Token | Hex | Uso |
|---|---|---|
| `--kratos-text-primary` | #F0F0F2 | 67 |
| `--kratos-text-secondary` | #8A8A9A | 54 |
| `--kratos-text-muted` | #4A4A5A | 122 |

### Semânticas (6)
| Token | Hex | Uso |
|---|---|---|
| `--kratos-ok` | #22C55E | 9 |
| `--kratos-warn` | #F59E0B | 6 |
| `--kratos-critical` | #EF4444 | 10 |
| `--kratos-info` | #3B82F6 | 8 |
| `--kratos-ghost` | #6366F1 | 13 |
| `--kratos-accent` | #818CF8 | 18 |

### Bordas (4)
| Token | Cor | Uso |
|---|---|---|
| `--kratos-border` | rgba(255,255,255,0.06) | 55 |
| `--kratos-border-on-focus` | rgba(34,197,94,0.15) | 2 |
| `--kratos-border-off-focus` | rgba(239,68,68,0.15) | 2 |
| `--kratos-border-live` | rgba(99,102,241,0.15) | 16 |

### Tipografia (2)
| Token | Valor | Uso |
|---|---|---|
| `--kratos-font-sans` | Inter, ... | 2 |
| `--kratos-font-mono` | JetBrains Mono, ... | 4 |

---

## Issues encontrados

### 1. `--kratos-risk` — USADO mas NÃO DEFINIDO

**Local:** `src/components/kratos/views/DashboardView.tsx:165`
```tsx
style={{ color: "var(--kratos-risk)" }}
```

Este token não existe em `src/styles.css`. No runtime, a variável CSS
não definida herda o valor `initial` (transparente), possivelmente
tornando o ícone AlertTriangle invisível.

**Severidade:** Média
**Correção sugerida:** `--kratos-warn` (ícone de alerta de atraso)

---

## Cobertura

- 22/22 tokens definidos são usados em componentes (100% de cobertura)
- 1 token usado mas não definido (`--kratos-risk`)
- Tokens mais usados: `text-muted` (122), `text-primary` (67), `border` (55)
- Token menos usado: `border-on-focus` (2), `border-off-focus` (2)

---

## Nomenclatura

Padrão consistente: `--kratos-{categoria}-{nível|intensidade}`

| Categoria | Exemplos |
|---|---|
| surface | surface-0 a surface-4 (escala de luminosidade) |
| text | primary, secondary, muted (escala de ênfase) |
| border | border, border-live, border-on-focus, border-off-focus |
| semantic | ok, warn, critical, info, ghost, accent |
| font | sans, mono |
