import registerFooter from './components/footer.js';
import registerHeader from './components/header.js';

function app() {
  registerHeader();
  registerFooter();
}

document.addEventListener('DOMContentLoaded', app);
