---
id: kratos-aurora-ui
name: Kratos Aurora UI
description: Implementa e gerencia a interface da assistente Aurora, focando em sua função de âncora contextual e mentora.
tags: [ui, aurora, ai, assistant, neuro-ux, context]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Aurora UI

## 1. Propósito
Esta skill é dedicada à implementação e manutenção da interface da assistente Aurora no KRATOS Mission Control. A Aurora não é um chatbot genérico; ela é uma **âncora de contexto** e **mentora**, projetada para interpretar o estado do sistema, detectar desvios de foco e guiar o operador de forma concisa e neurocompatível. O objetivo é garantir que a interação com a Aurora seja intuitiva, não intrusiva e altamente eficaz na redução da carga cognitiva e na facilitação da retomada de contexto [1] [2].

## 2. Quando Usar
- Ao desenvolver ou modificar o componente `AuroraWidget` na sidebar direita.
- Ao implementar novas funcionalidades de interação com a Aurora (e.g., "Falar com Aurora").
- Ao integrar mensagens ou recomendações da Aurora baseadas em dados do backend (e.g., `mentor_recommendations`, `context_drift`).
- Ao ajustar a apresentação visual da Aurora para otimizar sua função de guia contextual.

## 3. Quando NÃO Usar
- Para lógica de negócio que não está diretamente ligada à interface da Aurora.
- Para a implementação de componentes de UI genéricos (usar `kratos-design-system`).
- Para a comunicação de dados em tempo real via SSE (usar `kratos-sse-performance`).

## 4. Inputs Esperados
- Mensagens e recomendações da Aurora provenientes do backend (e.g., `/mentor/next-action`, `/mentor/context-signals`).
- Status da Aurora (online/offline).
- Dados de contexto do operador para personalização das mensagens.

## 5. Arquivos que Pode Tocar
- `frontend/src/components/widgets/AuroraWidget.tsx`
- `frontend/src/components/ui/AuroraCard.tsx` (se for um componente separado).
- `frontend/src/types/kratos.ts` (para definir interfaces de mensagens da Aurora).
- `frontend/src/hooks/useLiveKratos.ts` (para consumir mensagens da Aurora em tempo real).

## 6. Arquivos Proibidos
- Qualquer arquivo dentro de `backend/` [3].
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`).
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a UI da Aurora.

## 7. Definição de Pronto
- A interface da Aurora é renderizada corretamente, seguindo o estilo visual da `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `KRATOS_VISUAL_ACCEPTANCE.md` [2] [4].
- As mensagens da Aurora são exibidas de forma clara, concisa e não intrusiva, aderindo às regras de Neuro-UX [1].
- A interação "Falar com Aurora" funciona, se implementada, e a Aurora responde de forma contextual.
- O status online/offline da Aurora é corretamente indicado.
- A Aurora atua como uma âncora de contexto eficaz, guiando o operador sem sobrecarregá-lo.

## 8. Checklist Operacional
- [ ] Verificado `docs/kratos-visual/KRATOS_UI_BIBLE.md` para estilo visual da Aurora (avatar, cores, balão de fala) [2].
- [ ] Verificado `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md` para princípios de Neuro-UX aplicáveis à Aurora (mensagens curtas, diretas, âncora de contexto) [1].
- [ ] Implementado o componente `AuroraWidget` na sidebar direita.
- [ ] Integradas as mensagens da Aurora, garantindo que sejam contextuais e relevantes.
- [ ] Assegurado que a voz da Aurora (calma, encorajadora, objetiva) é refletida no tom das mensagens.
- [ ] Garantido que a Aurora não gera notificações intrusivas ou pop-ups que bloqueiam a tela.

## 9. Anti-Patterns
- Fazer a Aurora "conversar" em excesso ou com mensagens longas e vagas.
- Usar a Aurora para exibir informações não relacionadas ao foco ou contexto atual do operador.
- Implementar a Aurora como um chatbot genérico com respostas pré-definidas e sem inteligência contextual.
- Ignorar o status online/offline da Aurora, exibindo mensagens quando ela não está ativa.

## 10. Exemplos de Execução
- **Cenário:** A Aurora detecta um desvio de foco e sugere uma ação.
  - **Ação:** O `AuroraWidget` exibe uma mensagem concisa como: *"Lucas, você está no YouTube há 15 minutos, mas a missão atual é o Deploy do Kratos. Queremos voltar para a Forja?"*, com um botão "Voltar para Forja" [1].
- **Cenário:** A Aurora dá as boas-vindas ao Omnis Lab.
  - **Ação:** O `AuroraWidget` exibe: *"Bem-vindo ao Omnis Lab. Aqui as ideias ganham vida e sistemas constroem o futuro."* [2].

## 11. Guardrails
- As mensagens da Aurora devem ter no máximo duas frases.
- O avatar da Aurora deve ser consistente com a imagem canônica.
- O `AuroraWidget` deve ter um indicador visual claro de seu status (online/offline).

## 12. Critérios de Qualidade
- **Contextualidade:** As mensagens da Aurora devem ser sempre relevantes ao contexto atual do operador.
- **Não Intrusividade:** A Aurora deve guiar sem distrair ou interromper o fluxo de trabalho.
- **Eficácia:** A capacidade da Aurora de ajudar o operador a retomar o foco e a progredir em suas missões.
- **Consistência:** A personalidade e o estilo de comunicação da Aurora devem ser consistentes em todo o sistema.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação da interface da Aurora, descrevendo como suas mensagens são integradas, como ela atua como âncora contextual e uma confirmação de que os princípios de Neuro-UX e as diretrizes visuais foram rigorosamente seguidos, com referência à `docs/kratos-visual/KRATOS_UI_BIBLE.md` e `docs/kratos-visual/KRATOS_V5_NEURO_UX_RULES.md`.

---

## Referências
[1] KRATOS_V5_NEURO_UX_RULES. (2026-05-13).
[2] KRATOS UI BIBLE. (2026-05-13).
[3] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
[4] KRATOS_VISUAL_ACCEPTANCE.md. (2026-05-13).
