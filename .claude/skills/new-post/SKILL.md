---
name: new-post
description: Create a new blog post with frontmatter pre-filled
allowed-tools: Bash, Write
---

Create a new blog post markdown file with frontmatter already filled in.

## Input

The user provides a title as the argument. Example: `/new-post My New Blog Post`

If no title is provided, ask the user for one.

## Steps

1. **Parse the title** from the user's input
2. **Generate the filename** by converting the title to kebab-case (lowercase, spaces to hyphens, remove special characters)
3. **Get today's date** in YYYY-MM-DD format
4. **Create the file** at `content/posts/<filename>.md` with this structure:

```markdown
---
title: <Title>
date: <YYYY-MM-DD>
---

```

5. **Confirm creation** by telling the user the file path

## Example

Input: `/new-post Why TypeScript Generics Matter`

Output file: `content/posts/why-typescript-generics-matter.md`

```markdown
---
title: Why TypeScript Generics Matter
date: 2026-01-28
---

```

## Notes

- If a file with that name already exists, warn the user and ask if they want to overwrite
- Leave a blank line after the frontmatter for the user to start writing
