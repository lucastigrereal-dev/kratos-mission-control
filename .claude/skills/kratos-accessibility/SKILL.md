---
id: kratos-accessibility
name: Kratos Accessibility
description: Garante que a interface do KRATOS Mission Control seja acessível a todos os operadores, incluindo aqueles com necessidades especiais, seguindo padrões WCAG e princípios de Neuro-UX.
tags: [accessibility, a11y, wcag, neuro-ux, inclusive-design]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Accessibility

## 1. Propósito
Esta skill tem como objetivo primordial garantir que a interface do KRATOS Mission Control seja acessível a todos os operadores, independentemente de suas capacidades ou necessidades especiais. Ela visa implementar e manter padrões de acessibilidade (como WCAG) e integrar os princípios de Neuro-UX para criar uma experiência inclusiva, onde a clareza, a navegabilidade e a interação são otimizadas para a diversidade cognitiva e sensorial [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar qualquer componente de UI ou tela.
- Ao integrar novos elementos interativos (botões, formulários, links).
- Ao revisar a estrutura semântica do HTML ou a ordem de tabulação.
- Ao selecionar cores, tipografia ou contrastes para novos elementos.
- Ao adicionar suporte para navegação por teclado ou leitores de tela.
- Sempre que houver uma decisão de design que possa impactar a usabilidade para operadores com deficiências visuais, motoras ou cognitivas.

## 3. Quando NÃO Usar
- Para lógica de backend ou operações de infraestrutura.
- Para otimizações de performance que não estão diretamente ligadas à acessibilidade.
- Para a criação de componentes de UI genéricos sem foco em acessibilidade (usar `kratos-design-system` para isso, mas com esta skill em mente).

## 4. Inputs Esperados
- Requisitos de design para um novo componente ou tela.
- Relatórios de auditoria de acessibilidade (e.g., Lighthouse, Axe).
- Feedback de usuários com necessidades especiais.
- Especificações de cores e tipografia da `docs/kratos-visual/KRATOS_UI_BIBLE.md`.

## 5. Arquivos que Pode Tocar
- `frontend/src/components/**/*.tsx` (todos os arquivos de componentes React).
- `frontend/src/pages/**/*.tsx` (todos os arquivos de páginas React).
- `frontend/src/index.css` (para ajustes de foco, `skip-links`, etc.).
- `tailwind.config.js` (para estender configurações de cores ou tamanhos de fonte para acessibilidade).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [3].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`), a menos que a alteração seja estritamente necessária para integrar uma solução de acessibilidade fundamental.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a acessibilidade da UI.

## 7. Definição de Pronto
- O componente ou tela implementado atende aos critérios de acessibilidade WCAG 2.1 AA [4].
- A navegação por teclado é totalmente funcional e intuitiva.
- Elementos interativos possuem estados de foco visíveis e claros.
- O contraste de cores atende aos requisitos mínimos para texto e elementos gráficos [2].
- A estrutura semântica do HTML é correta, facilitando a interpretação por leitores de tela.
- Os princípios de Neuro-UX são integrados para beneficiar também operadores com TDAH [1].

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX que se sobrepõem à acessibilidade (clareza, contraste, feedback) [1].
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para paleta de cores e tipografia, garantindo contraste adequado [2].
- [ ] Todos os elementos interativos são acessíveis via teclado (tab, enter, space).
- [ ] Estados de foco (`:focus-visible`) são claros e visíveis.
- [ ] Imagens e ícones informativos possuem `alt text` descritivo.
- [ ] Elementos semânticos HTML5 são utilizados corretamente (`<button>`, `<nav>`, `<main>`, etc.).
- [ ] Atributos `aria-label`, `aria-describedby`, `role` são usados quando necessário para melhorar a semântica.
- [ ] O contraste de texto e elementos gráficos foi testado (ferramentas como WebAIM Contrast Checker).
- [ ] A ordem de tabulação é lógica e segue o fluxo visual.

## 9. Anti-Patterns
- Usar `div` ou `span` para elementos interativos que deveriam ser `button` ou `a`.
- Desabilitar o outline de foco (`outline: none`) sem fornecer um substituto visual claro.
- Usar cores como único meio de transmitir informação (e.g., 
apenas cores para indicar status sem texto ou ícone).
- Criar modais ou pop-ups que não podem ser fechados com a tecla `Esc` ou que prendem o foco do teclado.
- Ignorar a semântica HTML em favor de estilos visuais.

## 10. Exemplos de Execução
- **Cenário:** Implementar um botão de ação com um ícone.
  - **Ação:** Utilizar o componente `Button` do `shadcn/ui`, garantindo que o ícone tenha um `aria-hidden="true"` e que o texto do botão ou um `aria-label` forneça o contexto para leitores de tela.
- **Cenário:** Criar uma lista de status de coletores.
  - **Ação:** Utilizar uma lista HTML semântica (`<ul>`, `<li>`), com cada item de status contendo texto e um ícone visual, garantindo que o contraste de cores seja adequado e que o texto seja legível.

## 11. Guardrails
- Todas as imagens informativas devem ter `alt text` significativo.
- Elementos interativos devem ter um tamanho mínimo de `44x44px` para facilitar o toque.
- A navegação por teclado deve ser testada em todas as novas funcionalidades.
- O uso de `aria-live regions` deve ser considerado para atualizações dinâmicas de conteúdo que precisam ser anunciadas a leitores de tela.

## 12. Critérios de Qualidade
- **Conformidade WCAG:** A interface deve atender no mínimo ao nível AA das WCAG 2.1.
- **Usabilidade Inclusiva:** A interface deve ser fácil de usar para operadores com diversas necessidades.
- **Experiência Consistente:** A experiência de acessibilidade deve ser consistente em todo o aplicativo.
- **Feedback:** Relatórios de acessibilidade devem ser gerados e revisados regularmente.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado sobre as medidas de acessibilidade implementadas, incluindo os testes realizados (se houver), a conformidade com os padrões WCAG e como os princípios de Neuro-UX foram integrados para criar uma experiência inclusiva. Mencione os arquivos modificados e as ferramentas de validação utilizadas.

---

## Referências
[1] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[4] Web Content Accessibility Guidelines (WCAG) 2.1. (2018). W3C Recommendation.
