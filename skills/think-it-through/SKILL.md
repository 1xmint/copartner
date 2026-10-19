---
name: think-it-through
description: Carries a judgement question or a big, vague ask through to one finished, reasoned recommendation - works out the real goal, reads first, compares real options (including changing nothing), researches current sources, gets an outside challenge, decides, and writes the whole answer. Use when the user asks is this sound, what's best, how does it compare, is it worth building, which approach or architecture, why something works badly, or gives a big or vague ask; and before planning big work. Not for small, clear asks.
model: opus
effort: high
---

# Think it through

ultrathink. (On Codex, which ignores this skill's model and effort: take
the time to think each step through.)

The user is a founder, not an engineer. They won't say "plan first,
compare options, research, then decide": you do that for them, every time,
to the end. The bar: your answer must be clearly better than what plain
Claude in plan mode would give for the same message.

Do all seven steps, in order. Keep a task list with one item per step.

1. **Goal.** Say in a line or two what the user is really after and what a
   finished answer looks like. Their words are a clue, not a spec. Ask
   only if two readings lead to different work; otherwise state your
   assumption and go.
2. **Read first.** Make no edits until step 7. Read the project note, the
   repo's own notes and the real files the question touches. Send bulky
   reading to an Explore helper on `model: haiku`. Check claims in code,
   not in summaries or old notes.
3. **Options.** Write down the real, distinct options, usually three or
   more. Always weigh "change nothing" and "remove or simplify something";
   don't pad the list to hit a number. For each: what it gets the user,
   what it costs (quota, time, attention, risk).
4. **Research** what the choice hinges on, from current sources (official
   docs, changelogs, real reports), with links and dates. Stop once more
   research wouldn't change the call. Codex's `architect` mode can do the
   heavy research; the call stays yours.
5. **Challenge.** Send your leading option, the others and your reasons to
   a second mind to attack: Codex `challenge` at high effort via
   codex-partner, or a helper on `model: opus` if Codex is out. It looks
   for holes; it doesn't decide. Check each point it makes against the
   evidence.
6. **Decide.** Pick one. Say why it beats each other option, what it
   costs, and what would change your mind. If the best move is to change
   nothing, say so plainly, and why. Don't invent work.
7. **Answer, then act.** Write the whole answer in your message, not in a
   recap or question box:
   - the verdict in one or two lines;
   - the options compared;
   - the evidence, with sources;
   - what happens next.

   If the next move is theirs (what the product does, money, credentials,
   anything public or irreversible), ask one question and lead with your
   recommendation. If they only asked for an assessment, the assessment is
   the finished job. If they also asked for the work, carry on: small work
   now, big work through engineer-project. If engineer-project called you,
   hand the decision back to it and let it carry on.

Before you end, check yourself:
- Did you do all seven steps?
- Is the whole answer in the message?
- Would plain plan mode have given a better answer?

If any check fails, go back and finish.
