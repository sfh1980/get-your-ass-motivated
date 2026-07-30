# GYAM beforeShellExecution: ask on destructive or secret-exposing commands. Fail open otherwise.
$ErrorActionPreference = 'Continue'

try {
    $rawInput = [Console]::In.ReadToEnd()
    $payload = if ([string]::IsNullOrWhiteSpace($rawInput)) { $null } else { $rawInput | ConvertFrom-Json }
} catch {
    Write-Output '{ "permission": "allow" }'
    exit 0
}

$command = ''
if ($null -ne $payload -and $payload.command) {
    $command = [string]$payload.command
}

if ([string]::IsNullOrWhiteSpace($command)) {
    Write-Output '{ "permission": "allow" }'
    exit 0
}

$patterns = @(
    'git\s+push\s+.*--force',
    'git\s+push\s+.*-f\b',
    'git\s+reset\s+--hard',
    'Remove-Item\s+.*-Recurse',
    '\brm\s+-rf\b',
    'drop\s+database',
    'drop\s+schema',
    'docker\s+compose\s+down\s+-v',
    'docker-compose\s+down\s+-v',
    '\.env\b.*\b(type|cat|Get-Content|Write-Output)\b',
    '\b(type|cat|Get-Content)\b.*\.env\b'
)

$matched = $false
foreach ($p in $patterns) {
    if ($command -match $p) {
        $matched = $true
        break
    }
}

if ($matched) {
    @{
        permission    = 'ask'
        user_message  = 'GYAM hook: this shell command looks destructive or may expose secrets. Review before continuing.'
        agent_message = 'A project hook flagged a potentially destructive or secret-exposing shell command. Wait for user approval.'
    } | ConvertTo-Json -Compress
    exit 0
}

Write-Output '{ "permission": "allow" }'
exit 0
