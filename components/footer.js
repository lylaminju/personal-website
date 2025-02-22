class Footer extends HTMLElement {
  getBasePath() {
    const depth = window.location.pathname.split('/').filter(Boolean).length;

    return depth === 0 ? './' : '../'.repeat(depth);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const basePath = this.getBasePath();

    this.innerHTML = `
      <footer>
        <a target="blank" href="mailto:mjuudev@gmail.com">
          <svg class="footer-icon">
            <use href="${basePath}assets/email.svg#icon"></use>
          </svg>
        </a>
        <a target="blank" href="https://github.com/pmjuu">
          <svg class="footer-icon">
            <use href="${basePath}assets/github.svg#icon"></use>
          </svg>
        </a>
        <a target="blank" href="https://www.linkedin.com/in/lylaminjupark">
          <svg class="footer-icon">
            <use href="${basePath}assets/linkedin.svg#icon"></use>
          </svg>
        </a>
      </footer>
    `;
  }
}

export default function registerFooter() {
  customElements.define('app-footer', Footer);
}
