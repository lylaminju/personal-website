import { slugify } from "../utils/slugify.js";

export const posts = [
  {
    date: "2025-02-23",
    title: "Why use `LIMIT 1` even if only one result is expected?",
    get slug() {
      return slugify(this.title);
    },
  },
  {
    date: "2025-02-25",
    title: "Hashing passwords using only the Web Crypto API",
    get slug() {
      return slugify(this.title);
    },
  },
];
