const contentEl = document.getElementById("blog-content");
const dateEl = document.getElementById("post-date");

// Extract 'slug' query parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const postSlug = urlParams.get("slug");

// Construct markdown file path
const markdownPath = `/pages/posts/${postSlug}/index.md`;

async function loadPost() {
  try {
    const response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error(`Markdown file not found at ${markdownPath}`);
    }
    
    const markdown = await response.text();
    
    // Convert markdown to HTML
    const html = marked.parse(markdown);
    contentEl.innerHTML = html;

    // Apply code highlighting
    if (window.hljs) {
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    } else {
      console.error("Highlight.js not loaded");
    }

    // TODO: Extract date metadata if it exists
    const dateMatch = markdown.match(/^Date:\s*(.+)$/m);
    if (dateMatch) {
      dateEl.textContent = new Date(dateMatch[1]).toDateString();
    }

    // Get the post title from the first h1 element or fallback to slug
    const postTitle = document.querySelector('h1')?.textContent || postSlug;
    document.title = `${postTitle} - Lyla's Blog`;
  } catch (err) {
    contentEl.innerHTML = "<p>Sorry, this post could not be loaded.</p>";
    console.error(err);
  }
}

// Execute the async function
loadPost();
