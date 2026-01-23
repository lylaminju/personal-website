---
name: wrap
description: End-of-session reflection with workflow improvement suggestions
allowed-tools: Glob, Grep, Read, Edit
---

Perform an end-of-session wrap-up. Review the session and provide actionable suggestions.

## Steps

### 1. Pattern Analysis
Review the conversation history for:
- Commands or operations repeated 3+ times (candidates for skills/aliases)
- Manual processes that could be automated
- Questions asked that indicate missing project context

Be medium-aggressive with suggestions: if something was done multiple times and would benefit from automation, suggest it. Don't suggest skills for one-off tasks.

### 2. Workflow Suggestions
Based on patterns observed, suggest (in text, not auto-applied):

**Potential new skills:**
- If a multi-step process was repeated, propose a skill with the steps
- Format: skill name, description, what it would do

**claude.md additions:**
- Project conventions discovered during the session
- Preferences the user expressed
- Context that would help future sessions
- Directly edit CLAUDE.md to add these (read it first, then append to appropriate section)

**Other improvements:**
- Bash aliases or shell functions
- Permission additions for settings.local.json
- Subagent configurations for common tasks

### 3. Pickup Note
Write a brief 2-3 sentence note summarizing:
- Where work left off
- Any blocking issues or open questions
- Suggested next steps

## Output Format

```
## Workflow Suggestions

### Potential Skills
[Skill suggestions or "None identified"]

### claude.md Additions
[List what was added to CLAUDE.md, or "None identified"]

### Other Improvements
[Aliases, permissions, etc. or "None identified"]

## Pickup Note
[Brief note for resuming next session]
```

Keep the output concise and actionable. Only suggest improvements that would provide real value based on observed patterns.
