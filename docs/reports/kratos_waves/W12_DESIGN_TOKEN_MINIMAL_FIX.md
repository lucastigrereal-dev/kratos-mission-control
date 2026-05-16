# W12 — Design Token Minimal Fix

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE

---

## Objetivo

Corrigir o gap encontrado na W11: token `--kratos-risk` usado sem definição.

---

## Mudança

### `src/components/kratos/views/DashboardView.tsx:165`

```diff
- style={{ color: "var(--kratos-risk)" }}
+ style={{ color: "var(--kratos-warn)" }}
```

**Contexto:** Ícone `AlertTriangle` na barra de alerta de compromissos atrasados.

**Justificativa:** `--kratos-warn` (#F59E0B, âmbar) é o token semântico correto
para situações de warning/atenção. O ícone de alerta de atraso é um warning,
não um erro crítico.

---

## Impacto

- Ícone AlertTriangle agora visível com cor âmbar (#F59E0B)
- Antes: cor herdada como `transparent`/fallback (ícone invisível)
