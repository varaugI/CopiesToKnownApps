import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class YtShortsShelf extends PolymerElement {
  static get is() {
    return 'yt-shorts-shelf';
  }

  static get properties() {
    return {
      shorts: Array,
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          color: var(--yt-text, #f1f1f1);
          font-family: Roboto, Arial, sans-serif;
        }

        .shelf {
          position: relative;
          border-top: 1px solid var(--yt-line, #3f3f3f);
          border-bottom: 1px solid var(--yt-line, #3f3f3f);
          padding: 23px 0 28px;
        }

        h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 20px;
          font-size: 1.3rem;
        }

        h2 span {
          color: #f00;
          font-size: 1.8rem;
          font-weight: 900;
          transform: rotate(-10deg);
        }

        .track {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 16px;
        }

        article {
          min-width: 0;
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

        .image {
          position: relative;
          overflow: hidden;
          aspect-ratio: 9 / 16;
          border-radius: 12px;
          background: #272727;
        }

        .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 200ms ease;
        }

        button:hover img {
          transform: scale(1.025);
        }

        h3 {
          display: -webkit-box;
          overflow: hidden;
          margin: 10px 0 4px;
          font-size: 0.95rem;
          line-height: 1.35;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        p {
          margin: 0;
          color: var(--yt-muted, #aaa);
          font-size: 0.84rem;
        }

        @media (max-width: 1200px) {
          .track {
            grid-template-columns: repeat(5, minmax(150px, 1fr));
            overflow-x: auto;
            scrollbar-width: none;
          }
        }

        @media (max-width: 760px) {
          .track {
            grid-template-columns: repeat(6, minmax(155px, 42vw));
          }

          .shelf {
            margin-inline: -4px;
          }
        }
      </style>

      <section class="shelf">
        <h2><span>▶</span> Shorts</h2>
        <div class="track">
          <template is="dom-repeat" items="[[shorts]]">
            <article>
              <button type="button" on-click="_open">
                <div class="image"><img src$="[[item.thumbnail]]" alt="" loading="lazy" /></div>
                <h3>[[item.title]]</h3>
                <p>[[item.views]]</p>
              </button>
            </article>
          </template>
        </div>
      </section>
    `;
  }

  _open(event) {
    this.dispatchEvent(
      new CustomEvent('short-selected', {
        detail: event.model.item,
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define(YtShortsShelf.is, YtShortsShelf);
