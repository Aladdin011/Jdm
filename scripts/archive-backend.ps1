Param(
  [string]$RepoRoot = "$(Resolve-Path ..)"
)

$backendPath = Join-Path $PSScriptRoot "..\backend"
if (Test-Path $backendPath) {
  $archivePath = Join-Path $PSScriptRoot "..\backend-archive-$(Get-Date -Format yyyyMMddHHmmss)"
  Write-Host "Archiving $backendPath to $archivePath"
  Move-Item $backendPath $archivePath
  Write-Host "Archived backend to $archivePath"
} else {
  Write-Host "No backend directory found at $backendPath"
}
