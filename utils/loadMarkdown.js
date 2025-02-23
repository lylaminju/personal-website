import { markdownToHtml } from './markdown.js';

export async function loadMarkdown(markdownPath, targetElementId) {
  try {
    const response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const markdown = await response.text();
    const html = markdownToHtml(markdown);

    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = html;
    } else {
      console.error(`Element with id '${targetElementId}' not found`);
    }

    return html;
  } catch (error) {
    console.error('Error loading markdown:', error);

    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = '<p>Failed to load content.</p>';
    }

    throw error;
  }
}
