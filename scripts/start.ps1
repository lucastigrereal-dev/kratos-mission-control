#Requires -Version 5.1
<#
.SYNOPSIS
    KRATOS Mission Control — Start Script
    Sobe: Backend (FastAPI :5100) + Frontend (Vite :5173) + verifica ActivityWatch (:5600)

.DESCRIPTION
    W0 — Backend Liveness (ksw-w0-backend-alive)
    Roda no terminal, logs em kratos-mission-control/logs/
    Uso: cd kratos-mission-control; .\scripts\start.ps1

.NOTES
    Execution Policy: RemoteSigned (CurrentUser) — ja confirmado
    NÃO requer admin. NÃO vaza secrets em log.
#>

$ErrorActionPreference = "Continue"

# ─── Paths ──────────────────────────────────────────────────────────────────
$ROOT        = Split-Path -Parent $PSScriptRoot
$BACKEND_DIR = Join-Path $ROOT "backend"
$VENV_PYTHON = Join-Path $BACKEND_DIR ".venv\Scripts\python.exe"
$VENV_UVICORN = Join-Path $BACKEND_DIR ".venv\Scripts\uvicorn.exe"
$LOGS_DIR    = Join-Path $ROOT "logs"
$LOG_BACKEND = Join-Path $LOGS_DIR "backend.log"
$LOG_FRONTEND = Join-Path $LOGS_DIR "frontend.log"

$BACKEND_PORT  = 5100
$FRONTEND_PORT = 5173
$AW_PORT       = 5600
$HEALTH_URL    = "http://localhost:$BACKEND_PORT/health"
$HEALTH_TIMEOUT = 30  # segundos

# ─── Helpers ────────────────────────────────────────────────────────────────
function Write-Header {
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor DarkCyan
    Write-Host "  KRATOS MISSION CONTROL — START" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor DarkCyan
}

function Write-Step {
    param([string]$Icon, [string]$Msg, [string]$Color = "White")
    Write-Host ("  $Icon  $Msg") -ForegroundColor $Color
}

function Write-Ok   { param([string]$Msg) Write-Step "✅" $Msg "Green" }
function Write-Warn { param([string]$Msg) Write-Step "⚠️ " $Msg "Yellow" }
function Write-Fail { param([string]$Msg) Write-Step "❌" $Msg "Red" }
function Write-Info { param([string]$Msg) Write-Step "ℹ️ " $Msg "Gray" }

function Test-PortOpen {
    param([int]$Port)
    try {
        $conn = New-Object System.Net.Sockets.TcpClient
        $conn.Connect("127.0.0.1", $Port)
        $conn.Close()
        return $true
    } catch { return $false }
}

function Get-PidOnPort {
    param([int]$Port)
    try {
        $result = netstat -ano | Select-String ":$Port\s" | Select-Object -First 1
        if ($result) {
            $parts = ($result.Line.Trim() -split '\s+')
            return $parts[-1]
        }
    } catch {}
    return $null
}

# ─── Ensure logs dir ────────────────────────────────────────────────────────
if (-not (Test-Path $LOGS_DIR)) { New-Item -ItemType Directory -Path $LOGS_DIR -Force | Out-Null }

# ─── Header ─────────────────────────────────────────────────────────────────
Write-Header
Write-Info "Root: $ROOT"
Write-Info "Logs: $LOGS_DIR"
Write-Host ""

# ─── 1. Verificar venv ──────────────────────────────────────────────────────
Write-Host "  [1/4] Verificando Python venv..." -ForegroundColor DarkGray
if (-not (Test-Path $VENV_PYTHON)) {
    Write-Fail "backend/.venv não encontrado. Rode: cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt"
    exit 1
}
if (-not (Test-Path $VENV_UVICORN)) {
    Write-Fail "uvicorn não encontrado no venv. Rode: cd backend && .venv\Scripts\activate && pip install uvicorn"
    exit 1
}
Write-Ok "venv OK — $VENV_PYTHON"

# ─── 2. Backend ─────────────────────────────────────────────────────────────
Write-Host "  [2/4] Iniciando backend (FastAPI :$BACKEND_PORT)..." -ForegroundColor DarkGray

if (Test-PortOpen -Port $BACKEND_PORT) {
    Write-Warn "Porta $BACKEND_PORT já ocupada — backend pode já estar rodando."
    $existingPid = Get-PidOnPort -Port $BACKEND_PORT
    if ($existingPid) { Write-Info "PID existente: $existingPid" }
} else {
    # Sanitizar: não logar args com secrets (uvicorn não expõe por default, mas garantir)
    $uvicornArgs = @(
        "-m", "uvicorn",
        "app.main:app",
        "--host", "0.0.0.0",
        "--port", "$BACKEND_PORT",
        "--log-level", "warning"
    )

    $backendProc = Start-Process `
        -FilePath $VENV_PYTHON `
        -ArgumentList $uvicornArgs `
        -WorkingDirectory $BACKEND_DIR `
        -RedirectStandardOutput $LOG_BACKEND `
        -RedirectStandardError $LOG_BACKEND `
        -NoNewWindow `
        -PassThru

    Write-Ok "Backend iniciado — PID $($backendProc.Id) — log: logs\backend.log"
}

# ─── 3. Frontend ────────────────────────────────────────────────────────────
Write-Host "  [3/4] Iniciando frontend (Vite :$FRONTEND_PORT)..." -ForegroundColor DarkGray

if (Test-PortOpen -Port $FRONTEND_PORT) {
    Write-Warn "Porta $FRONTEND_PORT já ocupada — frontend pode já estar rodando."
} else {
    $bunExe = (Get-Command bun -ErrorAction SilentlyContinue)?.Source
    if (-not $bunExe) {
        Write-Fail "bun não encontrado no PATH. Instale: https://bun.sh"
    } else {
        $frontendProc = Start-Process `
            -FilePath $bunExe `
            -ArgumentList @("run", "dev") `
            -WorkingDirectory $ROOT `
            -RedirectStandardOutput $LOG_FRONTEND `
            -RedirectStandardError $LOG_FRONTEND `
            -NoNewWindow `
            -PassThru

        Write-Ok "Frontend iniciado — PID $($frontendProc.Id) — log: logs\frontend.log"
    }
}

# ─── 4. ActivityWatch ───────────────────────────────────────────────────────
Write-Host "  [4/4] Verificando ActivityWatch (:$AW_PORT)..." -ForegroundColor DarkGray

if (Test-PortOpen -Port $AW_PORT) {
    Write-Ok "ActivityWatch está respondendo em :$AW_PORT"
} else {
    Write-Warn "ActivityWatch NÃO está rodando em :$AW_PORT"
    Write-Info "Inicie manualmente: abra 'ActivityWatch' no menu Iniciar"
    Write-Info "Sem AW: contexto atual e drift ficam em modo fallback"
}

# ─── 5. Health check ────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  Aguardando backend ficar saudável (timeout ${HEALTH_TIMEOUT}s)..." -ForegroundColor DarkGray

$elapsed = 0
$healthy = $false
while ($elapsed -lt $HEALTH_TIMEOUT) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    try {
        $resp = Invoke-WebRequest -Uri $HEALTH_URL -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
        if ($resp.StatusCode -eq 200) {
            $healthy = $true
            break
        }
    } catch {}
    Write-Host "  ." -NoNewline -ForegroundColor DarkGray
}
Write-Host ""

# ─── Relatório final ─────────────────────────────────────────────────────────
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor DarkCyan
Write-Host "  KRATOS STATUS" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor DarkCyan

$backendStatus  = if ($healthy) { "🟢 LIVE  — http://localhost:$BACKEND_PORT" } else { "🔴 OFFLINE (verifique logs\backend.log)" }
$frontendStatus = if (Test-PortOpen -Port $FRONTEND_PORT) { "🟢 LIVE  — http://localhost:$FRONTEND_PORT" } else { "🔴 OFFLINE" }
$awStatus       = if (Test-PortOpen -Port $AW_PORT) { "🟢 LIVE" } else { "🟡 OFFLINE (contexto em fallback)" }

Write-Host ("  {0,-16} {1}" -f "Backend:", $backendStatus) -ForegroundColor White
Write-Host ("  {0,-16} {1}" -f "Frontend:", $frontendStatus) -ForegroundColor White
Write-Host ("  {0,-16} {1}" -f "ActivityWatch:", $awStatus) -ForegroundColor White
Write-Host ""

if ($healthy) {
    Write-Host "  ✅ KRATOS está VIVO. Abra: http://localhost:$FRONTEND_PORT" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend não respondeu em ${HEALTH_TIMEOUT}s." -ForegroundColor Red
    Write-Host "  📋 Verifique: Get-Content logs\backend.log -Tail 20" -ForegroundColor Yellow
}

Write-Host ("=" * 60) -ForegroundColor DarkCyan
Write-Host ""
