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