import registerBlogPosts from "./components/blog-posts.js";
import registerFooter from "./components/footer.js";
import registerHeader from "./components/header.js";
import registerPostDate from "./components/post-date.js";

function app() {
  registerHeader();
  registerFooter();
  registerPostDate();
  registerBlogPosts();
}

document.addEventListener("DOMContentLoaded", app);
