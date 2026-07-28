"use client";

import type { User } from "@/types";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type AvatarUser = Pick<
  User,
  "name" | "initials" | "avatarClass"
> & {
  avatarUrl?: string;
};

export interface AvatarProps {
  user: AvatarUser;
  size?: AvatarSize;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  imageAlt?: string;
  className?: string;
}

export function Avatar({
  user,
  size = "md",
  href,
  onClick,
  ariaLabel = `Open ${user.name}'s profile`,
  imageAlt = `${user.name}'s profile picture`,
  className = "",
}: AvatarProps) {
  const avatarClasses = [
    "twitter-app-avatar",
    `twitter-app-avatar--${size}`,
    user.avatarClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const visual = (
    <span className={avatarClasses} data-avatar-size={size}>
      {user.avatarUrl ? (
        <img
          className="twitter-app-avatar-image"
          src={user.avatarUrl}
          alt={href || onClick ? "" : imageAlt}
        />
      ) : (
        <span className="twitter-app-avatar-initials" aria-hidden="true">
          {user.initials}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <a
        className="twitter-app-avatar-action"
        href={href}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {visual}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        className="twitter-app-avatar-action"
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {visual}
      </button>
    );
  }

  return visual;
}
