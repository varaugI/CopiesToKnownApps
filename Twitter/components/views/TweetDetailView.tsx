"use client";

import { MessageCircle } from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import { Composer } from "@/components/feed/Composer";
import { ConnectedTweetCard } from "@/components/feed/ConnectedTweetCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export interface TweetDetailViewProps {
  tweetId: string;
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

export function TweetDetailView({
  tweetId,
  onNavigate,
  onBack,
}: TweetDetailViewProps) {
  const {
    currentUser,
    getRepliesForTweet,
    getTweetById,
    getUserById,
    replyToTweet,
  } = useTwitter();
  const tweet = getTweetById(tweetId);
  const goBack = onBack ?? (() => onNavigate("/home"));

  if (!tweet) {
    return (
      <section className="tw-view tw-tweet-detail-view">
        <PageHeader title="Post" onBack={goBack} />
        <EmptyState
          className="tw-tweet-detail-missing"
          icon={MessageCircle}
          title="This post isn’t available"
          description="It may have been deleted, or the link may be incorrect."
          actionLabel="Go home"
          onAction={() => onNavigate("/home")}
        />
      </section>
    );
  }

  const author = getUserById(tweet.userId);
  const replies = getRepliesForTweet(tweet.id);

  return (
    <section
      className="tw-view tw-tweet-detail-view"
      aria-label={`Post by ${author.name}`}
    >
      <PageHeader title="Post" onBack={goBack} />

      <div className="tw-tweet-detail-main">
        <ConnectedTweetCard tweet={tweet} onNavigate={onNavigate} />
      </div>

      <div className="tw-tweet-detail-reply-composer">
        <Composer
          currentUser={currentUser}
          replyTo={author}
          placeholder="Post your reply"
          submitLabel="Reply"
          compact
          onSubmit={({ text }) => {
            replyToTweet(tweet.id, text);
          }}
        />
      </div>

      <section
        className="tw-tweet-detail-thread"
        aria-labelledby="tw-tweet-detail-replies-title"
      >
        <h2 id="tw-tweet-detail-replies-title" className="tw-section-heading">
          Replies
        </h2>
        {replies.length > 0 ? (
          <div className="tw-feed-list">
            {replies.map((reply) => (
              <ConnectedTweetCard
                tweet={reply}
                onNavigate={onNavigate}
                key={reply.id}
              />
            ))}
          </div>
        ) : (
          <div className="tw-tweet-detail-no-replies">
            <MessageCircle size={22} aria-hidden="true" />
            <div>
              <strong>Be the first to reply</strong>
              <span>Share what you think and start the conversation.</span>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

export default TweetDetailView;
