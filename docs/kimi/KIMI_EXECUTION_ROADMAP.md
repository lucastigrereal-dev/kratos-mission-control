# KIMI_EXECUTION_ROADMAP.md — Ordem Oficial KRATOS Frontend

## Estado validado antes desta reorganização

- Visual shell já existe.
- Kimi deve ser tratado como **referência visual e técnica**, não como código para colar bruto.
- Próxima fase correta: **P1-C — CSS Token Completion**.

## Pipeline oficial

```txt
P1-A ✅  Visual consistency fixes já aplicado
P1-C 🔥 CSS Token Completion
P1-D 🧱 UI Primitives novos
P2-A ✨ Refinamento de primitives existentes
P2-B 📱 Navegação mobile + legenda do mundo
P3 🏝️ Páginas internas das ilhas
P4 🧭 HUD/Aurora polish
P5 ✅ Visual QA e screenshot review
```

## P1-C — CSS Token Completion

**Objetivo:** tokenizar rgba/hex residuais em `frontend/src/index.css`.

**Pode alterar:**
- `frontend/src/styles/kratos-tokens.css`
- `frontend/src/index.css`
- `docs/KRATOS_FRONTEND_P1C_TOKEN_COMPLETION_REPORT.md`

**Não pode alterar:**
- qualquer `.tsx`
- `backend/`
- hooks
- package.json

**Critério de aceite:**
- `npm run build` passa.
- `git diff HEAD -- backend/` vazio.
- Sem dependências novas.

## P1-D — UI Primitives Novos

Criar apenas componentes que não existem:
- `EmptyState.tsx`
- `ErrorState.tsx`
- `ProgressRing.tsx`
- `MetricBadge.tsx`

Usar `docs/kimi/03_component_reference/safe_primitives/` como referência, mas adaptar para:
- CSS transitions.
- Tokens `--kr-*`.
- Sem `any`.
- Sem Framer Motion.
- Sem CVA.

## P2-A — Refinamento de existentes

- `LoadingSkeleton.tsx` com shimmer CSS.
- `SectionTitle.tsx` com props aditivas `action` e `divider`.

## P2-B — Mobile / onboarding

- `IslandMiniCard.tsx`.
- `WorldMapLegend.tsx`.

## P3 — Island Pages

Usar `docs/kimi/03_component_reference/island_pages/` como base conceitual. Criar páginas por ilha só depois que P1-C/P1-D/P2 fecharem.

## Ordem original do Kimi

# Ordem de Execução Claude Code

Esta ordem descreve as principais ações que o Claude Code deve seguir ao trabalhar no frontend do KRATOS usando o pacote Kimi.  Antes de começar qualquer microfase, leia esta lista.

1. **Abrir o repo KRATOS**
   - Executar `git status --short`, `git branch --show-current` e `git rev-parse --show-toplevel` para confirmar o diretório correto.
2. **Verificar pendências**
   - Garantir que não haja alterações não commitadas fora da microfase atual.
3. **Ler `docs/kimi/KIMI_NEXT_MICROPHASE.md`**
   - Descobrir qual microfase executar em seguida.
4. **Ler roadmap e mapa de componentes**
   - Abrir `KIMI_EXECUTION_ROADMAP.md` e `KIMI_COMPONENT_MAP.md` para entender o escopo.
5. **Ler códigos brutos relevantes**
   - Navegar até o arquivo `KIMI_CODE_RAW_PART_XX` específico da microfase (e.g., tokens, primitives, world map, etc.).
6. **Mapear o frontend existente**
   - Verificar se o componente proposto já existe (`src/components`, `src/pages`).  Se existir, planejar adaptação em vez de duplicação.
7. **Implementar apenas o escopo autorizado**
   - Criar ou editar arquivos permitidos.  Não tocar em backend, SSE ou Mission Lens.
8. **Rodar validações**
   - `cd frontend && npm run build`
   - `cd ..\backend && python -m pytest -q`
   - Executar smoke tests se necessário.
9. **Atualizar registro**
   - Registrar o uso do código no `KIMI_ADOPTION_LOG.md`.
   - Definir a próxima microfase em `KIMI_NEXT_MICROPHASE.md`.
10. **Commit limpo**
   - Fazer `git add` seletivo nos arquivos alterados.
   - Garantir que `git diff --cached --name-only` não contenha backend ou arquivos proibidos.
   - Commitar com mensagem semântica (e.g., `feat(kratos): implement ui primitives`).
11. **Repetir**
   - Retornar ao passo 3 para a próxima microfase.

Seguir esta ordem reduz o risco de duplicar código, quebrar contratos ou criar mudanças irreversíveis.
