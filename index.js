import registerBlogPosts from "./components/blog-posts.js";
import registerFooter from "./components/footer.js";
import registerHeader from "./components/header.js";
import registerPostDate from "./components/post-date.js";
import { initTheme } from "./utils/theme.js";

function app() {
  registerHeader();
  registerFooter();
  registerPostDate();
  registerBlogPosts();
  initTheme();
}

document.addEventListener("DOMContentLoaded", app);
