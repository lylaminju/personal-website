import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const POSTS_DIR = new URL("../pages/posts", import.meta.url).pathname;
const OUTPUT_FILE = new URL("../data/posts.js", import.meta.url).pathname;

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
	if (!match) return {};

	return match[1].split("\n").reduce((acc, line) => {
		const colonIndex = line.indexOf(":");
		if (colonIndex === -1) return acc;
		const key = line.slice(0, colonIndex).trim();
		const value = line.slice(colonIndex + 1).trim();
		return key && value ? { ...acc, [key]: value } : acc;
	}, {});
}

async function buildPosts() {
	const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".md"));

	const posts = [];

	for (const file of files) {
		const content = await readFile(join(POSTS_DIR, file), "utf-8");
		const meta = parseFrontmatter(content);

		if (!meta.title || !meta.date) {
			console.warn(`Skipping ${file}: missing title or date in frontmatter`);
			continue;
		}

		posts.push({
			date: meta.date,
			title: meta.title,
			slug: slugify(meta.title),
		});
	}

	posts.sort((a, b) => new Date(b.date) - new Date(a.date));

	const output = `export const posts = ${JSON.stringify(posts, null, "\t")};\n`;

	await writeFile(OUTPUT_FILE, output, "utf-8");
	console.log(`Generated ${OUTPUT_FILE} with ${posts.length} posts`);
}

buildPosts();
