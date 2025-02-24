function createPostDate() {
  const dateElement = document.createElement('div');
  dateElement.className = 'post-date';

  const path = window.location.pathname;
  const dateMatch = path.match(/\/(\d{4}-\d{2}-\d{2})-/);

  if (dateMatch) {
    const date = new Date(dateMatch[1]);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    dateElement.textContent = formattedDate;
  }

  return dateElement;
}

export default function registerPostDate() {
  const targetSection = document.querySelector('#blog-content')?.parentElement;

  if (targetSection?.children.length !== 1) {
    return;
  }

  const postDate = createPostDate();

  targetSection.insertBefore(postDate, targetSection.firstChild);
}
