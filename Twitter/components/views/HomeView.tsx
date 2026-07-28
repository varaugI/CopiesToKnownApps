"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowUp, Users } from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import {
  Composer,
  type ComposerDraft,
} from "@/components/feed/Composer";
import { ConnectedTweetCard } from "@/components/feed/ConnectedTweetCard";
import { TweetSkeleton } from "@/components/feed/TweetSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import type { FeedTab } from "@/types";

export interface HomeViewProps {
  onNavigate: (path: string) => void;
}

const TAB_LOADING_DURATION_MS = 420;
const NEW_POSTS_REVEAL_DELAY_MS = 1_150;
const NEW_POSTS_VISIBLE_DURATION_MS = 6_500;

export function HomeView({ onNavigate }: HomeViewProps) {
  const {
    createTweet,
    currentUser,
    feedTweets,
    followingUserIds,
    isHydrated,
    showToast,
  } = useTwitter();
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [showNewPosts, setShowNewPosts] = useState(false);
  const tabLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineStartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealTimer = globalThis.setTimeout(
      () => setShowNewPosts(true),
      NEW_POSTS_REVEAL_DELAY_MS,
    );
    const hideTimer = globalThis.setTimeout(
      () => setShowNewPosts(false),
      NEW_POSTS_REVEAL_DELAY_MS + NEW_POSTS_VISIBLE_DURATION_MS,
    );

    return () => {
      globalThis.clearTimeout(revealTimer);
      globalThis.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(
    () => () => {
      if (tabLoadingTimerRef.current !== null) {
        globalThis.clearTimeout(tabLoadingTimerRef.current);
      }
    },
    [],
  );

  const visibleTweets = useMemo(() => {
    if (activeTab === "for-you") {
      return feedTweets;
    }

    return feedTweets.filter(
      (tweet) =>
        tweet.userId === currentUser.id ||
        followingUserIds.has(tweet.userId),
    );
  }, [
    activeTab,
    currentUser.id,
    feedTweets,
    followingUserIds,
  ]);

  function selectTab(nextTab: FeedTab) {
    if (nextTab === activeTab) {
      return;
    }

    if (tabLoadingTimerRef.current !== null) {
      globalThis.clearTimeout(tabLoadingTimerRef.current);
    }

    setActiveTab(nextTab);
    setIsTabLoading(true);
    setShowNewPosts(false);
    tabLoadingTimerRef.current = globalThis.setTimeout(() => {
      setIsTabLoading(false);
      tabLoadingTimerRef.current = null;
    }, TAB_LOADING_DURATION_MS);
  }

  function showUnsupportedTool(toolName: string) {
    showToast(`${toolName} isn't available in this demo yet.`);
  }

  function handleComposeSubmit(draft: ComposerDraft) {
    const sessionMediaUrls: string[] = [];

    if (draft.media.length > 0) {
      const canCreateObjectUrl =
        typeof URL !== "undefined" &&
        typeof URL.createObjectURL === "function";

      if (!canCreateObjectUrl) {
        showToast("Media attachments aren't supported in this browser.");
        return;
      }

      try {
        draft.media.forEach((file) => {
          sessionMediaUrls.push(URL.createObjectURL(file));
        });
      } catch {
        sessionMediaUrls.forEach((url) => URL.revokeObjectURL(url));
        showToast("That media couldn't be attached. Please try another file.");
        return;
      }
    }

    const createdTweet = createTweet({
      text: draft.text,
      media: sessionMediaUrls,
      mediaAlt: draft.media.map((file) =>
        file.name ? `Attached media: ${file.name}` : "Attached media",
      ),
    });

    if (!createdTweet) {
      sessionMediaUrls.forEach((url) => URL.revokeObjectURL(url));
      showToast("Add some text or media before posting.");
      return;
    }

    setShowNewPosts(false);
  }

  function revealNewPosts() {
    setShowNewPosts(false);
    timelineStartRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    showToast("You're all caught up.");
  }

  const showLoadingState = !isHydrated || isTabLoading;

  return (
    <div className="tw-home-view">
      <PageHeader
        title="Home"
        className="tw-home-header"
        tabs={[
          {
            id: "for-you",
            label: "For you",
            selected: activeTab === "for-you",
            onSelect: () => selectTab("for-you"),
          },
          {
            id: "following",
            label: "Following",
            selected: activeTab === "following",
            onSelect: () => selectTab("following"),
          },
        ]}
      />

      <section
        className="tw-home-composer"
        aria-label="Create a post"
      >
        <Composer
          currentUser={currentUser}
          onSubmit={handleComposeSubmit}
          onAudienceClick={() => showUnsupportedTool("Audience controls")}
          onGifClick={() => showUnsupportedTool("GIF search")}
          onPollClick={() => showUnsupportedTool("Polls")}
          onEmojiClick={() => showUnsupportedTool("The emoji picker")}
          onScheduleClick={() => showUnsupportedTool("Post scheduling")}
          onLocationClick={() => showUnsupportedTool("Location tagging")}
        />
      </section>

      {showNewPosts && activeTab === "for-you" && !showLoadingState ? (
        <div className="tw-home-new-posts-wrap" role="status">
          <button
            className="tw-home-new-posts"
            type="button"
            onClick={revealNewPosts}
          >
            <ArrowUp size={17} aria-hidden="true" />
            Show new posts
          </button>
        </div>
      ) : null}

      <div className="tw-home-timeline-start" ref={timelineStartRef} />
      <section
        className="tw-home-timeline"
        aria-label={
          activeTab === "for-you"
            ? "For you timeline"
            : "Following timeline"
        }
        aria-busy={showLoadingState}
      >
        {showLoadingState ? (
          <div
            className="tw-home-loading"
            role="status"
            aria-label="Loading posts"
          >
            <span className="tw-home-loading-label">
              Refreshing your timeline...
            </span>
            <TweetSkeleton />
            <TweetSkeleton media />
            <TweetSkeleton />
          </div>
        ) : visibleTweets.length > 0 ? (
          <div className="tw-home-feed">
            {visibleTweets.map((tweet) => (
              <ConnectedTweetCard
                tweet={tweet}
                onNavigate={onNavigate}
                key={tweet.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="tw-home-empty"
            icon={Users}
            title={
              activeTab === "following"
                ? "Your following timeline is quiet"
                : "No posts to show yet"
            }
            description={
              activeTab === "following"
                ? "Follow a few people and their latest posts will appear here."
                : "Check back soon for something new."
            }
            actionLabel={
              activeTab === "following" ? "Find people to follow" : undefined
            }
            onAction={
              activeTab === "following"
                ? () => onNavigate("/explore")
                : undefined
            }
          />
        )}
      </section>
    </div>
  );
}

export default HomeView;
