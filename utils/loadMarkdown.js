import { markdownToHtml } from './markdown.js';

/**
 * Converts a markdown file to HTML and displays it in the target element.
 * @param {string} markdownPath - The path to the markdown file.
 * @param {string} targetElementId - The id of the element to display the HTML.
 */
async function loadMarkdown(markdownPath, targetElementId) {
  try {
    const response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error(`Fetch error! Status: ${response.status}`);
    }

    const markdown = await response.text();
    const html = markdownToHtml(markdown);

    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = html;
    } else {
      console.error(`Element with id '${targetElementId}' not found`);
    }
  } catch (error) {
    console.error('Error loading markdown:', error);

    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = '<p>Failed to load content.</p>';
    }

    throw error;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadMarkdown('./index.md', 'blog-content');
});
