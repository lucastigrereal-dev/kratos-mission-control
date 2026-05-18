---
id: kratos-frontend-guardrails
name: Kratos Frontend Guardrails
description: Define as regras e restrições para o desenvolvimento do frontend do KRATOS, garantindo consistência, performance e aderência à arquitetura.
tags: [frontend, guardrails, architecture, best-practices, react, vite, tailwind, typescript]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Frontend Guardrails

## 1. Propósito
Esta skill estabelece um conjunto de regras e restrições obrigatórias para o desenvolvimento do frontend do KRATOS Mission Control. O objetivo é garantir que o código seja consistente, performático, manutenível e que adira estritamente à arquitetura definida, à stack tecnológica e aos princípios de Neuro-UX. Ela serve como uma barreira de proteção contra desvios que possam comprometer a qualidade e a visão do projeto [1] [2] [3].

## 2. Quando Usar
- Ao escrever qualquer linha de código no frontend (React, TypeScript, Tailwind).
- Ao integrar novas funcionalidades ou componentes.
- Ao realizar revisões de código ou auditorias de conformidade.
- Ao tomar decisões sobre a escolha de bibliotecas ou padrões de design no frontend.
- Sempre que houver dúvida sobre a forma correta de implementar algo no frontend.

## 3. Quando NÃO Usar
- Para lógica de backend ou operações de infraestrutura.
- Para tarefas de design puramente visual que já são cobertas pela `kratos-design-system`.
- Para planejamento de tarefas ou gerenciamento de projetos (usar `kratos-planning`).

## 4. Inputs Esperados
- Código-fonte do frontend a ser desenvolvido ou revisado.
- Requisitos de funcionalidade ou design para o frontend.
- Relatórios de análise estática de código ou testes.

## 5. Arquivos que Pode Tocar
- Todos os arquivos dentro de `frontend/src/`.
- `frontend/package.json` e `frontend/package-lock.json` (para gerenciamento de dependências).
- `frontend/tailwind.config.js` (para configurações do Tailwind).
- `frontend/vite.config.ts` (para configurações do Vite).
- `frontend/tsconfig.json` (para configurações do TypeScript).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [1].
- Arquivos de configuração do sistema operacional ou de ferramentas externas que não fazem parte da stack do projeto.
- Arquivos de bibliotecas de terceiros que não foram explicitamente aprovadas.

## 7. Definição de Pronto
- O código do frontend está em total conformidade com a stack tecnológica (React, Vite, TypeScript, Tailwind, shadcn/ui) [1].
- Todas as regras de estilo e design da `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `KRATOS_VISUAL_ACCEPTANCE.md` são respeitadas [2] [3].
- Os princípios de Neuro-UX (`docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md`) são aplicados [4].
- Não há uso de bibliotecas ou frameworks não autorizados.
- O código é performático, manutenível e segue as melhores práticas de desenvolvimento frontend.
- O sistema de comunicação (SSE) é utilizado corretamente para dados em tempo real [1].

## 8. Checklist Operacional
- [ ] O código utiliza React para componentes, TypeScript para tipagem e Tailwind CSS para estilização.
- [ ] Componentes `shadcn/ui` são preferidos sempre que possível.
- [ ] Não há CSS customizado fora de `index.css` (para globais) ou classes Tailwind.
- [ ] O código TypeScript é estritamente tipado, sem `any` desnecessários.
- [ ] O roteamento é feito via `React Router DOM`.
- [ ] A comunicação com o backend para dados em tempo real utiliza o `useLiveKratos.ts` e o endpoint `/live/stream` [1].
- [ ] As animações e transições são fluidas e rápidas (máximo 300ms) [2].
- [ ] O layout respeita o grid de 12 colunas e os breakpoints definidos [2].
- [ ] A carga cognitiva é minimizada e o foco do operador é priorizado [4].

## 9. Anti-Patterns
- Introduzir jQuery, Lodash ou outras bibliotecas de utilitários que já são cobertas por funcionalidades nativas do JavaScript ou React.
- Usar `useState` para gerenciar estados globais complexos; preferir soluções mais robustas como `useContext` ou bibliotecas de gerenciamento de estado (se aprovadas).
- Escrever lógica de negócio complexa diretamente em componentes de UI; preferir custom hooks ou módulos de serviço.
- Ignorar warnings do compilador TypeScript ou do linter.
- Criar componentes com responsabilidades múltiplas ou que não são reutilizáveis.
- Fazer chamadas de API diretamente em componentes sem abstração (`lib/api.ts`).

## 10. Exemplos de Execução
- **Cenário:** Criar um novo componente de botão.
  - **Ação:** Utilizar o componente `Button` do `shadcn/ui`, aplicando classes `Tailwind CSS` para cor, tamanho e estados de hover, garantindo que o feedback visual esteja em conformidade com a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- **Cenário:** Exibir dados em tempo real de um coletor.
  - **Ação:** Utilizar o `useLiveKratos.ts` para consumir o stream `/live/stream` e renderizar os dados de forma reativa, aplicando os indicadores de estado do sistema (`ONLINE`, `DEGRADED`, etc.) [1] [2].

## 11. Guardrails
- Qualquer nova dependência `npm` deve ser justificada e ter um impacto mínimo no bundle size e na performance.
- O uso de `!important` em CSS é estritamente proibido.
- A estrutura de pastas `frontend/src/` deve ser mantida, com componentes em `components/`, páginas em `pages/`, hooks em `hooks/`, etc.
- O `package.json` deve ser mantido limpo, sem scripts desnecessários ou dependências não utilizadas.

## 12. Critérios de Qualidade
- **Conformidade:** 100% de aderência às regras de guardrail e à stack tecnológica.
- **Performance:** O frontend deve ser rápido, responsivo e com baixo consumo de recursos.
- **Manutenibilidade:** O código deve ser limpo, modular, bem documentado e fácil de entender.
- **Robustez:** O frontend deve ser resiliente a erros de backend e fornecer feedback claro ao usuário.
- **Neuro-UX:** A experiência do usuário deve ser otimizada para o foco e a redução da carga cognitiva.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado das implementações ou revisões de frontend, destacando como os guardrails foram aplicados e quais documentos de referência foram consultados. Inclua métricas de performance (se aplicável) e uma avaliação da conformidade com os princípios de Neuro-UX.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_VISUAL_ACCEPTANCE.md. (2026-05-13).
[4] docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md. (2026-05-13).
