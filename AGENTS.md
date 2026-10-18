# Working on copartner

## What this is for
copartner is a setup, installed outside any repo, that makes Claude Code and
Codex work like a technical cofounder for people who build software by
describing it. It is one short rules file (`rules.md`) both tools load, plus
one note per project in `~/.copartner/projects/`. It runs on a normal
subscription, with no API key and no outside service.

Always true:
- `rules.md` is read on every turn, so it stays small. CI fails it above its
  byte limit; raising the limit needs a dated reason in STATE.md.
- Rules change because of what real use on projects shows, not on a hunch.
  Each change says in STATE.md what it fixes.
- Install never overwrites a user's file and can be fully undone.
- No person's name, home folder path, email or account detail in any file.

Not doing:
- Fixing or restructuring the user's repos.
- Hooks, status lines or always-on machinery. An earlier, larger system of
  that kind cost about 1.36x the quota for no measured gain.

How to check work: `node scripts/check.mjs` (runs in CI on every PR).
