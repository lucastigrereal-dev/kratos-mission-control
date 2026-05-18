---
id: kratos-visual-qa
name: Kratos Visual QA
description: Garante a qualidade visual e a fidelidade ao design canônico do KRATOS Mission Control através de testes e validações visuais.
tags: [qa, visual-testing, design-system, pixel-perfect, acceptance-criteria]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Visual QA

## 1. Propósito
Esta skill é responsável por implementar e manter os processos de Garantia de Qualidade Visual (Visual QA) para o frontend do KRATOS Mission Control. O objetivo é garantir que cada componente e tela implementada seja pixel-perfect e fiel ao design canônico (`docs/kratos-visual/KRATOS_UI_BIBLE.md`, `KRATOS_VISUAL_ACCEPTANCE.md`, `docs/kratos-visual/KRATOS_IMAGE_OCR_SPEC.md`), bem como aos princípios de Neuro-UX. A skill visa identificar e corrigir desvios visuais, inconsistências e problemas de layout antes da entrega [1] [2] [3] [4].

## 2. Quando Usar
- Após a implementação ou modificação de qualquer componente de UI ou tela.
- Durante o processo de revisão de código para validar a fidelidade visual.
- Ao realizar testes de regressão visual para garantir que novas alterações não introduzam problemas em componentes existentes.
- Ao verificar a responsividade da interface em diferentes tamanhos de tela e breakpoints.

## 3. Quando NÃO Usar
- Para testes de funcionalidade ou lógica de negócio (usar testes unitários/de integração).
- Para testes de performance de backend (usar `kratos-sse-performance` para frontend, e testes de carga para backend).
- Para a gestão de componentes de UI genéricos (usar `kratos-design-system`).

## 4. Inputs Esperados
- Componentes ou telas do frontend a serem testados.
- Imagens de referência do design canônico (e.g., screenshots da `docs/kratos-visual/KRATOS_IMAGE_OCR_SPEC.md`).
- Especificações de design da `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `KRATOS_VISUAL_ACCEPTANCE.md`.

## 5. Arquivos que Pode Tocar
- `frontend/src/components/**/*.tsx` e `frontend/src/pages/**/*.tsx` (para inspeção visual).
- `frontend/src/tests/visual-regression/**/*.spec.ts` (para testes automatizados de regressão visual).
- `frontend/src/styles/**/*.css` (para verificar estilos aplicados).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [1].
- Arquivos de configuração de build ou de fundação da aplicação que não estão diretamente relacionados aos testes visuais.
- Alterar o código de produção sem uma falha visual confirmada e aprovada.

## 7. Definição de Pronto
- O componente ou tela testado é visualmente idêntico ao design canônico em todos os breakpoints relevantes.
- Não há inconsistências de layout, tipografia, cores ou espaçamento.
- Todos os elementos interativos possuem os estados visuais corretos (hover, focus, active, disabled).
- A interface é neurocompatível, com baixa carga cognitiva e sem elementos distrativos [4].
- Testes de regressão visual (se automatizados) passaram com sucesso.

## 8. Checklist Operacional
- [ ] Comparado o componente/tela implementado com a `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `docs/kratos-visual/KRATOS_IMAGE_OCR_SPEC.md` [2] [3].
- [ ] Verificado o layout e o espaçamento (padding, margin) de acordo com o grid de 12 colunas e `gap` padrão de 24px [2].
- [ ] Confirmado o uso correto da paleta de cores e tipografia definida [2].
- [ ] Testada a responsividade em diferentes tamanhos de tela (desktop, laptop, tablet, mobile) [2].
- [ ] Verificados os estados de hover, focus e active para elementos interativos.
- [ ] Avaliada a carga cognitiva e a presença de elementos distrativos, conforme `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` [4].
- [ ] Realizado um teste de contraste de cores para garantir acessibilidade.

## 9. Anti-Patterns
- Aprovar um componente visualmente inconsistente com o design canônico.
- Ignorar problemas de responsividade ou de layout em breakpoints específicos.
- Não testar os estados interativos dos componentes.
- Confiar apenas na inspeção manual sem ferramentas de apoio (e.g., Storybook, ferramentas de diff visual).

## 10. Exemplos de Execução
- **Cenário:** Validar a implementação de um novo widget na sidebar direita.
  - **Ação:** Abrir o Storybook (se implementado) ou a página de desenvolvimento do widget, e comparar visualmente com a imagem de referência da `docs/kratos-visual/KRATOS_IMAGE_OCR_SPEC.md`, verificando espaçamento, cores, tipografia e comportamento de hover.
- **Cenário:** Realizar um teste de regressão visual após uma atualização de CSS global.
  - **Ação:** Executar os testes automatizados de regressão visual (e.g., com `Playwright` ou `Cypress` + plugin de diff visual) e analisar os relatórios de diferenças.

## 11. Guardrails
- Qualquer desvio visual do design canônico deve ser documentado e justificado, ou corrigido.
- A `KRATOS_VISUAL_ACCEPTANCE.md` deve ser o documento de referência final para aprovação visual [3].
- Ferramentas de desenvolvimento do navegador (Developer Tools) devem ser usadas para inspecionar estilos e layout.

## 12. Critérios de Qualidade
- **Fidelidade ao Design:** O frontend deve ser uma representação exata do design canônico.
- **Consistência:** A interface deve ser consistente em todos os componentes e telas.
- **Responsividade:** A interface deve se adaptar perfeitamente a diferentes tamanhos de tela.
- **Neuro-UX Compliance:** A qualidade visual deve suportar os princípios de baixa carga cognitiva e foco.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado do processo de Visual QA, incluindo os componentes/telas testados, os desvios encontrados e as ações corretivas tomadas. Confirme que a fidelidade ao design canônico e aos princípios de Neuro-UX foi alcançada, com referência à `docs/kratos-visual/KRATOS_UI_BIBLE.md`, `KRATOS_VISUAL_ACCEPTANCE.md` e `docs/kratos-visual/KRATOS_IMAGE_OCR_SPEC.md`.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_VISUAL_ACCEPTANCE.md. (2026-05-13).
[4] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
