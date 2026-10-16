---
name: work-summary
description: After finishing work, summarize changes made, list files changed, and mention things that require verification. Do not run the application for style and UI changes. Use when a task is complete, when reporting results, or after implementing, editing, or fixing code.
---

# Work summary

Whenever work is done, summarize changes made. List files changed. Mention things that require verification. Don't run the application application for things like style and ui changes

## When the work is done

End the reply with this wrap-up. Do not skip it after implementation, fixes, or refactors.

### 1. Summary

A short account of what changed and why (decisions, not a file dump).

### 2. Files changed

List every path created, modified, or deleted.

### 3. Verification

Name what still needs a human or later check (visual polish, recording, API keys, other platforms).

Do **not** start the app, Metro, Expo, a simulator, or the browser for style and UI changes. Describe the UI in the summary instead.

Run lint/typecheck only when the change is behavioral or type-level, not when it is purely visual.

## Template

```markdown
## Summary
[What changed and why]

## Files changed
- `path` — created | modified | deleted — [one-line why]

## Needs verification
- [item]
```
