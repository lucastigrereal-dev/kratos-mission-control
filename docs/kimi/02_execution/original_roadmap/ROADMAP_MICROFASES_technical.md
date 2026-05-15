# Roadmap de Microfases

Este roadmap lista as microfases propostas para evoluir o frontend do KRATOS a partir do material Kimi.  Cada microfase deve ser executada de forma independente, com validação e commit próprios.  Nunca avance para a próxima fase sem encerrar a anterior.

## Fases Iniciais

1. **FRONT-KIMI-00 — Setup**
   - Criar a estrutura `docs/kimi/` e importar todo o material bruto fornecido pelo Kimi.
   - Organizar roadmap, mapa de componentes e registros de adoção.
   - Definir a microfase seguinte no arquivo `KIMI_NEXT_MICROPHASE.md`.

2. **FRONT-KIMI-01 — UI Primitives Seguras**
   - Implementar/adaptar os primitives ausentes: `EmptyState`, `ErrorState`, `ProgressRing`, `MetricBadge`.
   - Adicionar tokens necessários se faltarem.
   - Validar com build e testes backend.

3. **FRONT-KIMI-02 — Tokens e Glass Consistency**
   - Limpar cores hardcoded existentes no frontend.
   - Aplicar tokens de glass e sombra definidos em `DESIGN_TOKENS.md`.
   - Ajustar `SourceBadge` e `KratosBottomDock` para usar tokens de opacidade corretos.

4. **FRONT-KIMI-03 — World Map Polish**
   - Analisar o componente `KratosWorldMap` existente.
   - Incorporar trechos do Kimi: `OceanBackdrop`, `CloudLayer`, `IslandBridge`, centralização e depth.
   - Não recriar o mapa do zero; adaptar cores e sombras.

5. **FRONT-KIMI-04 — HUD Assembly Polish**
   - Ajustar `KratosTopBar`, `KratosSidebar`, `KratosRightRail`, `KratosBottomDock`, `MissionBar`.
   - Aplicar tokens e glass.
   - Adicionar barra de energia, nível e XP se ausentes.

6. **FRONT-KIMI-05 — Aurora Panel Polish**
   - Revisar `AuroraPanel` existente.
   - Integrar orb holográfico e design de cards para riscos, checkpoints e recomendações.
   - Não virar chat ainda.

7. **FRONT-KIMI-06 — Bottom Dock / MissionBar Polish**
   - Melhorar `MissionBar` com progresso, squads, botão continuar e badges.
   - Garantir legibilidade e foco.

## Fases de Ilhas Internas

8. **FRONT-KIMI-07 — OMNIS Lab Page**
   - Criar visual placeholder para `OmnisLabPage`.  Exibir status do OMNIS read‑only (jobs running, skills disponíveis).
   - Não executar automações.

9. **FRONT-KIMI-08 — Akasha Vault Page**
   - Esboçar visual do banco de conhecimento (Akasha).  Listar categorias, resumos e anexos sem implementação de RAG.

10. **FRONT-KIMI-09 — Agência / Estúdio Page**
   - Página para marketing, marca e conteúdo.  Mostrar agenda, calendários e campanhas.

11. **FRONT-KIMI-10 — Arena Comercial Page**
   - Páginas de vendas, negociações e conquistas.  Aplicar `MetricBadge` e `ProgressRing` para metas.

12. **FRONT-KIMI-11 — Forja / Corpo Page**
   - Foco em saúde, treino e disciplina.  Visualização de metas de exercício.

13. **FRONT-KIMI-12 — Observatório Page**
   - Página de ideias e inspirações.  Grid de cards, fluxos de nota.

14. **FRONT-KIMI-13 — Vila Viva Page**
   - Área de vida pessoal, família e filhos.  Conteúdo mais acolhedor e lúdico.

15. **FRONT-KIMI-14 — Tesouro / Finanças Page**
   - Dashboard de finanças pessoais.  Uso cuidadoso de tons verdes e dourados.

16. **FRONT-KIMI-15 — Visual QA + Review**
   - Comparar prints do front com mockups originais.
   - Preencher checklists de QA e Acceptance.

Cada microfase deve atualizar o `KIMI_ADOPTION_LOG.md` e definir a próxima microfase em `KIMI_NEXT_MICROPHASE.md`.