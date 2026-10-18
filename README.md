# copartner

A ready-made setup that makes Claude Code and Codex work like a technical
cofounder for people who build software by describing it: it finds out what
you actually want, picks the approach, proves the work is done, and talks in
plain words.

It lives outside your repos. Nothing is added to your project, so it works the
same on a tidy repo or a messy one. It is one short rules file that both tools
load, plus one short note per project kept in `~/.copartner/projects/`. It
works on a normal Claude or ChatGPT subscription; no API key.

> **Early.** It has not yet been measured against plain Claude Code and Codex.
> That comparison comes before the first release.

## Install

Paste this into Claude Code or Codex:

```
Set me up with copartner: follow https://github.com/1xmint/copartner/blob/main/INSTALL.md
```

Start a new session afterwards. To update, paste the same line again. To
remove it, ask to uninstall copartner using the same page.

## What it changes

- Small, clear asks just get done; plans and reviews are saved for big or
  risky work.
- It asks you only about what the product should do, money, credentials and
  anything public or irreversible, and leads with a recommendation.
- "Done" comes with evidence: the check that ran or the flow it drove.
- It keeps the always-on text short, because every line is read on every
  turn and spends your quota.

Read the whole thing in [rules.md](rules.md).

## License

MIT
