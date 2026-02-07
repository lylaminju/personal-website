import { posts } from "../data/posts.js";

class BlogPosts extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
	}

	formatDate(dateStr) {
		const [year, month, day] = dateStr.split("-").map(Number);
		const date = new Date(year, month - 1, day);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "2-digit",
		});
	}

	render() {
		const grouped = Object.groupBy(posts, (post) => post.date.slice(0, 4));
		const years = Object.entries(grouped).sort(([a], [b]) => b - a);

		this.innerHTML = `
      <div class="blog-posts">
        ${years
					.map(
						([year, yearPosts]) => `
            <h2 class="posts-year">${year}</h2>
            <ul class="posts-list">
              ${yearPosts
								.map(
									(post) => `
                  <li class="post-item">
                    <a href="/blog/${post.slug}" class="post-link">
                      <div class="post-title">${post.title}</div>
                      <div class="post-date">${this.formatDate(post.date)}</div>
                    </a>
                  </li>
                `,
								)
								.join("")}
            </ul>
          `,
					)
					.join("")}
      </div>
    `;
	}
}

export default function registerBlogPosts() {
	customElements.define("blog-posts", BlogPosts);
}
