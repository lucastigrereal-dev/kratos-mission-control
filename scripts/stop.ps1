#Requires -Version 5.1
<#
.SYNOPSIS
    KRATOS Mission Control — Stop Script
    Para: Backend (:8000) + Frontend (:5173) de forma graceful.

.NOTES
    W0 — Backend Liveness (ksw-w0-backend-alive)
    NÃO para ActivityWatch (Lucas decide quando parar o AW).
    NÃO requer admin.
#>

$ErrorActionPreference = "Continue"

$BACKEND_PORT  = 8000
$FRONTEND_PORT = 5173

function Write-Step {
    param([string]$Icon, [string]$Msg, [string]$Color = "White")
    Write-Host ("  $Icon  $Msg") -ForegroundColor $Color
}
function Write-Ok   { param([string]$Msg) Write-Step "✅" $Msg "Green" }
function Write-Info { param([string]$Msg) Write-Step "ℹ️ " $Msg "Gray" }

function Stop-PortProcess {
    param([int]$Port, [string]$Name)
    try {
        $lines = netstat -ano | Select-String ":$Port\s"
        $pids = $lines | ForEach-Object {
            $parts = ($_.Line.Trim() -split '\s+')
            $parts[-1]
        } | Sort-Object -Unique

        foreach ($pid in $pids) {
            if ($pid -match '^\d+$' -and [int]$pid -gt 0) {
                try {
                    Stop-Process -Id ([int]$pid) -Force -ErrorAction Stop
                    Write-Ok "$Name (PID $pid) parado."
                } catch {
                    Write-Info "$Name PID $pid já não existe."
                }
            }
        }
        if (-not $pids) { Write-Info "$Name não estava rodando em :$Port" }
    } catch {
        Write-Info "Não foi possível verificar :$Port — $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor DarkCyan
Write-Host "  KRATOS MISSION CONTROL — STOP" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor DarkCyan

Stop-PortProcess -Port $BACKEND_PORT -Name "Backend"
Stop-PortProcess -Port $FRONTEND_PORT -Name "Frontend"

Write-Info "ActivityWatch NÃO foi parado (gerido separadamente)."
Write-Host ""
Write-Host "  KRATOS parado." -ForegroundColor DarkCyan
Write-Host ""
