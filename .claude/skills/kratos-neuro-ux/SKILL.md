---
id: kratos-neuro-ux
name: Kratos Neuro-UX
description: Aplica os princípios de Neuro-UX (TDAH-first) para otimizar a experiência do usuário no KRATOS.
tags: [neuro-ux, accessibility, focus, cognitive-load, adhd-first]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Neuro-UX

## 1. Propósito
Esta skill garante que todas as implementações de UI/UX no KRATOS Mission Control adiram estritamente aos princípios de Neuro-UX, com foco na experiência do operador com TDAH. O objetivo é reduzir a carga cognitiva, facilitar o foco, otimizar a retomada de contexto e proporcionar feedback visual e interativo que promova o engajamento e a continuidade mental [1] [2].

## 2. Quando Usar
- Ao projetar ou implementar qualquer nova funcionalidade ou tela.
- Ao revisar a usabilidade de componentes ou fluxos de trabalho existentes.
- Ao otimizar a performance percebida e a responsividade da interface.
- Ao criar animações, transições ou microinterações.
- Sempre que houver uma decisão de design que possa impactar a clareza, o foco ou a gestão do estado mental do operador.

## 3. Quando NÃO Usar
- Para tarefas de backend ou lógica de negócio que não têm impacto direto na interface do usuário.
- Para a criação de componentes de UI genéricos sem considerar o contexto de uso (usar `kratos-design-system` para isso).
- Para a integração de APIs ou manipulação de dados brutos.

## 4. Inputs Esperados
- Requisitos de funcionalidade para uma nova feature.
- Mockups ou wireframes (que devem ser avaliados sob a ótica da Neuro-UX).
- Feedback de testes de usabilidade ou observações do comportamento do operador.

## 5. Arquivos que Pode Tocar
- `frontend/src/components/**/*.tsx` (todos os arquivos de componentes React).
- `frontend/src/pages/**/*.tsx` (todos os arquivos de páginas React).
- `frontend/src/index.css` (para ajustes finos de contraste, espaçamento, etc.).
- `tailwind.config.js` (para estender configurações de espaçamento, cores, etc., que impactam a Neuro-UX).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [3].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para otimizar a experiência do usuário em nível fundamental.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a UI.

## 7. Definição de Pronto
- A funcionalidade ou componente implementado adere a todas as regras de Neuro-UX definidas em `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` [1].
- A carga cognitiva é minimizada, e o foco do operador é direcionado de forma eficaz.
- O feedback visual é instantâneo e claro, sem distrações desnecessárias.
- A retomada de contexto é facilitada por elementos visuais e transições fluidas.
- A interface é acessível e responsiva, garantindo uma experiência consistente em diferentes contextos.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para as regras absolutas de interface [1].
- [ ] Garantido contraste alto para elementos críticos e legibilidade máxima [2].
- [ ] Implementado feedback visual instantâneo (<50ms) para todas as interações [2].
- [ ] Assegurado que o 
ruído visual é minimizado e que a informação é apresentada de forma clara e concisa.
- [ ] Verificado que as transições entre telas e componentes são suaves e rápidas (máximo 300ms) [2].
- [ ] Confirmado que elementos de ancoragem de foco (e.g., Castelo Central, Foco do Dia) são proeminentes.
- [ ] Implementadas microinterações que fornecem feedback dopaminérgico positivo.

## 9. Anti-Patterns
- Introduzir elementos visuais piscantes, cores berrantes ou animações excessivas que distraiam o operador.
- Apresentar blocos de texto longos sem quebras, dificultando a leitura.
- Esconder ações críticas em menus complexos ou exigir múltiplos cliques para tarefas frequentes.
- Não fornecer feedback visual para interações do usuário, gerando incerteza.
- Criar interfaces que exigem que o operador 
adivinhe o próximo passo ou o estado do sistema.

## 10. Exemplos de Execução
- **Cenário:** Implementar o widget "Foco do Dia".
  - **Ação:** Garantir que o widget tenha o maior peso visual na sidebar direita, utilizando cores de alto contraste e tipografia Poppins ExtraBold para o título principal, conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- **Cenário:** Desenvolver a transição entre a visão geral do mundo e uma ilha específica.
  - **Ação:** Utilizar uma transição de `zoom` suave e `fade` rápido (máximo 300ms), mantendo o botão "Voltar ao Castelo" sempre visível para facilitar a retomada de contexto [2].

## 11. Guardrails
- Qualquer animação ou transição deve ser testada para garantir que não cause distração ou sobrecarga sensorial.
- A densidade de informação em qualquer painel ou widget deve ser cuidadosamente controlada para evitar a paralisia por análise.
- O feedback de erro deve ser claro, conciso e oferecer uma ação de recuperação imediata, sem culpar o operador.

## 12. Critérios de Qualidade
- **Redução da Carga Cognitiva:** Medida pela facilidade com que o operador pode entender o estado do sistema e identificar a próxima ação.
- **Engajamento:** A interface deve ser convidativa e recompensadora, incentivando o uso contínuo sem causar fadiga.
- **Foco Sustentado:** A capacidade do sistema de manter a atenção do operador na tarefa principal, minimizando desvios.
- **Acessibilidade:** Conformidade com padrões de acessibilidade para garantir que a interface seja utilizável por uma ampla gama de usuários.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado sobre como os princípios de Neuro-UX foram aplicados na funcionalidade ou componente desenvolvido, incluindo uma avaliação de como a carga cognitiva foi reduzida e o foco do operador foi otimizado. Mencione especificamente as regras de `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` que foram endereçadas.

---

## Referências
[1] KRATOS NEURO-UX RULES. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
