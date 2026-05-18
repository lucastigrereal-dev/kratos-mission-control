---
id: kratos-design-system
name: Kratos Design System
description: Garante a aplicação consistente do sistema de design do KRATOS em todos os componentes de UI.
tags: [design-system, ui, components, tailwind, shadcn]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Design System

## 1. Propósito
Esta skill tem como objetivo principal garantir a aplicação consistente e correta do sistema de design do KRATOS em todos os componentes e telas do frontend. Ela serve como um guia para o uso de cores, tipografia, espaçamento, componentes `shadcn/ui` e classes `Tailwind CSS`, assegurando que a interface do usuário seja coesa, neurocompatível e visualmente alinhada com a `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `KRATOS_VISUAL_ACCEPTANCE.md` [2] [3].

## 2. Quando Usar
- Ao criar qualquer novo componente de UI.
- Ao modificar o estilo ou layout de um componente existente.
- Ao implementar novas telas ou seções da aplicação.
- Ao realizar refatorações visuais para melhorar a consistência ou a Neuro-UX.
- Sempre que houver dúvida sobre qual cor, fonte, espaçamento ou componente usar.

## 3. Quando NÃO Usar
- Para lógica de negócio complexa ou manipulação de dados do backend.
- Para otimizações de performance que não envolvem diretamente a renderização visual.
- Para a criação de serviços ou coletores de dados.

## 4. Inputs Esperados
- Requisitos de design para um novo componente ou tela.
- Mockups ou referências visuais (que devem estar alinhados com a `docs/kratos-visual/KRATOS_UI_BIBLE.md`).
- Nome do componente a ser criado ou modificado.

## 5. Arquivos que Pode Tocar
- `frontend/src/components/**/*.tsx` (todos os arquivos de componentes React).
- `frontend/src/pages/**/*.tsx` (todos os arquivos de páginas React).
- `frontend/src/index.css` (para variáveis CSS globais ou configurações do Tailwind, se estritamente necessário e aprovado).
- `tailwind.config.js` (para estender ou configurar o Tailwind, se estritamente necessário e aprovado).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [1].
- Arquivos de configuração de build (e.g., `vite.config.ts`).
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a UI.
- Arquivos de bibliotecas de estilo que não sejam Tailwind CSS ou `shadcn/ui`.

## 7. Definição de Pronto
- O componente ou tela está visualmente consistente com a `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `KRATOS_VISUAL_ACCEPTANCE.md` [2] [3].
- Todas as cores, tipografia, espaçamentos e efeitos (sombras, bordas arredondadas) seguem as especificações.
- Componentes `shadcn/ui` são utilizados sempre que possível, com as customizações necessárias via Tailwind.
- O código CSS é composto exclusivamente por classes `Tailwind CSS` (ou variáveis CSS globais definidas em `index.css`).
- A responsividade está implementada conforme os breakpoints definidos [3].

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para cores, tipografia, layout e grid [2].
- [ ] Verificado `KRATOS_VISUAL_ACCEPTANCE.md` para critérios de aceitação visual [3].
- [ ] Utilizadas classes `Tailwind CSS` para estilização.
- [ ] Utilizados componentes `shadcn/ui` quando aplicável.
- [ ] Implementada a responsividade para os breakpoints `sm`, `md`, `lg`, `xl`, `2xl`.
- [ ] Garantido que as animações e microinterações seguem as diretrizes (e.g., hover, click, transições) [2].
- [ ] Assegurado que o contraste e a legibilidade são ótimos (Neuro-UX) [4].

## 9. Anti-Patterns
- Escrever CSS customizado em arquivos `.css` ou blocos `<style>` em componentes React (exceto `index.css` para globais).
- Usar cores ou fontes que não estejam definidas na `docs/kratos-visual/KRATOS_UI_BIBLE.md`.
- Ignorar os princípios de Neuro-UX, criando interfaces visualmente poluídas ou com alta carga cognitiva.
- Duplicar estilos ou componentes em vez de reutilizar ou criar abstrações.

## 10. Exemplos de Execução
- **Cenário:** Criar um novo `Card` para exibir informações de um projeto.
  - **Ação:** Utilizar o componente `Card` do `shadcn/ui`, aplicando classes `Tailwind CSS` para `background-color` (neutros), `border-radius` (16px), `box-shadow` (sombras suaves) e `padding` (24px) conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md`.
- **Cenário:** Implementar um botão de ação primária.
  - **Ação:** Utilizar o componente `Button` do `shadcn/ui`, configurando-o com a cor primária (Azul Kratos `#1E90FF`) e garantindo o feedback visual de hover/click.

## 11. Guardrails
- Qualquer customização de `shadcn/ui` deve ser feita via `Tailwind CSS` ou `CSS variables` definidos globalmente.
- A introdução de novas bibliotecas de ícones deve ser justificada e alinhada com o estilo visual existente.
- O uso de `z-index` deve seguir a hierarquia de camadas organizada para evitar conflitos visuais.

## 12. Critérios de Qualidade
- **Fidelidade Visual:** O componente/tela deve ser pixel-perfect em relação às especificações visuais.
- **Consistência:** O design deve ser indistinguível de outros componentes que seguem o mesmo padrão.
- **Performance:** A renderização do componente não deve causar lentidão ou engasgos na UI.
- **Acessibilidade:** O componente deve ser acessível, com foco em contraste e navegação por teclado.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado dos componentes ou telas implementadas/modificadas, com capturas de tela (se possível) e uma confirmação de que todos os critérios de design system foram rigorosamente seguidos, incluindo referências específicas à `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `KRATOS_VISUAL_ACCEPTANCE.md`.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_VISUAL_ACCEPTANCE.md. (2026-05-13).
[4] KRATOS NEURO-UX RULES. (2026-05-13).
