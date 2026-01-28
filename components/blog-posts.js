import { posts } from "../data/posts.js";

class BlogPosts extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.innerHTML = `
      <div class="blog-posts">
        <ul class="posts-list">
          ${posts
						.map(
							(post) => `
                <li class="post-item">
                  <a href="/posts/${post.slug}" class="post-link">
                    <div class="post-title">${post.title}</div>
                    <div class="post-date">${post.date}</div>
                  </a>
                </li>
              `,
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
