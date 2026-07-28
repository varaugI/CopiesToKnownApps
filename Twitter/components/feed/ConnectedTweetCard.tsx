"use client";

import { useState } from "react";
import { Flag, Trash2, UserRoundX, VolumeX } from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import { Modal } from "@/components/ui/Modal";
import type { Tweet } from "@/types";
import { TweetCard } from "./TweetCard";

export interface ConnectedTweetCardProps {
  tweet: Tweet;
  onNavigate: (path: string) => void;
  compact?: boolean;
  showThreadLine?: boolean;
  className?: string;
}

export function ConnectedTweetCard({
  tweet,
  onNavigate,
  compact,
  showThreadLine,
  className,
}: ConnectedTweetCardProps) {
  const {
    currentUser,
    deleteAuthoredTweet,
    getTweetById,
    getUserById,
    isTweetBookmarked,
    isTweetLiked,
    isTweetReposted,
    openReplyModal,
    showToast,
    toggleBookmark,
    toggleFollow,
    toggleLike,
    toggleRepost,
  } = useTwitter();
  const [mediaIndex, setMediaIndex] = useState<number | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const author = getUserById(tweet.userId);
  const quotedTweet = tweet.quotedTweetId
    ? getTweetById(tweet.quotedTweetId)
    : undefined;
  const quotedAuthor = quotedTweet
    ? getUserById(quotedTweet.userId)
    : undefined;
  const selectedMedia =
    mediaIndex === null ? undefined : tweet.media?.[mediaIndex];

  const navigateToTweet = (target: Tweet) => {
    const targetAuthor = getUserById(target.userId);
    onNavigate(`/${targetAuthor.handle}/status/${target.id}`);
  };

  const shareTweet = async (target: Tweet) => {
    const targetAuthor = getUserById(target.userId);
    const path = `/${targetAuthor.handle}/status/${target.id}`;
    const url =
      typeof window === "undefined" ? path : `${window.location.origin}${path}`;

    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard.");
    } catch {
      showToast("Share link is ready.");
    }
  };

  return (
    <div className="tw-connected-tweet">
      <TweetCard
        tweet={tweet}
        author={author}
        quotedTweet={quotedTweet}
        quotedAuthor={quotedAuthor}
        liked={isTweetLiked(tweet.id)}
        reposted={isTweetReposted(tweet.id)}
        bookmarked={isTweetBookmarked(tweet.id)}
        compact={compact}
        showThreadLine={showThreadLine}
        className={className}
        onNavigate={navigateToTweet}
        onAuthorNavigate={(targetUser) =>
          onNavigate(`/${targetUser.handle}`)
        }
        onQuotedTweetNavigate={navigateToTweet}
        onMediaClick={(_target, index) => setMediaIndex(index)}
        onReply={(target) => openReplyModal(target.id)}
        onRepost={(target) => toggleRepost(target.id)}
        onLike={(target) => toggleLike(target.id)}
        onView={navigateToTweet}
        onBookmark={(target) => toggleBookmark(target.id)}
        onShare={shareTweet}
        onMore={() => setMoreOpen((open) => !open)}
      />

      {moreOpen ? (
        <>
          <button
            type="button"
            className="tw-tweet-menu-backdrop"
            aria-label="Close post menu"
            onClick={() => setMoreOpen(false)}
          />
          <div className="tw-tweet-menu" role="menu">
            {author.id === currentUser.id ? (
              <button
                type="button"
                className="tw-tweet-menu-item tw-tweet-menu-item--danger"
                role="menuitem"
                onClick={() => {
                  deleteAuthoredTweet(tweet.id);
                  setMoreOpen(false);
                }}
              >
                <Trash2 size={18} aria-hidden="true" />
                Delete
              </button>
            ) : (
              <button
                type="button"
                className="tw-tweet-menu-item"
                role="menuitem"
                onClick={() => {
                  toggleFollow(author.id);
                  setMoreOpen(false);
                }}
              >
                <UserRoundX size={18} aria-hidden="true" />
                Follow or unfollow @{author.handle}
              </button>
            )}
            <button
              type="button"
              className="tw-tweet-menu-item"
              role="menuitem"
              onClick={() => {
                showToast(`Muted @${author.handle}.`);
                setMoreOpen(false);
              }}
            >
              <VolumeX size={18} aria-hidden="true" />
              Mute @{author.handle}
            </button>
            <button
              type="button"
              className="tw-tweet-menu-item"
              role="menuitem"
              onClick={() => {
                showToast("Thanks. We’ll review this post.");
                setMoreOpen(false);
              }}
            >
              <Flag size={18} aria-hidden="true" />
              Report post
            </button>
          </div>
        </>
      ) : null}

      <Modal
        open={Boolean(selectedMedia)}
        title={`Media from ${author.name}`}
        onClose={() => setMediaIndex(null)}
        size="full"
        className="tw-media-modal"
      >
        {selectedMedia ? (
          <img
            className="tw-media-modal-image"
            src={selectedMedia}
            alt={tweet.mediaAlt?.[mediaIndex ?? 0] ?? "Post media"}
          />
        ) : null}
      </Modal>
    </div>
  );
}
