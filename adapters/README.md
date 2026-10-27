# Adapters

An adapter is a **pointer**, not a lesson. Each one carries only its agent's trigger metadata plus
"read `core/BOOTSTRAP.md` and follow it". That is what guarantees every agent behaves identically:
there is exactly one copy of the methodology, and no adapter contains enough to diverge from it.

If you ever find yourself explaining a teaching step inside an adapter, stop — it belongs in
`core/`.

## Canonical sources

| Agent | Canonical file | Installed to |
|---|---|---|
| Claude Code | `adapters/claude/SKILL.md` | `~/.claude/skills/learn/SKILL.md` |
| OpenCode | `adapters/opencode/learn.md` | `~/.config/opencode/commands/learn.md` |
| Codex | `adapters/codex/SKILL.md` | `~/.codex/skills/learn/SKILL.md` |
| Claude Code | `adapters/claude/scratch.md` | `~/.claude/skills/scratch/SKILL.md` |
| OpenCode | `adapters/opencode/scratch.md` | `~/.config/opencode/commands/scratch.md` |
| Codex | `adapters/codex/scratch.md` | `~/.codex/skills/scratch/SKILL.md` |
| Claude Code | `adapters/claude/progress-mod/` | `~/.claude/skills/learning-progress` (a link, not a copy) |

`progress-mod` is a Claude Code mod, not a pointer: a one-line band above the prompt, shown in
sessions opened in this repo — the most recent track on a beginner → senior ladder with its next topic, its lessons and scratches as two meters, then every track in one row. It
reads the repo through the link, so it is never stale. Test it with
`claude plugin test adapters/claude/progress-mod`.

The `scratch` adapters are the same pointer with one difference: they hand the bootstrap the
argument `scratch <scope>`, which its dispatch table sends to `core/SCRATCH.md`. The manual and
verify snippets below show `/learn` only; the installer handles both.

Installed globally, so `/learn` and `/scratch` resolve from **any** directory — including while working inside an
unrelated company repo.

## Install / reinstall

Use the installer at the repo root — it detects the repo path and substitutes it, so the same
checkout works on any machine at any location:

```powershell
.\install.ps1        # or  ./install.sh
```

The manual equivalent, if you prefer (note: this installs the placeholder path verbatim, so it only
works if the repo really is at `C:/Projects/learning-system`):

```bash
# Claude Code
mkdir -p ~/.claude/skills/learn
cp /c/Projects/learning-system/adapters/claude/SKILL.md ~/.claude/skills/learn/SKILL.md

# OpenCode
mkdir -p ~/.config/opencode/commands ~/.config/opencode/command
cp /c/Projects/learning-system/adapters/opencode/learn.md ~/.config/opencode/commands/learn.md
cp /c/Projects/learning-system/adapters/opencode/learn.md ~/.config/opencode/command/learn.md

# Codex
mkdir -p ~/.codex/skills/learn
cp /c/Projects/learning-system/adapters/codex/SKILL.md ~/.codex/skills/learn/SKILL.md
```

**Why OpenCode gets two directories.** The documented path is `commands/` (plural), but published
sources disagree about whether some builds read `command/` (singular). The adapter is a ~20-line
pointer with no learning content, so writing both spellings guarantees `/learn` resolves whichever
convention the installed build uses. This duplicates a pointer, never content. If you confirm which
one your build reads, delete the other.

## Moving the learning repo

The absolute path appears twice per adapter: the fenced `Learning home:` block and step 1. The
installer rewrites both — re-run it rather than editing by hand.

## Verifying an install

```bash
test -f ~/.claude/skills/learn/SKILL.md && echo "claude adapter installed"
test -f ~/.config/opencode/commands/learn.md && echo "opencode adapter installed"
test -f ~/.codex/skills/learn/SKILL.md && echo "codex adapter installed"

# installed copies must match canonical once the repo path is substituted
here="$(cygpath -m "$PWD" 2>/dev/null || pwd)"
for p in claude/SKILL.md:.claude/skills/learn/SKILL.md \
         opencode/learn.md:.config/opencode/commands/learn.md \
         codex/SKILL.md:.codex/skills/learn/SKILL.md; do
  sed "s|C:/Projects/learning-system|$here|g" "adapters/${p%%:*}" | diff -q - "$HOME/${p#*:}"
done
```

In Claude Code and Codex the skill is picked up on the next session start. In OpenCode the command
appears as `/learn` in the TUI.

## Adding a third agent

Create `adapters/<agent>/` with whatever entry-point format that agent expects, pointing at
`core/BOOTSTRAP.md` the same way. Do not copy any part of `core/` into it. Then add a row to the
table above.
