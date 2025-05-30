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
  {
    date: "2025-05-21",
    title: "Balancing ease of access for anonymous users with spam protection",
    get slug() {
      return slugify(this.title);
    },
  },
  {
    date: "2025-05-22",
    title: "Ensuring data integrity in SvelteKit + Supabase",
    get slug() {
      return slugify(this.title);
    },
  },
  {
    date: "2025-05-30",
    title: "Handling concurrency issues in Kotlin + Spring Boot REST APIs",
    get slug() {
      return slugify(this.title);
    },
  },
];
