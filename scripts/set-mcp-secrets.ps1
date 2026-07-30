# Sets GYAM MCP secrets as Windows USER environment variables for Cursor.
# Run once in PowerShell, then restart Cursor.
# Does not write secrets into the git repo.
# ASCII-only file (no fancy dashes/arrows) so Windows PowerShell parses cleanly.

$ErrorActionPreference = 'Stop'

function Read-Secret([string]$Prompt) {
    $secure = Read-Host -Prompt $Prompt -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

function Set-UserEnv([string]$Name, [string]$Value) {
    [System.Environment]::SetEnvironmentVariable($Name, $Value, 'User')
    Set-Item -Path "Env:$Name" -Value $Value
    Write-Host "Set $Name (User scope)." -ForegroundColor Green
}

Write-Host ""
Write-Host "GYAM MCP secret setup" -ForegroundColor Cyan
Write-Host "Values are stored in your Windows user environment only." -ForegroundColor DarkGray
Write-Host ""

# --- GitHub PAT (required for github MCP) ---
Write-Host "1) GitHub Personal Access Token" -ForegroundColor Yellow
Write-Host "   Create at: https://github.com/settings/tokens"
Write-Host "   Suggested scopes: repo, read:org, workflow (as needed)"
$existingGh = [System.Environment]::GetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', 'User')
if ($existingGh) {
    $keep = Read-Host "   Existing token found. Keep it? [Y/n]"
    if ($keep -and $keep.ToLower() -eq 'n') {
        $token = Read-Secret '   Paste new GitHub PAT'
        if (-not $token) { throw 'GitHub PAT cannot be empty.' }
        Set-UserEnv 'GITHUB_PERSONAL_ACCESS_TOKEN' $token
    }
    else {
        Write-Host "   Kept existing GITHUB_PERSONAL_ACCESS_TOKEN." -ForegroundColor DarkGray
    }
}
else {
    $token = Read-Secret '   Paste GitHub PAT'
    if (-not $token) { throw 'GitHub PAT cannot be empty.' }
    Set-UserEnv 'GITHUB_PERSONAL_ACCESS_TOKEN' $token
}

# --- Context7 (optional) ---
Write-Host ""
Write-Host "2) Context7 API key (optional - Enter to skip)" -ForegroundColor Yellow
Write-Host "   Get at: https://context7.com"
$c7 = Read-Secret '   Paste Context7 API key (or leave blank)'
if ($c7) {
    Set-UserEnv 'CONTEXT7_API_KEY' $c7
}
else {
    Write-Host "   Skipped CONTEXT7_API_KEY (Context7 still works with lower limits)." -ForegroundColor DarkGray
}

# --- Postgres URI ---
Write-Host ""
Write-Host "3) GYAM Postgres connection URI" -ForegroundColor Yellow
$defaultUri = 'postgresql://gyam:gyam@host.docker.internal:5432/gyam'
$existingUri = [System.Environment]::GetEnvironmentVariable('GYAM_DATABASE_URI', 'User')
if (-not $existingUri) { $existingUri = $defaultUri }
Write-Host "   Default/local placeholder: $defaultUri"
$uri = Read-Host "   Enter URI [$existingUri]"
if (-not $uri) { $uri = $existingUri }
Set-UserEnv 'GYAM_DATABASE_URI' $uri

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Cyan
Write-Host "  1. Fully quit Cursor (all windows)."
Write-Host "  2. Reopen Cursor in this project."
Write-Host "  3. Settings -> MCP -> confirm server status."
Write-Host "  Note: postgres MCP stays red until the GYAM database is running."
Write-Host ""
