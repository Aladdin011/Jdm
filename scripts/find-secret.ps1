param(
  [Parameter(Mandatory=$true)][string]$Token
)

Write-Host "Searching working tree for token substring..."
Get-ChildItem -Recurse -File -Exclude '.git','node_modules' | ForEach-Object {
  try {
    Select-String -Path $_.FullName -Pattern $Token -SimpleMatch -Quiet | Out-Null
    if ($?) { Write-Host "MATCH in file:" $_.FullName }
  } catch { }
}

Write-Host "\nSearching commit history (git log -S) for exact token..."
try {
  $matches = git log -S"$Token" --pretty=format:'%H %an %ad %s' --all
  if ($matches) { Write-Host $matches } else { Write-Host "No matches in commit history via git log -S" }
} catch {
  Write-Host "git not available or not a git repository in this folder." 
}

Write-Host "\nIf you find matches in commits, use the instructions in scripts/git-secret-removal.md to remove them safely."
