# KRATOS Boundary Map — Separation of Responsibilities

**Status:** Canonical | **Version:** 2.0 | **Date:** 2026-05-18

---

## The Six Entities

```
┌─────────────────────────────────────────────────────────┐
│                    LUCAS DECIDE                          │
│         (juízo final, aprovação, direção)                │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ relatórios, alertas, estado
    ┌──────────────────────┼──────────────────────────┐
    │                      │                          │
    ▼                      ▼                          ▼
┌──────────┐    ┌──────────────┐    ┌──────────────────────┐
│  KRATOS  │    │   AURORA     │    │    OMNIS / HOMINIS   │
│   VÊ     │───▶│ INTERPRETA   │    │       AGE            │
│ cockpit  │    │ voz mentor   │    │ skills, crews, deploys│
└──────────┘    └──────────────┘    └──────────────────────┘
    │                                      │
    │ dados                                │ dados
    ▼                                      ▼
┌──────────┐                        ┌──────────────┐
│  AKASHA  │                        │   PUBLISHER  │
│  LEMBRA  │                        │     OS       │
│ pgvector │                        │  (externo)   │
└──────────┘                        └──────────────┘
```

---

## KRATOS Boundary

### KRATOS OWNS (exclusivo)
- Coleta de contexto de janela ativa (ActivityWatch, psutil, filesystem scan)
- Docker/Git/Sistema health checks (coleta real, não mock)
- Classificação de contexto (on_focus, off_focus, idle, deep_work)
- Drift detection (desvio do plano vs realidade)
- Sugestão de checkpoint (baseado em drift)
- Checkpoints CRUD (salvar/restaurar estado mental)
- Alertas operacionais (avaliação + exibição)
- Mission Lens v1 (composição de verdade operacional)
- SSE streaming (/live/stream)
- Tasks CRUD (persistência + exibição)
- Projects lista (persistência + exibição)
- Deadlines tracking
- Planos de execução (geração + exibição)
- Design tokens e design system visual
- Shell, navegação, layout grid

### KRATOS READS (read-only)
- Status do OMNIS (online/offline, crews ativas, jobs recentes)
- Status da Akasha (online/offline, doc count, último sync)
- Status do Publisher OS (fila, publicações recentes)
- GitHub status (PRs, commits de repos trackeados)
- Status de serviços (Supabase DB, Redis, Ollama, n8n)

### KRATOS NEVER
- Executa skills do Instagram/publicação
- Comanda crews CrewAI
- Faz deploy ou push para produção
- Publica conteúdo
- Executa SDR/prospecção
- Escreve na Akasha
- Gera código fora do próprio repo
- Toma decisões pelo Lucas

---

## Aurora Boundary

### Aurora OWNS
- Interpretação de padrões de comportamento do Lucas
- Voz mentor (tom calmo/urgente/crítico)
- Sugestões contextuais ("Você parece estar preso nisso há 40min")
- Análise de tendências de produtividade
- Chat conversacional (futuro)
- Relatórios automáticos de insight
- Modo guerra (ativação de bloqueios de distração)

### Aurora READS
- Dados brutos do KRATOS (Mission Lens, checkpoints, contexto)
- Histórico da Akasha (para análise de tendências)

### Aurora NEVER
- Executa ações externas diretamente
- Altera estado sem registrar em log
- Ignora preferência explícita do Lucas

---

## OMNIS/HOMINIS Boundary

### OMNIS OWNS
- Execução de skills de conteúdo (SEOgram, carrossel, etc.)
- Crews CrewAI (produção, redação, QA)
- Pipeline de publishing (BullMQ)
- Deploys de conteúdo
- Integração com APIs externas (Meta, Publer, Kommo)
- SDR e prospecção automatizada

### OMNIS READS
- Briefing e estratégia definidos pelo Lucas
- Estado de serviços (saúde, disponibilidade)

### OMNIS NEVER
- Altera configuração do KRATOS
- Decide estratégia editorial sem aprovação
- Publica sem passing score de brand_fit

---

## Akasha Boundary

### Akasha OWNS
- Memória vetorial de longo prazo (pgvector)
- Documentos, livros, insights históricos
- Busca semântica e híbrida (pgvector + tsvector)
- Grafo relacional de conhecimento (Mem0 + Kuzu)

### Akasha READS
- Nada — é repositório puro

### Akasha NEVER
- Toma decisões
- Sugere ações não solicitadas
- Expõe dados privados sem autorização

---

## Cross-Boundary Communication Rules

1. **Toda comunicação cross-system é via API/contrato documentado**
2. **Mock data é sempre sinalizado com `source=mock`**
3. **Dados stale são sinalizados com `stale=true` + timestamp**
4. **Erros de sistema externo nunca quebram KRATOS — fallback visual sempre**
5. **Nenhum sistema pode se passar por outro** (KRATOS não pode "falar como Aurora")

---

*Mapa canônico. Atualizado quando novos sistemas ou responsabilidades são adicionados.*
