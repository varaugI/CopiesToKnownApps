const icons = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>',
  create: '<path d="M15 10.5 20 8v8l-5-2.5z"/><rect x="3" y="6" width="12" height="12" rx="2"/><path d="M9 9v6M6 12h6"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  home: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  shorts: '<path d="m9 3 8-2 3 5-5 3 4 2-3 6-8 3-4-5 5-3-4-2z"/><path d="m10 9 5 3-5 3z"/>',
  subscriptions: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 3h8M10 10l5 3-5 3z"/>',
  library: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3h8M10 10l5 3-5 3z"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v6l4 2"/>',
  playlist: '<path d="M4 6h10M4 11h10M4 16h7M17 11v7M14 15l3 3 3-3"/>',
  videos: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
  like: '<path d="M7 10v11H3V10zM7 19h10a2 2 0 0 0 2-1.6l1.5-7A2 2 0 0 0 18.5 8H14l1-4c.2-1-1-2-2-1l-6 7z"/>',
  fire: '<path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 0 3-1 4-2 5 0-5-2-8-5-10 1 5-3 7-3 12 0 4 3 7 7 7z"/>',
  music: '<path d="M9 18V5l11-2v13M9 8l11-2"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  movies: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="m7 5 3-3M13 5l3-3M3 10h18"/>',
  live: '<path d="M8 8a6 6 0 0 0 0 8M5 5a10 10 0 0 0 0 14M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/><circle cx="12" cy="12" r="2"/>',
  gaming: '<path d="M8 8h8a5 5 0 0 1 5 5v3a3 3 0 0 1-5 2l-2-2h-4l-2 2a3 3 0 0 1-5-2v-3a5 5 0 0 1 5-5zM7 12h4M9 10v4M16 11h.01M18 13h.01"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v5M8 21h8M9 18h6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
  flag: '<path d="M5 22V3M5 4h12l-2 4 2 4H5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4 2.4c-1 .5-1.5 1-1.5 2.1M12 17h.01"/>',
  feedback: '<path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/><path d="M8 8h8M8 12h5"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  more: '<circle cx="12" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  clip: '<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m8.5 8.5 11 6M8.5 15.5l11-6"/>',
  moon: '<path d="M21 15.5A9 9 0 1 1 8.5 3a7 7 0 0 0 12.5 12.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
};

class YtIcon extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'size'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const name = this.getAttribute('name') || 'more';
    const size = this.getAttribute('size') || '24';
    this.attachShadowIfNeeded();
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-grid; width: ${size}px; height: ${size}px; place-items: center; flex: 0 0 auto; }
        svg { width: 100%; height: 100%; overflow: visible; }
      </style>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        ${icons[name] || icons.more}
      </svg>
    `;
  }

  attachShadowIfNeeded() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
  }
}

customElements.define('yt-icon', YtIcon);
