# KIMI_NEXT_MICROPHASE.md

## Próxima microfase autorizada

```txt
FRONT-KIMI-P1-C — CSS Token Completion
```

## Objetivo

Tokenizar rgba/hex residuais em `frontend/src/index.css` criando tokens novos em `frontend/src/styles/kratos-tokens.css`.

## Escopo permitido

- `frontend/src/styles/kratos-tokens.css`
- `frontend/src/index.css`
- `docs/KRATOS_FRONTEND_P1C_TOKEN_COMPLETION_REPORT.md`

## Escopo proibido

- `backend/`
- qualquer `.tsx`
- hooks
- `package.json`
- dependências novas
- Framer Motion
- lucide-react
- clsx/cn
- CVA

## Prompt executor

```text
Você está na ABA 1 — KRATOS FRONT P1-C TOKEN COMPLETION.

Leia docs/kimi/KIMI_EXECUTION_ROADMAP.md e docs/kimi/KIMI_COMPONENT_MAP.md.
Execute apenas P1-C.
Não toque em backend, hooks, componentes .tsx ou package.json.
Tokenize rgba/hex residuais em index.css criando tokens --kr-* em kratos-tokens.css.
Rode npm run build.
Gere docs/KRATOS_FRONTEND_P1C_TOKEN_COMPLETION_REPORT.md.
Pare antes de commitar.
```
