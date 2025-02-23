class Header extends HTMLElement {
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
      <header>
        <a href="${basePath}index.html">Home</a>
        <a href="${basePath}pages/blog.html">Blog</a>
        <a href="${basePath}pages/projects.html">Projects</a>
        <a href="${basePath}pages/about.html">About</a>
      </header>
    `;
  }
}

export default function registerHeader() {
  customElements.define('app-header', Header);
}
