# One progress bar per track, computed from core/<track>/CURRICULUM.md and state/PROGRESS.md.
#   full block: topic with a completed lesson   medium: scratched only   light: not started
#
# Usage:  .\progress.ps1               one bar per track (also called by the status line, so keep it
#                                       fast and the source ASCII-only: PowerShell 5.1 reads it as ANSI)
#         .\progress.ps1 -Roadmap       the roadmap: every section, every topic, the next topic per track

param([switch]$Roadmap)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$width = 30

if ($Roadmap) {
    $ch = { param($c) [string][char]$c }
    $dash = & $ch 0x2014
    # fill = confidence: solid full, ok half, shaky quarter, scratched dotted, not started a dot
    $glyph = @{ solid = & $ch 0x25CF; ok = & $ch 0x25D1; shaky = & $ch 0x25D4; scr = & $ch 0x25CC; none = & $ch 0x00B7 }
    $nextGlyph = & $ch 0x25B6
    $rank = @{ solid = 1; ok = 2; shaky = 3 }
    function Rank($k) { if ($k) { [int]$rank[$k] } else { 0 } }

    $state = @{}; $current = [ordered]@{}; $levels = @{}; $sec = ''
    foreach ($l in [System.IO.File]::ReadLines("$PSScriptRoot/state/PROGRESS.md")) {
        if ($l -cmatch '^## (.+)') { $sec = $Matches[1].Trim(); continue }
        if ($l -cmatch "^\*\*(\w+)\*\* $dash Topic: ([A-Z]*\d{2})[a-z]? $dash ") {
            $current[$Matches[1]] = $Matches[2]
        }
        if (-not $l.StartsWith('| ')) { continue }
        $c = @($l.Split('|') | Select-Object -Skip 1 | ForEach-Object { $_.Trim() })
        $id = if ($c[0] -cmatch '^([A-Z]*\d{2})[a-z]?$') { $Matches[1] }
        if ($sec -eq 'Level' -and $c[0] -cmatch '^[a-z]+$') { $levels[$c[0]] = $c[1] }
        # a split topic (04a, 04b) shows its weakest part
        if ($sec -eq 'Completed' -and $id -and (Rank $c[3]) -gt (Rank $state[$id])) { $state[$id] = $c[3] }
        if ($sec -eq 'Scratched' -and $id -and -not $state[$id]) { $state[$id] = 'scr' }
    }

    # tracks in the order of their Current lines; spring is sections F-H of the java curriculum
    $tracks = [System.Collections.Generic.List[object]]::new()
    $names = @{}
    foreach ($cur in Get-ChildItem "$PSScriptRoot/core/*/CURRICULUM.md") {
        $t = $cur.Directory.Name
        $own = @{ name = $t; sections = [System.Collections.Generic.List[object]]::new() }
        $spring = @{ name = 'spring'; sections = [System.Collections.Generic.List[object]]::new() }
        $s = $null
        foreach ($l in [System.IO.File]::ReadLines($cur.FullName)) {
            if ($l -cmatch "^## Track (\w+) $dash (.+)") {
                $s = @{ name = $Matches[2].Trim(); ids = [System.Collections.Generic.List[string]]::new() }
                if ($t -eq 'java' -and $Matches[1] -cmatch '^[FGH]$') { $spring.sections.Add($s) } else { $own.sections.Add($s) }
                continue
            }
            if ($l.StartsWith('## ')) { $s = $null; continue }
            if ($s -and $l -cmatch '^\| ([A-Z]*\d{2})[a-z]? \| ([^|]*)' -and -not $s.ids.Contains($Matches[1])) {
                $s.ids.Add($Matches[1]); $names[$Matches[1]] = ($Matches[2] -replace "[$(& $ch 0x2605)$(& $ch 0x2606)]", '').Trim()
            }
        }
        $tracks.Add($own); if ($spring.sections.Count) { $tracks.Add($spring) }
    }
    $order = @($current.Keys)
    $sorted = $tracks | Sort-Object { $i = [array]::IndexOf($order, $(if ($_.name -eq 'spring') { 'java' } else { $_.name }))
        if ($i -lt 0) { 99 } else { $i + [int]($_.name -eq 'spring') * 0.5 } }

    $out = [System.Collections.Generic.List[string]]::new()
    foreach ($t in $sorted) {
        $secs = @($t.sections | Where-Object { $_.ids.Count })
        $ids = @($secs | ForEach-Object { $_.ids })
        if (-not $ids) { continue }
        $d = @($ids | Where-Object { Rank $state[$_] }).Count
        $sc = @($ids | Where-Object { $state[$_] -eq 'scr' }).Count
        $full = [math]::Floor($d * $width / $ids.Count)
        $part = [math]::Floor(($d + $sc) * $width / $ids.Count) - $full
        $bar = (& $ch 0x2588) * $full + (& $ch 0x2592) * $part + (& $ch 0x2591) * ($width - $full - $part)
        $line = '{0,-9} {1}  {2,2}/{3} done' -f $t.name, $bar, $d, $ids.Count
        if ($sc) { $line += ", $sc scratched" }
        $line += ' - ' + $(if ($levels[$t.name]) { $levels[$t.name] } else { 'not assessed' })
        $out.Add($line)

        $first = $ids | Where-Object { -not (Rank $state[$_]) } | Select-Object -First 1
        $next = if ($ids -contains $current[$t.name]) { $current[$t.name] }
                else { $first }
        foreach ($sx in $secs) {
            $cells = $sx.ids | ForEach-Object {
                $g = if ($next -and $_ -eq $next) { $nextGlyph } else { $glyph[$(if ($state[$_]) { $state[$_] } else { 'none' })] }
                "$g $_"
            }
            $out.Add(('  {0,-31}{1}' -f $(if ($sx.name.Length -gt 30) { $sx.name.Substring(0, 29) + '.' } else { $sx.name }), ($cells -join '  ')))
        }
        if ($next) { $out.Add("  next $nextGlyph $next $($names[$next])") }
        $out.Add('')
    }
    $out.Add("$($glyph.solid) solid   $($glyph.ok) ok   $($glyph.shaky) shaky   $($glyph.scr) scratched   $($glyph.none) not started   $nextGlyph next")
    $out
    return
}

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
