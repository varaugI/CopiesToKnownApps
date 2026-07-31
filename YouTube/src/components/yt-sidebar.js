import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class YtSidebar extends PolymerElement {
  static get is() {
    return 'yt-sidebar';
  }

  static get properties() {
    return {
      active: String,
      collapsed: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          position: fixed;
          z-index: 80;
          top: 56px;
          bottom: 0;
          left: 0;
          display: block;
          width: 240px;
          overflow-y: auto;
          padding: 12px;
          background: var(--yt-bg, #0f0f0f);
          color: var(--yt-text, #f1f1f1);
          font-family: Roboto, Arial, sans-serif;
          transition: width 180ms ease;
        }

        :host([collapsed]) {
          width: 72px;
          overflow: hidden;
          padding: 4px;
        }

        nav {
          display: grid;
        }

        section {
          display: grid;
          gap: 2px;
          border-bottom: 1px solid var(--yt-line, #3f3f3f);
          padding: 0 0 12px;
          margin-bottom: 12px;
        }

        section:last-child {
          border: 0;
        }

        h2 {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 2px 10px 7px;
          font-size: 1rem;
          font-weight: 600;
        }

        button {
          display: flex;
          width: 100%;
          min-height: 40px;
          align-items: center;
          gap: 24px;
          border: 0;
          border-radius: 10px;
          padding: 0 12px;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-size: 0.88rem;
          text-align: left;
        }

        button:hover,
        button.active {
          background: var(--yt-hover, #272727);
        }

        button.active {
          font-weight: 600;
        }

        button yt-icon {
          flex: 0 0 auto;
        }

        .subscription-avatar {
          display: grid;
          width: 25px;
          height: 25px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          color: white;
          font-size: 0.55rem;
          font-weight: 700;
        }

        footer {
          padding: 4px 12px 22px;
          color: var(--yt-muted, #aaa);
          font-size: 0.74rem;
          line-height: 1.45;
        }

        footer p {
          margin: 8px 0;
          font-weight: 600;
        }

        :host([collapsed]) section {
          border: 0;
          margin: 0;
          padding: 0;
        }

        :host([collapsed]) section:not(:first-child),
        :host([collapsed]) h2,
        :host([collapsed]) footer {
          display: none;
        }

        :host([collapsed]) button {
          min-height: 70px;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          padding: 6px 0;
          font-size: 0.62rem;
        }

        @media (max-width: 760px) {
          :host {
            display: none;
          }
        }
      </style>

      <nav aria-label="YouTube">
        <section>
          <button class$="[[_activeClass(active, 'home')]]" data-view="home" on-click="_navigate">
            <yt-icon name="home"></yt-icon><span>Home</span>
          </button>
          <button class$="[[_activeClass(active, 'shorts')]]" data-view="shorts" on-click="_navigate">
            <yt-icon name="shorts"></yt-icon><span>Shorts</span>
          </button>
          <button
            class$="[[_activeClass(active, 'subscriptions')]]"
            data-view="subscriptions"
            on-click="_navigate"
          >
            <yt-icon name="subscriptions"></yt-icon><span>Subscriptions</span>
          </button>
        </section>

        <section>
          <h2>You <yt-icon name="chevronRight" size="17"></yt-icon></h2>
          <button><yt-icon name="history"></yt-icon><span>History</span></button>
          <button><yt-icon name="playlist"></yt-icon><span>Playlists</span></button>
          <button><yt-icon name="videos"></yt-icon><span>Your videos</span></button>
          <button><yt-icon name="clock"></yt-icon><span>Watch later</span></button>
          <button><yt-icon name="like"></yt-icon><span>Liked videos</span></button>
        </section>

        <section>
          <h2>Subscriptions</h2>
          <button data-view="subscriptions" on-click="_navigate">
            <span class="subscription-avatar" style="background:#4158a6">NF</span><span>Nomad Frames</span>
          </button>
          <button data-view="subscriptions" on-click="_navigate">
            <span class="subscription-avatar" style="background:#b45b42">MS</span><span>Made Simple</span>
          </button>
          <button data-view="subscriptions" on-click="_navigate">
            <span class="subscription-avatar" style="background:#356b6f">FN</span><span>Field Notes</span>
          </button>
        </section>

        <section>
          <h2>Explore</h2>
          <button><yt-icon name="fire"></yt-icon><span>Trending</span></button>
          <button><yt-icon name="music"></yt-icon><span>Music</span></button>
          <button><yt-icon name="movies"></yt-icon><span>Movies</span></button>
          <button><yt-icon name="live"></yt-icon><span>Live</span></button>
          <button><yt-icon name="gaming"></yt-icon><span>Gaming</span></button>
          <button><yt-icon name="trophy"></yt-icon><span>Sports</span></button>
        </section>

        <section>
          <button><yt-icon name="settings"></yt-icon><span>Settings</span></button>
          <button><yt-icon name="flag"></yt-icon><span>Report history</span></button>
          <button><yt-icon name="help"></yt-icon><span>Help</span></button>
          <button><yt-icon name="feedback"></yt-icon><span>Send feedback</span></button>
        </section>
      </nav>

      <footer>
        <p>About Press Copyright<br />Contact us Creators<br />Advertise Developers</p>
        <p>Terms Privacy Policy & Safety<br />How YouTube works</p>
        <span>© 2026 YouTube interface study</span>
      </footer>
    `;
  }

  _activeClass(active, expected) {
    return active === expected ? 'active' : '';
  }

  _navigate(event) {
    this.dispatchEvent(
      new CustomEvent('navigate', {
        detail: event.currentTarget.dataset.view,
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define(YtSidebar.is, YtSidebar);
