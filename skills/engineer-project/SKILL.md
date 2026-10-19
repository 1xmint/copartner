---
name: engineer-project
description: Runs a big project phase by phase until it is done - a roadmap, then plan, build and prove each phase - and picks up where it left off in any later session. Use when the user asks to engineer or build something big (a new app, a system with many parts), or says to carry on with one. Not for small or single-step tasks.
---

# Engineer a project, phase by phase

Progress lives only in the project note, `~/.copartner/projects/<repo folder
name>.md` (see "Project notes" in the rules), so any later session can resume.

## Start or resume
If the note has a roadmap, resume: read it, check the repo matches (git log
and status), tell the user in one line which phase you're on, and continue.

If not, start one:
1. Find out the goal. Ask only questions the user can answer about the
   product (who it's for, what it must do first, what's out), in one round,
   each with your recommended answer.
2. Choose the stack and architecture yourself, one line of why for each.
   Prefer boring, well-known tools and the simplest structure that will
   still hold at the finished size.
3. Write a roadmap of 3 to 8 phases into the note under "Roadmap". Each phase
   ends in something the user can see or try, and says how you'll prove it.
   Phase 1 is the smallest version that runs end to end.
4. Show the roadmap in plain words and ask for one go-ahead. Say that it
   covers building every phase and merging each one once its checks pass,
   and that you'll stop for anything that is theirs to decide.

## Each phase
1. Work on a branch named `phase/<n>-<short-name>`.
2. Plan it. If superpowers is installed, use its writing-plans and
   subagent-driven-development skills. If not, write a short task list and
   hand big, separable tasks to helpers on a cheaper model. If the
   codex-partner skill is available, have Codex challenge the roadmap and
   each plan, and give it separable tasks before using Claude helpers.
3. Build it, testing as you go.
4. Prove it: run the checks and drive the real flow (start the app, use the
   feature). Fix until it works.
5. Have the diff reviewed by fresh eyes: Codex through codex-partner if it
   is available, otherwise a helper for phases touching money, auth, user
   data or the architecture, and your own check for the rest.
6. Commit, push, open a pull request, and merge once checks pass.
7. Update the note: phase done with the date and the proof, decisions and
   why, and any change to later phases that this one taught you.
8. Tell the user in two lines what now works and what's next, then start the
   next phase without waiting.

## Stop and ask only when
- a decision is the user's: what the product does, money, credentials, who
  sees data, or anything public or destructive;
- a phase has failed twice in a way you can't fix: say what you tried;
- the roadmap must change in a way that changes what the user gets.

Otherwise keep going until the roadmap is done. If the session is running
long, update the note first so the next session can carry on.

## Finish
When the last phase is done, run the whole thing end to end once, mark the
note "Done" with the proof, and tell the user in a few plain sentences what
was built and how to use it.
