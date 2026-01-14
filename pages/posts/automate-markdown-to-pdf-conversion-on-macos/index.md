---
title: Automate Markdown to PDF Conversion on macOS
date: 2026-01-14
---

# Automate Markdown to PDF Conversion on macOS

Tired of manually running commands every time you update your markdown file? This guide shows you how to set up an automated workflow that converts markdown to PDF instantly when you save.

## What I'm Building

```
Edit markdown → Save → PDF updates automatically
```

No terminal switching, no manual commands. Just save and see your changes.

## Prerequisites

You'll need to install a few tools:

### 1. Pandoc

Pandoc is a universal document converter that handles the markdown to PDF conversion.

```bash
brew install pandoc
```

### 2. LaTeX (for PDF generation)

Pandoc needs a LaTeX engine to generate PDFs. Install BasicTeX (smaller) or MacTeX (full):

```bash
# Smaller installation (~100MB)
brew install --cask basictex

# Or full installation (~4GB)
brew install --cask mactex
```

After installation, restart your terminal or run:

```bash
# Reloads system paths so your terminal can find the newly installed LaTeX binaries
eval "$(/usr/libexec/path_helper)"
```

### 3. fswatch (file watcher)

fswatch monitors your files and triggers actions when they change.

```bash
brew install fswatch
```

### 4. Skim (PDF viewer with auto-reload)

macOS Preview doesn't refresh automatically when a file changes. Skim does.

```bash
brew install --cask skim
```

Enable auto-reload in Skim:

```bash
defaults write -app Skim SKAutoReloadFileUpdate -bool true
defaults write -app Skim SKAutoCheckFileUpdate -bool true
```

## Basic Conversion

Convert a markdown file to PDF:

```bash
pandoc input.md -o output.pdf
```

### Using Custom Fonts (Optional)

If you want to use system fonts like Arial, you need XeLaTeX:

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex
```

Create a `config.yaml` for styling:

```yaml
fontsize: 11pt
geometry:
  - top=1in
  - bottom=1in
  - left=1in
  - right=1in
mainfont: Arial
header-includes:
  - \usepackage{fontspec}
```

Then run:

```bash
pandoc input.md -o output.pdf --metadata-file=config.yaml --pdf-engine=xelatex
```

## Automating the Workflow

Now the good part—make it automatic.

### Start the File Watcher

Run this command in your terminal:

```bash
fswatch -o input.md | xargs -n1 -I{} pandoc input.md -o output.pdf --pdf-engine=xelatex
```

This watches `input.md` and rebuilds the PDF every time you save.

### Open PDF in Skim

```bash
open -a Skim output.pdf
```

Now arrange your windows: editor on one side, Skim on the other. Every time you save, the PDF updates automatically.

### Stop the Watcher

Press `Ctrl+C` in the terminal to stop fswatch.

## Why Does It Take ~2 Seconds?

You might notice a 1-2 second delay between saving and seeing the updated PDF. This is because:

1. **LaTeX is slow by design** - It's a full typesetting system that handles complex layouts, fonts, and formatting. This power comes at a cost.

2. **XeLaTeX specifically** - If you're using system fonts (like Arial), you need XeLaTeX or LuaLaTeX. These engines are slower than pdfLaTeX because they support modern font formats.

3. **Multiple passes** - LaTeX sometimes needs multiple passes to resolve references, table of contents, etc.

There's no easy way around this without switching to a different toolchain entirely. For most use cases, 2 seconds is acceptable.

## Quick Reference

```bash
# One-time setup
brew install pandoc fswatch
brew install --cask basictex skim
defaults write -app Skim SKAutoReloadFileUpdate -bool true
defaults write -app Skim SKAutoCheckFileUpdate -bool true

# Start watching (run in your project directory)
fswatch -o input.md | xargs -n1 -I{} pandoc input.md -o output.pdf --pdf-engine=xelatex

# Open PDF viewer
open -a Skim output.pdf
```

Replace `input.md` and `output.pdf` with your actual filenames.

## Conclusion

This setup eliminates the repetitive cycle of editing, switching to terminal, running commands, and switching to a PDF viewer. Just save and see your changes—the way it should be.
