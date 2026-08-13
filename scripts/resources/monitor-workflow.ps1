param(
  [int]$WatchSeconds = 0,
  [int]$RefreshSeconds = 20,
  [string]$PythonExecutable = ""
)

if (-not $PythonExecutable) {
  $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
  if ($pythonCommand) {
    $PythonExecutable = $pythonCommand.Source
  } else {
    $pyCommand = Get-Command py -ErrorAction SilentlyContinue
    if ($pyCommand) { $PythonExecutable = $pyCommand.Source }
  }
}
if (-not $PythonExecutable) {
  throw "No Python interpreter found. Pass -PythonExecutable with the project runtime."
}

function Invoke-ResourcePython {
  param([string]$Script, [string[]]$Arguments = @())
  & $PythonExecutable $Script @Arguments
  if ($LASTEXITCODE -ne 0) { throw "$Script exited with code $LASTEXITCODE" }
}

function Show-WorkflowStatus {
  $start = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Write-Host "=== OMHAS Resource Workflow Monitor ($start) ==="
  Write-Host

  Write-Host "--- Completion snapshot ---"
  Invoke-ResourcePython scripts/resources/resource_completion_report.py
  Write-Host

  Write-Host "--- Validation checks ---"
  Invoke-ResourcePython scripts/resources/validate_resource_workflow.py
  Write-Host

  Write-Host "--- Next batch (up to 10) ---"
  Invoke-ResourcePython scripts/resources/run_resource_pipeline.py @("--limit", "10")
  Write-Host

  Write-Host "--- Process health (hermes/ollama/python/node) ---"
  try {
    $processes = Get-Process -Name python,node,ollama,powershell -ErrorAction SilentlyContinue
    $rows = @()
    foreach ($p in $processes) {
      $command = (Get-CimInstance Win32_Process -Filter "ProcessId=$($p.Id)" -ErrorAction SilentlyContinue).CommandLine
      if ($command -and (
        $command -like "*hermes*" -or $command -like "*sql-expert*" -or
        $command -like "*resource*" -or $command -like "*run_resource_pipeline*"
      )) {
        $rows += [PSCustomObject]@{
          ProcessId = $p.Id
          Name = $p.ProcessName
          CommandLine = $command
        }
      }
    }
    if ($rows.Count -gt 0) {
      $rows | Sort-Object ProcessId | Format-Table -AutoSize
    } else {
      Write-Host "No matched long-running helper processes detected."
    }
  } catch {
    Write-Host "Process list unavailable in this environment (permissions)."
  }
  Write-Host
}

if ($WatchSeconds -gt 0) {
  $end = (Get-Date).AddSeconds($WatchSeconds)
  while ((Get-Date) -lt $end) {
    Show-WorkflowStatus
    Start-Sleep -Seconds $RefreshSeconds
    if ((Get-Date) -lt $end) { Write-Host "--- refresh in ${RefreshSeconds}s ---`n" }
  }
  Write-Host "Monitor window complete."
} else {
  Show-WorkflowStatus
}
