import { posts } from "../data/posts.js";
import { markdownToHtml } from "./markdown.js";

/**
 * Extracts the slug from the URL
 * @returns {string} The slug from the URL
 */
function getSlugFromUrl() {
  // Get the slug from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("slug");
}

/**
 * Finds post data based on the slug
 * @param {string} slug - The post slug
 * @returns {Object|null} The post data or null if not found
 */
function findPostBySlug(slug) {
  return posts.find((post) => {
    // Create a slug from the post title for comparison
    const postSlug = post.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    return postSlug === slug;
  });
}

/**
 * Loads and displays the blog post content
 * @param {string} slug - The post slug
 */
async function loadBlogPost(slug) {
  try {
    // Find the post data
    const post = findPostBySlug(slug);

    if (!post) {
      throw new Error("Post not found");
    }

    // Set the page title and post title
    document.title = `${post.title} - Lyla's Blog`;
    document.getElementById("post-title").textContent = post.title;

    // Set the post date
    const dateElement = document.getElementById("post-date");
    if (dateElement) {
      dateElement.setAttribute("date", post.date);
    }

    // Generate the path to the markdown file
    const postSlug = post.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const markdownPath = `/pages/posts/${postSlug}/index.md`;

    // Load and convert the markdown content
    const response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.status}`);
    }

    const markdown = await response.text();
    const html = markdownToHtml(markdown);

    // Display the content
    const contentElement = document.getElementById("blog-content");
    if (contentElement) {
      contentElement.innerHTML = html;
    }
  } catch (error) {
    console.error("Error loading blog post:", error);

    // Display error message
    const contentElement = document.getElementById("blog-content");
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="error-message">
          <h2>Post Not Found</h2>
          <p>Sorry, the blog post you're looking for could not be found.</p>
          <p><a href="/">Return to homepage</a></p>
        </div>
      `;
    }
  }
}

// When the DOM is loaded, get the slug from the URL and load the post
document.addEventListener("DOMContentLoaded", () => {
  const slug = getSlugFromUrl();
  if (slug) {
    loadBlogPost(slug);
  } else {
    // No slug provided, show error
    const contentElement = document.getElementById("blog-content");
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="error-message">
          <h2>No Post Selected</h2>
          <p>Please select a blog post to read.</p>
          <p><a href="/">Return to homepage</a></p>
        </div>
      `;
    }
  }
});
