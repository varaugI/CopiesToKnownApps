"use client";

import {
  type KeyboardEvent,
  useMemo,
  useState,
} from "react";
import {
  AtSign,
  Bell,
  Heart,
  Repeat2,
  Settings,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import { Avatar } from "@/components/layout/Avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import type { NotificationItem, NotificationTab, User } from "@/types";

export interface NotificationsViewProps {
  onNavigate: (path: string) => void;
  initialTab?: NotificationTab;
}

const NOTIFICATION_ICONS: Record<NotificationItem["kind"], LucideIcon> = {
  like: Heart,
  repost: Repeat2,
  follow: UserPlus,
  mention: AtSign,
  post: Bell,
};

function notificationActorLabel(users: User[]): string {
  if (users.length === 0) {
    return "Someone";
  }
  if (users.length === 1) {
    return users[0]!.name;
  }
  if (users.length === 2) {
    return `${users[0]!.name} and ${users[1]!.name}`;
  }
  return `${users[0]!.name} and ${users.length - 1} others`;
}

function notificationMatchesTab(
  notification: NotificationItem,
  tab: NotificationTab,
): boolean {
  if (tab === "verified") {
    return Boolean(notification.verified);
  }
  if (tab === "mentions") {
    return notification.kind === "mention";
  }
  return true;
}

export function NotificationsView({
  onNavigate,
  initialTab = "all",
}: NotificationsViewProps) {
  const {
    getTweetById,
    getUserById,
    notifications,
    showToast,
  } = useTwitter();
  const [activeTab, setActiveTab] = useState<NotificationTab>(initialTab);

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) =>
        notificationMatchesTab(notification, activeTab),
      ),
    [activeTab, notifications],
  );

  const openNotification = (notification: NotificationItem) => {
    if (notification.tweetId) {
      const tweet = getTweetById(notification.tweetId);
      if (!tweet) {
        showToast("That post is no longer available.");
        return;
      }
      const author = getUserById(tweet.userId);
      onNavigate(`/${author.handle}/status/${tweet.id}`);
    }
  };

  const handleNotificationKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    notification: NotificationItem,
  ) => {
    if (
      event.key === "Enter" &&
      event.currentTarget === event.target &&
      notification.tweetId
    ) {
      event.preventDefault();
      openNotification(notification);
    }
  };

  return (
    <section
      className="tw-view tw-notifications-view"
      aria-label="Notifications"
    >
      <PageHeader
        title="Notifications"
        actions={[
          {
            id: "notification-settings",
            label: "Notification settings",
            icon: Settings,
            onSelect: () => onNavigate("/settings/notifications"),
          },
        ]}
        tabs={[
          {
            id: "all",
            label: "All",
            selected: activeTab === "all",
            onSelect: () => setActiveTab("all"),
          },
          {
            id: "verified",
            label: "Verified",
            selected: activeTab === "verified",
            onSelect: () => setActiveTab("verified"),
          },
          {
            id: "mentions",
            label: "Mentions",
            selected: activeTab === "mentions",
            onSelect: () => setActiveTab("mentions"),
          },
        ]}
      />

      {visibleNotifications.length === 0 ? (
        <EmptyState
          className="tw-notifications-empty"
          icon={activeTab === "mentions" ? AtSign : Bell}
          title={
            activeTab === "mentions"
              ? "Nothing to see here—yet"
              : "No notifications yet"
          }
          description={
            activeTab === "mentions"
              ? "When someone mentions you, you’ll find it here."
              : "Likes, follows, reposts, and other activity will show up here."
          }
          actionLabel="Explore posts"
          onAction={() => onNavigate("/explore")}
        />
      ) : (
        <div className="tw-notification-list" role="feed">
          {visibleNotifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.kind];
            const actors = notification.userIds.map(getUserById);
            const canOpen = Boolean(notification.tweetId);

            return (
              <article
                className={[
                  "tw-notification-row",
                  `tw-notification-row--${notification.kind}`,
                  notification.unread ? "is-unread" : "",
                  canOpen ? "is-clickable" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                role={canOpen ? "link" : undefined}
                tabIndex={canOpen ? 0 : undefined}
                onClick={() => openNotification(notification)}
                onKeyDown={(event) =>
                  handleNotificationKeyDown(event, notification)
                }
                key={notification.id}
              >
                <div
                  className="tw-notification-kind-icon"
                  aria-hidden="true"
                >
                  <Icon
                    size={26}
                    fill={notification.kind === "like" ? "currentColor" : "none"}
                  />
                </div>

                <div className="tw-notification-content">
                  <div
                    className="tw-notification-avatars"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {actors.map((actor) => (
                      <Avatar
                        user={actor}
                        size="sm"
                        ariaLabel={`Open ${actor.name}'s profile`}
                        onClick={() =>
                          onNavigate(`/${actor.handle}`)
                        }
                        key={actor.id}
                      />
                    ))}
                  </div>
                  <p className="tw-notification-copy">
                    <strong>{notificationActorLabel(actors)}</strong>{" "}
                    {notification.text}
                  </p>
                  <time className="tw-notification-time">
                    {notification.timestamp}
                  </time>
                </div>

                {notification.unread && (
                  <span
                    className="tw-notification-unread-dot"
                    aria-label="Unread"
                  />
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default NotificationsView;
