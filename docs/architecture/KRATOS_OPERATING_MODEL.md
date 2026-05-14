# KRATOS Operating Model v1.0

**Status:** Canonical | **Version:** 1.0 | **Date:** 2026-05-13

---

## 1. Definição

KRATOS é o **sistema nervoso central / cockpit local-first** da operação Lucas Tigre.

Ele observa, compõe e exibe o estado operacional em tempo real. Não executa ações — enxerga o campo para que Lucas decida.

O nome importa: KRATOS não é um deus que age. É um titã que **vê**.

---

## 2. Separação de Responsabilidades

```
KRATOS vê.           → observabilidade, composição de estado, exibição
Aurora interpreta.    → voz mentor, análise de padrões, sugestões
OMNIS/HOMINIS age.    → execução de skills, crews, deploys, publicações
Akasha lembra.        → memória vetorial, documentos, insights históricos
Codex/Claude constrói.→ geração de código, relatórios, análise profunda
Lucas decide.         → juízo final, aprovação, direção estratégica
```

O KRATOS nunca deve cruzar a linha de observar para executar.
Se uma feature exige execução de ação externa, ela pertence ao OMNIS ou à Aurora, não ao KRATOS.

---

## 3. O que o KRATOS É

| Dimensão | Descrição |
|----------|-----------|
| **Cockpit operacional** | Painel único que mostra estado de todos os sistemas, projetos e contexto |
| **Observador em tempo real** | Coletores reais: Docker CLI, Git CLI, psutil, ActivityWatch HTTP, filesystem scan |
| **Compositor de verdade operacional** | Agrega dados de 7+ fontes em um payload canônico (Mission Lens v1) |
| **Guardião de continuidade** | Checkpoints, drift detection, sugestão de retomada |
| **Local-first** | SQLite + arquivos locais. Sem cloud dependency. Funciona offline. |
| **SSE push** | Server-Sent Events para streaming de estado ao vivo para o frontend |

## 4. O que o KRATOS NÃO É

| Não é | Por quê |
|-------|---------|
| **App de tarefas** | Tasks são uma lente de observação, não o produto central |
| **Executor de skills** | Execução pertence ao OMNIS/HOMINIS |
| **Chat/assistente** | Conversa pertence à Aurora |
| **Banco de memória** | Memória pertence à Akasha |
| **Code generator** | Construção pertence ao Codex/Claude |
| **Dashboard bonito** | O frontend serve à verdade, não à estética vazia |

---

## 5. O Que Pertence ao OMNIS/HOMINIS

- Execução de skills (Instagram, SDR, conteúdo)
- Crews CrewAI (produção de carrossel, legenda, etc.)
- Deploys e publicações
- Checkers e testes automatizados
- Pipeline de publishing (BullMQ)
- Integração com APIs externas (Meta, Publer, Kommo)

**KRATOS lê o estado do OMNIS, mas não o comanda.**

---

## 6. O Que Pertence à Aurora

- Interpretação de padrões de comportamento
- Voz mentor (tom calmo/urgente/crítico)
- Sugestões contextuais ("Você parece estar preso nisso há 40min")
- Análise de tendências de produtividade
- Chat conversacional (futuro)

**KRATOS fornece dados para a Aurora interpretar, mas não interpreta sozinho.**

---

## 7. O Que Pertence à Akasha

- Memória vetorial de longo prazo (pgvector)
- Documentos, livros, insights históricos
- Busca semântica e híbrida (pgvector + tsvector)
- Grafo relacional de conhecimento (Mem0 + Kuzu)

**KRATOS pode exibir o status da Akasha (online/offline, doc count), mas não busca nem escreve nela.**

---

## 8. Regras Anti-Caos

1. **KRATOS não vira executor universal.** Se algo precisa executar uma ação externa, vai para OMNIS ou Aurora.
2. **Aurora não pode fingir que executou.** Sugestões são sugestões. Ações são ações. O contrato entre elas é explícito.
3. **Dados mock precisam ser visíveis.** Nenhum componente pode exibir dado mock sem indicar `source=mock` claramente.
4. **Toda feature nova precisa de dono claro.** KRATOS? Aurora? OMNIS? Akasha? Sem ambiguidade.
5. **Nada de Qdrant/embeddings/grafo/LLM local antes do básico funcionar.** Tasks, projects, source badges e restore básico vêm primeiro.
6. **Contratos canônicos não quebram.** Mission Lens v1, /context/current, /live/snapshot — mudanças são versionadas.
7. **Nenhum endpoint é removido ou renomeado sem versão nova do contrato.**

---

## 9. Matriz de Responsabilidade

| Funcionalidade | Dono Primário | KRATOS | Aurora | OMNIS/HOMINIS | Akasha | Status |
|---------------|---------------|--------|--------|---------------|--------|--------|
| Coleta de contexto (janela ativa) | KRATOS | **Coleta** | — | — | — | REAL |
| Coleta Docker/Git/Sistema | KRATOS | **Coleta** | — | — | — | REAL |
| Classificação de contexto | KRATOS | **Classifica** | — | — | — | REAL |
| Drift detection | KRATOS | **Detecta** | — | — | — | REAL |
| Sugestão de checkpoint | KRATOS | **Sugere** | Interpreta | — | — | REAL |
| Checkpoints (salvar/restaurar) | KRATOS | **Persiste** | — | — | — | REAL |
| Alertas operacionais | KRATOS | **Avalia + exibe** | — | — | — | REAL |
| Mission Lens (composição) | KRATOS | **Compõe** | — | — | — | REAL |
| SSE streaming | KRATOS | **Transmite** | — | — | — | REAL |
| Tasks (CRUD) | KRATOS | **Persiste + exibe** | — | — | — | PARCIAL |
| Projects (lista) | KRATOS | **Persiste + exibe** | — | — | — | PARCIAL |
| Deadlines | KRATOS | **Persiste + exibe** | — | — | — | REAL |
| Planos de execução | KRATOS | **Gera + exibe** | — | — | — | REAL |
| Voz mentor / tom | — | Fornece dados | **Gera** | — | — | PARCIAL |
| Produção de conteúdo | OMNIS | Lê status | — | **Executa** | — | REAL |
| SDR/Prospecção | OMNIS | Lê status | — | **Executa** | — | PARCIAL |
| Deploy/Publishing | OMNIS | Lê status | — | **Executa** | — | REAL |
| Chat conversacional | Aurora | — | **Executa** | — | — | AUSENTE |
| Memória semântica | Akasha | Lê status | — | — | **Armazena** | REAL |
| Relatórios automáticos | Aurora | Fornece dados | **Gera** | Executa | Armazena | AUSENTE |
| Analytics/Tendências | Aurora | Fornece dados | **Analisa** | — | Armazena | AUSENTE |
| Modo guerra | Aurora | Detecta estado | **Ativa** | Executa bloqueios | — | AUSENTE |

---

## 10. Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| **Backend** | FastAPI + uvicorn (port 5100) |
| **Banco** | SQLite (WAL mode, 25 tables) |
| **Streaming** | SSE (Server-Sent Events) via /live/stream |
| **Cache** | In-memory TTL (live_cache_service.py, thread-safe) |
| **Paralelismo** | ThreadPoolExecutor (_parallel_fetch, SECTION_TIMEOUT=5s) |
| **Frontend** | React 18 + Vite 8 + TypeScript + Tailwind 4 (port 5173) |
| **Conexão** | SSE primário → HTTP polling fallback (useLiveKratos.ts) |
| **Fallback** | 3 camadas: real collector → cache TTL → mock JSON |

---

*Documento canônico. Alterações requerem PR e atualização da versão.*
