"use client";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";
import {
  BadgeCheck,
  MoreHorizontal,
  Search,
  Users,
  X,
} from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import { ConnectedTweetCard } from "@/components/feed/ConnectedTweetCard";
import { Avatar } from "@/components/layout/Avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ExploreTab, Trend, User } from "@/types";

export interface ExploreViewProps {
  onNavigate: (path: string) => void;
  initialQuery?: string;
  initialTab?: ExploreTab;
}

const EXPLORE_TABS: ReadonlyArray<{ id: ExploreTab; label: string }> = [
  { id: "for-you", label: "For you" },
  { id: "trending", label: "Trending" },
  { id: "news", label: "News" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
];

function trendMatchesTab(trend: Trend, tab: ExploreTab): boolean {
  if (tab === "for-you" || tab === "trending") {
    return true;
  }

  const searchable = `${trend.eyebrow} ${trend.title}`.toLowerCase();
  if (tab === "news") {
    return /news|science|technology/.test(searchable);
  }
  if (tab === "sports") {
    return /sport|championship/.test(searchable);
  }
  return /entertainment|summer reading|music|film|television/.test(searchable);
}

function userMatchesQuery(user: User, query: string): boolean {
  const searchable = `${user.name} ${user.handle} ${user.bio}`.toLowerCase();
  return searchable.includes(query);
}

export function ExploreView({
  onNavigate,
  initialQuery = "",
  initialTab = "for-you",
}: ExploreViewProps) {
  const {
    allTweets,
    currentUser,
    feedTweets,
    getUserById,
    isFollowing,
    showToast,
    toggleFollow,
    trends,
    users,
  } = useTwitter();
  const [activeTab, setActiveTab] = useState<ExploreTab>(initialTab);
  const [query, setQuery] = useState(initialQuery);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleTrends = useMemo(() => {
    const tabTrends = trends.filter((trend) => trendMatchesTab(trend, activeTab));
    if (!normalizedQuery) {
      return tabTrends;
    }
    return tabTrends.filter((trend) =>
      `${trend.eyebrow} ${trend.title} ${trend.summary ?? ""}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [activeTab, normalizedQuery, trends]);

  const visiblePeople = useMemo(() => {
    const candidates = users.filter((user) => user.id !== currentUser.id);
    return normalizedQuery
      ? candidates.filter((user) => userMatchesQuery(user, normalizedQuery))
      : candidates.slice(0, 3);
  }, [currentUser.id, normalizedQuery, users]);

  const visibleTweets = useMemo(() => {
    if (normalizedQuery) {
      return allTweets.filter((tweet) => {
        const author = getUserById(tweet.userId);
        return (
          tweet.text.toLowerCase().includes(normalizedQuery) ||
          userMatchesQuery(author, normalizedQuery)
        );
      });
    }

    if (activeTab === "trending") {
      return [...feedTweets].sort((left, right) => right.views - left.views);
    }
    if (activeTab === "news") {
      return feedTweets.filter((tweet) => {
        const author = getUserById(tweet.userId);
        return (
          author.handle === "dailycircuit" ||
          /research|technology|science|battery|news/i.test(tweet.text)
        );
      });
    }
    if (activeTab === "sports") {
      return feedTweets.filter((tweet) =>
        /sport|championship|game|trail|runner/i.test(
          `${tweet.context ?? ""} ${tweet.text}`,
        ),
      );
    }
    if (activeTab === "entertainment") {
      return feedTweets.filter((tweet) =>
        /music|film|book|cinematic|design|travel/i.test(tweet.text),
      );
    }
    return feedTweets;
  }, [
    activeTab,
    allTweets,
    feedTweets,
    getUserById,
    normalizedQuery,
  ]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      showToast("Try searching for a topic, account, or post.");
    }
  };

  const openTrend = (trend: Trend) => {
    setQuery(trend.title);
    onNavigate(`/explore?query=${encodeURIComponent(trend.title)}`);
  };

  const hasResults =
    visibleTrends.length > 0 ||
    visiblePeople.length > 0 ||
    visibleTweets.length > 0;

  return (
    <section className="tw-view tw-explore-view" aria-label="Explore">
      <PageHeader
        title="Explore"
        tabs={EXPLORE_TABS.map((tab) => ({
          id: tab.id,
          label: tab.label,
          selected: activeTab === tab.id,
          onSelect: () => setActiveTab(tab.id),
        }))}
      />

      <form
        className="tw-explore-search"
        role="search"
        onSubmit={submitSearch}
      >
        <Search size={19} aria-hidden="true" />
        <label className="tw-visually-hidden" htmlFor="tw-explore-search-input">
          Search
        </label>
        <input
          id="tw-explore-search-input"
          type="search"
          value={query}
          placeholder="Search"
          autoComplete="off"
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        {query && (
          <button
            type="button"
            className="tw-explore-search-clear"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </form>

      {!hasResults && (
        <EmptyState
          className="tw-explore-empty"
          icon={Search}
          title={`No results for “${query.trim()}”`}
          description="Try searching for something else, or check the spelling of what you typed."
          actionLabel="Clear search"
          onAction={() => setQuery("")}
        />
      )}

      {visibleTrends.length > 0 && (
        <section
          className="tw-explore-section tw-explore-trends"
          aria-labelledby="tw-explore-trends-title"
        >
          <h2 id="tw-explore-trends-title">
            {normalizedQuery ? "Matching trends" : "What’s happening"}
          </h2>
          <ol className="tw-explore-trend-list">
            {visibleTrends.map((trend) => (
              <li className="tw-explore-trend" key={trend.id}>
                <button
                  type="button"
                  className="tw-explore-trend-main"
                  onClick={() => openTrend(trend)}
                >
                  <span className="tw-explore-trend-eyebrow">
                    {trend.eyebrow}
                  </span>
                  <strong>{trend.title}</strong>
                  {trend.summary && <span>{trend.summary}</span>}
                  <span className="tw-explore-trend-count">{trend.posts}</span>
                </button>
                <button
                  type="button"
                  className="tw-explore-trend-more"
                  aria-label={`More options for ${trend.title}`}
                  onClick={() =>
                    showToast(`More options for ${trend.title} are coming soon.`)
                  }
                >
                  <MoreHorizontal size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {visiblePeople.length > 0 && (
        <section
          className="tw-explore-section tw-explore-people"
          aria-labelledby="tw-explore-people-title"
        >
          <h2 id="tw-explore-people-title">
            {normalizedQuery ? "People" : "Who to follow"}
          </h2>
          <ul className="tw-explore-people-list">
            {visiblePeople.map((user) => {
              const following = isFollowing(user.id);
              return (
                <li className="tw-explore-person" key={user.id}>
                  <Avatar user={user} size="md" />
                  <button
                    type="button"
                    className="tw-explore-person-copy"
                    onClick={() => onNavigate(`/${user.handle}`)}
                  >
                    <span className="tw-explore-person-name">
                      <strong>{user.name}</strong>
                      {user.verified && (
                        <BadgeCheck
                          size={16}
                          aria-label="Verified account"
                        />
                      )}
                    </span>
                    <span>@{user.handle}</span>
                    <span className="tw-explore-person-bio">{user.bio}</span>
                  </button>
                  <button
                    type="button"
                    className={[
                      "tw-follow-button",
                      following ? "is-following" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-pressed={following}
                    onClick={() => toggleFollow(user.id)}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                </li>
              );
            })}
          </ul>
          {!normalizedQuery && (
            <button
              type="button"
              className="tw-section-more"
              onClick={() => onNavigate("/connect")}
            >
              <Users size={17} aria-hidden="true" />
              Show more
            </button>
          )}
        </section>
      )}

      {visibleTweets.length > 0 && (
        <section
          className="tw-explore-section tw-explore-results"
          aria-labelledby="tw-explore-results-title"
        >
          <h2 id="tw-explore-results-title">
            {normalizedQuery ? "Posts" : "Posts for you"}
          </h2>
          <div className="tw-feed-list">
            {visibleTweets.map((tweet) => (
              <ConnectedTweetCard
                tweet={tweet}
                onNavigate={onNavigate}
                key={tweet.id}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

export default ExploreView;
