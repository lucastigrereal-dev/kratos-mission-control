# /ship — Release Readiness Check

Verifica se o branch atual está pronto para staging/production.

## Execution Steps

1. `/audit` completo (build + test + lint)
2. `git log --oneline -10` — revisar commits recentes
3. `git diff origin/main...HEAD --stat` — diff contra main (se em feature branch)
4. Verificar E2E results (se disponíveis)
5. Verificar checklist de deploy:
   - Cloudflare secrets configurados?
   - `wrangler.jsonc` válido?
   - Rotas novas têm loader?
   - Schemas Zod cobrem todos os novos endpoints?

## Output Format

```
KRATOS SHIP CHECK — <timestamp>
Audit:    PASS/FAIL
E2E:      <N>/<M> PASS (<X>%)
Branch:   <branch> (ahead by <N> commits)
Deploy:   READY / PENDING (items faltantes)
────────
Verdict: CLEARED FOR STAGING / BLOCKED
```

## Blocked If

- Audit falha
- E2E < 90% pass rate (para staging)
- Deploy checklist tem itens críticos pendentes
- Working tree dirty

## Notes

- NÃO executa deploy
- NÃO faz push
- Apenas avalia readiness
- Deploy requer autorização explícita do Lucas
