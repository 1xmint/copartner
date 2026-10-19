---
name: codex-partner
description: Uses Codex (GPT, on the user's ChatGPT subscription) as Claude's engineering partner while it has quota - challenging plans, adversarial review before merging, a fresh diagnosis when stuck, and taking well-specified tasks off Claude's hands - then falls back to Claude when Codex runs out. Use at those moments in big or risky work, not for small asks.
---

# Codex as engineering partner

Codex is a second, different brain: it catches what Claude misses because it
reasons differently. While it has quota, prefer it for the jobs below; it
spends the user's ChatGPT quota instead of their Claude quota. You stay the
lead: you decide, and you check what it says before acting on it.

The helper is `~/.claude/skills/codex-partner/codex-partner.mjs` (needs
`node` and a logged-in `codex`). If either is missing, skip this skill and
work as you would without it.

## When to call it, and how hard it thinks
Efforts: low, medium, high, xhigh, max, ultra. Higher is slower and spends
quota faster.

| Moment | Mode | Effort |
|---|---|---|
| A plan or roadmap is written, before building | challenge | high |
| Before merging big work | review | high |
| ...that touches money, auth, user data or the architecture | review | xhigh |
| A bug survived one real fix attempt | think | xhigh |
| A hard design choice between real options | think | high |
| A separable, well-specified coding task | task | medium (high if tricky) |

Use max or ultra only when the user asks, or when you and Codex still
disagree at xhigh about something that matters. Don't call it for small
asks, things you can verify in seconds, or every step.

If the usage line shows the 5-hour window above 80%, step down one level
and save what's left for reviews.

## How to call it
Write the prompt to a file, then run this from the repo, in the background
(it can take several minutes) and keep working on something else:

```
node ~/.claude/skills/codex-partner/codex-partner.mjs ask --mode review --effort high < prompt.txt
```

Optional `status` (no prompt) tells you whether Codex is available and how
much is used. You don't need it before `ask`; `ask` checks first.

Prompts that get good answers:
- Give the goal, the constraints that matter, and where to look (paths,
  branch, `git diff main...HEAD`). Codex reads the repo itself.
- Don't say what you think the answer is. Ask it to find what's wrong.
- For review and challenge, ask for: a verdict, then findings ordered by
  severity, each with file:line, why it matters, and a fix; then what would
  change its mind. Say "no findings" is a fine answer.
- For a task: exactly what to build, which files it may touch, how to prove
  it works, and to run that proof. Only hand over tasks whose files you
  aren't editing at the same time.

## Using the answer
- Check each finding against the code before acting. Fix what's real, and
  say in a line why you're dropping the rest.
- If you disagree on something important, send one rebuttal with your
  evidence. Then decide yourself and note the call in the project note.
- For a task, review its diff and run the proof yourself before keeping it.

## When Codex is out
Exit code 3 (`CODEX_UNAVAILABLE`) means out of quota, not installed, not
logged in, or signed in with an API key (which bills separately, so it is
never used). Do the step with Claude instead (a helper on a cheaper model for
reviews and tasks), tell the user once in a line, and don't call Codex again
until the time it gives. The helper remembers this in
`~/.copartner/codex-paused.json`.
