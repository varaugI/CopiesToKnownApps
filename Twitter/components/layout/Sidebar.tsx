"use client";

import { Feather, MoreHorizontal } from "lucide-react";
import { Avatar, type AvatarUser } from "@/components/ui/Avatar";
import { AppLogo } from "./AppLogo";
import type { TwitterNavigationItem } from "./navigation.types";

export interface SidebarProps {
  items: readonly TwitterNavigationItem[];
  currentUser: AvatarUser & {
    handle: string;
  };
  onPost: () => void;
  onOpenProfile?: () => void;
  onOpenAccountMenu?: () => void;
  logoHref?: string;
  onLogoActivate?: () => void;
  postLabel?: string;
  navigationLabel?: string;
  className?: string;
}

function SidebarNavigationControl({ item }: { item: TwitterNavigationItem }) {
  const Icon = item.icon;
  const content = (
    <>
      <span className="twitter-app-sidebar-nav-icon" aria-hidden="true">
        <Icon size={26} strokeWidth={item.active ? 2.45 : 2} />
      </span>
      <span className="twitter-app-sidebar-nav-label">{item.label}</span>
      {item.badge !== undefined ? (
        <span
          className="twitter-app-sidebar-nav-badge"
          aria-label={item.badgeLabel}
        >
          {item.badge}
        </span>
      ) : null}
    </>
  );
  const classes = [
    "twitter-app-sidebar-nav-item",
    item.active ? "twitter-app-sidebar-nav-item--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (item.href && !item.disabled) {
    return (
      <a
        className={classes}
        href={item.href}
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
      aria-current={item.active ? "page" : undefined}
      disabled={item.disabled}
      onClick={item.onSelect}
    >
      {content}
    </button>
  );
}

export function Sidebar({
  items,
  currentUser,
  onPost,
  onOpenProfile,
  onOpenAccountMenu,
  logoHref,
  onLogoActivate,
  postLabel = "Post",
  navigationLabel = "Primary",
  className = "",
}: SidebarProps) {
  const accountAction = onOpenAccountMenu ?? onOpenProfile;
  const asideClasses = ["twitter-app-sidebar", className]
    .filter(Boolean)
    .join(" ");
  const accountContent = (
    <>
      <Avatar user={currentUser} size="md" />
      <span className="twitter-app-sidebar-account-copy">
        <strong className="twitter-app-sidebar-account-name">
          {currentUser.name}
        </strong>
        <span className="twitter-app-sidebar-account-handle">
          @{currentUser.handle}
        </span>
      </span>
      <MoreHorizontal
        className="twitter-app-sidebar-account-more"
        size={20}
        aria-hidden="true"
      />
    </>
  );

  return (
    <aside className={asideClasses}>
      <div className="twitter-app-sidebar-inner">
        <AppLogo
          href={logoHref}
          onActivate={onLogoActivate}
          className="twitter-app-sidebar-logo"
        />

        <nav
          className="twitter-app-sidebar-navigation"
          aria-label={navigationLabel}
        >
          {items.map((item) => (
            <SidebarNavigationControl key={item.id} item={item} />
          ))}
        </nav>

        <button
          className="twitter-app-sidebar-post-button"
          type="button"
          onClick={onPost}
        >
          <Feather
            className="twitter-app-sidebar-post-icon"
            size={22}
            aria-hidden="true"
          />
          <span className="twitter-app-sidebar-post-label">{postLabel}</span>
        </button>

        <div className="twitter-app-sidebar-spacer" aria-hidden="true" />

        {accountAction ? (
          <button
            className="twitter-app-sidebar-account"
            type="button"
            aria-label={`Open account menu for ${currentUser.name}`}
            onClick={accountAction}
          >
            {accountContent}
          </button>
        ) : (
          <div className="twitter-app-sidebar-account">
            {accountContent}
          </div>
        )}
      </div>
    </aside>
  );
}
