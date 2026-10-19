# Install copartner

These steps are for the AI agent (Claude Code or Codex) to carry out when the
user asks to be set up with copartner. Do every step, then tell the user in
two or three plain sentences what changed. Never overwrite a file the user
already has: add to it, and copy it to `<file>.before-copartner` first.

If your sandbox blocks writing to these folders or downloading (Codex blocks
writes to its own settings folder), don't ask the user to change permissions.
Write one command for their shell that does every step below, show it in
your final message, and ask them to paste it into a terminal.

The base URL is `https://raw.githubusercontent.com/1xmint/copartner/main`.

## 1. Get the rules
Download `rules.md` from the base URL to `~/.copartner/rules.md`, replacing
any older copy. Create `~/.copartner/projects/` if it is missing.

## 2. Codex
Codex reads `~/.codex/AGENTS.md` and cannot import other files, so the rules
go inside it, between these two marker lines:

```
<!-- copartner:start -->
<!-- copartner:end -->
```

If the markers are there, replace what is between them with the new
`rules.md`. If not, add the markers and the rules at the end of the file
(create the file if it is missing).

Codex may only write inside the folder it was started in, so let it write
project notes: in `~/.codex/config.toml`, add the absolute path of
`~/.copartner` to `writable_roots` under `[sandbox_workspace_write]`, keeping
anything already listed.

## 3. Claude Code
Add this line at the end of `~/.claude/CLAUDE.md` (create the file if it is
missing), unless it is already there:

```
@~/.copartner/rules.md
```

Skip this step if that file already imports `~/.codex/AGENTS.md`, because
Claude then gets the rules through step 2 and would load them twice.

## 4. Skills
Download `skills/cofounder/SKILL.md` from the base URL to both of these,
replacing any older copy (Claude Code reads the first, Codex the second):

- `~/.claude/skills/cofounder/SKILL.md`
- `~/.agents/skills/cofounder/SKILL.md`

If an older install left `engineer-project` or `think-it-through` skill
folders in either place, remove them: `cofounder` replaces both.

Then download `skills/codex-partner/SKILL.md` and
`skills/codex-partner/codex-partner.mjs` into
`~/.claude/skills/codex-partner/`. This one is for Claude Code only: it lets
Claude use Codex as a partner, and works if Codex is installed and logged in.

## 5. Optional: a cheaper main chat
Big questions and big work run through the cofounder skill, which switches
to Opus at high effort by itself, so a mid-size model is enough for the
rest. Ask the user once whether to set Claude Code's default model to Sonnet (`"model": "sonnet"` in
`~/.claude/settings.json`). Change it only if they say yes.

## 6. Check
Show the user that the marker block is in `~/.codex/AGENTS.md`, the import
line (or the existing `~/.codex/AGENTS.md` import) is in
`~/.claude/CLAUDE.md`, and the skill files exist. Everything takes effect in
the next new session.

## Update
Run the same steps again. They replace the rules and skill and change
nothing else.

## Uninstall
Remove the marker block from `~/.codex/AGENTS.md`, the import line from
`~/.claude/CLAUDE.md`, the `~/.copartner` entry from `writable_roots`, and
both `cofounder` skill folders, the `codex-partner` skill folder and `~/.copartner/codex-paused.json` if it exists.
Leave `~/.copartner/projects/` and `~/.copartner/briefs/`, because those are
the user's project notes and research;
tell them it is there and that they can delete it.
