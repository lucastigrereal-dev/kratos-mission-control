# KRATOS Safety Hooks

Hooks de segurança que rodam em eventos do ciclo de vida do projeto.

---

## Hook: pre-commit-validation

**Trigger:** Antes de qualquer commit
**Type:** Manual (invocado por `/preflight` ou pelo agente `kratos-qa-guard`)

### Checks

1. **Build gate:** `bun run build` deve passar com zero erros
2. **Test gate:** `bun run test` deve passar com zero falhas
3. **Protected files:** Verificar se `src/routeTree.gen.ts` ou componentes protegidos não estão no diff
4. **Token compliance:** Grep por `style={{ color: "#` no diff → BLOCK se encontrado
5. **Type safety:** Grep por `: any` ou `as any` no código staged → FLAG
6. **Console hygiene:** Grep por `console.log` no código staged → FLAG

### Outcome

- **PASS:** Todos os checks passam → commit autorizado
- **FLAG:** Warnings não-bloqueantes → commit autorizado com notas
- **BLOCK:** Violação de regra de ouro → commit bloqueado

---

## Hook: safety-guard

**Trigger:** Em toda sessão de desenvolvimento
**Type:** Permanente (ativado pelo CREDIT SAVER)

### Guards Ativos

1. **No deploy:** Bloquear `wrangler deploy`, `bunx wrangler deploy`, `cloudflare`
2. **No push:** Bloquear `git push` para remote (exceto se autorizado)
3. **No secrets:** Bloquear leitura de `.env`, `.env.local`, `*.secret`
4. **No OMNIS:** Bloquear chamadas de execução do OMNIS
5. **No `git add .`:** Bloquear staging em massa
6. **No force push to main:** Bloquear `git push --force origin main`

### Outcome

- **ALLOW:** Operação segura → prossegue
- **BLOCK:** Operação requer autorização → solicitar ao Lucas
- **WARN:** Operação arriscada mas não bloqueada → alertar e prosseguir

---

## Hook: worktree-limit

**Trigger:** Antes de criar novo worktree
**Type:** Preventivo

### Rule

- Máximo 2 worktrees simultâneas
- Se já existem 2: rejeitar nova criação até que uma seja concluída e removida
- Ordem canônica: `data-layer` → `api-routes` → `ui-pages`
- `auth` e `deploy-config` exigem autorização explícita adicional

---

## Hooks Directory Structure

```
.claude/hooks/
├── README.md              ← Este arquivo
├── preflight-check.sh     ← Script de validação pré-commit
└── safety-rules.json      ← Regras em formato machine-readable
```

---

*Hooks canônicos. Violação de hook constitui quebra de governança.*
