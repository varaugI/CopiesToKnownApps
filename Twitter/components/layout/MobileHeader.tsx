"use client";

import { Avatar, type AvatarUser } from "@/components/ui/Avatar";
import { AppLogo } from "./AppLogo";
import type { TwitterHeaderAction } from "./navigation.types";

export interface MobileHeaderProps {
  currentUser: AvatarUser;
  onOpenProfile: () => void;
  actions?: readonly TwitterHeaderAction[];
  logoHref?: string;
  onLogoActivate?: () => void;
  title?: string;
  className?: string;
}

export function MobileHeader({
  currentUser,
  onOpenProfile,
  actions = [],
  logoHref,
  onLogoActivate,
  title = "Chirp",
  className = "",
}: MobileHeaderProps) {
  return (
    <header
      className={["twitter-app-mobile-header", className]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        className="twitter-app-mobile-header-profile"
        type="button"
        aria-label={`Open ${currentUser.name}'s profile`}
        onClick={onOpenProfile}
      >
        <Avatar user={currentUser} size="sm" />
      </button>

      <AppLogo
        label={title}
        href={logoHref}
        onActivate={onLogoActivate}
        className="twitter-app-mobile-header-logo"
      />

      <div className="twitter-app-mobile-header-actions">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              className="twitter-app-mobile-header-action"
              type="button"
              aria-label={action.label}
              disabled={action.disabled}
              onClick={action.onSelect}
              key={action.id}
            >
              <Icon size={21} aria-hidden="true" />
              {action.badge !== undefined ? (
                <span className="twitter-app-mobile-header-badge">
                  {action.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </header>
  );
}
