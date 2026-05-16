# KRATOS — Mission Control Roadmap

**Produto:** Painel de missão pessoal do Lucas Tigre
**Stack:** TanStack Start · React 19 · Tailwind v4 · Cloudflare Workers
**Repositório:** kratos-mission-control

---

## Visão do Produto

Kratos não é um app de produtividade genérico.
É um **cockpit de vida operacional** — uma interface de missão onde cada aba é uma área de controle real da vida do Lucas: o que está acontecendo agora, o que vem na agenda, quais projetos estão vivos, quais checkpoints foram batidos.

---

## FASE 0 — Fundação Operacional ✅ (base criada)
- [x] Setup TanStack Start + Router file-based
- [x] Tailwind v4 configurado
- [x] Radix UI + shadcn/ui instalados
- [x] Hono server em `src/server.ts`
- [x] Rotas base criadas (7 telas stub)
- [x] Wrangler para Cloudflare configurado

---

## FASE 1 — Telas Funcionais (MVP Real)

### Sequência de implementação (ordem de prioridade):
1. `/agora` — mais simples, mais impacto imediato
2. `/checkpoints` — core do produto
3. `/projetos` — segundo mais importante
4. `/` (dashboard) — depende das outras estarem prontas
5. `/agenda` — mais complexo (calendar)
6. `/contexto` — texto livre, mais simples
7. `/sistema` — por último

### Entidades principais:
```
Projeto { id, nome, status, repo, prioridade, ultimaAtividade }
Checkpoint { id, projetoId, titulo, progresso, status, deadline }
Compromisso { id, titulo, data, horario, tipo, descricao }
Contexto { id, conteudo, tags, criadoEm }
SessaoAgora { id, descricao, inicio, fim, duracao }
```

---

## FASE 2 — Camada de Dados Real
- [ ] Definir estratégia de storage: Cloudflare KV vs D1 vs Supabase
- [ ] Criar endpoints Hono em `src/server.ts` para cada entidade
- [ ] Schemas Zod em `api-contract/` para todas as entidades
- [ ] Integrar TanStack Query com as APIs reais

---

## FASE 3 — Integrações
- [ ] GitHub API → Pull status de repositórios
- [ ] Webhook Omnis → Omnis empurra updates de agentes para o Kratos
- [ ] Notificações push (via Cloudflare Workers + Web Push)

---

## FASE 4 — Inteligência
- [ ] Resumo diário gerado por LLM
- [ ] Sugestão de foco do "Agora"
- [ ] Detecção de projetos estagnados (sem atividade > 7 dias)
- [ ] Relatório semanal automático

---

## Critério de Lançamento (Fase 1 → usar no dia a dia)

> Kratos está pronto para uso real quando:
> - Todas as 7 telas têm UI real (sem "Em construção")
> - Dashboard home dá visão real do dia em < 5 segundos
> - Posso adicionar um checkpoint sem abrir outra ferramenta
> - Dark mode funciona em 100% das telas
> - Funciona no celular sem quebrar layout
