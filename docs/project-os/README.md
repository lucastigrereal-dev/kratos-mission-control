# KRATOS Project OS — Governance Pack v2

**Status:** Active | **Version:** 2.0 | **Date:** 2026-05-18

---

## O Que É

O Project OS Pack é o sistema de governança operacional do KRATOS. Ele define:

- **Quem** pode fazer **o quê** (agentes, skills)
- **Como** o trabalho é validado (gates, comandos)
- **Onde** cada responsabilidade termina (boundary map)
- **Qual** o estado atual do projeto (state JSON)

Não é produto. Não é feature. É a **camada de operação** que mantém o projeto governável por agentes de IA + 1 humano (Lucas).

---

## Estrutura do Pack

```
docs/project-os/
├── README.md                    ← Este arquivo
├── governance-constitution.md   ← A constituição (regras imutáveis)
├── boundary-map.md              ← Mapa de separação de responsabilidades
├── agent-manifest.md            ← Catálogo de agentes
└── skill-manifest.md            ← Catálogo de skills

.claude/
├── commands/                    ← Comandos operacionais (/audit, /preflight, /ship, /status)
├── agents/                      ← Definições de agentes (5 core)
├── state/                       ← Estado do projeto (JSON machine-readable)
└── hooks/                       ← Hooks de segurança e validação

./
├── CLAUDE.md                    ← Instruções do projeto (regras de ouro, arquitetura)
└── AGENTS.md                    ← Instruções para agentes de IA
```

---

## Princípios

1. **KRATOS vê. Não age.** — A linha entre observar e executar é sagrada.
2. **Contratos são a fonte da verdade.** — `api-contract/` define o que existe.
3. **Gates antes de commits.** — Build, test, lint. Sempre.
4. **Staging seletivo.** — Nunca `git add .`. Cada arquivo merece ser visto.
5. **Humano decide.** — Deploy, push, e ações destrutivas exigem autorização do Lucas.

---

## Próxima Ação

Após instalação: executar `/audit` para validar que todos os gates passam.
