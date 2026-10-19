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

## 2026-10-18: Codex as Claude's partner
- Added the `codex-partner` skill (Claude Code only) and its helper script.
  Claude calls Codex at set moments (plan challenge, review before merge,
  stuck bugs, hard choices, separable tasks) with an effort chosen per
  moment, and falls back to Claude when Codex is out. Why: the owner wants
  their ChatGPT subscription used first as a second brain.
- Not on every turn: calls take minutes and Claude still reads the answer,
  so constant use would cost Claude quota, not save it.
- Built our own instead of OpenAI's codex-plugin-cc: its review commands
  can't be started by Claude itself, its task path runs through a Sonnet
  wrapper, and its prompts target an older model.
- Quota is read up front from Codex's local app server
  (`account/rateLimits/read`, 5-hour and weekly percent). Usage-limit errors
  are the backstop. Either one pauses Codex until the reset time, kept in
  `~/.copartner/codex-paused.json`. The app-server call is not a documented
  API; if it stops answering, the helper falls back to errors only.

## 2026-10-19: a cofounder that runs its own team
What each change fixes (found by a Codex and an Opus review of the plan,
and checked against the files; compared with Kiro, Spec Kit, BMAD, GSD,
Anthropic's and Cognition's write-ups):
- Outcomes in every plan (rules): plans said what to build but not how each
  piece serves the goal. Each task names its Outcome; proofs include the
  failure case and are written first. Workers can't edit proofs.
- Architect mode in codex-partner: big design calls and research go to Codex
  with web search (Opus if Codex is out), which returns a ~600-word brief and
  saves full notes to `~/.copartner/briefs/`. Keeps the main chat's context
  clean and lets a cheaper main chat talk coherently. Hard triggers for when
  to use it, because weaker main models under-escalate.
- One approval up front (engineer-project): superpowers' plan and execution
  questions plus ours were up to five stops. Now one go-ahead covers the
  roadmap, Outcomes and user-only setup items; superpowers is told not to ask.
- One owner per review gate: per-task reviews only for money, auth or data;
  one Codex (or Opus) review per phase, one round.
- "Now" block in the note and the note named after the main checkout, so a
  new session or a worktree resumes in-progress work.
- Helper fixes: a timeout now waits for Codex to really stop before the
  fallback starts; `--dir` runs a task in its own worktree.
- No saved helper agents: the Agent tool takes a model per call. No persona
  teams, hooks, best-of-N or agent teams: they cost tokens without evidence
  of better results.
- rules.md is 3,802 of 4,000 bytes.

Merged before a real run, by the owner's call: they prove it by using it
on real projects and report back what works worse or better.

Known problems:
- Not yet checked: that Codex can write project notes to `~/.copartner`
  after the `writable_roots` change. (Claude's auto mode did allow writing
  there.)

Next:
0. From real use, watch for: stops after the one approval, a Codex worker's
   work kept or redone cleanly, Architect briefs that hold up on follow-up,
   and resuming from a worktree.
1. Ship a tested one-command installer (and uninstaller) in the repo, so
   the agent hands over that command instead of writing one.
2. More on-demand skills (such as reviewing money or auth code), only if
   real use shows a gap they fill.
