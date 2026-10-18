# Install copartner

These steps are for the AI agent (Claude Code or Codex) to carry out when the
user asks to be set up with copartner. Do every step, then tell the user in
two or three plain sentences what changed. Never overwrite a file the user
already has: add to it, and copy it to `<file>.before-copartner` first.

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

## 4. Check
Show the user that the marker block is in `~/.codex/AGENTS.md` and the import
line (or the existing `~/.codex/AGENTS.md` import) is in
`~/.claude/CLAUDE.md`. The rules take effect in the next new session.

## Update
Run the same steps again. They replace the rules and change nothing else.

## Uninstall
Remove the marker block from `~/.codex/AGENTS.md`, the import line from
`~/.claude/CLAUDE.md`, and the `~/.copartner` entry from `writable_roots`.
Leave `~/.copartner/projects/`, because those are the user's project notes;
tell them it is there and that they can delete it.
