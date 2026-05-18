---
id: kratos-checkpoints-screen
name: Kratos Checkpoints Screen
description: Implementa a tela 'Checkpoints', focada na criação, visualização e gestão de snapshots de contexto do operador.
tags: [screen, checkpoints, context, save-game, neuro-ux, recovery]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Checkpoints Screen

## 1. Propósito
Esta skill é responsável por implementar a tela 'Checkpoints' (`Checkpoints.tsx`) no KRATOS Mission Control. O objetivo é fornecer ao operador a capacidade de criar, visualizar e gerenciar 'save-games' de seu contexto operacional, permitindo uma retomada de trabalho precisa e sem esforço. A tela deve ser neurocompatível, facilitando a navegação por históricos de contexto e a restauração de estados anteriores, minimizando a ansiedade de perda de foco [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar a página `Checkpoints.tsx`.
- Ao integrar dados de checkpoints do backend (e.g., `checkpoint_suggestion_service.py`, `context_checkpoint_service.py`).
- Ao implementar funcionalidades de criação manual de checkpoints, visualização de detalhes de checkpoints e restauração de estados.
- Ao exibir sugestões de checkpoints na tela 'Agora' ou 'Contexto'.

## 3. Quando NÃO Usar
- Para lógica de negócio específica de outras telas (e.g., `Agenda`, `Sistema`).
- Para a criação de componentes de UI genéricos que não são exclusivos da tela 'Checkpoints' (usar `kratos-design-system`).
- Para a configuração de aspectos fundamentais da aplicação (usar `kratos-foundation`).

## 4. Inputs Esperados
- Dados dos endpoints de checkpoints do backend: `/checkpoints` (GET, POST) [1].
- Sugestões de checkpoints do backend (`/mentor/context-signals` ou `live_snapshot`) [1].
- Interações do usuário para criar, visualizar ou restaurar checkpoints.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Checkpoints.tsx` (componente principal da tela).
- `frontend/src/lib/api.ts` (para métodos de API relacionados a checkpoints).
- `frontend/src/types/kratos.ts` (para tipagem dos dados de checkpoints).
- Componentes em `frontend/src/components/` que exibem informações de checkpoints (e.g., `CheckpointCard`, `CheckpointList`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é a fonte dos dados, não o alvo de modificação por esta skill) [1].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para a rota da tela 'Checkpoints'.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a tela 'Checkpoints'.

## 7. Definição de Pronto
- A tela 'Checkpoints' é renderizada corretamente, exibindo uma lista de checkpoints de forma clara e organizada, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- A criação manual de checkpoints é funcional e fornece feedback visual ao operador.
- A visualização de detalhes de um checkpoint (snapshot JSON) é implementada de forma legível.
- A funcionalidade de restauração de um checkpoint é clara e segura (com confirmação).
- A interface é neurocompatível, facilitando a gestão e a retomada de contexto [1].

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para layout, cores e tipografia da tela 'Checkpoints' [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à gestão de checkpoints (clareza, feedback, facilidade de retomada) [1].
- [ ] Implementado o componente `Checkpoints.tsx` e seus subcomponentes.
- [ ] Consumidos os dados do endpoint `/checkpoints` via `api.ts` para listar os checkpoints existentes.
- [ ] Desenvolvida a funcionalidade de `POST /checkpoints` para criar novos checkpoints.
- [ ] Implementada a visualização do conteúdo JSON de um checkpoint (com formatação legível).
- [ ] Adicionada a funcionalidade de restauração de um checkpoint (com aviso de impacto).
- [ ] Garantido que a apresentação dos checkpoints não sobrecarrega o operador.

## 9. Anti-Patterns
- Exibir o conteúdo JSON completo de um checkpoint sem formatação, dificultando a leitura.
- Não fornecer um mecanismo claro para criar checkpoints, tornando a funcionalidade inútil.
- Não avisar o operador sobre o impacto da restauração de um checkpoint.
- Criar uma interface que exige muitos cliques para gerenciar checkpoints.

## 10. Exemplos de Execução
- **Cenário:** Listar todos os checkpoints existentes.
  - **Ação:** Chamar `api.getCheckpoints()` e renderizar os resultados em uma lista, onde cada item exibe o timestamp, um breve resumo e botões para 'Ver Detalhes' e 'Restaurar'.
- **Cenário:** Criar um novo checkpoint manual.
  - **Ação:** Implementar um botão 'Criar Checkpoint' que, ao ser clicado, chama `api.createCheckpoint()` e exibe uma notificação de sucesso.

## 11. Guardrails
- A restauração de um checkpoint deve sempre exigir uma confirmação explícita do operador.
- O conteúdo JSON dos checkpoints deve ser exibido de forma segura, sem executar código ou scripts.
- A funcionalidade de sugestão de checkpoints (`checkpoint_suggestion_service.py`) deve ser integrada visualmente na tela 'Contexto' ou 'Agora' [1].

## 12. Critérios de Qualidade
- **Confiabilidade:** A criação e restauração de checkpoints devem ser robustas e sem perda de dados.
- **Clareza:** A interface deve ser fácil de entender, mesmo para operadores que não estão familiarizados com o conceito de snapshots de contexto.
- **Usabilidade:** A gestão de checkpoints deve ser intuitiva e eficiente.
- **Segurança:** A restauração de estados deve ser segura e controlada.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação da tela 'Checkpoints', descrevendo os componentes criados, como os dados são consumidos e gerenciados, e uma confirmação de que os princípios de Neuro-UX e as diretrizes visuais foram rigorosamente seguidos. Inclua uma avaliação da confiabilidade e usabilidade da funcionalidade de checkpoints.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
