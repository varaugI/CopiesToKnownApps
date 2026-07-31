import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { fallbackFeed, filterVideos, getRecommendations } from '../data/feed';

class YtApp extends PolymerElement {
  static get is() {
    return 'yt-app';
  }

  static get properties() {
    return {
      feed: {
        type: Object,
        value: () => fallbackFeed,
      },
      view: {
        type: String,
        value: 'home',
      },
      activeCategory: {
        type: String,
        value: 'All',
      },
      query: {
        type: String,
        value: '',
      },
      drawerCollapsed: {
        type: Boolean,
        value: false,
      },
      selectedVideo: Object,
      createOpen: {
        type: Boolean,
        value: false,
      },
      profileOpen: {
        type: Boolean,
        value: false,
      },
      lightTheme: {
        type: Boolean,
        value: false,
      },
      shortOpen: {
        type: Boolean,
        value: false,
      },
      selectedShort: Object,
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          --yt-bg: #0f0f0f;
          --yt-surface: #212121;
          --yt-hover: #272727;
          --yt-hover-strong: #3f3f3f;
          --yt-text: #f1f1f1;
          --yt-muted: #aaa;
          --yt-line: #3f3f3f;
          display: block;
          min-height: 100vh;
          background: var(--yt-bg);
          color: var(--yt-text);
          font-family: Roboto, Arial, sans-serif;
        }

        :host([light-theme]) {
          --yt-bg: #fff;
          --yt-surface: #f2f2f2;
          --yt-hover: #f2f2f2;
          --yt-hover-strong: #e5e5e5;
          --yt-text: #0f0f0f;
          --yt-muted: #606060;
          --yt-line: #dedede;
        }

        * {
          box-sizing: border-box;
        }

        button,
        input {
          font: inherit;
        }

        button {
          color: inherit;
        }

        header {
          position: fixed;
          z-index: 100;
          inset: 0 0 auto;
          display: grid;
          grid-template-columns: minmax(205px, 1fr) minmax(300px, 732px) minmax(205px, 1fr);
          height: 56px;
          align-items: center;
          gap: 20px;
          padding: 0 16px;
          background: var(--yt-bg);
        }

        .header-left,
        .header-right,
        .logo,
        .search-form,
        .chips,
        .bottom-nav,
        .profile-item,
        .empty-state {
          display: flex;
          align-items: center;
        }

        .header-left {
          gap: 17px;
        }

        .icon-button {
          display: grid;
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
        }

        .icon-button:hover {
          background: var(--yt-hover);
        }

        .logo {
          position: relative;
          gap: 4px;
          border: 0;
          padding: 0;
          background: transparent;
          color: var(--yt-text);
          cursor: pointer;
          font-size: 1.18rem;
          font-weight: 750;
          letter-spacing: -0.07em;
        }

        .logo-mark {
          position: relative;
          display: inline-block;
          width: 29px;
          height: 20px;
          border-radius: 6px;
          background: #f00;
        }

        .logo-mark::after {
          position: absolute;
          top: 5px;
          left: 11px;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 8px solid #fff;
          content: "";
        }

        .logo sup {
          position: absolute;
          top: -7px;
          right: -18px;
          color: var(--yt-muted);
          font-size: 0.58rem;
          font-weight: 400;
          letter-spacing: 0;
        }

        .search-form {
          width: 100%;
          justify-content: center;
        }

        .search-box {
          display: flex;
          width: min(640px, 100%);
          height: 40px;
          overflow: hidden;
          border: 1px solid var(--yt-line);
          border-radius: 20px 0 0 20px;
          margin-left: 32px;
          background: var(--yt-bg);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
        }

        .search-box:focus-within {
          border-color: #1c62b9;
          box-shadow: inset 1px 0 #1c62b9;
        }

        .search-box input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          padding: 0 16px;
          background: transparent;
          color: var(--yt-text);
          font-size: 1rem;
        }

        .search-submit {
          display: grid;
          width: 64px;
          height: 40px;
          place-items: center;
          border: 1px solid var(--yt-line);
          border-left: 0;
          border-radius: 0 20px 20px 0;
          background: var(--yt-surface);
          cursor: pointer;
        }

        .mic {
          margin-left: 14px;
          background: var(--yt-hover);
        }

        .header-right {
          justify-content: flex-end;
          gap: 8px;
        }

        .profile-trigger,
        .user-avatar {
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: linear-gradient(145deg, #00897b, #0d47a1);
          color: white;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .profile-wrap {
          position: relative;
          margin-left: 5px;
        }

        .profile-menu {
          position: absolute;
          top: 43px;
          right: 0;
          width: 300px;
          overflow: hidden;
          border: 1px solid var(--yt-line);
          border-radius: 12px;
          background: var(--yt-surface);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
        }

        .profile-head {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          border-bottom: 1px solid var(--yt-line);
          padding: 15px;
        }

        .profile-head .user-avatar {
          width: 42px;
          height: 42px;
        }

        .profile-head span {
          display: grid;
          align-content: start;
          gap: 3px;
          font-size: 0.88rem;
        }

        .profile-head a {
          margin-top: 8px;
          color: #3ea6ff;
          text-decoration: none;
        }

        .profile-items {
          display: grid;
          padding: 8px 0;
        }

        .profile-item {
          gap: 14px;
          min-height: 42px;
          border: 0;
          padding: 0 15px;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .profile-item:hover {
          background: var(--yt-hover-strong);
        }

        .layout {
          min-height: 100vh;
          padding-top: 56px;
        }

        .content {
          min-height: calc(100vh - 56px);
          margin-left: 240px;
          padding: 0 24px 70px;
          transition: margin-left 180ms ease;
        }

        .content.collapsed {
          margin-left: 72px;
        }

        .content.watch-content {
          margin-left: 0;
          padding: 0;
        }

        .chips-wrap {
          position: sticky;
          z-index: 60;
          top: 56px;
          margin: 0 -24px 24px;
          padding: 12px 24px;
          background: var(--yt-bg);
        }

        .chips {
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .chips::-webkit-scrollbar {
          display: none;
        }

        .chip {
          min-height: 32px;
          border: 0;
          border-radius: 8px;
          padding: 0 13px;
          background: var(--yt-hover);
          color: var(--yt-text);
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .chip:hover {
          background: var(--yt-hover-strong);
        }

        .chip.active {
          background: var(--yt-text);
          color: var(--yt-bg);
        }

        .section-heading {
          margin: 2px 0 20px;
          font-size: 1.25rem;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 38px 16px;
          max-width: 1880px;
          margin: 0 auto;
        }

        .shorts-block {
          max-width: 1880px;
          margin: 44px auto 38px;
        }

        .empty-state {
          min-height: 52vh;
          flex-direction: column;
          justify-content: center;
          color: var(--yt-muted);
          text-align: center;
        }

        .empty-state span {
          display: grid;
          width: 86px;
          height: 86px;
          place-items: center;
          border-radius: 50%;
          background: var(--yt-hover);
        }

        .empty-state h2 {
          margin: 20px 0 6px;
          color: var(--yt-text);
        }

        .empty-state p {
          margin: 0;
        }

        .bottom-nav {
          display: none;
        }

        .modal-backdrop {
          position: fixed;
          z-index: 300;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.62);
        }

        .create-modal {
          width: min(650px, 100%);
          overflow: hidden;
          border-radius: 14px;
          background: var(--yt-surface);
          box-shadow: 0 18px 65px rgba(0, 0, 0, 0.55);
        }

        .modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--yt-line);
          padding: 14px 18px;
        }

        .modal-head h2 {
          margin: 0;
          font-size: 1.05rem;
        }

        .upload-zone {
          display: flex;
          min-height: 390px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 45px 20px;
          text-align: center;
        }

        .upload-zone > span {
          display: grid;
          width: 120px;
          height: 120px;
          place-items: center;
          border-radius: 50%;
          background: var(--yt-hover-strong);
        }

        .upload-zone h3 {
          margin: 24px 0 6px;
          font-size: 1rem;
          font-weight: 500;
        }

        .upload-zone p {
          margin: 0 0 25px;
          color: var(--yt-muted);
          font-size: 0.82rem;
        }

        .select-button {
          min-height: 36px;
          border: 0;
          border-radius: 2px;
          padding: 0 16px;
          background: #3ea6ff;
          color: #0f0f0f;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .short-modal {
          position: relative;
          width: min(390px, 100%);
          overflow: hidden;
          aspect-ratio: 9 / 16;
          border-radius: 14px;
          background: #111;
        }

        .short-modal img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .short-modal::after {
          position: absolute;
          inset: 50% 0 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
          content: "";
        }

        .short-copy {
          position: absolute;
          z-index: 1;
          right: 18px;
          bottom: 22px;
          left: 18px;
          color: white;
        }

        .short-copy h2 {
          margin: 0 0 7px;
          font-size: 1.05rem;
        }

        .short-close {
          position: absolute;
          z-index: 2;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.55);
        }

        @media (max-width: 1400px) {
          .video-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 1150px) {
          header {
            grid-template-columns: 190px 1fr 190px;
          }

          .content {
            margin-left: 72px;
          }

          .video-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          header {
            grid-template-columns: auto minmax(200px, 1fr) auto;
            gap: 10px;
          }

          .search-box {
            margin-left: 0;
          }

          .mic,
          .header-right .create-button {
            display: none;
          }

          .video-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          header {
            grid-template-columns: minmax(110px, 1fr) auto;
            height: 54px;
            padding: 0 10px;
          }

          .header-left {
            gap: 8px;
          }

          .header-left > .icon-button {
            display: none;
          }

          .search-form {
            justify-content: flex-end;
          }

          .search-box {
            width: 42px;
            border: 0;
            border-radius: 50%;
            box-shadow: none;
          }

          .search-box input {
            position: fixed;
            z-index: 120;
            top: 7px;
            right: 56px;
            left: 10px;
            display: none;
            width: calc(100vw - 66px);
            height: 40px;
            border: 1px solid #1c62b9;
            border-radius: 20px;
            padding-left: 16px;
            background: var(--yt-bg);
          }

          .search-box:focus-within input {
            display: block;
          }

          .search-submit {
            width: 42px;
            border: 0;
            border-radius: 50%;
            background: transparent;
          }

          .header-right {
            gap: 2px;
          }

          .header-right .notification-button {
            display: none;
          }

          .layout {
            padding-top: 54px;
          }

          .content,
          .content.collapsed {
            margin-left: 0;
            padding: 0 12px 76px;
          }

          .chips-wrap {
            top: 54px;
            margin: 0 -12px 16px;
            padding: 10px 12px;
          }

          .video-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .shorts-block {
            margin: 36px auto 30px;
          }

          .bottom-nav {
            position: fixed;
            z-index: 95;
            right: 0;
            bottom: 0;
            left: 0;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            height: 58px;
            border-top: 1px solid var(--yt-line);
            background: var(--yt-bg);
          }

          .bottom-nav button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            border: 0;
            background: transparent;
            color: inherit;
            font-size: 0.62rem;
          }

          .profile-menu {
            position: fixed;
            top: 50px;
            right: 8px;
            left: 8px;
            width: auto;
          }
        }
      </style>

      <header>
        <div class="header-left">
          <button class="icon-button" aria-label="Menu" on-click="_toggleDrawer">
            <yt-icon name="menu"></yt-icon>
          </button>
          <button class="logo" aria-label="YouTube Home" on-click="_goHome">
            <span class="logo-mark"></span><span>YouTube</span><sup>IN</sup>
          </button>
        </div>

        <form class="search-form" on-submit="_submitSearch">
          <label class="search-box">
            <input
              aria-label="Search"
              placeholder="Search"
              type="search"
              value="{{query::input}}"
            />
          </label>
          <button class="search-submit" aria-label="Search" type="submit">
            <yt-icon name="search" size="22"></yt-icon>
          </button>
          <button class="icon-button mic" aria-label="Search with your voice" type="button">
            <yt-icon name="mic" size="21"></yt-icon>
          </button>
        </form>

        <div class="header-right">
          <button class="icon-button create-button" aria-label="Create" on-click="_openCreate">
            <yt-icon name="create" size="23"></yt-icon>
          </button>
          <button class="icon-button notification-button" aria-label="Notifications">
            <yt-icon name="bell" size="22"></yt-icon>
          </button>
          <div class="profile-wrap">
            <button class="profile-trigger" aria-label="Account" on-click="_toggleProfile">GV</button>
            <template is="dom-if" if="[[profileOpen]]" restamp>
              <aside class="profile-menu">
                <div class="profile-head">
                  <span class="user-avatar">GV</span>
                  <span>
                    <strong>Gaurav Verma</strong>
                    <small>@gauravbuilds</small>
                    <a href="#channel">View your channel</a>
                  </span>
                </div>
                <div class="profile-items">
                  <button class="profile-item">
                    <yt-icon name="videos" size="20"></yt-icon><span>YouTube Studio</span>
                  </button>
                  <button class="profile-item" on-click="_toggleTheme">
                    <yt-icon name$="[[_themeIcon(lightTheme)]]" size="20"></yt-icon>
                    <span>Appearance: [[_themeLabel(lightTheme)]]</span>
                  </button>
                  <button class="profile-item">
                    <yt-icon name="settings" size="20"></yt-icon><span>Settings</span>
                  </button>
                  <button class="profile-item">
                    <yt-icon name="help" size="20"></yt-icon><span>Help</span>
                  </button>
                </div>
              </aside>
            </template>
          </div>
        </div>
      </header>

      <div class="layout">
        <template is="dom-if" if="[[_showNavigation(view)]]">
          <yt-sidebar
            active="[[view]]"
            collapsed="[[drawerCollapsed]]"
            on-navigate="_handleNavigate"
          ></yt-sidebar>
        </template>

        <main class$="[[_contentClass(drawerCollapsed, view)]]">
          <template is="dom-if" if="[[_showFeed(view)]]">
            <div class="chips-wrap">
              <nav class="chips" aria-label="Topics">
                <template is="dom-repeat" items="[[feed.categories]]">
                  <button
                    class$="chip [[_chipClass(item, activeCategory)]]"
                    data-category$="[[item]]"
                    on-click="_chooseCategory"
                    type="button"
                  >
                    [[item]]
                  </button>
                </template>
              </nav>
            </div>

            <template is="dom-if" if="[[_hasVideos(feed.videos, activeCategory, query, view)]]">
              <template is="dom-if" if="[[_showSectionHeading(view, query)]]">
                <h1 class="section-heading">[[_sectionHeading(view, query)]]</h1>
              </template>
              <section class="video-grid">
                <template
                  is="dom-repeat"
                  items="[[_firstVideos(feed.videos, activeCategory, query, view)]]"
                >
                  <yt-video-card video="[[item]]" on-video-selected="_openVideo"></yt-video-card>
                </template>
              </section>

              <template is="dom-if" if="[[_showShorts(view, query, activeCategory)]]">
                <div class="shorts-block">
                  <yt-shorts-shelf shorts="[[feed.shorts]]" on-short-selected="_openShort"></yt-shorts-shelf>
                </div>
              </template>

              <section class="video-grid">
                <template
                  is="dom-repeat"
                  items="[[_remainingVideos(feed.videos, activeCategory, query, view)]]"
                >
                  <yt-video-card video="[[item]]" on-video-selected="_openVideo"></yt-video-card>
                </template>
              </section>
            </template>

            <template is="dom-if" if="[[!_hasVideos(feed.videos, activeCategory, query, view)]]">
              <div class="empty-state">
                <span><yt-icon name="search" size="40"></yt-icon></span>
                <h2>No videos found</h2>
                <p>Try different keywords or remove search filters.</p>
              </div>
            </template>
          </template>

          <template is="dom-if" if="[[_isView(view, 'shorts')]]">
            <div class="chips-wrap"><h1 class="section-heading">Shorts</h1></div>
            <div class="shorts-block">
              <yt-shorts-shelf shorts="[[feed.shorts]]" on-short-selected="_openShort"></yt-shorts-shelf>
            </div>
          </template>

          <template is="dom-if" if="[[_isView(view, 'watch')]]" restamp>
            <yt-watch-page
              video="[[selectedVideo]]"
              comments="[[feed.comments]]"
              recommendations="[[_recommendations(feed.videos, selectedVideo.id)]]"
            ></yt-watch-page>
          </template>
        </main>
      </div>

      <nav class="bottom-nav" aria-label="Mobile navigation">
        <button data-view="home" on-click="_bottomNavigate"><yt-icon name="home" size="22"></yt-icon>Home</button>
        <button data-view="shorts" on-click="_bottomNavigate"><yt-icon name="shorts" size="22"></yt-icon>Shorts</button>
        <button data-view="subscriptions" on-click="_bottomNavigate">
          <yt-icon name="subscriptions" size="22"></yt-icon>Subscriptions
        </button>
        <button><yt-icon name="library" size="22"></yt-icon>You</button>
      </nav>

      <template is="dom-if" if="[[createOpen]]" restamp>
        <div class="modal-backdrop" on-click="_closeCreate">
          <section class="create-modal" on-click="_stopPropagation">
            <div class="modal-head">
              <h2>Upload videos</h2>
              <button class="icon-button" aria-label="Close" on-click="_closeCreate">
                <yt-icon name="close" size="21"></yt-icon>
              </button>
            </div>
            <div class="upload-zone">
              <span><yt-icon name="create" size="55"></yt-icon></span>
              <h3>Drag and drop video files to upload</h3>
              <p>Your videos will be private until you publish them.</p>
              <button class="select-button">Select files</button>
            </div>
          </section>
        </div>
      </template>

      <template is="dom-if" if="[[shortOpen]]" restamp>
        <div class="modal-backdrop" on-click="_closeShort">
          <section class="short-modal" on-click="_stopPropagation">
            <button class="icon-button short-close" aria-label="Close" on-click="_closeShort">
              <yt-icon name="close" size="21"></yt-icon>
            </button>
            <img src$="[[selectedShort.thumbnail]]" alt="" />
            <div class="short-copy">
              <h2>[[selectedShort.title]]</h2>
              <span>[[selectedShort.views]]</span>
            </div>
          </section>
        </div>
      </template>
    `;
  }

  constructor() {
    super();
    this.selectedVideo = fallbackFeed.videos[0];
    this.selectedShort = fallbackFeed.shorts[0];
  }

  connectedCallback() {
    super.connectedCallback();
    fetch('/api/feed')
      .then((response) => {
        if (!response.ok) throw new Error('Feed service unavailable');
        return response.json();
      })
      .then((feed) => {
        this.feed = feed;
      })
      .catch(() => {
        // The bundled JSON keeps the Polymer client usable without the Python API.
      });
  }

  _toggleDrawer() {
    this.drawerCollapsed = !this.drawerCollapsed;
  }

  _goHome() {
    this.view = 'home';
    this.query = '';
    this.activeCategory = 'All';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _submitSearch(event) {
    event.preventDefault();
    this.view = 'search';
    this.activeCategory = 'All';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _chooseCategory(event) {
    this.activeCategory = event.currentTarget.dataset.category;
  }

  _handleNavigate(event) {
    this.view = event.detail;
    this.query = '';
    this.activeCategory = 'All';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _bottomNavigate(event) {
    this.view = event.currentTarget.dataset.view;
    this.query = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _openVideo(event) {
    this.selectedVideo = event.detail;
    this.view = 'watch';
    this.profileOpen = false;
    window.scrollTo({ top: 0 });
  }

  _openShort(event) {
    this.selectedShort = event.detail;
    this.shortOpen = true;
  }

  _closeShort() {
    this.shortOpen = false;
  }

  _openCreate() {
    this.createOpen = true;
  }

  _closeCreate() {
    this.createOpen = false;
  }

  _stopPropagation(event) {
    event.stopPropagation();
  }

  _toggleProfile() {
    this.profileOpen = !this.profileOpen;
  }

  _toggleTheme() {
    this.lightTheme = !this.lightTheme;
    this.toggleAttribute('light-theme', this.lightTheme);
    document.body.classList.toggle('light-theme', this.lightTheme);
  }

  _visibleVideos(videos, category, query, view) {
    return filterVideos(videos || [], category, query, view);
  }

  _firstVideos(videos, category, query, view) {
    const visible = this._visibleVideos(videos, category, query, view);
    return this._showShorts(view, query, category) ? visible.slice(0, 8) : visible;
  }

  _remainingVideos(videos, category, query, view) {
    if (!this._showShorts(view, query, category)) return [];
    return this._visibleVideos(videos, category, query, view).slice(8);
  }

  _hasVideos(videos, category, query, view) {
    return this._visibleVideos(videos, category, query, view).length > 0;
  }

  _recommendations(videos, selectedId) {
    return getRecommendations(videos || [], selectedId).slice(0, 9);
  }

  _showNavigation(view) {
    return view !== 'watch';
  }

  _showFeed(view) {
    return ['home', 'search', 'subscriptions'].includes(view);
  }

  _showShorts(view, query, category) {
    return view === 'home' && !query && category === 'All';
  }

  _showSectionHeading(view, query) {
    return view !== 'home' || Boolean(query);
  }

  _sectionHeading(view, query) {
    if (view === 'subscriptions') return 'Latest from your subscriptions';
    if (query) return `Search results for “${query}”`;
    return 'Recommended';
  }

  _isView(view, expected) {
    return view === expected;
  }

  _contentClass(collapsed, view) {
    if (view === 'watch') return 'content watch-content';
    return collapsed ? 'content collapsed' : 'content';
  }

  _chipClass(item, activeCategory) {
    return item === activeCategory ? 'active' : '';
  }

  _toggleProfile() {
    this.profileOpen = !this.profileOpen;
  }

  _themeIcon(lightTheme) {
    return lightTheme ? 'sun' : 'moon';
  }

  _themeLabel(lightTheme) {
    return lightTheme ? 'Light' : 'Dark';
  }
}

customElements.define(YtApp.is, YtApp);
