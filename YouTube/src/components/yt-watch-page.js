import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

const playerSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

class YtWatchPage extends PolymerElement {
  static get is() {
    return 'yt-watch-page';
  }

  static get properties() {
    return {
      video: Object,
      recommendations: Array,
      comments: Array,
      liked: {
        type: Boolean,
        value: false,
      },
      subscribed: {
        type: Boolean,
        value: false,
      },
      expanded: {
        type: Boolean,
        value: false,
      },
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

        button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .watch {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 402px;
          gap: 24px;
          max-width: 1680px;
          margin: 0 auto;
          padding: 24px 24px 80px;
        }

        .player-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          background: #000;
          box-shadow: 0 -35px 100px color-mix(in srgb, var(--ambient), transparent 50%);
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        h1 {
          margin: 13px 0 10px;
          font-size: 1.25rem;
          line-height: 1.35;
        }

        .meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .channel,
        .actions,
        .action,
        .comment,
        .comment-head,
        .recommendation {
          display: flex;
          align-items: center;
        }

        .channel {
          min-width: 0;
          gap: 11px;
        }

        .avatar {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: var(--avatar);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .channel-copy {
          display: grid;
          min-width: 0;
          margin-right: 8px;
        }

        .channel-copy strong {
          overflow: hidden;
          font-size: 0.96rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .channel-copy small {
          color: var(--yt-muted, #aaa);
          font-size: 0.73rem;
        }

        .subscribe {
          min-height: 36px;
          border-radius: 18px;
          padding: 0 16px;
          background: var(--yt-text, #f1f1f1);
          color: var(--yt-bg, #0f0f0f);
          font-weight: 600;
        }

        .subscribe.active {
          background: var(--yt-hover, #272727);
          color: var(--yt-text, #f1f1f1);
        }

        .actions {
          gap: 8px;
          margin-left: auto;
        }

        .action {
          min-height: 36px;
          gap: 7px;
          border-radius: 18px;
          padding: 0 13px;
          background: var(--yt-hover, #272727);
          font-size: 0.86rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .action:hover,
        .action.active {
          background: var(--yt-hover-strong, #3f3f3f);
        }

        .description {
          margin-top: 14px;
          border-radius: 12px;
          padding: 12px;
          background: var(--yt-hover, #272727);
          font-size: 0.9rem;
          line-height: 1.45;
          cursor: pointer;
        }

        .description strong {
          margin-right: 7px;
        }

        .description p {
          display: -webkit-box;
          overflow: hidden;
          margin: 7px 0 0;
          white-space: pre-line;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .description.expanded p {
          display: block;
        }

        .comments {
          margin-top: 24px;
        }

        .comments h2 {
          margin: 0 0 22px;
          font-size: 1.05rem;
        }

        .add-comment {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 12px;
          margin-bottom: 25px;
        }

        .user-avatar {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 50%;
          background: #0a7e6f;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .add-comment input {
          align-self: start;
          border: 0;
          border-bottom: 1px solid var(--yt-line, #3f3f3f);
          outline: 0;
          padding: 8px 0;
          background: transparent;
          color: inherit;
        }

        .comment {
          align-items: flex-start;
          gap: 12px;
          margin: 0 0 22px;
        }

        .comment-avatar {
          display: grid;
          width: 38px;
          height: 38px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: #385a7c;
          color: white;
          font-size: 0.67rem;
          font-weight: 700;
        }

        .comment-copy {
          min-width: 0;
        }

        .comment-head {
          gap: 7px;
          font-size: 0.8rem;
        }

        .comment-head small {
          color: var(--yt-muted, #aaa);
        }

        .comment p {
          margin: 6px 0 9px;
          font-size: 0.88rem;
          line-height: 1.4;
        }

        .comment-actions {
          display: flex;
          align-items: center;
          gap: 13px;
          color: var(--yt-muted, #aaa);
          font-size: 0.75rem;
        }

        .recommendations {
          display: grid;
          align-content: start;
          gap: 10px;
        }

        @media (max-width: 1050px) {
          .watch {
            grid-template-columns: 1fr;
            padding-inline: 18px;
          }

          .recommendations {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .watch {
            display: block;
            padding: 0 12px 70px;
          }

          .player-wrap {
            margin-inline: -12px;
            border-radius: 0;
          }

          h1 {
            font-size: 1.05rem;
          }

          .meta-bar {
            align-items: flex-start;
            flex-direction: column;
          }

          .actions {
            width: 100%;
            margin: 0;
            overflow-x: auto;
            padding-bottom: 5px;
            scrollbar-width: none;
          }

          .recommendations {
            grid-template-columns: 1fr;
            margin-top: 25px;
          }
        }
      </style>

      <main class="watch">
        <section>
          <div class="player-wrap" style$="--ambient:[[video.avatarColor]]">
            <video src="${playerSource}" poster$="[[video.thumbnail]]" controls autoplay></video>
          </div>
          <h1>[[video.title]]</h1>
          <div class="meta-bar">
            <div class="channel">
              <span class="avatar" style$="--avatar:[[video.avatarColor]]">[[video.avatar]]</span>
              <span class="channel-copy">
                <strong>[[video.channel]] ✓</strong>
                <small>[[video.subscribers]]</small>
              </span>
              <button class$="subscribe [[_activeClass(subscribed)]]" on-click="_toggleSubscribe">
                [[_subscribeLabel(subscribed)]]
              </button>
            </div>
            <div class="actions">
              <button class$="action [[_activeClass(liked)]]" on-click="_toggleLike">
                <yt-icon name="like" size="19"></yt-icon> [[video.likes]]
              </button>
              <button class="action"><yt-icon name="share" size="19"></yt-icon> Share</button>
              <button class="action"><yt-icon name="download" size="19"></yt-icon> Download</button>
              <button class="action"><yt-icon name="clip" size="19"></yt-icon> Clip</button>
              <button class="action"><yt-icon name="more" size="19"></yt-icon></button>
            </div>
          </div>

          <div class$="description [[_expandedClass(expanded)]]" on-click="_toggleExpanded">
            <strong>[[video.views]]</strong><strong>[[video.published]]</strong>
            <p>[[video.description]]

This interface copy uses fictional catalog data and a demo video asset. #creative #documentary</p>
          </div>

          <section class="comments">
            <h2>[[video.comments]] Comments</h2>
            <div class="add-comment">
              <span class="user-avatar">GV</span>
              <input type="text" placeholder="Add a comment..." aria-label="Add a comment" />
            </div>
            <template is="dom-repeat" items="[[comments]]">
              <article class="comment">
                <span class="comment-avatar">[[item.avatar]]</span>
                <div class="comment-copy">
                  <div class="comment-head"><strong>@[[item.author]]</strong><small>[[item.time]]</small></div>
                  <p>[[item.body]]</p>
                  <div class="comment-actions">
                    <yt-icon name="like" size="17"></yt-icon><span>[[item.likes]]</span><span>Reply</span>
                  </div>
                </div>
              </article>
            </template>
          </section>
        </section>

        <aside class="recommendations">
          <template is="dom-repeat" items="[[recommendations]]">
            <yt-video-card compact video="[[item]]"></yt-video-card>
          </template>
        </aside>
      </main>
    `;
  }

  _toggleLike() {
    this.liked = !this.liked;
  }

  _toggleSubscribe() {
    this.subscribed = !this.subscribed;
  }

  _toggleExpanded() {
    this.expanded = !this.expanded;
  }

  _activeClass(value) {
    return value ? 'active' : '';
  }

  _expandedClass(value) {
    return value ? 'expanded' : '';
  }

  _subscribeLabel(value) {
    return value ? 'Subscribed' : 'Subscribe';
  }
}

customElements.define(YtWatchPage.is, YtWatchPage);
