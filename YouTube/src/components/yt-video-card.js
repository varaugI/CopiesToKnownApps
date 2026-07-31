import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class YtVideoCard extends PolymerElement {
  static get is() {
    return 'yt-video-card';
  }

  static get properties() {
    return {
      video: Object,
      compact: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          min-width: 0;
          color: var(--yt-text, #f1f1f1);
          font-family: Roboto, Arial, sans-serif;
        }

        button {
          width: 100%;
          border: 0;
          padding: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          text-align: left;
        }

        .card {
          display: grid;
          gap: 12px;
        }

        .thumbnail {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          background: #272727;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 220ms ease, border-radius 180ms;
        }

        .card:hover .thumbnail img {
          transform: scale(1.025);
        }

        .duration {
          position: absolute;
          right: 6px;
          bottom: 6px;
          border-radius: 4px;
          padding: 3px 5px;
          background: rgba(0, 0, 0, 0.82);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1;
        }

        .live {
          position: absolute;
          bottom: 7px;
          left: 7px;
          border-radius: 3px;
          padding: 3px 6px;
          background: #f00;
          color: #fff;
          font-size: 0.67rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .details {
          display: grid;
          grid-template-columns: 36px minmax(0, 1fr) 24px;
          gap: 11px;
          align-items: start;
        }

        .avatar {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          border-radius: 50%;
          background: var(--avatar);
          color: white;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .copy {
          min-width: 0;
        }

        h3 {
          display: -webkit-box;
          overflow: hidden;
          margin: 0 0 6px;
          font-size: 0.98rem;
          font-weight: 600;
          line-height: 1.35;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        p {
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 0 0 2px;
          color: var(--yt-muted, #aaa);
          font-size: 0.86rem;
          line-height: 1.3;
        }

        .verified {
          display: inline-grid;
          width: 13px;
          height: 13px;
          place-items: center;
          border-radius: 50%;
          background: var(--yt-muted, #aaa);
          color: var(--yt-bg, #0f0f0f);
          font-size: 0.55rem;
          font-weight: 900;
        }

        .more {
          display: grid;
          width: 32px;
          height: 32px;
          margin-top: -5px;
          place-items: center;
          border-radius: 50%;
          opacity: 0;
        }

        .card:hover .more,
        button:focus-visible .more {
          opacity: 1;
        }

        .more:hover {
          background: var(--yt-hover, #272727);
        }

        :host([compact]) .card {
          grid-template-columns: minmax(150px, 168px) minmax(0, 1fr);
          gap: 9px;
        }

        :host([compact]) .thumbnail {
          border-radius: 8px;
        }

        :host([compact]) .details {
          grid-template-columns: minmax(0, 1fr) 20px;
          gap: 3px;
        }

        :host([compact]) .avatar {
          display: none;
        }

        :host([compact]) h3 {
          margin-bottom: 5px;
          font-size: 0.88rem;
          line-height: 1.3;
        }

        :host([compact]) p {
          font-size: 0.75rem;
        }

        @media (max-width: 600px) {
          :host(:not([compact])) .thumbnail {
            margin-inline: -12px;
            border-radius: 0;
          }
        }
      </style>

      <button class="card" type="button" on-click="_select" aria-label$="Watch [[video.title]]">
        <div class="thumbnail">
          <img src$="[[video.thumbnail]]" alt="" loading="lazy" />
          <span class="duration">[[video.duration]]</span>
          <template is="dom-if" if="[[video.live]]">
            <span class="live">Live</span>
          </template>
        </div>
        <div class="details">
          <span class="avatar" style$="--avatar: [[video.avatarColor]]">[[video.avatar]]</span>
          <div class="copy">
            <h3>[[video.title]]</h3>
            <p>
              [[video.channel]]
              <template is="dom-if" if="[[video.verified]]">
                <span class="verified">✓</span>
              </template>
            </p>
            <p>[[video.views]] · [[video.published]]</p>
          </div>
          <span class="more"><yt-icon name="more" size="20"></yt-icon></span>
        </div>
      </button>
    `;
  }

  _select() {
    this.dispatchEvent(
      new CustomEvent('video-selected', {
        detail: this.video,
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define(YtVideoCard.is, YtVideoCard);
