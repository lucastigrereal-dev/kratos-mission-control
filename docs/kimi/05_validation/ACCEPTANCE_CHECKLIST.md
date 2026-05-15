# ACCEPTANCE_CHECKLIST.md — KRATOS Frontend
## Checklist Completo de Aceite por Microfase

---

## TÉCNICO (obrigatório em TODA microfase)

- [ ] `cd frontend && npm run build` → 0 erros, build concluído
- [ ] `python -m pytest -q` → 128/128 passed
- [ ] Nenhum arquivo de `backend/` foi alterado
- [ ] Nenhum endpoint foi adicionado ou modificado
- [ ] `useLiveKratos.ts` não foi alterado
- [ ] `/live/stream`, `/live/snapshot`, `/mission/lens` intocados
- [ ] Nenhuma dependência nova instalada sem autorização
- [ ] Nenhum `any` TypeScript criado
- [ ] Nenhum `console.log` ou `debugger` no código entregue
- [ ] `git status --short` limpo antes de commitar

---

## VISUAL

- [ ] Interface NÃO parece SaaS genérico
- [ ] Interface NÃO parece dashboard corporativo
- [ ] Interface NÃO parece LinkedIn/Notion/Grafana
- [ ] Fundo oceano azul presente (não fundo branco/cinza)
- [ ] Glassmorphism consistente: `backdrop-blur-xl` + `border-white/[0.08-0.15]`
- [ ] Glow temático presente na ilha ativa
- [ ] Aurora presente no RightRail topo
- [ ] Missão atual visível em menos de 10 segundos
- [ ] Próxima ação visível e clicável no BottomDock
- [ ] SourceBadge visível onde dados reais são usados

---

## NEURO-UX (TDAH-friendly)

- [ ] Hierarquia clara — saber o que fazer sem pensar
- [ ] Não cria dashboard de culpa (excesso de tarefas atrasadas em vermelho)
- [ ] EmptyState amigável quando não há dados
- [ ] LoadingSkeleton presente durante carregamento (não spinner genérico)
- [ ] `prefers-reduced-motion` respeitado — animações pausam
- [ ] Focus ring visível em todos elementos interativos (`ring-2 ring-amber-400/60`)
- [ ] Ilhas acessíveis via teclado (`tabIndex={0}` + `role="button"`)

---

## GIT

- [ ] Sem `git add .` — staging seletivo
- [ ] Commit tem mensagem semântica: `feat(kratos):`, `fix(kratos):`, `docs(kratos):`
- [ ] Relatório gerado ANTES do commit
- [ ] Hash do commit registrado no ADOPTION_LOG

---

## BUILD GUARD (rodar antes de cada microfase)

```powershell
# BUILD_GUARD.ps1 — Windows / Claude Code no KRATOS
# Rodar: .\docs\kimi\11_VALIDATION\BUILD_GUARD.ps1

Write-Host "=== KRATOS BUILD GUARD ===" -ForegroundColor Cyan

# 1. Backend tests
Write-Host "[1/3] Backend tests..." -ForegroundColor Yellow
$pytest = python -m pytest -q 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "FALHOU: Backend tests" -ForegroundColor Red
    Write-Host $pytest
    exit 1
}
Write-Host "OK: Backend 128/128" -ForegroundColor Green

# 2. Frontend build
Write-Host "[2/3] Frontend build..." -ForegroundColor Yellow
Set-Location frontend
$build = npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "FALHOU: Frontend build" -ForegroundColor Red
    Write-Host $build
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "OK: Frontend build" -ForegroundColor Green

# 3. Git status
Write-Host "[3/3] Git status..." -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "AVISO: Arquivos não commitados:" -ForegroundColor Yellow
    Write-Host $gitStatus
} else {
    Write-Host "OK: Working tree clean" -ForegroundColor Green
}

Write-Host "=== BUILD GUARD PASSOU ===" -ForegroundColor Green
```

```bash
#!/bin/bash
# BUILD_GUARD.sh — Linux/Mac
# Rodar: bash docs/kimi/11_VALIDATION/BUILD_GUARD.sh

echo "=== KRATOS BUILD GUARD ==="

# Backend tests
echo "[1/3] Backend tests..."
python -m pytest -q
if [ $? -ne 0 ]; then echo "FALHOU: Backend tests"; exit 1; fi
echo "OK: Backend"

# Frontend build
echo "[2/3] Frontend build..."
cd frontend && npm run build
if [ $? -ne 0 ]; then echo "FALHOU: Frontend build"; cd ..; exit 1; fi
cd ..
echo "OK: Frontend build"

# Git status
echo "[3/3] Git status..."
git status --short

echo "=== BUILD GUARD PASSOU ==="
```

---

# VISUAL_QA_CHECKLIST.md

## Classificação de divergências

| Símbolo | Classificação | O que significa | Ação |
|---|---|---|---|
| ✅ | OK | Idêntico ou equivalente funcional | Nenhuma |
| ⚠️ | AJUSTE LEVE | Diferença pequena, não bloqueia | Corrigir na próxima iteração |
| ❌ | DIVERGÊNCIA | Diferença visível significativa | Corrigir antes de avançar |
| 🚫 | BLOQUEANTE | Quebra a experiência principal | Corrigir AGORA antes de commitar |

## Template de QA por componente

```
| Componente | Mockup | Implementado | Classificação | Nota |
|---|---|---|---|---|
| OceanBackdrop | Azul gradiente dia claro | ✓ | ✅ OK | |
| CloudLayer | 5 nuvens animando | ✓ animando? | ⚠️ AJUSTE | Verificar drift |
| FloatingIsland OMNIS | Glow roxo | | ❌ DIVERGÊNCIA | Falta glow |
| CentralCastle | Banner missão | ✓ | ✅ OK | |
| HolographicCore | Anéis + cubo 3D | | 🚫 BLOQUEANTE | Não implementado |
```
