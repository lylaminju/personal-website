import registerFooter from './components/footer.js';
import registerHeader from './components/header.js';
import registerPostDate from './components/post-date.js';

function app() {
  registerHeader();
  registerFooter();
  registerPostDate();
}

document.addEventListener('DOMContentLoaded', app);
