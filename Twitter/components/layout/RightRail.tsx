"use client";

import type { FormEvent } from "react";
import {
  BadgeCheck,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import type { Trend, User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

export type RightRailUser = Pick<
  User,
  "id" | "name" | "handle" | "initials" | "avatarClass" | "verified"
> & {
  avatarUrl?: string;
};

export interface RightRailSuggestion {
  user: RightRailUser;
  isFollowing?: boolean;
}

export interface RightRailFooterLink {
  label: string;
  href: string;
}

export interface RightRailProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  trends: readonly Trend[];
  suggestions: readonly RightRailSuggestion[];
  onOpenTrend?: (trend: Trend) => void;
  onOpenTrendMenu?: (trend: Trend) => void;
  onShowMoreTrends?: () => void;
  onOpenProfile?: (user: RightRailUser) => void;
  onToggleFollow?: (user: RightRailUser, isFollowing: boolean) => void;
  onShowMoreSuggestions?: () => void;
  footerLinks?: readonly RightRailFooterLink[];
  searchPlaceholder?: string;
  className?: string;
}

export function RightRail({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  trends,
  suggestions,
  onOpenTrend,
  onOpenTrendMenu,
  onShowMoreTrends,
  onOpenProfile,
  onToggleFollow,
  onShowMoreSuggestions,
  footerLinks = [],
  searchPlaceholder = "Search",
  className = "",
}: RightRailProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearchSubmit?.(searchValue.trim());
  }

  return (
    <aside
      className={["twitter-app-right-rail", className]
        .filter(Boolean)
        .join(" ")}
      aria-label="Discover"
    >
      <form
        className="twitter-app-right-rail-search"
        role="search"
        onSubmit={handleSubmit}
      >
        <Search
          className="twitter-app-right-rail-search-icon"
          size={19}
          aria-hidden="true"
        />
        <label
          className="twitter-app-visually-hidden"
          htmlFor="twitter-app-global-search"
        >
          Search
        </label>
        <input
          id="twitter-app-global-search"
          className="twitter-app-right-rail-search-input"
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          autoComplete="off"
          onChange={(event) => onSearchChange(event.currentTarget.value)}
        />
        {searchValue ? (
          <button
            className="twitter-app-right-rail-search-clear"
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : null}
      </form>

      {trends.length ? (
        <section
          className="twitter-app-right-rail-card twitter-app-right-rail-trends"
          aria-labelledby="twitter-app-trends-heading"
        >
          <h2
            className="twitter-app-right-rail-heading"
            id="twitter-app-trends-heading"
          >
            What&apos;s happening
          </h2>
          <ol className="twitter-app-right-rail-list">
            {trends.map((trend) => (
              <li className="twitter-app-right-rail-trend" key={trend.id}>
                <button
                  className="twitter-app-right-rail-trend-main"
                  type="button"
                  onClick={() => onOpenTrend?.(trend)}
                >
                  <span className="twitter-app-right-rail-trend-eyebrow">
                    {trend.eyebrow}
                  </span>
                  <strong className="twitter-app-right-rail-trend-title">
                    {trend.title}
                  </strong>
                  {trend.summary ? (
                    <span className="twitter-app-right-rail-trend-summary">
                      {trend.summary}
                    </span>
                  ) : null}
                  <span className="twitter-app-right-rail-trend-posts">
                    {trend.posts}
                  </span>
                </button>
                {onOpenTrendMenu ? (
                  <button
                    className="twitter-app-right-rail-more-button"
                    type="button"
                    aria-label={`More options for ${trend.title}`}
                    onClick={() => onOpenTrendMenu(trend)}
                  >
                    <MoreHorizontal size={18} aria-hidden="true" />
                  </button>
                ) : null}
              </li>
            ))}
          </ol>
          {onShowMoreTrends ? (
            <button
              className="twitter-app-right-rail-show-more"
              type="button"
              onClick={onShowMoreTrends}
            >
              Show more
            </button>
          ) : null}
        </section>
      ) : null}

      {suggestions.length ? (
        <section
          className="twitter-app-right-rail-card twitter-app-right-rail-suggestions"
          aria-labelledby="twitter-app-suggestions-heading"
        >
          <h2
            className="twitter-app-right-rail-heading"
            id="twitter-app-suggestions-heading"
          >
            Who to follow
          </h2>
          <ul className="twitter-app-right-rail-list">
            {suggestions.map(({ user, isFollowing = false }) => (
              <li
                className="twitter-app-right-rail-suggestion"
                key={user.id}
              >
                <Avatar user={user} size="md" />
                <button
                  className="twitter-app-right-rail-profile"
                  type="button"
                  onClick={() => onOpenProfile?.(user)}
                >
                  <span className="twitter-app-right-rail-profile-name">
                    {user.name}
                    {user.verified ? (
                      <BadgeCheck
                        className="twitter-app-verified-icon"
                        size={16}
                        aria-label="Verified account"
                      />
                    ) : null}
                  </span>
                  <span className="twitter-app-right-rail-profile-handle">
                    @{user.handle}
                  </span>
                </button>
                <button
                  className={[
                    "twitter-app-right-rail-follow-button",
                    isFollowing
                      ? "twitter-app-right-rail-follow-button--following"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  type="button"
                  aria-pressed={isFollowing}
                  onClick={() => onToggleFollow?.(user, isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </li>
            ))}
          </ul>
          {onShowMoreSuggestions ? (
            <button
              className="twitter-app-right-rail-show-more"
              type="button"
              onClick={onShowMoreSuggestions}
            >
              Show more
            </button>
          ) : null}
        </section>
      ) : null}

      {footerLinks.length ? (
        <nav
          className="twitter-app-right-rail-footer"
          aria-label="Footer"
        >
          {footerLinks.map((link) => (
            <a
              className="twitter-app-right-rail-footer-link"
              href={link.href}
              key={`${link.href}-${link.label}`}
            >
              {link.label}
            </a>
          ))}
          <span className="twitter-app-right-rail-copyright">
            © {new Date().getFullYear()} Chirp
          </span>
        </nav>
      ) : null}
    </aside>
  );
}
