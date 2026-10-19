# copartner

A ready-made setup that makes Claude Code and Codex work like a technical
cofounder for people who build software by describing it: it finds out what
you actually want, picks the approach, proves the work is done, and talks in
plain words.

It lives outside your repos. Nothing is added to your project, so it works the
same on a tidy repo or a messy one. It is one short rules file that both tools
load, plus one short note per project kept in `~/.copartner/projects/`. It
works on a normal Claude or ChatGPT subscription; no API key.

> **Early.** It is being tried on real projects; changes come from what that
> use shows.

## Install

Paste this into Claude Code or Codex:

```
Set me up with copartner: follow https://github.com/1xmint/copartner/blob/main/INSTALL.md
```

If the tool can't change its own settings, it gives you one command to paste
into a terminal instead. Start a new session afterwards. To update, paste the same line again. To
remove it, ask to uninstall copartner using the same page.

## What it changes

- Small, clear asks just get done; plans and reviews are saved for big or
  risky work.
- It asks you only about what the product should do, money, credentials and
  anything public or irreversible, and leads with a recommendation.
- "Done" comes with evidence: the check that ran or the flow it drove.
- Every plan starts with Outcomes: what you'll see, and how it will be
  proved. Each piece of work says which Outcome it serves.
- One cofounder loop for anything big (the `cofounder` skill, on Opus at
  high effort). First it decides: the real goal, the options (including
  changing nothing), current research, an outside challenge, then one
  recommendation, written out in full and recorded in the project note.
  A question ends there.
- Big projects then run phase by phase: ask it to build something big and it
  writes a roadmap with Outcomes, asks once for the go-ahead and anything
  only you can set up (accounts, keys), then plans, builds, proves and merges
  each phase, picking up where it left off in a new session. It runs the
  team itself: an Architect for research, one reviewer,
  and workers for separable tasks. You never manage agents. It uses
  superpowers if you have it.
- If you also have Codex, Claude uses it as that team on your ChatGPT
  subscription: Architect (with web search, returning a short brief),
  reviewer before merging, a fresh diagnosis when Claude is stuck, and
  worker in its own worktree.
  When Codex runs out of quota, Claude carries on alone until it resets.
  (The `codex-partner` skill.)
- It keeps the always-on text short, because every line is read on every
  turn and spends your quota.

Read the whole thing in [rules.md](rules.md).

## License

MIT
