"use client";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Bookmark,
  Search,
  X,
} from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import { ConnectedTweetCard } from "@/components/feed/ConnectedTweetCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export interface BookmarksViewProps {
  onNavigate: (path: string) => void;
}

export function BookmarksView({ onNavigate }: BookmarksViewProps) {
  const {
    allTweets,
    bookmarkedTweetIds,
    currentUser,
    getUserById,
    showToast,
  } = useTwitter();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const bookmarkedTweets = useMemo(
    () => allTweets.filter((tweet) => bookmarkedTweetIds.has(tweet.id)),
    [allTweets, bookmarkedTweetIds],
  );

  const visibleBookmarks = useMemo(() => {
    if (!normalizedQuery) {
      return bookmarkedTweets;
    }
    return bookmarkedTweets.filter((tweet) => {
      const author = getUserById(tweet.userId);
      return `${tweet.text} ${author.name} ${author.handle}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [bookmarkedTweets, getUserById, normalizedQuery]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      showToast("Type something to search your bookmarks.");
    }
  };

  return (
    <section className="tw-view tw-bookmarks-view" aria-label="Bookmarks">
      <PageHeader title="Bookmarks" subtitle={`@${currentUser.handle}`} />

      {bookmarkedTweets.length > 0 && (
        <form
          className="tw-bookmarks-search"
          role="search"
          onSubmit={submitSearch}
        >
          <Search size={18} aria-hidden="true" />
          <label
            className="tw-visually-hidden"
            htmlFor="tw-bookmarks-search-input"
          >
            Search bookmarks
          </label>
          <input
            id="tw-bookmarks-search-input"
            type="search"
            value={query}
            placeholder="Search Bookmarks"
            autoComplete="off"
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear bookmark search"
              onClick={() => setQuery("")}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </form>
      )}

      {bookmarkedTweets.length === 0 ? (
        <EmptyState
          className="tw-bookmarks-empty"
          icon={Bookmark}
          title="Save posts for later"
          description="Bookmark posts to easily find them again in the future."
          actionLabel="Explore posts"
          onAction={() => onNavigate("/explore")}
        />
      ) : visibleBookmarks.length === 0 ? (
        <EmptyState
          className="tw-bookmarks-empty"
          icon={Search}
          title={`No bookmarks match “${query.trim()}”`}
          description="Try a different word, account name, or handle."
          actionLabel="Clear search"
          onAction={() => setQuery("")}
        />
      ) : (
        <>
          <div className="tw-bookmarks-summary">
            <span>
              {visibleBookmarks.length} saved{" "}
              {visibleBookmarks.length === 1 ? "post" : "posts"}
            </span>
            <span>Only you can see your Bookmarks</span>
          </div>
          <div className="tw-feed-list">
            {visibleBookmarks.map((tweet) => (
              <ConnectedTweetCard
                tweet={tweet}
                onNavigate={onNavigate}
                key={tweet.id}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default BookmarksView;
