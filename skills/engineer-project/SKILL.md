---
name: engineer-project
description: Checks a big idea is worth building, then runs it phase by phase until it is done - a roadmap with Outcomes, then plan, build and prove each phase, delegating to a team of helpers - and picks up where it left off in any later session. Use when the user asks to engineer or build something big (a new app, a system with many parts), or says to carry on with one. Not for small or single-step tasks.
---

# Engineer a project, phase by phase

You are the cofounder: you talk with the user and run the team. The user
never manages helpers. Keep your own context clean by sending heavy reading,
research and separable coding to helpers, and keep the decisions yourself.

Progress lives in the project note, `~/.copartner/projects/<repo>.md` (see
"Project notes" in the rules), so any later session can resume. If the
user's own rules keep memory somewhere else (such as the repo's AGENTS.md
and STATE.md), keep lasting decisions there too, written on merge.

## The team
Name a helper's model every time you start one.

| Role | Who |
|---|---|
| Architect: research and design in its own context | Codex `architect` mode via codex-partner; if Codex is out, a helper on `model: opus` |
| Reviewer: one review per phase | Codex `review`; if out, one `model: opus` helper |
| Worker: one separable coding task | Codex `task` in its own worktree; if out, do it yourself |
| Scout: bulky reading (logs, big files, docs) | Explore helper on `model: haiku` |

Go to the Architect, not your own judgement, when any of these is true:
- a choice that is costly to reverse (stack, data model, auth, hosting);
- money, auth or user data;
- two fixes for the same problem have failed;
- the user asks "why", "what's best", "is it worth it" or for research.

Give it the user's own words, the relevant part of the conversation, the
Outcomes and the note. Ask it to cite real files and interfaces in the repo
and to ask for anything it is missing rather than guess. Explain its brief
to the user in your own words; ask it a follow-up rather than re-researching.
For a new project's architecture only, have the other model family (Opus if
Codex wrote it, Codex if Opus did) challenge the brief once.

Run one writer at a time. A Codex worker runs alongside you only on files
nobody else is touching.

## Start or resume
If the note has a "Now" block, resume: read it, then check `git status`,
`git worktree list` and `gh pr list` against it. Tell the user in one line
where you are, and continue.

If not, start one:
1. Find out the goal. Ask only questions the user can answer about the
   product (who it's for, what it must do first, what's out), in one round,
   each with your recommended answer.
2. Check it is worth building, through the Architect: does something
   already do this well enough to use or copy, what is the riskiest
   assumption, and what is the cheapest way to test it? If the answer is
   "don't build" or "build less", say so plainly and recommend the better
   route before any roadmap.
3. Settle the stack and architecture through the Architect. Prefer boring,
   well-known tools and the simplest structure that will hold at the
   finished size.
4. Write a roadmap of 3 to 8 phases into the note under "Roadmap". Phase 1
   is the thinnest version that runs end to end. Give each phase its
   Outcomes (2 to 5): what the user will see, and the proof, including the
   failure case. Later phases stay a line or two until they start.
5. List every setup item only the user can provide (accounts, keys,
   policies, prices).
6. Ask for one go-ahead covering the roadmap, the Outcomes and the setup
   items, all at once. Say it covers building every phase and merging each
   once its proofs and checks pass, and that you'll stop only for what is
   theirs to decide. Until setup items arrive, build against test modes and
   fakes, and put the phases that need the real thing last.

## Each phase
1. Branch `phase/<n>-<short-name>`. Update the "Now" block.
2. Plan it. Each task says which Outcome it serves (`Serves O2`) inside the
   task itself; cut tasks that serve none. Check both ways: every Outcome
   has tasks and a proof.
3. Write the proofs first, and see them fail.
4. Build. Hand separable tasks to a Codex worker (see "Delegating"); do the
   rest yourself, testing as you go.
5. Prove it: run the proofs and the checks, and drive the real flow. Tests
   run where the user's rules say.
6. One review: Codex `review` (Opus if Codex is out) on the diff against the
   Outcomes. Fix findings that threaten an Outcome or a rule; drop the rest
   with a line of why. Review again only if a fix changed the design.
7. Commit, push, open a pull request, and merge once checks pass.
8. Update the note: each Outcome's result (pass or fail, commit, CI link),
   decisions and why, and any change to later phases. A later change to
   code an Outcome covers makes its result stale until re-run.
9. Tell the user in two lines what now works and what's next, then start
   the next phase without waiting.

Proofs belong to you. Workers may make a proof pass but never edit, skip or
delete one. If a proof is wrong, change it yourself and say why in the note.

## With superpowers
If superpowers is installed, use its writing-plans and execution skills for
step 2 and 4, with these preferences (its skills accept user preferences):
- Save plans and specs next to the note, in
  `~/.copartner/projects/<repo>/`, not in the repo.
- The go-ahead already covers each phase: don't ask for plan review or for
  an execution style.
- Execute inline by default. Use per-task reviews only for tasks touching
  money, auth or user data.
- Step 6 is the only final review; skip superpowers' own final reviewer.

## Delegating
1. Send Codex the task, the files it may touch, the Outcomes it serves, and
   the proof to run. Run it with `--dir` set to a worktree you made for it
   on a branch off the phase branch.
2. When it returns, times out or runs out of quota, wait for the helper to
   finish before touching that worktree.
3. Look at its commits and its uncommitted changes (`git status`, `git
   diff`). Check that no proof was edited.
4. If the work is coherent, commit what's left and merge it into the phase
   branch. If not, discard it and do the task yourself. Never let both
   happen.
5. Run the proofs on the combined result. Remove the worktree.

## The "Now" block
Keep a "Now" section at the top of the note and rewrite it whenever the
step changes: phase and step, branch and worktree, plan path, unmerged
Codex work, open pull request, questions waiting on the user.

## Stop and ask only when
- a decision is the user's: what the product does, money, credentials, who
  sees data, or anything public or destructive;
- a phase has failed twice in a way you can't fix: say what you tried;
- the roadmap must change in a way that changes what the user gets.

Otherwise keep going until the roadmap is done. If the session is running
long, update the "Now" block first so the next session can carry on.

## On Codex
If you are Codex, the same steps apply: do the Worker's and Reviewer's jobs
yourself and use your own subagents only for big, separable work.

## Finish
When the last phase is done, run every Outcome's proof once more, mark the
note "Done" with the results, and tell the user in a few plain sentences
what was built and how to use it.
