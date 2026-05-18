---
id: kratos-reporting
name: Kratos Reporting
description: Gerencia a geração de relatórios e a exportação de dados do KRATOS Mission Control.
tags: [reporting, data-export, analytics, documentation]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Reporting

## 1. Propósito
Esta skill é responsável por implementar e manter as funcionalidades de geração de relatórios e exportação de dados dentro do KRATOS Mission Control. O objetivo é permitir que o operador extraia insights de seu progresso, atividades e do estado do sistema de forma estruturada e compreensível. A skill deve garantir que os relatórios sejam coerentes, completos e formatados de maneira a facilitar a análise e a documentação [1].

## 2. Quando Usar
- Ao desenvolver ou modificar funcionalidades de exportação de dados (e.g., CSV, JSON, PDF).
- Ao criar novos tipos de relatórios (e.g., relatório semanal de performance, relatório de contexto).
- Ao integrar dados de diferentes serviços do backend para compor um relatório unificado.
- Ao implementar a interface para configuração e download de relatórios.

## 3. Quando NÃO Usar
- Para a exibição de dados em tempo real na UI (usar `kratos-live-state-ui`).
- Para a lógica de negócio principal de cada tela (usar as skills de tela específicas).
- Para a gestão de componentes de UI genéricos (usar `kratos-design-system`).

## 4. Inputs Esperados
- Parâmetros de filtro para relatórios (e.g., período, tipo de dados).
- Dados brutos dos serviços de backend (e.g., `mission_service`, `project_service`, `activity_service`).
- Requisições do operador para gerar ou baixar um relatório.

## 5. Arquivos que Pode Tocar
- `frontend/src/pages/Reports.tsx` (se houver uma tela dedicada a relatórios).
- `frontend/src/lib/api.ts` (para endpoints de API de relatórios).
- `frontend/src/utils/reportGenerators.ts` (para lógica de formatação de relatórios no frontend).
  
**Nota:** a geração e agregação de dados de relatórios é responsabilidade do backend existente e **não deve ser modificada** durante esta etapa de especialização. Concentre-se apenas nos arquivos de frontend e utilitários relacionados a relatórios, como `frontend/src/utils/reportGenerators.ts` e outros utilitários de formatação.

## 6. Arquivos Proibidos
- Arquivos de configuração de build ou de fundação da aplicação (e.g., `main.tsx`, `App.tsx`).
- Arquivos de lógica de negócio ou serviços que não impactam diretamente a geração de relatórios.

## 7. Definição de Pronto
- O relatório é gerado com sucesso, contendo todos os dados solicitados e formatado corretamente.
- A exportação de dados funciona para os formatos especificados (e.g., CSV, JSON).
- A interface para solicitar e baixar relatórios é intuitiva e fornece feedback claro ao operador.
- Os dados nos relatórios são precisos e consistentes com os dados do sistema [1].

## 8. Checklist Operacional
- [ ] Verificado `KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo` para endpoints de relatórios [1].
- [ ] Consumidos apenas endpoints já existentes para montar a visualização/solicitação de relatórios no frontend.
- [ ] Desenvolvida a interface de usuário para seleção de parâmetros e acionamento da geração de relatórios.
- [ ] Implementada a funcionalidade de download do relatório gerado.
- [ ] Garantido que os dados sensíveis são tratados com segurança e que apenas informações autorizadas são incluídas nos relatórios.
- [ ] Verificado que a formatação dos relatórios é clara e legível.

## 9. Anti-Patterns
- Gerar relatórios com dados inconsistentes ou incompletos.
- Não fornecer feedback ao operador durante o processo de geração de relatórios (que pode ser demorado).
- Exigir que o operador configure relatórios complexos sem orientação clara.
- Não oferecer opções de exportação em formatos comuns (CSV, JSON).

## 10. Exemplos de Execução
- **Cenário:** Gerar um relatório semanal de performance.
  - **Ação:** O operador seleciona o período 
semanal e clica em 'Gerar Relatório'. O backend processa os dados de atividades, missões e projetos, e o frontend exibe um link para download do relatório em PDF ou CSV.
- **Cenário:** Exportar dados de contexto para análise.
  - **Ação:** O operador acessa a tela de contexto e seleciona a opção 'Exportar Dados'. O frontend chama um endpoint do backend que retorna um arquivo JSON com o histórico de contexto do período selecionado.

## 11. Guardrails
- A geração de relatórios deve ser assíncrona para não bloquear a UI em relatórios grandes.
- A privacidade e a segurança dos dados devem ser mantidas rigorosamente durante a geração e exportação de relatórios.
- Os relatórios devem ser versionados para garantir a rastreabilidade.

## 12. Critérios de Qualidade
- **Precisão:** Os dados nos relatórios devem ser 100% precisos e confiáveis.
- **Completude:** Os relatórios devem conter todas as informações relevantes para o propósito.
- **Clareza:** A apresentação dos dados deve ser fácil de entender e analisar.
- **Performance:** A geração e o download de relatórios devem ser eficientes.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório detalhado da implementação das funcionalidades de reporting, descrevendo os tipos de relatórios gerados, os formatos de exportação suportados e uma confirmação de que a precisão, completude e clareza dos dados foram garantidas. Inclua uma avaliação da experiência do usuário na geração e consumo de relatórios.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
