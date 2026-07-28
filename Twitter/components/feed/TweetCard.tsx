"use client";

import type {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import {
  BadgeCheck,
  BarChart3,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share,
} from "lucide-react";

import { Avatar } from "@/components/layout/Avatar";
import type { Tweet, User } from "@/types";

export type TweetToggleHandler = (tweet: Tweet, active: boolean) => void;
export type TweetHandler = (tweet: Tweet) => void;

export interface TweetCardProps {
  tweet: Tweet;
  author: User;
  quotedTweet?: Tweet;
  quotedAuthor?: User;
  liked?: boolean;
  reposted?: boolean;
  bookmarked?: boolean;
  compact?: boolean;
  showThreadLine?: boolean;
  className?: string;
  onNavigate?: TweetHandler;
  onAuthorNavigate?: (user: User) => void;
  onQuotedTweetNavigate?: TweetHandler;
  onMediaClick?: (tweet: Tweet, mediaIndex: number) => void;
  onReply?: TweetHandler;
  onRepost?: TweetToggleHandler;
  onLike?: TweetToggleHandler;
  onView?: TweetHandler;
  onBookmark?: TweetToggleHandler;
  onShare?: TweetHandler;
  onMore?: TweetHandler;
}

interface ActionButtonProps {
  label: string;
  count?: number;
  active?: boolean;
  tone?: "reply" | "repost" | "like" | "neutral";
  children: ReactNode;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatCount(count: number): string {
  return count > 0 ? compactNumber.format(count) : "";
}

function isVideoSource(source: string): boolean {
  return /\.(?:mp4|webm|mov)(?:$|[?#])/i.test(source);
}

function stopRowNavigation(event: MouseEvent<HTMLElement>): void {
  event.stopPropagation();
}

function TweetText({ text }: { text: string }) {
  const tokens = text.split(/(\n|(?:^|\s)[@#][\p{L}\p{N}_]+)/gu);
  let tokenOffset = 0;

  return (
    <p className="tw-tweet-text">
      {tokens.map((token) => {
        const tokenKey = `${tokenOffset}-${token}`;
        tokenOffset += token.length;

        if (token === "\n") {
          return <br key={tokenKey} />;
        }

        const entityMatch = token.match(/^(\s*)([@#][\p{L}\p{N}_]+)$/u);
        if (entityMatch) {
          return (
            <span key={tokenKey}>
              {entityMatch[1]}
              <span className="tw-tweet-entity">{entityMatch[2]}</span>
            </span>
          );
        }

        return token;
      })}
    </p>
  );
}

function ActionButton({
  label,
  count,
  active = false,
  tone = "neutral",
  children,
  onClick,
}: ActionButtonProps) {
  const classNames = [
    "tw-tweet-action",
    `tw-tweet-action--${tone}`,
    active ? "is-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      aria-label={count === undefined ? label : `${label}: ${count}`}
      aria-pressed={tone === "like" || tone === "repost" ? active : undefined}
      title={label}
      onClick={onClick}
    >
      <span className="tw-tweet-action-icon" aria-hidden="true">
        {children}
      </span>
      {count !== undefined && (
        <span className="tw-tweet-action-count">{formatCount(count)}</span>
      )}
    </button>
  );
}

function MediaGrid({
  tweet,
  onMediaClick,
}: {
  tweet: Tweet;
  onMediaClick?: TweetCardProps["onMediaClick"];
}) {
  const media = tweet.media?.slice(0, 4) ?? [];
  if (media.length === 0) {
    return null;
  }

  return (
    <div
      className={`tw-tweet-media tw-tweet-media--${media.length}`}
      onClick={stopRowNavigation}
    >
      {media.map((source, index) => {
        const label =
          tweet.mediaAlt?.[index] ?? `Media attached to ${tweet.text}`;
        const openMedia = (event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onMediaClick?.(tweet, index);
        };

        return (
          <button
            type="button"
            className="tw-tweet-media-item"
            key={source}
            aria-label={`Open media ${index + 1} of ${media.length}`}
            onClick={openMedia}
          >
            {isVideoSource(source) ? (
              <video
                className="tw-tweet-media-asset"
                src={source}
                aria-label={label}
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                className="tw-tweet-media-asset"
                src={source}
                alt={label}
                loading="lazy"
                draggable={false}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function QuotedTweet({
  tweet,
  author,
  onNavigate,
}: {
  tweet: Tweet;
  author: User;
  onNavigate?: TweetHandler;
}) {
  const handleNavigate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onNavigate?.(tweet);
  };

  return (
    <button
      type="button"
      className="tw-quoted-tweet"
      aria-label={`Quoted post by ${author.name}`}
      onClick={handleNavigate}
    >
      <span className="tw-quoted-tweet-author">
        <Avatar user={author} size="sm" />
        <span className="tw-tweet-author-name">{author.name}</span>
        {author.verified && (
          <BadgeCheck
            className="tw-tweet-verified"
            size={15}
            strokeWidth={2.25}
            aria-label="Verified account"
          />
        )}
        <span className="tw-tweet-meta">
          @{author.handle} · {tweet.timeLabel}
        </span>
      </span>
      <span className="tw-quoted-tweet-text">{tweet.text}</span>
      {tweet.media?.[0] && (
        <span className="tw-quoted-tweet-media">
          {isVideoSource(tweet.media[0]) ? (
            <video
              className="tw-tweet-media-asset"
              src={tweet.media[0]}
              aria-label={tweet.mediaAlt?.[0] ?? "Quoted post media"}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              className="tw-tweet-media-asset"
              src={tweet.media[0]}
              alt={tweet.mediaAlt?.[0] ?? "Quoted post media"}
              loading="lazy"
              draggable={false}
            />
          )}
        </span>
      )}
    </button>
  );
}

export function TweetCard({
  tweet,
  author,
  quotedTweet,
  quotedAuthor,
  liked = false,
  reposted = false,
  bookmarked = false,
  compact = false,
  showThreadLine = false,
  className = "",
  onNavigate,
  onAuthorNavigate,
  onQuotedTweetNavigate,
  onMediaClick,
  onReply,
  onRepost,
  onLike,
  onView,
  onBookmark,
  onShare,
  onMore,
}: TweetCardProps) {
  const navigateToTweet = () => onNavigate?.(tweet);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && event.currentTarget === event.target) {
      event.preventDefault();
      navigateToTweet();
    }
  };

  const articleClassName = [
    "tw-tweet-card",
    compact ? "tw-tweet-card--compact" : "",
    showThreadLine ? "tw-tweet-card--threaded" : "",
    onNavigate ? "is-clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={articleClassName}
      role={onNavigate ? "link" : undefined}
      tabIndex={onNavigate ? 0 : undefined}
      onClick={navigateToTweet}
      onKeyDown={handleKeyDown}
      data-tweet-id={tweet.id}
    >
      {(tweet.context || tweet.promoted) && (
        <div className="tw-tweet-context">
          {tweet.context?.toLowerCase().includes("repost") ? (
            <Repeat2 size={14} strokeWidth={2.25} aria-hidden="true" />
          ) : (
            <span className="tw-tweet-context-spacer" aria-hidden="true" />
          )}
          <span>{tweet.promoted ? "Ad" : tweet.context}</span>
        </div>
      )}

      <div className="tw-tweet-grid">
        <div className="tw-tweet-avatar-column">
          <button
            type="button"
            className="tw-tweet-avatar-button"
            aria-label={`Open ${author.name}'s profile`}
            onClick={(event) => {
              event.stopPropagation();
              onAuthorNavigate?.(author);
            }}
          >
            <Avatar user={author} size="md" />
          </button>
          {showThreadLine && <span className="tw-tweet-thread-line" />}
        </div>

        <div className="tw-tweet-content">
          <header className="tw-tweet-header">
            <button
              type="button"
              className="tw-tweet-author"
              onClick={(event) => {
                event.stopPropagation();
                onAuthorNavigate?.(author);
              }}
            >
              <span className="tw-tweet-author-name">{author.name}</span>
              {author.verified && (
                <BadgeCheck
                  className="tw-tweet-verified"
                  size={17}
                  strokeWidth={2.25}
                  aria-label="Verified account"
                />
              )}
              <span className="tw-tweet-meta">
                @{author.handle} · {tweet.timeLabel}
              </span>
            </button>
            <button
              type="button"
              className="tw-tweet-more"
              aria-label="More actions"
              title="More"
              onClick={(event) => {
                event.stopPropagation();
                onMore?.(tweet);
              }}
            >
              <MoreHorizontal size={19} aria-hidden="true" />
            </button>
          </header>

          {tweet.replyingTo && (
            <div className="tw-tweet-replying-to">
              Replying to <span>@{tweet.replyingTo}</span>
            </div>
          )}

          <TweetText text={tweet.text} />
          <MediaGrid tweet={tweet} onMediaClick={onMediaClick} />

          {quotedTweet && quotedAuthor && (
            <QuotedTweet
              tweet={quotedTweet}
              author={quotedAuthor}
              onNavigate={onQuotedTweetNavigate ?? onNavigate}
            />
          )}

          <div
            className="tw-tweet-actions"
            aria-label="Post actions"
            onClick={stopRowNavigation}
          >
            <ActionButton
              label="Reply"
              count={tweet.replies}
              tone="reply"
              onClick={(event) => {
                event.stopPropagation();
                onReply?.(tweet);
              }}
            >
              <MessageCircle size={18} />
            </ActionButton>
            <ActionButton
              label={reposted ? "Undo repost" : "Repost"}
              count={tweet.reposts}
              active={reposted}
              tone="repost"
              onClick={(event) => {
                event.stopPropagation();
                onRepost?.(tweet, !reposted);
              }}
            >
              <Repeat2 size={18} />
            </ActionButton>
            <ActionButton
              label={liked ? "Unlike" : "Like"}
              count={tweet.likes}
              active={liked}
              tone="like"
              onClick={(event) => {
                event.stopPropagation();
                onLike?.(tweet, !liked);
              }}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
            </ActionButton>
            <ActionButton
              label="View post analytics"
              count={tweet.views}
              tone="reply"
              onClick={(event) => {
                event.stopPropagation();
                onView?.(tweet);
              }}
            >
              <BarChart3 size={18} />
            </ActionButton>
            <div className="tw-tweet-actions-tail">
              <ActionButton
                label={
                  bookmarked ? "Remove from bookmarks" : "Add to bookmarks"
                }
                active={bookmarked}
                tone="reply"
                onClick={(event) => {
                  event.stopPropagation();
                  onBookmark?.(tweet, !bookmarked);
                }}
              >
                <Bookmark
                  size={18}
                  fill={bookmarked ? "currentColor" : "none"}
                />
              </ActionButton>
              <ActionButton
                label="Share"
                tone="reply"
                onClick={(event) => {
                  event.stopPropagation();
                  onShare?.(tweet);
                }}
              >
                <Share size={18} />
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TweetCard;
