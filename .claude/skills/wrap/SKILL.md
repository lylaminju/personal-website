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

### 3. Prompting Feedback
Review the user's prompts throughout the session and provide constructive feedback:

**Clarity & Specificity:**
- Were requests clear enough to act on immediately?
- Did vague requests cause back-and-forth clarification?
- Could the user have provided more context upfront?

**Efficiency:**
- Did the user break large tasks into reasonable chunks?
- Were there unnecessary intermediate prompts that could be combined?
- Did the user leverage Claude's capabilities effectively (e.g., parallel tasks, batch requests)?

**Best Practices:**
- Note any particularly effective prompts as examples
- Suggest specific rephrasing for prompts that could be improved
- Highlight when more/less detail would have helped

Be honest but constructive. The goal is to help the user become more effective at working with Claude.

### 4. Pickup Note
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

## Prompting Feedback
[Honest, constructive feedback on the user's prompts with specific examples and suggestions]

## Pickup Note
[Brief note for resuming next session]
```

Keep the output concise and actionable. Only suggest improvements that would provide real value based on observed patterns.
