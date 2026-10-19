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

## 2026-10-19: judgement questions go to the Architect
- Real use: a fresh Sonnet chat was asked how sound copartner is and how it
  compares with other agent systems. It answered from memory in about two
  minutes, with no web search, no Architect and no skill. The escalation
  triggers lived only in engineer-project, which loads for building, not
  for questions.
- Fix: rules.md now says judgement questions (is this sound, what's best,
  how does it compare, is it worth building, which architecture) are big
  work: research current sources and get the Architect before answering.
  codex-partner's description names them, so it loads for questions too.
- engineer-project gains a "worth building?" check before the roadmap: what
  already exists, the riskiest assumption, the cheapest test. The user's
  goal includes knowing whether an idea is worth pursuing.
- rules.md is 3,983 of 4,000 bytes; a shorter codex-partner line paid for it.
- Considered and dropped: a hook as merge gate (no hooks, see AGENTS.md); a
  separate friction log (this file already records what real use shows).

## 2026-10-19: write the whole answer
- Real use: two judgement-question runs (a Sonnet main chat, then an Opus
  one) both put their whole answer into the app's end-of-turn recap and
  question box. The user saw a one-line verdict and a question, never the
  reasoning. Same failure on both models, so it's the instruction, not the
  model.
- Fix: the Talking rule now says to write the whole answer in the message;
  a recap or question box only repeats it.
- Paid for by shortening two sentences; rules.md is 4,000 of 4,000 bytes.
- Also seen: in the Sonnet run, the Opus advisor tool was available and
  was never called; the Opus run made no web search. Judgement routing is
  still open: the evidence so far favours the main chat owning judgement
  over handing it to the Architect. A clean re-test decides it.

## 2026-10-19: one cofounder loop
- Real use: asked "how sound is copartner?", a fresh session stopped
  partway (an audit, a task card and a question) with no options compared,
  no research and no verdict. Nothing in copartner said what a finished
  judgement answer is, and nothing controlled how hard it thought: effort
  was "low" for a month, Sonnet did most of the work via opusplan, and Opus
  5.5 ignores the top-level `effortLevel`.
- Fix: `engineer-project` becomes `cofounder`, one loop with two stages.
  Decide (goal, read first, real options always weighing "change nothing",
  current research, an outside challenge, one recommendation written out
  in full and recorded in the note) runs for every big question, at the
  start of big work and at costly choices mid-build. Build is the old
  phase-by-phase flow. A question ends after Decide. The bar: beat plain
  plan mode on the same message.
- Why one loop, not a separate question skill: the owner saw two skills and
  rule lines as patches. The note is already the single source of truth
  and engineer-project already the loop; the failure was that questions
  never entered it. A full plan-graph system was rejected: the earlier
  always-on system cost 1.36x quota for no gain (AGENTS.md), and a real
  dependency graph only pays off with many parallel writers, which we
  avoid on purpose.
- The skill's frontmatter sets `model: opus` and `effort: high` while it
  runs (skills docs), so the system picks model and effort, not the user.
  High, not xhigh, by the owner's call: the steps carry the gain.
- rules.md routes judgement questions, vague big asks and the start of big
  work to it, with a one-line fallback if it doesn't load. The whole-answer
  line stays in Talking (shorter), because a skill only loads when the
  model picks it.
- Codex challenged the plan. Taken: keep the rules fallback, no padded
  option lists, a question's answer is a finished job unless work was asked
  for, a clean plan-mode baseline (`--safe-mode`, same model and effort)
  judged on accuracy before process. Not taken: a separate rule-only vs
  skill comparison (extra quota; real use decides).
- A skill's model lasts for the rest of its turn; the next message goes
  back to the session model, though the skill's text stays in context.
- rules.md is 3,993 of 4,000 bytes.

Proof, same soundness question, 2026-10-19:
- Copartner as a real app session (started on Sonnet): the skill loaded by
  itself, switched to Opus, made 3 web searches, and put the whole answer
  in the message. It skipped the challenge step (no Codex or Opus call).
- Plain plan mode (`--safe-mode --permission-mode plan`, Opus high): also
  a full answer, 3 searches and 4 page reads, about 6 minutes.
- Codex judged both blind, claims checked against the repo: copartner won
  narrowly (accuracy 7 v 6, recommendation 8 v 6, clarity 8 v 7). Both
  overstated some claims; neither ran an outside challenge.
- Fix: the skill now says never to skip the challenge, and the self-check
  asks whether it ran.

## 2026-10-19: helper timeout and safe install
A real-use test and a blind Codex review both found these at 3344356:
- The helper's timeout gave up after 15 seconds without knowing Codex had
  stopped, so the claim above ("waits for Codex to really stop") was not
  true. Now it only counts Codex as stopped when the process has closed
  (and, on Windows, `taskkill` ended the whole tree). If not, it prints
  `CODEX_STILL_RUNNING` and exits 4, and the skill says not to start a
  fallback or reuse the folder until that process ends.
- CI now runs `node --check` on the helper, so a syntax error fails the PR.
- Install removed any `engineer-project` or `think-it-through` folder and
  replaced same-name skills, even a user's own. Now a skill folder is only
  replaced or removed if its description matches copartner's (listed in
  INSTALL.md step 4); otherwise it is skipped and the user is told. Changing
  a skill's description now means adding the new opening to that list.
- Uninstall now also removes `~/.copartner/rules.md`, removes skill folders
  only if they are copartner's, and puts back the default model if step 5
  changed it. Backups are not overwritten on a second install.

Known problems:
- In the real app run the effort indicator stayed low after the skill
  loaded, so the skill's `effort: high` may not apply in the app.
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
