class PostDate extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Check if we have a date attribute
    const dateAttr = this.getAttribute('date');
    
    if (dateAttr) {
      this.renderDate(dateAttr);
    } else {
      // Try to get date from URL path (for backward compatibility)
      const path = window.location.pathname;
      const dateMatch = path.match(/\/(\d{4}-\d{2}-\d{2})-/);
      
      if (dateMatch) {
        this.renderDate(dateMatch[1]);
      }
    }
  }

  renderDate(dateString) {
    try {
      const date = new Date(dateString);
      
      if (!isNaN(date.getTime())) {
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        
        this.innerHTML = `<div class="post-date">${formattedDate}</div>`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  }
}

export default function registerPostDate() {
  customElements.define('post-date', PostDate);
}
