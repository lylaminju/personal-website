import { posts } from "../data/posts.js";

class BlogPosts extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // Sort posts by date in reverse order (newest first)
    const sortedPosts = [...posts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    this.innerHTML = `
      <div class="blog-posts">
        <ul class="posts-list">
          ${sortedPosts
            .map(
              (post) => `
            <li class="post-item">
              <a href="/pages/post.html?slug=${post.slug}" class="post-link">
                <div class="post-title">${post.title}</div>
                <div class="post-date">${post.date}</div>
              </a>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }
}

export default function registerBlogPosts() {
  customElements.define("blog-posts", BlogPosts);
}
