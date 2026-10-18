# State

## 2026-10-17: first version
- Started from a personal shared rules file that was proven to load in fresh
  Claude Code and Codex sessions. Generalised it (no personal or machine
  details) into `rules.md`.
- Project notes live outside the repo so messy repos don't matter. Fallback:
  `NOTES.md` at the repo root if the agent can't write there.
- Install is a page the agent follows (`INSTALL.md`), not scripts, so one
  install works for both tools on any OS.
- Repo is public; `main` requires a PR and a green check, no approvals (one
  maintainer).

## 2026-10-17: judged by real use
- No scripted comparison runs. The owner uses it on real projects and
  reports what could be better; that feedback drives changes. Why: scripted
  runs spend quota and test made-up tasks.

## 2026-10-17: install test, Codex
- A fresh Codex session could not install: its sandbox blocks writes to
  `~/.codex` even when the folder is granted. It wrote the user a one-command
  installer instead, so that is now the documented fallback.
- Codex adds a trust entry to `config.toml` for any folder it runs in; that
  is Codex, not the install.

## 2026-10-17: install test, Claude Code
- A fresh Claude Code session downloaded the rules, correctly skipped its own
  import (the user file already imported the Codex file), then stopped:
  auto mode blocks an agent editing its own instruction files. It offered a
  paste-in command, as the fallback says.
- So in both tools the real install is the user pasting one command. The
  agent writes that command fresh each time, which can vary or be wrong.

## 2026-10-17: superpowers for big work
- The effort rule now names superpowers: use it for big, open-ended work and
  skip it for small asks, so the agent picks by itself. Why: the owner wants
  the full workflow on big projects without asking for it each time, and no
  ceremony on small ones.

## 2026-10-17: phase-by-phase projects
- Added the `engineer-project` skill: roadmap in the project note, one
  go-ahead, then plan, build, prove and merge each phase, resuming from the
  note in later sessions. Why: the owner's main want is managing a big
  project across many phases. A skill, not rules, so it costs nothing on
  small asks. Built on superpowers rather than GSD, which writes planning
  files into the repo and spends heavily.
- Installed to `~/.claude/skills/` (Claude Code) and `~/.agents/skills/`
  (Codex).

Known problems:
- Not yet checked: that Codex can write project notes to `~/.copartner`
  after the `writable_roots` change. (Claude's auto mode did allow writing
  there.)

Next:
1. Ship a tested one-command installer (and uninstaller) in the repo, so
   the agent hands over that command instead of writing one.
2. More on-demand skills (such as reviewing money or auth code), only if
   real use shows a gap they fill.
