# KRATOS PACK AUDIT REPORT v2

**Data:** 2026-05-16
**Pacote:** `C:\Users\lucas\Downloads\KRATOS_PACK_REVIEW\kratos-pack\` (extraído de `kratos-claude-pack.zip`)
**Projeto atual:** `C:\Users\lucas\kratos-mission-control`
**Branch:** `main`

---

## 1. Comparação CLAUDE.md

| Item | Projeto Atual | Pacote |
|---|---|---|
| Existe? | **NÃO** — não há CLAUDE.md no nível do projeto | **SIM** — `CLAUDE.md` (140 linhas, 5.521 bytes) |
| Stack declarada | (ausente) | React 19, TanStack Start/Router/Query, Tailwind v4, Radix UI, Zod, Vite 7, Bun, Cloudflare Workers |
| Missão declarada | (ausente) | Painel de missão pessoal do Lucas — cockpit de vida real, 7 rotas |
| Arquitetura documentada | (ausente) | Documentada com árvore de diretórios, convenções de código, DoD |
| Regras de ouro | (ausente) | 8 regras incluindo "nunca editar routeTree.gen.ts" |

**Conclusão:** O pacote provê um CLAUDE.md completo e bem escrito. Não há conflito de sobrescrita porque o projeto atual não tem CLAUDE.md. Porém, o CLAUDE.md do pacote **não referencia** os conceitos existentes no projeto (mundo 3D de ilhas, glass panels, tokens KRATOS, neuro-UX TDAH, Akasha, Omnis, Kimi specs).

**Risco:** BAIXO. O CLAUDE.md do pacote é um bom template, mas precisaria de merge manual com o contexto real do que já foi construído (skills existentes, design system de ilhas, etc.).

---

## 2. Comparação `.claude/`

### 2.1 Estrutura

| Pasta | Projeto Atual | Pacote |
|---|---|---|
| `.claude/agents/` | **Não existe** | 5 agentes (`.md` soltos) |
| `.claude/skills/` | 10 skills (`.md` soltos, flat) | 7 skills (subpastas `nome/SKILL.md`) |
| `.claude/settings.json` | Não existe | Não existe |
| `.claude/settings.local.json` | Não existe | Não existe |

### 2.2 Skills — Projeto Atual (10)

| Skill | Tier | Status |
|---|---|---|
| `akasha-vault-builder.md` | strategy | placeholder |
| `glass-panel-builder.md` | core | ativo |
| `hud-assembler.md` | core | ativo (6 protected components) |
| `island-composer.md` | core | ativo (6 protected components) |
| `kimi-to-code.md` | core | ativo (5 protected endpoints) |
| `motion-guardian.md` | analytics | ativo |
| `neuro-ux-checker.md` | analytics | ativo |
| `omnis-lab-builder.md` | strategy | placeholder |
| `token-enforcer.md` | strategy | ativo |
| `visual-qa-kimi.md` | analytics | ativo |

### 2.3 Skills — Pacote (7)

| Skill | Pasta | Propósito |
|---|---|---|
| `api-contract-sync` | `api-contract-sync/SKILL.md` | Sincronizar schemas Zod server↔cliente |
| `bug-triage` | `bug-triage/SKILL.md` | Diagnosticar bugs sistematicamente |
| `component-scaffolder` | `component-scaffolder/SKILL.md` | Criar componentes React no padrão Kratos |
| `refactor-guardian` | `refactor-guardian/SKILL.md` | Refatorar preservando interfaces |
| `repo-architect` | `repo-architect/SKILL.md` | Mapear arquitetura do repo |
| `route-builder` | `route-builder/SKILL.md` | Criar rotas TanStack Router |
| `ship-checklist` | `ship-checklist/SKILL.md` | Checklist pré-merge/deploy |

### 2.4 Agentes — Pacote (5, NOVO)

| Agente | Propósito |
|---|---|
| `kratos-api-builder.md` | Construir endpoints Hono em `src/server.ts` |
| `kratos-architect.md` | Planejamento e arquitetura (não escreve código) |
| `kratos-data-layer.md` | Schemas Zod, tipos, mocks, hooks TanStack Query |
| `kratos-qa-guard.md` | Revisor de qualidade pré-merge |
| `kratos-ui-builder.md` | Construir UI de rotas (Tailwind v4, shadcn/ui) |

### 2.5 Análise de Sobreposição

**ZERO sobreposição de nomes.** Nenhuma skill ou agente do pacote conflita com skills existentes.

**Diferença estrutural crítica:** As skills atuais são arquivos `.md` soltos em `.claude/skills/`. As skills do pacote usam subpastas (`nome-da-skill/SKILL.md`). O sistema de skills pode ou não suportar ambas as estruturas simultaneamente.

---

## 3. Arquivos que Seriam Sobrescritos

**Nenhum.** Não há sobreposição de caminhos de arquivo entre o pacote e o projeto atual.

| Caminho no pacote | Existe no projeto? | Seria sobrescrito? |
|---|---|---|
| `CLAUDE.md` | Não | Não (seria criado) |
| `KRATOS-ROADMAP.md` | Não | Não (seria criado) |
| `PLAYBOOK-5-FRENTES.md` | Não | Não (seria criado) |
| `TERMINAL-COMMANDS.md` | Não | Não (seria criado) |
| `.claude/agents/*` (5 arquivos) | Não | Não (seria criado) |
| `.claude/skills/*/SKILL.md` (7 skills) | Não | Não (seria criado) |

---

## 4. O que é Seguro Copiar

**Tudo é seguro do ponto de vista de conflito de arquivos** — zero sobrescritas. Porém com ressalvas:

| Arquivo/Pasta | Seguro? | Ressalva |
|---|---|---|
| `CLAUDE.md` | ✅ Seguro | Não referencia o mundo 3D, ilhas, tokens KRATOS já construídos. Ideal fazer merge manual. |
| `.claude/agents/` | ✅ Seguro | Pasta nova. Agentes bem escritos com guardrails corretos (sem deploy/push/env). |
| `.claude/skills/api-contract-sync/` | ✅ Seguro | Skill útil, sem conflito. Template de schema Zod incluso. |
| `.claude/skills/bug-triage/` | ✅ Seguro | Cobre bugs comuns de TanStack/Tailwind/Hono. |
| `.claude/skills/component-scaffolder/` | ✅ Seguro | Template CVA + cn() + lucide-react. Segue stack. |
| `.claude/skills/refactor-guardian/` | ✅ Seguro | Lista de arquivos críticos. |
| `.claude/skills/repo-architect/` | ✅ Seguro | Stack documentada corretamente. |
| `.claude/skills/route-builder/` | ✅ Seguro | Template `createFileRoute` com loader. Regra crítica: não editar routeTree.gen.ts. |
| `.claude/skills/ship-checklist/` | ✅ Seguro | DoD completo com convenção de commits. |
| `KRATOS-ROADMAP.md` | ✅ Seguro | Documento de referência, não código. |
| `PLAYBOOK-5-FRENTES.md` | ✅ Seguro | Playbook de paralelização. Sequência clara. |
| `TERMINAL-COMMANDS.md` | ✅ Seguro | Referência de comandos. |

---

## 5. O que é Perigoso Copiar

| Item | Perigo | Nível |
|---|---|---|
| **Estrutura mista de skills** | Skills atuais (flat `.md`) + skills do pacote (subpastas `nome/SKILL.md`). Se o sistema exige uma estrutura consistente, skills antigas podem ficar invisíveis. | ⚠️ MÉDIO |
| **CLAUDE.md cego** | O CLAUDE.md do pacote ignora completamente o que já existe: mundo 3D de ilhas, glass panels, tokens CSS customizados, neuro-UX TDAH, Akasha vault, Omnis lab, Kimi specs. Se copiado sem merge, Claude perde contexto de 10 skills existentes. | 🔴 ALTO |
| **5 Worktrees de uma vez** | O PLAYBOOK-5-FRENTES.md propõe 5 worktrees simultâneos, o que viola a regra "não abrir 5 worktrees ainda". O playbook reconhece isso ("só após auditoria", "só após lint/build limpos"), mas o template está lá como tentação. | ⚠️ MÉDIO |
| **Worktree deploy-config** | A Frente 5 (`kratos-deploy`) é explicitamente marcada como "SÓ ABRE COM AUTORIZAÇÃO EXPLÍCITA DO LUCAS". O template existe, mas se um agente for lançado sem o prompt correto, pode tentar deploy. | ⚠️ MÉDIO |
| **Contexto perdido** | As skills do pacote desconhecem os `protected_components` e `protected_endpoints` das skills atuais. Um `refactor-guardian` do pacote não sabe que `KratosVisualShell.tsx`, `KratosWorldMap.tsx`, `Layout.tsx` são protegidos. | 🔴 ALTO |

---

## 6. Verificação de Regras Absolutas

| Regra | Status | Evidência no pacote |
|---|---|---|
| **Nunca editar `src/routeTree.gen.ts`** | ✅ RESPEITA | Citado 3x: CLAUDE.md §"Regras de Ouro" #1, `route-builder/SKILL.md` como "REGRA CRÍTICA", `repo-architect/SKILL.md` §Stack |
| **Não fazer deploy** | ✅ RESPEITA | Todo agente tem "NUNCA fazer deploy". `PLAYBOOK-5-FRENTES.md`: Frente 5 "SÓ ABRE COM AUTORIZAÇÃO EXPLÍCITA". `TERMINAL-COMMANDS.md`: "NUNCA sem autorização explícita". |
| **Não mexer em `.env`/secrets** | ✅ RESPEITA | Agente API Builder: "NUNCA ler .env ou secrets". Playbook: "NÃO leia .env". Consistente em todos os prompts. |
| **Não abrir 5 worktrees ainda** | ⚠️ AMBÍGUO | O pacote **propõe** 5 worktrees (CLAUDE.md §Paralelização, PLAYBOOK-5-FRENTES.md). Mas condiciona a "só após auditoria aprovada", "só após lint/build limpos". O template existe mas com guardrails. |
| **Não implementar produto agora** | ✅ RESPEITA | `kratos-architect.md`: "Não escreve código de produto". Agentes são scaffolding/config, não implementação. |
| **Não fazer merge** | ✅ RESPEITA | `kratos-qa-guard.md`: "NUNCA faça merge". `PLAYBOOK-5-FRENTES.md`: ordem de merge documentada mas sem comando automático. |
| **Não fazer push** | ✅ RESPEITA | Todos os 5 agentes terminam com "NÃO faça push". Consistente. |
| **Não copiei arquivos** | ✅ RESPEITO | Zero cópias realizadas nesta auditoria. |
| **Não sobrescrevi CLAUDE.md** | ✅ RESPEITO | Nenhum arquivo alterado. |
| **Não sobrescrevi `.claude`** | ✅ RESPEITO | Nenhum arquivo alterado. |
| **Não li `.env`/secrets/keys** | ✅ RESPEITO | Nenhum arquivo sensível lido. |

---

## 7. Sumário de Compatibilidade

```
CLAUDE.md           [NOVO] — projeto não tem. Bom template, falta contexto real.
KRATOS-ROADMAP.md   [NOVO] — referência de fases. Útil.
PLAYBOOK-5-FRENTES  [NOVO] — bem escrito, guardrails nos prompts.
TERMINAL-COMMANDS    [NOVO] — referência de comandos. Útil.
.claude/agents/      [NOVO] — 5 agentes. Bem escritos, seguros.
.claude/skills/      [MERGE] — 7 skills novas (subpastas) vs 10 existentes (flat).
                     Zero conflito de nomes. Diferença estrutural.
```

---

## 8. Recomendações

### Imediato ( seguro )
1. **Copiar `.claude/agents/`** — pasta nova, zero conflito. Agentes são bem escritos e seguros.
2. **Copiar `KRATOS-ROADMAP.md` e `TERMINAL-COMMANDS.md`** — docs de referência.
3. **Copiar `.claude/skills/api-contract-sync/`** — skill standalone útil.

### Com cautela ( requer decisão )
4. **CLAUDE.md: NÃO copiar direto.** Fazer merge manual: pegar a estrutura do pacote (stack, convenções, regras de ouro) e adicionar o contexto real do projeto (ilhas, tokens, skills existentes, protected components).
5. **Skills do pacote (`component-scaffolder`, `route-builder`, `ship-checklist`, `bug-triage`, `refactor-guardian`, `repo-architect`):** úteis, mas precisam conhecer o contexto existente. Copiar para `.claude/skills/` como subpastas (mantendo a estrutura flat das 10 skills atuais também).

### Bloqueado ( não fazer agora )
6. **NÃO abrir worktrees** — mesmo com os templates prontos. Aguardar lint/build limpos.
7. **NÃO executar a Frente 5 (deploy)** — requer autorização explícita.
8. **NÃO fazer merge de branches** — requer auditoria QA primeiro.

---

## 9. Próximo Passo Sugerido

1. Lucas aprova quais itens copiar desta auditoria
2. Copiar itens aprovados (agentes, docs, skills selecionadas)
3. Fazer merge manual do CLAUDE.md (template do pacote + contexto real do projeto)
4. Rodar `bun run lint && bun run build` para validar
5. Só então considerar abrir 1 (uma) worktree por vez

---

## 10. Snapshot Final

```
Projeto atual (14 itens em .claude/):
  .claude/skills/*.md × 10 (flat, frontmatter YAML)

Pacote (14 itens):
  CLAUDE.md
  KRATOS-ROADMAP.md
  PLAYBOOK-5-FRENTES.md
  TERMINAL-COMMANDS.md
  .claude/agents/*.md × 5
  .claude/skills/*/SKILL.md × 7 (subpastas)

Sobreposição: ZERO
Arquivos que seriam criados: 19
Arquivos que seriam sobrescritos: 0
```
