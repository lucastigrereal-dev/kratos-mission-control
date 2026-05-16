# KRATOS — Comandos do Terminal (Claude Code)

⚠️ SEQUÊNCIA OBRIGATÓRIA ANTES DE QUALQUER COMANDO:
1. Auditar o pacote (Claude Code audita, não instala)
2. Instalar seletivamente
3. Validar lint/build
4. Só então abrir frentes

---

## Auditoria do Pacote (PRIMEIRO PASSO)

```powershell
# Windows — extrair em pasta de revisão (NUNCA na raiz do projeto)
mkdir "$env:USERPROFILE\Downloads\KRATOS_PACK_REVIEW" -Force
Expand-Archive -Path "$env:USERPROFILE\Downloads\kratos-claude-pack.zip" -DestinationPath "$env:USERPROFILE\Downloads\KRATOS_PACK_REVIEW" -Force
dir "$env:USERPROFILE\Downloads\KRATOS_PACK_REVIEW" -Recurse
```

**Prompt de auditoria para o Claude Code (na raiz do projeto):**
```
Leia o projeto atual do KRATOS e audite o pacote extraído em:
C:\Users\lucas\Downloads\KRATOS_PACK_REVIEW

Faça somente:
1. Comparar CLAUDE.md atual vs pacote
2. Comparar .claude atual vs pacote
3. Listar arquivos que seriam sobrescritos
4. Listar o que é seguro copiar
5. Listar o que é perigoso copiar
6. Verificar se o pacote respeita as regras
7. Gerar relatório em docs/KRATOS_PACK_AUDIT_REPORT.md

Regras absolutas:
- NÃO copie arquivos
- NÃO sobrescreva CLAUDE.md
- NÃO sobrescreva .claude
- NÃO crie worktrees
- NÃO rode deploy
- NÃO faça merge ou push
- NÃO leia .env, secrets, *.key, *.pem
```

---

## Setup (só após auditoria aprovada)

```bash
# Instalar dependências
bun install

# Rodar dev server
bun run dev
# → http://localhost:3000

# Lint
bun run lint

# Build
bun run build
```

---

## Worktrees (só após lint/build limpos)

```bash
git worktree add ../kratos-ui      -b feat/ui-pages
git worktree add ../kratos-api     -b feat/api-routes
git worktree add ../kratos-data    -b feat/data-layer
git worktree add ../kratos-auth    -b feat/auth
git worktree add ../kratos-deploy  -b feat/deploy-config
git worktree list
```

---

## Deploy — NUNCA sem autorização explícita

```bash
# SÓ RODAR COM APROVAÇÃO DO LUCAS
bunx wrangler deploy
```

---

## Sessão de Trabalho Típica (1-2h)

```bash
# Terminal 1 — dev server
cd kratos-mission-control && bun run dev

# Terminal 2 — frente ativa (você supervisiona)
cd ../kratos-data && claude

# Terminal 3 — monitorar agentes
claude agents
```
