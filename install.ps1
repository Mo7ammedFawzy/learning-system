<#
.SYNOPSIS
    Installs the Learning System adapters so /learn works from any directory.

.DESCRIPTION
    Detects this repo's location automatically and writes the per-agent adapters into the
    global config directories, substituting the detected path. Nothing in this repo is
    modified, so the same checkout installs correctly on any machine at any path.

    Safe to re-run: it overwrites the installed adapters and nothing else.

.NOTES
    Learning content is never copied — the adapters are pointers back to this repo, so the
    repo must stay where it is after installing. Move it, and just re-run this script.
#>
[CmdletBinding()]
param(
    [switch]$Uninstall,
    # Installs nothing: only runs the environment report, so check.sh can prove the script still
    # runs to the end.
    [switch]$Check
)

$ErrorActionPreference = 'Stop'
$repo = $PSScriptRoot
$repoFwd = $repo -replace '\\', '/'
$placeholder = 'C:/Projects/learning-system'

$claudeDst = Join-Path $HOME '.claude\skills\learn\SKILL.md'
$codexDst  = Join-Path $HOME '.codex\skills\learn\SKILL.md'
# OpenCode's documented folder is "commands"; some builds read "command". Both get the
# same ~25-line pointer so /learn resolves either way. This duplicates a pointer, never content.
$openDsts = @(
    (Join-Path $HOME '.config\opencode\commands\learn.md'),
    (Join-Path $HOME '.config\opencode\command\learn.md')
)

# /scratch - the fast batch pass. Same pointer shape, same bootstrap.
$scratchClaudeDst = Join-Path $HOME '.claude\skills\scratch\SKILL.md'
$scratchCodexDst  = Join-Path $HOME '.codex\skills\scratch\SKILL.md'
$scratchOpenDsts = @(
    (Join-Path $HOME '.config\opencode\commands\scratch.md'),
    (Join-Path $HOME '.config\opencode\command\scratch.md')
)

$allDsts = @($claudeDst, $codexDst) + $openDsts + @($scratchClaudeDst, $scratchCodexDst) + $scratchOpenDsts

# The Claude Code progress band above the prompt. A junction, not a copy, so the mod reads this
# repo's state/PROGRESS.md. Claude Code loads a plugin folder found under ~/.claude/skills.
$modSrc = Join-Path $repo 'adapters\claude\progress-mod'
$modDst = Join-Path $HOME '.claude\skills\learning-progress'
# Directory.Delete without recursion removes a junction and refuses a real folder with files.
function Remove-ModLink { if (Test-Path $modDst) { [System.IO.Directory]::Delete($modDst); Write-Host "removed  $modDst" } }

if ($Uninstall) {
    foreach ($f in $allDsts) {
        if (Test-Path $f) { Remove-Item $f -Force; Write-Host "removed  $f" }
    }
    Remove-ModLink
    Write-Host "`nUninstalled. This repo was not touched." -ForegroundColor Green
    return
}

function Install-Adapter {
    param([string]$Source, [string]$Dest)

    if (-not (Test-Path $Source)) { throw "missing canonical adapter: $Source" }
    $dir = Split-Path -Parent $Dest
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

    # -Encoding UTF8 on read too: Windows PowerShell 5.1 reads BOM-less UTF-8 as ANSI and mangles em-dashes
    $content = (Get-Content $Source -Raw -Encoding UTF8).Replace($placeholder, $repoFwd)
    # -Encoding utf8 so the em-dashes in the adapter text survive
    $content | Out-File -FilePath $Dest -Encoding utf8 -NoNewline
    Write-Host "installed  $Dest"
}

Write-Host "Learning System" -ForegroundColor Cyan
Write-Host "repo: $repoFwd`n"

if (-not $Check) {
    Install-Adapter -Source (Join-Path $repo 'adapters\claude\SKILL.md')   -Dest $claudeDst
    Install-Adapter -Source (Join-Path $repo 'adapters\codex\SKILL.md')    -Dest $codexDst
    foreach ($d in $openDsts) {
        Install-Adapter -Source (Join-Path $repo 'adapters\opencode\learn.md') -Dest $d
    }
    Install-Adapter -Source (Join-Path $repo 'adapters\claude\scratch.md') -Dest $scratchClaudeDst
    Install-Adapter -Source (Join-Path $repo 'adapters\codex\scratch.md')  -Dest $scratchCodexDst
    foreach ($d in $scratchOpenDsts) {
        Install-Adapter -Source (Join-Path $repo 'adapters\opencode\scratch.md') -Dest $d
    }

    # --- verify the installed copies actually point back here ---
    Write-Host ""
    $bad = @()
    foreach ($f in $allDsts) {
        if (-not (Select-String -Path $f -SimpleMatch "$repoFwd/core/BOOTSTRAP.md" -Quiet)) { $bad += $f }
    }
    if ($bad) {
        Write-Host "FAILED - these do not point at this repo:" -ForegroundColor Red
        $bad | ForEach-Object { Write-Host "  $_" }
        exit 1
    }
    Write-Host "verified: all adapters resolve to $repoFwd/core/BOOTSTRAP.md" -ForegroundColor Green

    Remove-ModLink
    New-Item -ItemType Junction -Path $modDst -Target $modSrc | Out-Null
    Write-Host "linked   $modDst -> $modSrc  (progress band in Claude Code)"

    # check.sh runs on every commit from here on
    if (Get-Command git -ErrorAction SilentlyContinue) { git -C $repo config core.hooksPath .githooks }
}

# --- environment report (informational, never fatal) ---
Write-Host "`nEnvironment:"
$java = Get-Command java -ErrorAction SilentlyContinue
if ($java) {
    $v = (cmd /c "java -version 2>&1" | Select-Object -First 1)
    Write-Host "  java     $v"
} else {
    Write-Host "  java     NOT FOUND - install a JDK (21+) or Java exercises cannot be run" -ForegroundColor Yellow
}
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "  node     $(& node --version)"
} else {
    Write-Host "  node     NOT FOUND - install Node.js (20+) or React exercises cannot be run" -ForegroundColor Yellow
}
if (Get-Command claude   -ErrorAction SilentlyContinue) { Write-Host "  claude   found" } else { Write-Host "  claude   not on PATH" -ForegroundColor Yellow }
if (Get-Command opencode -ErrorAction SilentlyContinue) { Write-Host "  opencode found" } else { Write-Host "  opencode not on PATH" -ForegroundColor Yellow }
if (Get-Command codex    -ErrorAction SilentlyContinue) { Write-Host "  codex    found" } else { Write-Host "  codex    not on PATH" -ForegroundColor Yellow }

$labRoot = 'C:\Projects\8080'
if (Test-Path $labRoot) {
    Write-Host "  lab      nama-erp available ($labRoot)"
} else {
    Write-Host "  lab      nama-erp not present - lessons run in codebase-free mode (this is fine)"
}

Write-Host "`nDone. Start a new agent session and type /learn or /scratch" -ForegroundColor Green
