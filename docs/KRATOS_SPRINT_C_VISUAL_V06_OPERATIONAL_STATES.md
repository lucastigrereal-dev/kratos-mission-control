# KRATOS Sprint C — V06 Operational States Polish

**Data:** 2026-05-17

## Changes

### ErrorState (`src/components/kratos/base/ErrorState.tsx`)

Added `variant` prop com 4 estados operacionais padronizados:

| Variant | Icon | Color | Default Title | Use Case |
|---------|------|-------|---------------|----------|
| `error` | AlertTriangle | Critical (red) | "Algo falhou" | Erro de carregamento/falha |
| `missing_config` | Wrench | Warn (amber) | "Configuração pendente" | Token/API não configurado |
| `external_unavailable` | Unplug | Muted (gray) | "Serviço externo indisponível" | API externa offline |
| `degraded` | SignalLow | Warn (amber) | "Funcionando parcialmente" | Serviço com saúde parcial |

**Before:** Apenas ícone AlertTriangle vermelho para qualquer erro.
**After:** Cada estado tem ícone, cor e mensagem padrão apropriados.

Added `role="alert"` para screen readers.

### Backward compatibility
- `variant` é opcional, default `"error"` — nenhum call site quebrado
- Props `title`, `description`, `hint` continuam funcionando como antes

## Verification

- [x] `bun run build` — PASS (3.24s)
- [x] `bun test tests/` — 270 pass / 0 fail
- [x] Nenhum call site existente quebrado
- [x] 4 variants mapeadas com ícones distintos
