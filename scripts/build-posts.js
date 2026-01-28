import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import hljs from "highlight.js";

const md = MarkdownIt({
	html: true,
	highlight: (str, lang) => {
		if (lang && hljs.getLanguage(lang)) {
			return hljs.highlight(str, { language: lang }).value;
		}
		return "";
	},
}).use(anchor, {
	level: [2, 3, 4, 5, 6],
	permalink: anchor.permalink.ariaHidden({
		placement: "after",
		symbol: "#",
		class: "heading-anchor",
	}),
});

const POSTS_DIR = new URL("../content/posts", import.meta.url).pathname;
const OUTPUT_DIR = new URL("../posts", import.meta.url).pathname;
const DATA_FILE = new URL("../data/posts.js", import.meta.url).pathname;

function slugify(text) {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}

function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return { metadata: {}, content };

	const frontmatterContent = match[1];
	const markdownContent = content.slice(match[0].length);

	const metadata = frontmatterContent.split("\n").reduce((acc, line) => {
		const colonIndex = line.indexOf(":");
		if (colonIndex === -1) return acc;
		const key = line.slice(0, colonIndex).trim();
		const value = line.slice(colonIndex + 1).trim();
		return key && value ? { ...acc, [key]: value } : acc;
	}, {});

	return { metadata, content: markdownContent };
}

function generatePostHtml(title, date, htmlContent, tags) {
	const tagsHtml = tags
		? tags
				.split(", ")
				.map((tag) => `<span class="post-tag">#${tag}</span>`)
				.join(" ")
		: "";

	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Lyla's Blog</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="/styles/styles.css" />
    <link rel="stylesheet" href="/styles/blog-content.css" />
    <link rel="icon" type="image/png" href="/assets/profile character.ico" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css" />
  </head>
  <!-- Google tag (gtag.js) -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-8T2LVCMTTY"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "G-8T2LVCMTTY");
  </script>
  <body>
    <app-header></app-header>

    <main>
    <section>
      <div class="post-metadata">
        <post-date id="post-date">${date}</post-date>
      </div>
      <h1>${title}</h1>
      <div id="blog-content">${htmlContent}</div>
      <div id="post-tags">${tagsHtml}</div>
    </section>
    </main>

    <app-footer></app-footer>

    <script type="module" src="/index.js"></script>
  </body>
</html>
`;
}

async function buildPosts() {
	const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".md"));

	// Clean and recreate output directory
	await rm(OUTPUT_DIR, { recursive: true, force: true });
	await mkdir(OUTPUT_DIR, { recursive: true });

	const posts = [];

	for (const file of files) {
		const rawContent = await readFile(join(POSTS_DIR, file), "utf-8");
		const { metadata, content } = parseFrontmatter(rawContent);

		if (!metadata.title || !metadata.date) {
			console.warn(`Skipping ${file}: missing title or date in frontmatter`);
			continue;
		}

		const slug = slugify(metadata.title);
		const htmlContent = md.render(content);

		// Create directory for the post
		const postDir = join(OUTPUT_DIR, slug);
		await mkdir(postDir, { recursive: true });

		// Generate and write the HTML file
		const html = generatePostHtml(
			metadata.title,
			metadata.date,
			htmlContent,
			metadata.tags,
		);
		await writeFile(join(postDir, "index.html"), html, "utf-8");

		posts.push({
			date: metadata.date,
			title: metadata.title,
			slug,
		});

		console.log(`Generated: posts/${slug}/index.html`);
	}

	posts.sort((a, b) => new Date(b.date) - new Date(a.date));

	// Write posts data file
	const output = `export const posts = ${JSON.stringify(posts, null, "\t")};\n`;
	await writeFile(DATA_FILE, output, "utf-8");

	console.log(`\nGenerated ${posts.length} static posts`);
	console.log(`Updated ${DATA_FILE}`);
}

buildPosts();
