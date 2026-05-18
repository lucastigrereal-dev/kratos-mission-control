---
id: kratos-hud
name: Kratos HUD (Head-Up Display)
description: Implementa e mantém os componentes do Head-Up Display do KRATOS, fornecendo informações críticas e sempre visíveis ao operador.
tags: [ui, hud, topbar, status, critical-info, always-on]
version: 1.0
author: Manus AI
---

# SKILL: Kratos HUD (Head-Up Display)

## 1. Propósito
Esta skill é responsável por implementar e manter os componentes do Head-Up Display (HUD) do KRATOS Mission Control, especificamente a `TopBarStatus` e outros elementos que fornecem informações críticas e sempre visíveis ao operador. O objetivo é garantir que o operador tenha acesso imediato a dados essenciais como energia, nível, XP, hora e status do sistema, de forma clara, concisa e neurocompatível, sem distrações [2] [3].

## 2. Quando Usar
- Ao desenvolver ou modificar a `TopBarStatus` ou qualquer outro componente que faça parte do HUD global.
- Ao integrar novos indicadores de status que precisam estar sempre visíveis.
- Ao ajustar a apresentação visual de informações críticas para otimizar a legibilidade e a baixa carga cognitiva.
- Ao garantir que o HUD se adapte corretamente em diferentes resoluções e breakpoints.

## 3. Quando NÃO Usar
- Para componentes de UI que não são globais ou sempre visíveis (e.g., widgets da sidebar, elementos do mapa de ilhas).
- Para lógica de negócio complexa ou manipulação de dados do backend que não se traduzem diretamente em um indicador de status simples.
- Para a implementação de interações complexas ou fluxos de usuário (usar skills de tela específicas).

## 4. Inputs Esperados
- Dados de status do operador (energia, nível, XP) provenientes do backend (`/live/snapshot` ou `/now`).
- Informações de tempo e data.
- Status geral do sistema (online, degraded, error) [1].

## 5. Arquivos que Pode Tocar
- `frontend/src/components/layout/TopBar.tsx`
- `frontend/src/components/ui/SystemStatusBadge.tsx`
- `frontend/src/types/kratos.ts` (para definir interfaces de dados de status).
- `frontend/src/hooks/useLiveKratos.ts` (para consumir dados de status em tempo real).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [1].
- Arquivos de componentes de UI que não fazem parte do HUD global.
- Arquivos de lógica de negócio ou serviços que não impactam diretamente o HUD.

## 7. Definição de Pronto
- O HUD exibe todas as informações críticas (energia, nível, XP, hora, status do sistema) de forma precisa e atualizada [2].
- A apresentação visual do HUD é limpa, de alto contraste e segue a `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `KRATOS_VISUAL_ACCEPTANCE.md` [2] [4].
- O HUD é responsivo e mantém sua funcionalidade e legibilidade em todos os breakpoints definidos [2].
- Não há elementos distrativos ou que aumentem a carga cognitiva no HUD [3].

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para layout, cores e tipografia do HUD [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis ao HUD [3].
- [ ] Implementado o componente `TopBarStatus` com os indicadores de energia, nível, XP e hora.
- [ ] Integrado o `SystemStatusBadge` para exibir o status geral do sistema.
- [ ] Consumidos os dados de status em tempo real via `useLiveKratos` ou chamadas de API apropriadas [1].
- [ ] Garantido que o HUD mantém uma altura fixa de 80px e se adapta aos breakpoints.
- [ ] Assegurado que o contraste do texto no HUD é excelente para alta legibilidade.

## 9. Anti-Patterns
- Adicionar informações não essenciais ao HUD, sobrecarregando a barra superior.
- Usar animações complexas ou piscantes no HUD que possam distrair o operador.
- Não garantir que o HUD seja sempre visível, independentemente da tela ou modal aberto.
- Comprometer a legibilidade do texto ou ícones no HUD com cores de baixo contraste.

## 10. Exemplos de Execução
- **Cenário:** Atualizar o indicador de energia na `TopBarStatus`.
  - **Ação:** Consumir o valor de energia do `live_snapshot` via `useLiveKratos` e renderizá-lo no componente, garantindo que a cor e o ícone (`⚡`) estejam corretos conforme a `docs/kratos-visual/KRATOS_UI_BIBLE.md` [2].
- **Cenário:** Exibir o status `DEGRADED` do sistema.
  - **Ação:** O `SystemStatusBadge` deve reagir ao estado `DEGRADED` do backend, exibindo o ícone amarelo (`🟡`) e um pulso lento, conforme especificado [2].

## 11. Guardrails
- A altura do HUD (`TopBar`) deve ser estritamente 80px.
- A tipografia para os valores numéricos e textos do HUD deve ser `Inter Regular` ou `Inter Medium` para legibilidade [2].
- Qualquer novo elemento adicionado ao HUD deve passar por uma revisão rigorosa de Neuro-UX para garantir que não aumente a carga cognitiva.

## 12. Critérios de Qualidade
- **Clareza:** As informações no HUD devem ser imediatamente compreensíveis e legíveis.
- **Consistência:** O HUD deve manter sua aparência e funcionalidade em todas as telas.
- **Performance:** A renderização do HUD deve ser extremamente rápida e não causar engasgos na UI.
- **Relevância:** Apenas informações críticas e de alto valor para o operador devem ser exibidas no HUD.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação ou modificação do HUD, descrevendo os componentes afetados, como os dados são consumidos e uma confirmação de que os critérios de clareza, performance e Neuro-UX foram rigorosamente atendidos, com referência à `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md`.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
[4] KRATOS_VISUAL_ACCEPTANCE.md. (2026-05-13).
