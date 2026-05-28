# KRATOS — Autostart e Scripts de Inicialização

**Wave:** W0 — Backend Liveness (`ksw-w0-backend-alive`)  
**Data:** 2026-05-28

---

## TL;DR — Iniciar o KRATOS

```powershell
# Na raiz do projeto:
.\scripts\start.ps1
```

Isso sobe:
- ✅ Backend FastAPI em `http://localhost:5100`
- ✅ Frontend Vite em `http://localhost:5173`
- ✅ Verifica ActivityWatch em `:5600`

---

## Pré-requisitos

| Ferramenta | Versão mínima | Check |
|---|---|---|
| Python | 3.11+ | `python --version` |
| backend/.venv | criado | `ls backend/.venv` |
| bun | 1.3+ | `bun --version` |
| git | 2.x | `git --version` |
| ActivityWatch | qualquer | instalado separadamente |

### Criar venv (se não existir)

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..
```

---

## Scripts disponíveis

### `.\scripts\start.ps1`
Sobe backend + frontend + verifica AW. Aguarda health check (30s timeout).

```
[1/4] Verifica venv
[2/4] Backend (uvicorn app.main:app :5100) → logs/backend.log
[3/4] Frontend (bun run dev :5173) → logs/frontend.log
[4/4] Verifica ActivityWatch :5600
      ↓
Health check /health até OK ou timeout 30s
      ↓
Relatório: Backend 🟢/🔴 | Frontend 🟢/🔴 | AW 🟢/🟡
```

### `.\scripts\stop.ps1`
Para backend e frontend gracefully. NÃO para ActivityWatch.

---

## Ver logs

```powershell
# Backend (erros de startup, requests, etc):
Get-Content logs\backend.log -Tail 30 -Wait

# Frontend (Vite erros, HMR, etc):
Get-Content logs\frontend.log -Tail 20 -Wait
```

---

## Auto-start no boot do Windows

### Opção A — shell:startup (mais simples)

1. `Win+R` → `shell:startup` → Enter
2. Crie atalho: clique direito → Novo → Atalho
3. Destino:
   ```
   powershell.exe -ExecutionPolicy RemoteSigned -File "C:\Users\lucas\kratos-mission-control\scripts\start.ps1"
   ```
4. Nome: `KRATOS Start`
5. Pronto — ao logar no Windows, KRATOS sobe em background

### Opção B — Scheduled Task (mais robusto, sem janela)

```powershell
$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy RemoteSigned -WindowStyle Hidden -File `"C:\Users\lucas\kratos-mission-control\scripts\start.ps1`""

$trigger = New-ScheduledTaskTrigger -AtLogOn

Register-ScheduledTask `
    -TaskName "KRATOS_AutoStart" `
    -Action $action `
    -Trigger $trigger `
    -RunLevel Limited `
    -Description "Sobe KRATOS Mission Control no login"
```

Para remover depois:
```powershell
Unregister-ScheduledTask -TaskName "KRATOS_AutoStart" -Confirm:$false
```

---

## Troubleshooting

| Sintoma | Causa provável | Fix |
|---|---|---|
| "venv não encontrado" | `.venv` não criado | `cd backend && python -m venv .venv && pip install -r requirements.txt` |
| Backend não responde em 30s | Erro de import | `Get-Content logs\backend.log -Tail 20` |
| Porta 8000 ocupada | Backend já rodando | Rode `.\scripts\stop.ps1` e tente de novo |
| Frontend 5173 ocupada | Vite já rodando | Rode `.\scripts\stop.ps1` |
| AW offline | ActivityWatch não iniciado | Abra ActivityWatch manualmente |

---

## ActivityWatch

O KRATOS usa ActivityWatch para capturar app ativo, janela e drift cognitivo.  
Sem AW: contexto atual e drift ficam em modo **fallback** (dados menos precisos, mas KRATOS continua funcional).

Download: https://activitywatch.net/  
Porta: `:5600`  
O `start.ps1` **verifica** mas **não inicia** o AW — ele geralmente roda como sistema ou bandeja.

---

## Estrutura de logs

```
kratos-mission-control/
└── logs/
    ├── backend.log    ← FastAPI/uvicorn (stdout + stderr)
    └── frontend.log   ← Vite dev server
```

Logs são ignorados pelo git (`.gitignore` via `logs/*.log`).
