"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  children?: ReactNode;
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  children,
  compact = false,
  className = "",
}: EmptyStateProps) {
  return (
    <section
      className={[
        "twitter-app-empty-state",
        compact ? "twitter-app-empty-state--compact" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={title}
    >
      <span className="twitter-app-empty-state-icon" aria-hidden="true">
        <Icon size={compact ? 28 : 36} strokeWidth={1.8} />
      </span>
      <h2 className="twitter-app-empty-state-title">{title}</h2>
      {description ? (
        <p className="twitter-app-empty-state-description">{description}</p>
      ) : null}
      {children ? (
        <div className="twitter-app-empty-state-content">{children}</div>
      ) : null}
      {actionLabel || secondaryActionLabel ? (
        <div className="twitter-app-empty-state-actions">
          {actionLabel && onAction ? (
            <button
              className="twitter-app-empty-state-primary-action"
              type="button"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          ) : null}
          {secondaryActionLabel && onSecondaryAction ? (
            <button
              className="twitter-app-empty-state-secondary-action"
              type="button"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
