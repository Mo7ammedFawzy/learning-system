#!/usr/bin/env bash
# Consistency checks for the Learning System. Runs on every commit via .githooks/pre-commit.
#
# Usage:  ./check.sh  [--links]
#   --links   also fetch every documentation URL in the curricula (slow, needs network)

set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

fail=0
bad() {
  echo "FAIL  $1"
  [ -n "${2:-}" ] && echo "$2" | sed 's/^/        /'
  fail=1
}

# --- core/ names no agent and no company codebase ---
out=$(grep -rniE 'claude|opencode|codex|anthropic|8080|namasoft|\bnama\b|dev-docs|\bskill\b' core/) \
  && bad "core/ names an agent or a company codebase" "$out"

# --- no pointer to the pre-track location of a curriculum or bank ---
out=$(git grep -nE 'core/(CURRICULUM|INTERVIEW-BANK)\.md') \
  && bad "stale path: curricula and banks live in core/<track>/" "$out"

# --- each track: IDs unique, bank sections map to topics, rows well-formed, topics cite a source ---
for dir in core/*/; do
  t=$(basename "$dir"); cur="${dir}CURRICULUM.md"; bank="${dir}INTERVIEW-BANK.md"
  [ -f "$cur" ] && [ -f "$bank" ] || { bad "$t: CURRICULUM.md or INTERVIEW-BANK.md is missing"; continue; }

  rows=$(grep -E '^\| [A-Z]*[0-9]{2}[a-z]? \|' "$cur")
  ids=$(echo "$rows" | cut -d'|' -f2 | tr -d ' ' | sort)
  bank_ids=$(grep -oE '^## [A-Z]*[0-9]{2}[a-z]?' "$bank" | cut -c4- | sort)

  out=$(echo "$ids" | uniq -d);      [ -n "$out" ] && bad "$t: duplicate topic IDs in the curriculum" "$out"
  out=$(echo "$bank_ids" | uniq -d); [ -n "$out" ] && bad "$t: duplicate sections in the interview bank" "$out"
  out=$(comm -13 <(echo "$ids") <(echo "$bank_ids"))
  [ -n "$out" ] && bad "$t: interview-bank sections with no curriculum topic" "$out"
  out=$(echo "$rows" | awk -F'|' 'NF != 5 { print $2 }')
  [ -n "$out" ] && bad "$t: curriculum rows that are not exactly 3 cells (a stray | ?)" "$out"

  # The java track predates the primary-source rule and cites its sources per lesson instead.
  if [ "$t" != java ]; then
    unsourced=$(echo "$rows" | grep -vF '*Read:*' | cut -d'|' -f2 | tr -d ' ' | sort)
    out=$(comm -12 <(echo "$unsourced") <(echo "$bank_ids"))
    [ -n "$out" ] && bad "$t: topics with interview questions but no *Read:* link to official docs" "$out"
  fi
done

# --- state/PROGRESS.md: one Current line per track naming a real topic, and small enough to read every session ---
p=state/PROGRESS.md
for dir in core/*/; do
  t=$(basename "$dir")
  n=$(grep -c "^\*\*$t\*\* — Topic: " "$p")
  [ "$n" = 1 ] || { bad "$p: expected one Current line for $t, found $n"; continue; }
  id=$(grep -oE "^\*\*$t\*\* — Topic: [A-Z]*[0-9]{2}[a-z]?" "$p" | awk '{print $NF}')
  grep -qE "^\| $id \|" "${dir}CURRICULUM.md" || bad "$p: $t Current topic '$id' is not in ${dir}CURRICULUM.md"
done
lines=$(wc -l < "$p")
[ "$lines" -le 150 ] || bad "$p is $lines lines (cap 150): move detail to state/WEAK-SPOTS.md or trim Completed notes"

# --- the installers run to the end on this machine, without installing anything ---
out=$(bash install.sh --check 2>&1) || bad "install.sh --check failed" "$out"
if command -v powershell >/dev/null 2>&1; then
  out=$(powershell -NoProfile -ExecutionPolicy Bypass -File install.ps1 -Check 2>&1) \
    || bad "install.ps1 -Check failed" "$out"
fi

# --- every documentation link resolves ---
if [ "${1:-}" = "--links" ]; then
  out=$(grep -ohE 'https://[^) ]+' core/*/CURRICULUM.md | sort -u | xargs -P 8 -I{} sh -c \
    'c=$(curl -s -o /dev/null -L -m 25 -A "Mozilla/5.0" -w "%{http_code}" "{}"); [ "$c" = 200 ] || echo "$c {}"')
  [ -n "$out" ] && bad "documentation links that do not return 200" "$out"
fi

[ "$fail" -eq 0 ] && echo "check.sh: ok"
exit "$fail"
