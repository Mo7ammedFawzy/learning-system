# One progress bar per track, computed from core/<track>/CURRICULUM.md and state/PROGRESS.md.
#   full block: topic with a completed lesson   medium: scratched only   light: not started
#
# Usage:  .\progress.ps1      (also called by the status line, so keep it fast and ASCII-only)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$width = 30

# Topic IDs in one section of PROGRESS.md, without the lesson letter (04a, 04b -> 04).
# ponytail: a split topic counts as done once its first part closes (08a done, 08b open -> 08
# done). Declare the parts in the curriculum and count lessons instead if that overstates.
function Get-SectionIds($name) {
    $inside = $false
    foreach ($line in [System.IO.File]::ReadLines("$PSScriptRoot/state/PROGRESS.md")) {
        if ($line -cmatch '^## ') { $inside = $line -cmatch "^## $name"; continue }
        if ($inside -and $line -cmatch '^\| ([A-Z]*[0-9]{2})') { $Matches[1] }
    }
}

$completed = @(Get-SectionIds Completed)
$scratched = @(Get-SectionIds Scratched)

# Level per track, from the "## Level" table (| java | beginner+ | ...).
$levels = [ordered]@{}
$inside = $false
foreach ($line in [System.IO.File]::ReadLines("$PSScriptRoot/state/PROGRESS.md")) {
    if ($line -cmatch '^## ') { $inside = $line -cmatch '^## Level'; continue }
    if ($inside -and $line -cmatch '^\| ([a-z]+) \| ([a-z]+\+?) \|') { $levels[$Matches[1]] = $Matches[2] }
}

foreach ($cur in Get-ChildItem "$PSScriptRoot/core/*/CURRICULUM.md") {
    $topics = @([System.IO.File]::ReadLines($cur.FullName) |
        Where-Object { $_ -cmatch '^\| ([A-Z]*[0-9]{2}[a-z]?) \|' } |
        ForEach-Object { $Matches[1] } | Sort-Object -Unique)
    if (-not $topics) { continue }

    $d = @($topics | Where-Object { $completed -contains $_ }).Count
    $s = @($topics | Where-Object { $scratched -contains $_ -and $completed -notcontains $_ }).Count
    $full = [math]::Floor($d * $width / $topics.Count)
    $part = [math]::Floor(($d + $s) * $width / $topics.Count) - $full

    $bar = ([string][char]0x2588) * $full + ([string][char]0x2592) * $part +
           ([string][char]0x2591) * ($width - $full - $part)
    $line = '{0,-8} {1}  {2,2}/{3} topics ({4}%)' -f $cur.Directory.Name, $bar, $d, $topics.Count,
        [math]::Floor($d * 100 / $topics.Count)
    if ($s) { $line += ", $s scratched" }
    $name = $cur.Directory.Name
    if ($levels.Contains($name)) { $line += " - $($levels[$name])"; $levels.Remove($name) }
    $line
}

# Tracks with a level but no curriculum of their own (spring lives inside java's).
foreach ($k in $levels.Keys) { '{0,-8} level: {1}' -f $k, $levels[$k] }
