param(
  [int]$WatchSeconds = 0,
  [int]$RefreshSeconds = 20
)

function Show-WorkflowStatus {
  $start = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Write-Host "=== OMHAS Resource Workflow Monitor ($start) ==="
  Write-Host

  Write-Host "--- Completion snapshot ---"
  python scripts/resources/resource_completion_report.py
  Write-Host

  Write-Host "--- Validation checks ---"
  python scripts/resources/validate_resource_workflow.py
  Write-Host

  Write-Host "--- Next batch (up to 10) ---"
  python scripts/resources/run_resource_pipeline.py --limit 10
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
