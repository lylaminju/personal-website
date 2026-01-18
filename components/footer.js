class Footer extends HTMLElement {
	// dynamically get base path due to posts html
	getBasePath() {
		const depth = window.location.pathname.split("/").filter(Boolean).length;

		return depth === 0 ? "./" : "../".repeat(depth);
	}

	constructor() {
		super();
	}

	connectedCallback() {
		const iconPath = `${this.getBasePath()}assets/icons`;

		this.innerHTML = `
      <footer>
        <a target="_blank" href="mailto:lylaminju@gmail.com" aria-label="Send email">
          <svg class="footer-icon" aria-hidden="true">
            <use href="${iconPath}/email.svg#icon"></use>
          </svg>
        </a>
        <a target="_blank" href="https://github.com/lylaminju" aria-label="GitHub profile">
          <svg class="footer-icon" aria-hidden="true">
            <use href="${iconPath}/github.svg#icon"></use>
          </svg>
        </a>
        <a target="_blank" href="https://www.linkedin.com/in/lylaminju" aria-label="LinkedIn profile">
          <svg class="footer-icon" aria-hidden="true">
            <use href="${iconPath}/linkedin.svg#icon"></use>
          </svg>
        </a>
      </footer>
    `;
	}
}

export default function registerFooter() {
	customElements.define("app-footer", Footer);
}
