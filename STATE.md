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

Known problems:
- Not yet checked: that Codex can write to `~/.copartner` after the
  `writable_roots` change, and that Claude's auto mode allows writing there
  and allows the install itself.

Next:
1. Comparison: the same few real tasks with plain Claude Code/Codex and with
   copartner, scored on what the user feels and on quota. Ship only if better.
2. A fresh-session install test in each tool.
3. On-demand skills (plan a big feature, review money/auth code, pick up
   where we left off), only if the comparison shows a gap they fill.
