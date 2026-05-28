#Requires -Version 5.1
<#
.SYNOPSIS
    Registra KRATOS como Scheduled Task no Windows (auto-start no login).

.DESCRIPTION
    W0-B2 — Auto-start Windows (ksw-w0-backend-alive)
    Cria Scheduled Task "KRATOS_AutoStart" com trigger AtLogOn.
    Roda sem janela (WindowStyle Hidden).
    NÃO requer admin (RunLevel Limited — contexto do usuário).

    Para remover: .\scripts\remove-autostart.ps1
#>

$ErrorActionPreference = "Stop"

$TASK_NAME   = "KRATOS_AutoStart"
$SCRIPT_PATH = Join-Path $PSScriptRoot "start.ps1"
$SCRIPT_ABS  = Resolve-Path $SCRIPT_PATH

Write-Host ""
Write-Host "  Registrando KRATOS como auto-start..." -ForegroundColor Cyan

# Verificar se já existe
$existing = Get-ScheduledTask -TaskName $TASK_NAME -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "  ⚠️  Task '$TASK_NAME' já existe. Removendo para recriar..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TASK_NAME -Confirm:$false
}

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy RemoteSigned -WindowStyle Hidden -NonInteractive -File `"$SCRIPT_ABS`""

$trigger = New-ScheduledTaskTrigger -AtLogOn

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
    -RestartCount 1 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName $TASK_NAME `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -RunLevel Limited `
    -Description "KRATOS Mission Control — sobe backend + frontend ao logar" `
    -Force | Out-Null

Write-Host "  ✅ Task '$TASK_NAME' registrada." -ForegroundColor Green
Write-Host "  ℹ️  Ao próximo login do Windows, KRATOS sobe automaticamente." -ForegroundColor Gray
Write-Host "  ℹ️  Para desativar: .\scripts\remove-autostart.ps1" -ForegroundColor Gray
Write-Host ""
