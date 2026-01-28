---
title: Claude Code skills using metacognition
date: 2026-01-28
---

## `/wrap`: review the session

I use `/wrap` at the end of the session. It reviews the conversation and provides:

- **Pattern analysis** — identifies repeated operations that could become skills or aliases
- **Workflow suggestions** — proposes new skills, CLAUDE.md additions, and automation opportunities
- **Prompting feedback** — reviews my prompts for clarity and efficiency, with specific improvement suggestions
- **Pickup note** — summarizes where work left off for the next session

### Prompting Feedback Example

> What worked well:
> - Your initial prompt was concise and included the relevant line selection, which helped pinpoint the issue quickly
> - "still it looks like a code block" was a direct, efficient way to indicate the first fix didn't work
>
> What could be improved:
> - The initial prompt could have included how you're viewing the rendered output (browser? local dev server?). This would have helped me check the generated HTML directly instead of just the source markdown.
> - If you had mentioned you're using markdown-it or pointed to the build script, I could have diagnosed the HTML-block limitation faster instead of first trying a pure markdown fix.
>
> Example improvement:
>
> Instead of: "from this line, the markdown is rendered as a code block which is not true. how to fix"
>
> Try: "from this line, the markdown renders as a code block _**in the browser**_. _**Using markdown-it for build.**_ how to fix?"
>
> The extra context (markdown-it) would have saved one round-trip.
