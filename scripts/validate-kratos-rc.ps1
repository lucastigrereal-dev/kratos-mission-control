$ErrorActionPreference = "Stop"

function Write-Section {
  param([string]$Title)
  Write-Host ""
  Write-Host ("=" * 72) -ForegroundColor DarkGray
  Write-Host $Title -ForegroundColor Cyan
  Write-Host ("=" * 72) -ForegroundColor DarkGray
}

function Write-StatusLine {
  param([string]$Label, [string]$Value, [string]$Color = "White")
  Write-Host ("{0,-24} {1}" -f $Label, $Value) -ForegroundColor $Color
}

function Invoke-Step {
  param([string]$Name, [scriptblock]$Action)
  try {
    & $Action
    return @{ Name = $Name; Success = $true; Message = "PASS" }
  } catch {
    return @{ Name = $Name; Success = $false; Message = $_.Exception.Message }
  }
}

Write-Section "KRATOS RC VALIDATION"

$repoPath = (Get-Location).Path
Write-StatusLine -Label "Directory:" -Value $repoPath

if (-not (Test-Path ".\package.json")) {
  throw "package.json não encontrado. Execute este script na raiz de kratos-mission-control."
}

$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
$gitStatus = git status --short 2>$null
$treeClean = [string]::IsNullOrWhiteSpace(($gitStatus -join ""))

Write-Section "GIT STATUS"
Write-StatusLine -Label "Branch:" -Value $branch -Color Green
Write-StatusLine -Label "Working tree:" -Value $(if ($treeClean) { "clean" } else { "dirty" }) -Color $(if ($treeClean) { "Green" } else { "Yellow" })

if (-not $treeClean) {
  $gitStatus | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
}

Write-Section "LOCAL SERVER CHECK"

$serverUrl = "http://localhost:8081/"
$serverOk = $false

try {
  $response = Invoke-WebRequest -Uri $serverUrl -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
  $serverOk = ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400)
} catch { $serverOk = $false }

if ($serverOk) {
  Write-StatusLine -Label "Server:" -Value "$serverUrl OK" -Color Green
} else {
  Write-StatusLine -Label "Server:" -Value "$serverUrl indisponível" -Color Yellow
  Write-Host ""
  Write-Host "Abra outro terminal e rode:" -ForegroundColor Yellow
  Write-Host "  cd C:\Users\lucas\kratos-mission-control" -ForegroundColor White
  Write-Host "  bun run dev" -ForegroundColor White
  Write-Host ""
  Write-Host "Depois rode este script novamente." -ForegroundColor Yellow
}

$buildResult  = @{ Success = $false; Message = "NOT RUN" }
$unitResult   = @{ Success = $false; Message = "NOT RUN" }
$e2eResult    = @{ Success = $false; Message = "NOT RUN" }

Write-Section "BUILD"
$buildResult = Invoke-Step -Name "BUILD" -Action { bun run build }
Write-StatusLine -Label "BUILD:" -Value $(if ($buildResult.Success) { "PASS" } else { "FAIL" }) -Color $(if ($buildResult.Success) { "Green" } else { "Red" })
if (-not $buildResult.Success) { Write-Host $buildResult.Message -ForegroundColor Red }

Write-Section "UNIT TESTS"
if (-not $buildResult.Success) {
  $unitResult = @{ Success = $false; Message = "Pulados — build falhou." }
  Write-StatusLine -Label "UNIT:" -Value "SKIPPED" -Color Yellow
} else {
  $unitResult = Invoke-Step -Name "UNIT" -Action { bun run test }
  Write-StatusLine -Label "UNIT:" -Value $(if ($unitResult.Success) { "PASS" } else { "FAIL" }) -Color $(if ($unitResult.Success) { "Green" } else { "Red" })
  if (-not $unitResult.Success) { Write-Host $unitResult.Message -ForegroundColor Red }
}

Write-Section "E2E TESTS"
if (-not $serverOk) {
  $e2eResult = @{ Success = $false; Message = "Servidor local não respondeu." }
  Write-StatusLine -Label "E2E:" -Value "SKIPPED" -Color Yellow
} elseif (-not $buildResult.Success) {
  $e2eResult = @{ Success = $false; Message = "Pulados — build falhou." }
  Write-StatusLine -Label "E2E:" -Value "SKIPPED" -Color Yellow
} else {
  $e2eResult = Invoke-Step -Name "E2E" -Action {
    $env:PLAYWRIGHT_BASE_URL = "http://localhost:8081"
    bun run test:e2e
  }
  Write-StatusLine -Label "E2E:" -Value $(if ($e2eResult.Success) { "PASS" } else { "FAIL" }) -Color $(if ($e2eResult.Success) { "Green" } else { "Red" })
}

Write-Section "SUMMARY"
Write-StatusLine -Label "BUILD"  -Value $(if ($buildResult.Success) { "PASS" } else { "FAIL" })  -Color $(if ($buildResult.Success) { "Green" } else { "Red" })
Write-StatusLine -Label "UNIT"   -Value $(if ($unitResult.Success) { "PASS" } elseif ($unitResult.Message -like "Pulados*") { "SKIPPED" } else { "FAIL" })  -Color $(if ($unitResult.Success) { "Green" } elseif ($unitResult.Message -like "Pulados*") { "Yellow" } else { "Red" })
Write-StatusLine -Label "E2E"    -Value $(if ($e2eResult.Success) { "PASS" } elseif ($e2eResult.Message -like "*não respondeu*" -or $e2eResult.Message -like "Pulados*") { "SKIPPED" } else { "FAIL" }) -Color $(if ($e2eResult.Success) { "Green" } elseif ($e2eResult.Message -like "*não respondeu*" -or $e2eResult.Message -like "Pulados*") { "Yellow" } else { "Red" })

Write-Host ""
if (-not $serverOk) {
  Write-Host "NEXT ACTION: subir o servidor (bun run dev) e rodar novamente." -ForegroundColor Yellow
} elseif (-not $buildResult.Success) {
  Write-Host "NEXT ACTION: corrigir o build." -ForegroundColor Red
} elseif (-not $unitResult.Success) {
  Write-Host "NEXT ACTION: corrigir testes unitários." -ForegroundColor Red
} elseif (-not $e2eResult.Success) {
  Write-Host "NEXT ACTION: corrigir falhas E2E restantes." -ForegroundColor Yellow
} else {
  Write-Host "NEXT ACTION: commit seletivo e release candidate." -ForegroundColor Green
}
