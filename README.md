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
- Big projects run phase by phase: ask it to engineer something big and it
  writes a roadmap, gets one go-ahead, then plans, builds, proves and merges
  each phase, picking up where it left off in a new session. (The
  `engineer-project` skill; it uses superpowers if you have it.)
- It keeps the always-on text short, because every line is read on every
  turn and spends your quota.

Read the whole thing in [rules.md](rules.md).

## License

MIT
