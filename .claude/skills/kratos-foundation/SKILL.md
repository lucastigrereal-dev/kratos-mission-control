---
id: kratos-foundation
name: Kratos Foundation
description: Estabelece a base arquitetural e filosófica do KRATOS Mission Control.
tags: [foundation, architecture, principles, core]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Foundation

## 1. Propósito
Esta skill tem como objetivo garantir que qualquer desenvolvimento ou modificação no KRATOS Mission Control esteja em total alinhamento com seus princípios fundamentais, arquitetura canônica e filosofia de design. Ela serve como um guia inegociável para a manutenção da coerência e integridade do sistema, assegurando que o KRATOS permaneça fiel à sua visão de cockpit operacional local-first e neurocompatível [1] [2].

## 2. Quando Usar
- Ao iniciar qualquer novo módulo ou funcionalidade no KRATOS.
- Ao revisar ou refatorar partes existentes do código ou da UI.
- Ao tomar decisões arquiteturais ou de design que possam impactar a estrutura central do sistema.
- Ao integrar novas bibliotecas ou ferramentas.
- Sempre que houver dúvida sobre a direção ou o propósito de uma implementação.

## 3. Quando NÃO Usar
- Para tarefas de implementação de UI de baixo nível que já possuem skills específicas (e.g., `kratos-hud`, `kratos-agora-screen`).
- Para otimizações de performance pontuais que não alteram a arquitetura fundamental.
- Para correção de bugs isolados que não violam princípios arquiteturais.

## 4. Inputs Esperados
- Contexto da tarefa ou funcionalidade a ser desenvolvida/modificada.
- Referência a documentos estratégicos como `KRATOS_V5_MANIFESTO_ROOT.md`, `KRATOS_CONSTITUTION.md`, `KRATOS_BUILD_PLAN.md`.

## 5. Arquivos que Pode Tocar
- `frontend/src/App.tsx` (para configuração de rotas e layout principal).
- `frontend/src/main.tsx` (para inicialização da aplicação).
- `frontend/src/index.css` (para variáveis CSS globais e configurações do Tailwind).
- Arquivos de configuração de build (e.g., `vite.config.ts`).
- Arquivos de definição de tipos globais (e.g., `frontend/src/types/kratos.ts`).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` (o backend é imutável por esta skill) [1].
- Arquivos de bibliotecas de terceiros que não fazem parte da stack canônica (e.g., `node_modules/`).
- Arquivos de componentes de UI específicos que não são de nível de fundação.

## 7. Definição de Pronto
- A implementação está em total conformidade com o `KRATOS_V5_MANIFESTO_ROOT.md` e a `KRATOS_CONSTITUTION.md`.
- A stack tecnológica (`React`, `Vite`, `TypeScript`, `Tailwind`, `shadcn/ui`) é respeitada [1].
- A arquitetura local-first e a comunicação via SSE são mantidas [1].
- Não há introdução de dependências externas não aprovadas.
- O código é legível, manutenível e segue as convenções do projeto.

## 8. Checklist Operacional
- [ ] Verificado `KRATOS_V5_MANIFESTO_ROOT.md` para princípios gerais.
- [ ] Verificado `KRATOS_CONSTITUTION.md` para regras de ouro.
- [ ] Verificado `KRATOS_BUILD_PLAN.md` para stack e estrutura.
- [ ] Confirmado que nenhuma alteração no backend é necessária ou foi feita.
- [ ] Garantido que a solução é local-first e não depende de autenticação externa.
- [ ] Assegurado que a performance percebida é mantida ou melhorada.

## 9. Anti-Patterns
- Introduzir bibliotecas de UI que não sejam `shadcn/ui` ou que conflitem com `Tailwind CSS`.
- Adicionar lógica de negócio complexa diretamente em `App.tsx` ou `main.tsx`.
- Modificar o sistema de comunicação (SSE) sem justificativa explícita e aprovação.
- Ignorar as diretrizes de Neuro-UX em qualquer nível de design.

## 10. Exemplos de Execução
- **Cenário:** Configurar o roteamento inicial da aplicação.
  - **Ação:** Modificar `App.tsx` para definir as rotas principais usando `React Router DOM`, garantindo que o `KratosLayout` seja o componente pai.
- **Cenário:** Adicionar uma nova variável CSS global para o tema.
  - **Ação:** Editar `index.css` para incluir a nova variável, seguindo a paleta de cores definida na `docs/kratos-visual/KRATOS_UI_BIBLE.md`.

## 11. Guardrails
- Qualquer alteração que afete a inicialização do `Vite` ou a configuração do `TypeScript` deve ser revisada por um especialista.
- A introdução de novas dependências `npm` deve ser justificada e alinhada com a stack existente.
- O `package.json` e `package-lock.json` devem ser mantidos limpos e atualizados.

## 12. Critérios de Qualidade
- **Conformidade:** 100% de conformidade com os documentos estratégicos (`MANIFESTO`, `CONSTITUIÇÃO`, `BUILD PLAN`).
- **Performance:** O tempo de carregamento inicial da aplicação não deve ser impactado negativamente.
- **Manutenibilidade:** O código deve ser modular, bem comentado e fácil de entender por outros desenvolvedores.
- **Segurança:** Nenhuma vulnerabilidade de segurança deve ser introduzida, especialmente em relação ao acesso a dados locais.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório conciso confirmando a conformidade com esta skill, listando os arquivos modificados e justificando as decisões tomadas em relação aos princípios fundamentais do KRATOS.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS V5 MANIFESTO. (2026-05-13).
[3] KRATOS UI BIBLE. (2026-05-13).
