# Project Context

Personal portfolio website for Lyla (Minju) Park - a full-stack software engineer based in Toronto.

## Project Structure

- `/assets/` - Images and icons
- `/components/` - Web components (header, footer, blog-posts)
- `/pages/` - HTML pages (about, blog, posts)
- `/styles/` - CSS files
- `/utils/` - JavaScript utilities

## Conventions

### Images
- Store images in `/assets/`
- Use WebP format for web images (convert from HEIC/JPG)
- Resize to appropriate dimensions (e.g., 800px width max for photos)
- Keep file sizes under 100KB when possible

### CSS
- Styles are in `/styles/styles.css`
- Mobile breakpoint: 768px
- CSS variables defined in `:root` for colors and fonts
- Use flexbox for layouts, stack vertically on mobile

### Commit Messages
- Follow conventional commits (feat, fix, style, perf, refactor, chore, docs)
- End with `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>` when Claude contributes
