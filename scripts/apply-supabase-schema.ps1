param(
    [string]$ProjectRef = $env:SUPABASE_PROJECT_REF,
    [string]$ServiceKey = $env:SUPABASE_SERVICE_ROLE_KEY,
    [string]$SqlFile = "supabase/schema.sql"
)

Write-Host "This script helps apply the Supabase SQL schema to your project."

if (-not (Test-Path $SqlFile)) {
    Write-Error "SQL file not found: $SqlFile"
    exit 1
}

if (-not $ProjectRef -or -not $ServiceKey) {
    Write-Host "You can set SUPABASE_PROJECT_REF and SUPABASE_SERVICE_ROLE_KEY as environment variables, or pass them as parameters."
}

# If supabase CLI is installed, try to use it
try {
    $supabase = Get-Command supabase -ErrorAction SilentlyContinue
    if ($supabase) {
        if (-not $ProjectRef) {
            Write-Host "No project ref provided. Attempting to use local supabase project settings..."
            & supabase db remote set
        }
        Write-Host "Applying $SqlFile using supabase CLI..."
        & supabase db reset --yes --file $SqlFile
        if ($LASTEXITCODE -eq 0) { Write-Host "Schema applied via supabase CLI."; exit 0 }
    }
} catch {
    Write-Host "Supabase CLI not available or failed. Falling back to instructions."
}

Write-Host "\nManual steps to apply schema:"
Write-Host "1) Open the Supabase dashboard -> SQL Editor"
Write-Host "2) Copy the contents of $SqlFile and execute it as the Service Role or with a user that has schema privileges."
Write-Host "3) Confirm tables and RLS policies were created."
Write-Host "\nOr use psql with the service_role key as follows (example):"
Write-Host "psql 'postgresql://postgres:@db.<project-ref>.supabase.co:5432/postgres' -f $SqlFile"
