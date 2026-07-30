# GYAM sessionStart: inject source-of-truth + activity-log context.
$ErrorActionPreference = 'Continue'

try {
    $rawInput = [Console]::In.ReadToEnd()
} catch {
    $rawInput = ''
}

$root = $PWD.Path
if ($env:CURSOR_PROJECT_DIR) {
    $root = $env:CURSOR_PROJECT_DIR
}

$sot = Join-Path $root 'GYAM_SOURCE_OF_TRUTH.md'
$roadmap = Join-Path $root 'Project_Management_Daily_Roadmap_Starting_2026-07-27.md'
$logsDir = Join-Path $root 'logs\activity'

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('GYAM project session context:')

if (Test-Path -LiteralPath $sot) {
    $lines.Add('- Source of truth present: GYAM_SOURCE_OF_TRUTH.md (read before product/architecture changes).')
} else {
    $lines.Add('- WARNING: GYAM_SOURCE_OF_TRUTH.md is missing. Recreate or restore before major work.')
}

if (Test-Path -LiteralPath $roadmap) {
    $lines.Add('- Roadmap seed present: Project_Management_Daily_Roadmap_Starting_2026-07-27.md')
} else {
    $lines.Add('- WARNING: Roadmap seed markdown is missing.')
}

if (Test-Path -LiteralPath $logsDir) {
    $recent = Get-ChildItem -LiteralPath $logsDir -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ne '.gitkeep' -and $_.Extension -match '\.(jsonl|json|md|log)$' } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 3 |
        ForEach-Object { $_.Name }
    if ($recent) {
        $lines.Add('- Recent activity log files: ' + ($recent -join ', '))
        $lines.Add('- Before suggesting next versions, read logs/activity and ask targeted questions.')
    } else {
        $lines.Add('- logs/activity exists but has no activity files yet (expected until V1 logging lands).')
    }
} else {
    $lines.Add('- logs/activity not created yet (expected until V1 logging lands).')
}

$lines.Add('- Auth V1: users.userID + hashed PIN. Job columns: Wishlist|Applied|Interview|Accepted|Rejected.')
$lines.Add('- Present options when build forks appear; do not invent hard constraints.')

@{
    additional_context = ($lines -join "`n")
} | ConvertTo-Json -Compress

exit 0
