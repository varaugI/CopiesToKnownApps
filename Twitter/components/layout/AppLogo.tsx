"use client";

import { Bird } from "lucide-react";

export interface AppLogoProps {
  label?: string;
  showWordmark?: boolean;
  href?: string;
  onActivate?: () => void;
  className?: string;
}

export function AppLogo({
  label = "Chirp",
  showWordmark = false,
  href,
  onActivate,
  className = "",
}: AppLogoProps) {
  const classes = [
    "twitter-app-logo",
    showWordmark ? "twitter-app-logo--wordmark" : "twitter-app-logo--mark",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="twitter-app-logo-icon" aria-hidden="true">
        <Bird size={27} strokeWidth={2.35} />
      </span>
      {showWordmark ? (
        <span className="twitter-app-logo-wordmark">{label}</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        aria-label={showWordmark ? undefined : label}
        onClick={onActivate}
      >
        {content}
      </a>
    );
  }

  if (onActivate) {
    return (
      <button
        className={classes}
        type="button"
        aria-label={showWordmark ? undefined : label}
        onClick={onActivate}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={classes}
      role={showWordmark ? undefined : "img"}
      aria-label={showWordmark ? undefined : label}
    >
      {content}
    </span>
  );
}
