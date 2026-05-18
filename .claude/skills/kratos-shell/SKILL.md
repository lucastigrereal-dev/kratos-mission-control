---
id: kratos-shell
name: Kratos Shell Operations
description: Define as melhores práticas para o Codex interagir com o ambiente de shell para desenvolvimento e manutenção do KRATOS.
tags: [shell, development, environment, build, test, commands]
version: 1.0
author: Manus AI
---

# SKILL: Kratos Shell Operations

## 1. Propósito
Esta skill estabelece as diretrizes para o Codex executar comandos de shell no ambiente de desenvolvimento do KRATOS. O objetivo é garantir que as operações de build, teste, execução e manutenção sejam realizadas de forma eficiente, segura e consistente, utilizando as ferramentas e comandos definidos no `KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo` [1].

## 2. Quando Usar
- Ao iniciar os servidores de backend (`uvicorn`) ou frontend (`npm run dev`).
- Ao executar testes de backend (`pytest`) ou frontend (`npm test`).
- Ao realizar builds de produção do frontend (`npm run build`).
- Ao interagir com o sistema de arquivos para copiar, mover ou inspecionar arquivos do projeto.
- Ao executar comandos de `curl` para smoke tests ou depuração de endpoints do backend.
- Ao gerenciar dependências (`pip install`, `npm install`).

## 3. Quando NÃO Usar
- Para lógica de negócio que deve residir no código Python ou TypeScript.
- Para operações de UI que podem ser feitas diretamente através da manipulação de arquivos com a ferramenta `file`.
- Para interações com o navegador (usar a ferramenta `browser`).
- Para operações que exigem interação manual do usuário (a menos que seja explicitamente instruído para `send` input).

## 4. Inputs Esperados
- Comandos de shell específicos para o ambiente KRATOS (e.g., `uvicorn`, `npm run dev`, `pytest`).
- Caminhos de diretórios ou arquivos para operações de sistema de arquivos.
- Parâmetros para comandos de build ou teste.

## 5. Arquivos que Pode Tocar
- `backend/requirements.txt` (para instalar dependências Python).
- `frontend/package.json`, `frontend/package-lock.json` (para instalar dependências Node.js).
- Arquivos de log gerados por comandos de build ou teste.
- Arquivos do projeto para operações de **cópia ou inspeção**, desde que justificado. **Não** mover ou deletar arquivos do frontend ou backend nesta etapa.

## 6. Arquivos Proibidos
- Arquivos de configuração do sistema operacional fora do diretório do projeto KRATOS.
- Arquivos sensíveis que não devem ser modificados sem permissão explícita (e.g., `/etc/passwd`).

## 7. Definição de Pronto
- O comando de shell foi executado com sucesso e retornou o resultado esperado.
- O ambiente de desenvolvimento (backend/frontend) está em execução ou foi configurado conforme a necessidade.
- Os testes foram executados e seus resultados foram capturados.
- As operações de sistema de arquivos foram concluídas sem erros.

## 8. Checklist Operacional
- [ ] Verificado o `KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo` para comandos rápidos [1].
- [ ] Utilizados os caminhos corretos para os executáveis (e.g., `.venv/Scripts/activate` para backend Python).
- [ ] Capturada a saída do comando para análise ou feedback.
- [ ] Tratados possíveis erros de execução de shell.
- [ ] Garantido que os processos de longa duração (servidores) são executados em sessões separadas ou com `timeout` adequado.

## 9. Anti-Patterns
- Executar comandos de shell sem verificar o diretório de trabalho atual (`pwd`).
- Ignorar erros de saída de comandos de shell, assumindo sucesso.
- Tentar executar comandos interativos sem usar a ação `send` da ferramenta `shell`.
- Usar `sudo` sem necessidade explícita ou justificação.

## 10. Exemplos de Execução
- **Cenário:** Iniciar o servidor de backend do KRATOS.
  - **Ação:** `cd backend && .\.venv\Scripts\activate && uvicorn app.main:app --reload --port 5100` [1].
- **Cenário:** Executar os testes do frontend.
  - **Ação:** `cd frontend && npm test`.
- **Cenário:** Fazer um smoke test do endpoint `/health`.
  - **Ação:** `curl localhost:5100/health` [1].

## 11. Guardrails
- Sempre use `&&` para encadear comandos e garantir que cada passo seja bem-sucedido antes de prosseguir.
- Defina `timeout` para comandos que podem ficar bloqueados, especialmente ao iniciar servidores.
- Evite comandos que gerem muita saída desnecessária; redirecione para arquivos se a saída for muito grande.

## 12. Critérios de Qualidade
- **Confiabilidade:** Os comandos devem ser executados de forma consistente e previsível.
- **Eficiência:** As operações de shell devem ser otimizadas para o menor tempo de execução possível.
- **Segurança:** Nenhuma operação de shell deve comprometer a segurança do ambiente ou dos dados.
- **Rastreabilidade:** A saída dos comandos deve ser clara e útil para depuração.

## 13. Instrução de Saída/Relatório
Ao concluir, forneça um relatório da execução dos comandos de shell, incluindo a saída completa (ou um resumo relevante) e qualquer observação sobre o estado do ambiente de desenvolvimento ou dos testes.

---

## Referências
[1] KRATOS MISSION CONTROL — Relatório Ultra-Dev Completo. (2026-05-13).
