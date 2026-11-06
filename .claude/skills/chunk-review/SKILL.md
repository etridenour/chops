---
name: chunk-review
description: Check the current chunk of uncommitted work against docs/DEFINITION-OF-DONE.md and report pass, fail, or N/A per section. Use before handing a chunk to the user for review, or when the user runs /chunk-review.
---

# Chunk Review

Checks one chunk (the uncommitted changes) against the Definition of Done. Scope is the diff, not the codebase.

## Steps

1. **Get the chunk.** Run `git status --short` and `git diff HEAD`. Untracked files are part of the chunk. If there are no changes, say so and stop.
2. **Run the checks.**
   - `pnpm check` (lint + typecheck). Zero errors required. Report only new warnings in changed files.
   - `pnpm --filter <package> test` for each package the chunk touches.
   - Playwright: run only the spec for a journey the chunk changes (`pnpm --filter @chops/e2e e2e <spec>`), and only if the e2e stack is up. Otherwise mark it "not run" with the reason.
   - Report failures only. Never paste passing output.
3. **Check the list.** Read `docs/DEFINITION-OF-DONE.md`. Judge each item against the diff. Read surrounding code only when the diff alone can't answer an item.
4. **Report** in the shape below.

## Rules

- Mark an item N/A when it can't apply to this chunk. Never skip it silently.
- A fail names the file and line, and says what's missing in one line.
- When Claude runs this before a handoff: fix the fails, re-run the failed checks, then report. When the user runs it: report only, and propose fixes.
- No subagents. Don't read unchanged files whole.
- Don't touch the session log in `private-docs/SCHEDULE.md`. The finish time is stamped when the user approves the chunk.

## Report shape

```
Chunk: <one line on what changed>
Checks: pnpm check ✓/✗ · tests ✓/✗ (<packages>) · e2e ✓/✗/not run (<why>)

Fails
- <section>: <item> — <file:line> <what's missing>

Sections
- Tests: pass / N/A
- Accessibility: pass / N/A
- UX Patterns: pass / N/A
- Component Structure: pass / N/A
- API: pass / N/A
- Security: pass / N/A
- Performance: pass / N/A
- Maintainability: pass / N/A

Needs your eyes
- <anything a checklist can't judge: UX feel, naming, product calls>
```
