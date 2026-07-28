"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import type { TwitterHeaderAction } from "./navigation.types";

export interface PageHeaderTab {
  id: string;
  label: string;
  selected: boolean;
  badge?: number | string;
  onSelect: () => void;
}

export interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: readonly TwitterHeaderAction[];
  tabs?: readonly PageHeaderTab[];
  children?: ReactNode;
  sticky?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  eyebrow,
  subtitle,
  onBack,
  backLabel = "Go back",
  actions = [],
  tabs = [],
  children,
  sticky = true,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={[
        "twitter-app-page-header",
        sticky ? "twitter-app-page-header--sticky" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="twitter-app-page-header-main">
        {onBack ? (
          <button
            className="twitter-app-page-header-back"
            type="button"
            aria-label={backLabel}
            onClick={onBack}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
        ) : null}

        <div className="twitter-app-page-header-copy">
          {eyebrow ? (
            <span className="twitter-app-page-header-eyebrow">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="twitter-app-page-header-title">{title}</h1>
          {subtitle ? (
            <span className="twitter-app-page-header-subtitle">
              {subtitle}
            </span>
          ) : null}
        </div>

        {children ? (
          <div className="twitter-app-page-header-custom">{children}</div>
        ) : null}

        {actions.length ? (
          <div className="twitter-app-page-header-actions">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  className="twitter-app-page-header-action"
                  type="button"
                  aria-label={action.label}
                  disabled={action.disabled}
                  onClick={action.onSelect}
                  key={action.id}
                >
                  <Icon size={20} aria-hidden="true" />
                  {action.badge !== undefined ? (
                    <span className="twitter-app-page-header-action-badge">
                      {action.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {tabs.length ? (
        <div
          className="twitter-app-page-header-tabs"
          role="tablist"
          aria-label={`${title} views`}
        >
          {tabs.map((tab) => (
            <button
              className={[
                "twitter-app-page-header-tab",
                tab.selected ? "twitter-app-page-header-tab--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              type="button"
              role="tab"
              aria-selected={tab.selected}
              onClick={tab.onSelect}
              key={tab.id}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined ? (
                <span className="twitter-app-page-header-tab-badge">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
}
