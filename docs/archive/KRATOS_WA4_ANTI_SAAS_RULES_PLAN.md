# KRATOS WA4 — ANTI-SAAS RULES ENFORCEMENT PLAN

**Date:** 2026-05-15 | **Block:** A4 | **Status:** COMPLETE

---

## Plano de enforcement contínuo

### Checkpoints visuais por bloco

| # | Regra | Como verificar | Frequência |
|---|---|---|---|
| 1 | Fundo oceano escuro | Inspecionar `kr-shell` background | Todo bloco |
| 2 | Glass `rgba(15,23,42,X)` | grep por rgba no index.css | Todo bloco |
| 3 | Sem fundo branco/claro | grep por `#fff\|#ffffff\|white\|#f5f5f5\|#f0f0f0` | Todo bloco |
| 4 | Sem cores SaaS genéricas | grep por gradientes roxo-rosa | Wave C |
| 5 | Ilhas com identidade | Verificar `--kr-island-*` tokens usados | Wave B |
| 6 | Labels UPPERCASE tracking | Inspecionar `.kr-island-label` | Wave B |
| 7 | Aurora presente | Verificar AuroraPanel no RightRail | Wave C |
| 8 | Motion CSS-only | Verificar sem imports Framer/GSAP | Todo bloco |
| 9 | Dados reais preservados | Verificar useLiveKratos/useApi intactos | Wave E |

### Anti-padrões bloqueados automaticamente

| Anti-padrão | Bloqueio |
|---|---|
| Import de Framer Motion | Build quebra (não instalado) |
| Import de GSAP | Build quebra (não instalado) |
| Import de Three.js | Build quebra (não instalado) |
| Alteração de backend/ | Diretório não existe |
| `git add .` | Regra explícita — nunca usar |
| Force push | Regra explícita — nunca usar |

### Padrões a eliminar do código atual

| Local | Padrão SaaS | Substituir por |
|---|---|---|
| index.css | `--kr-bg-primary: #0e0e1a` (genérico) | Já está correto (escuro) — manter |
| index.css | `--kr-bg-card: #1a1a2e` | OK — escuro com glass overlay |
| FloatingIsland | Labels sem glass-backing | Adicionar glass-backed labels (Wave B) |
| KratosRightRail | 260px estreito | Expandir para 340px (Wave B) |
| OmnisPage | Placeholder mínimo | Expandir com identidade Omnis (Wave C) |

### Status atual: ~90% compliance

O código atual já segue a maioria das regras Anti-SaaS. Ações restantes são refinamento, não correção.

## Próximo bloco

A5 — Design Token Upgrade (CSS changes begin)
