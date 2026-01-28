function extractSlugFromUrl() {
  const pathMatch = window.location.pathname.match(/^\/posts\/(.+)$/);
  return pathMatch ? pathMatch[1] : null;
}

async function fetchMarkdown(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Markdown file not found at ${path} (${response.status})`);
  }

  return response.text();
}

function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: markdown };
  }

  const frontmatterContent = match[1];
  const markdownContent = markdown.slice(match[0].length);

  const metadata = frontmatterContent.split("\n").reduce((acc, line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return acc;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    return key && value ? { ...acc, [key]: value } : acc;
  }, {});

  return { metadata, content: markdownContent };
}

function applySyntaxHighlighting() {
  if (!window.hljs) {
    console.warn("Highlight.js not available - skipping syntax highlighting");
    return;
  }

  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
}

function setPageTitle(postSlug) {
  const postTitle = document.querySelector("h1")?.textContent || postSlug;
  document.title = `${postTitle} - Lyla's Blog`;
}

function displayError(contentEl, message) {
  if (contentEl) {
    contentEl.innerHTML = `<p class="error">${message}</p>`;
  }
}

async function loadPost() {
  const contentEl = document.getElementById("blog-content");
  const dateEl = document.getElementById("post-date");
  const tagEl = document.getElementById("post-tags");
  const postSlug = extractSlugFromUrl();

  // Early validation
  if (!postSlug) {
    displayError(contentEl, "No post slug provided in URL");
    return;
  }

  if (!contentEl || !dateEl) {
    displayError(contentEl, "Required DOM elements not found");
    return;
  }

  try {
    const markdownPath = `/pages/posts/${postSlug}.md`;
    const markdown = await fetchMarkdown(markdownPath);
    const { content, metadata } = parseFrontmatter(markdown);

    // Render content
    const html = marked.parse(content);
    contentEl.innerHTML = html;

    applySyntaxHighlighting();

    dateEl.textContent = metadata.date;

    if (metadata.tags) {
      tagEl.innerHTML = metadata.tags
        .split(", ")
        .map((tag) => `<span class="post-tag">#${tag}</span>`)
        .join(" ");
    }

    setPageTitle(postSlug);
  } catch (err) {
    displayError(contentEl, "Sorry, this post could not be loaded.");
    console.error(`Failed to load post: ${err.message}`);
  }
}

try {
  loadPost();
} catch (err) {
  console.error("Failed to initialize blog post loader:", err);
}
