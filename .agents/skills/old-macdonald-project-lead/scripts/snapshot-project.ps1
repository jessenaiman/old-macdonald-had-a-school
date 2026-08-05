param(
  [string]$ProjectRoot = ""
)

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
  $ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
}

Push-Location -LiteralPath $ProjectRoot
try {
  Write-Output "PROJECT_ROOT=$ProjectRoot"
  Write-Output "BRANCH=$(git branch --show-current)"
  Write-Output "STATUS_BEGIN"
  git status -sb
  Write-Output "STATUS_END"
  Write-Output "REMOTES_BEGIN"
  git remote -v
  Write-Output "REMOTES_END"
  Write-Output "RECENT_COMMITS_BEGIN"
  git log -3 --oneline --decorate
  Write-Output "RECENT_COMMITS_END"

  if (Test-Path -LiteralPath "package.json") {
    $package = Get-Content -Raw -LiteralPath "package.json" | ConvertFrom-Json
    Write-Output "DECLARED_NEXT_VERSION=$($package.dependencies.next)"
    Write-Output "PACKAGE_MANAGER=$($package.packageManager)"
  }

  $agentBrowser = Get-Command agent-browser -ErrorAction SilentlyContinue
  if ($null -eq $agentBrowser) {
    Write-Output "AGENT_BROWSER=missing-from-path"
  } else {
    Write-Output "AGENT_BROWSER=$(& agent-browser --version)"
  }

  foreach ($required in @(
    "AGENTS.md",
    "docs\PROJECT_STATE.md",
    "docs\PROJECT_CHECKLIST.md",
    "docs\TEAM_WORKFLOW.md",
    ".agents\skills\next-dev-loop\SKILL.md"
  )) {
    Write-Output "FILE[$required]=$(Test-Path -LiteralPath $required)"
  }
} finally {
  Pop-Location
}

