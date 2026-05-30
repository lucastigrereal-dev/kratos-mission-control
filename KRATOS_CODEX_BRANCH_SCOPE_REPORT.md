# KRATOS CODEX BRANCH AND SCOPE REPORT

## Branch atual
feature/kratos-1-frontend-visual

## Arquivos criados
1. `docs/kratos-visual/KRATOS_1_FRONTEND_CODEX_SCOPE.md` - Escopo do trabalho frontend visual
2. `docs/kratos-visual/KRATOS_CURRENT_FRONTEND_AUDIT.md` - Auditoria do frontend atual

## Próximos arquivos a alterar
1. `frontend/src/index.css` - Adicionar design tokens CSS
2. `frontend/src/styles/` - Criar estilos base
3. `frontend/src/components/layout/KratosVisualShell.tsx` - Aprimorar AppShell
4. `frontend/src/components/world/KratosWorldMap.tsx` - Aprimorar WorldMap
5. `frontend/src/components/world/FloatingIsland.tsx` - Aprimorar ilhas flutuantes
6. `frontend/src/components/ui/` - Criar componentes UI base
7. `frontend/src/pages/VisaoGeralPage.tsx` - Criar World MVP

## Riscos
1. **Three.js já instalado** - O prompt diz "NÃO instale Three.js na V1" mas já está instalado. Precisamos ter cuidado para não criar versões duplicadas ou conflitantes.
2. **Backend complexo** - 2569 arquivos Python no backend. Devemos manter o foco apenas no frontend visual.
3. **Conexão SSE ativa** - O hook `useLiveKratos.ts` já está implementado e conectando. Devemos preservar essa funcionalidade.
4. **Mission Lens endpoint** - O endpoint `/mission/lens` já existe no backend. Devemos integrá-lo corretamente sem modificá-lo.
5. **Build requirements** - O build deve continuar passando após todas as modificações.

## Próximo passo
Seguir para o próximo prompt: `03_FOUNDATION_DESIGN_SYSTEM.md` para implementar a base visual do KRATOS.