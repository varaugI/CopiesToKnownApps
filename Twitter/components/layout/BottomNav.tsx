"use client";

import type { TwitterNavigationItem } from "./navigation.types";

export interface BottomNavProps {
  items: readonly TwitterNavigationItem[];
  navigationLabel?: string;
  className?: string;
}

function BottomNavigationControl({ item }: { item: TwitterNavigationItem }) {
  const Icon = item.icon;
  const content = (
    <>
      <Icon
        className="twitter-app-bottom-nav-icon"
        size={25}
        strokeWidth={item.active ? 2.5 : 2}
        aria-hidden="true"
      />
      <span className="twitter-app-bottom-nav-label">{item.label}</span>
      {item.badge !== undefined ? (
        <span
          className="twitter-app-bottom-nav-badge"
          aria-label={item.badgeLabel}
        >
          {item.badge}
        </span>
      ) : null}
    </>
  );
  const classes = [
    "twitter-app-bottom-nav-item",
    item.active ? "twitter-app-bottom-nav-item--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (item.href && !item.disabled) {
    return (
      <a
        className={classes}
        href={item.href}
        aria-label={item.label}
        aria-current={item.active ? "page" : undefined}
        onClick={item.onSelect}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type="button"
      aria-label={item.label}
      aria-current={item.active ? "page" : undefined}
      disabled={item.disabled}
      onClick={item.onSelect}
    >
      {content}
    </button>
  );
}

export function BottomNav({
  items,
  navigationLabel = "Primary",
  className = "",
}: BottomNavProps) {
  return (
    <nav
      className={["twitter-app-bottom-nav", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={navigationLabel}
    >
      {items.map((item) => (
        <BottomNavigationControl key={item.id} item={item} />
      ))}
    </nav>
  );
}
