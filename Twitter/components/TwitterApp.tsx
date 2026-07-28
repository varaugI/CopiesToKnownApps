"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Bookmark,
  CircleEllipsis,
  Feather,
  Home,
  List,
  Mail,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  UserRound,
  Zap,
} from "lucide-react";

import { TwitterProvider, useTwitter } from "@/components/AppContext";
import { Composer, type ComposerDraft } from "@/components/feed/Composer";
import {
  BottomNav,
  MobileHeader,
  RightRail,
  Sidebar,
  type TwitterNavigationItem,
} from "@/components/layout";
import { Modal, ToastViewport } from "@/components/ui";
import { BookmarksView } from "@/components/views/BookmarksView";
import { ExploreView } from "@/components/views/ExploreView";
import { HomeView } from "@/components/views/HomeView";
import { MessagesView } from "@/components/views/MessagesView";
import { NotificationsView } from "@/components/views/NotificationsView";
import { ProfileView } from "@/components/views/ProfileView";
import { TweetDetailView } from "@/components/views/TweetDetailView";
import { UtilityView } from "@/components/views/UtilityView";

const RESERVED_ROUTES = new Set([
  "bookmarks",
  "explore",
  "grok",
  "home",
  "lists",
  "messages",
  "notifications",
  "premium",
  "profile",
  "settings",
]);

function toSessionMedia(files: File[]): string[] {
  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    return [];
  }
  return files.map((file) => URL.createObjectURL(file));
}

function TwitterShell() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const {
    closeComposeModal,
    composeModal,
    createTweet,
    currentUser,
    dismissToast,
    getTweetById,
    getUserById,
    isFollowing,
    notifications,
    openComposeModal,
    replyToTweet,
    showToast,
    theme,
    toasts,
    toggleFollow,
    toggleTheme,
    trends,
    users,
  } = useTwitter();
  const [searchValue, setSearchValue] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router],
  );

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      navigate("/");
    }
  }, [navigate, router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        openComposeModal();
      }
      if (event.key === "/") {
        event.preventDefault();
        document
          .querySelector<HTMLInputElement>("#twitter-app-global-search")
          ?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openComposeModal]);

  const navItems = useMemo<readonly TwitterNavigationItem[]>(
    () => [
      {
        id: "home",
        label: "Home",
        icon: Home,
        active: pathname === "/" || pathname === "/home",
        onSelect: () => navigate("/"),
      },
      {
        id: "explore",
        label: "Explore",
        icon: Search,
        active: pathname.startsWith("/explore"),
        onSelect: () => navigate("/explore"),
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        badge: notifications.filter((item) => item.unread).length || undefined,
        badgeLabel: "New notifications",
        active: pathname.startsWith("/notifications"),
        onSelect: () => navigate("/notifications"),
      },
      {
        id: "messages",
        label: "Messages",
        icon: Mail,
        badge: 1,
        badgeLabel: "One unread message",
        active: pathname.startsWith("/messages"),
        onSelect: () => navigate("/messages"),
      },
      {
        id: "grok",
        label: "Grok",
        icon: Sparkles,
        active: pathname.startsWith("/grok"),
        onSelect: () => navigate("/grok"),
      },
      {
        id: "bookmarks",
        label: "Bookmarks",
        icon: Bookmark,
        active: pathname.startsWith("/bookmarks"),
        onSelect: () => navigate("/bookmarks"),
      },
      {
        id: "lists",
        label: "Lists",
        icon: List,
        active: pathname.startsWith("/lists"),
        onSelect: () => navigate("/lists"),
      },
      {
        id: "premium",
        label: "Premium",
        icon: Zap,
        active: pathname.startsWith("/premium"),
        onSelect: () => navigate("/premium"),
      },
      {
        id: "profile",
        label: "Profile",
        icon: UserRound,
        active:
          pathname === "/profile" ||
          pathname === `/${currentUser.handle}`,
        onSelect: () => navigate("/profile"),
      },
      {
        id: "more",
        label: "More",
        icon: CircleEllipsis,
        active: pathname.startsWith("/settings"),
        onSelect: () => setMoreOpen(true),
      },
    ],
    [currentUser.handle, navigate, notifications, pathname],
  );

  const bottomNavItems = navItems.filter((item) =>
    ["home", "explore", "notifications", "messages"].includes(item.id),
  );

  const suggestedUsers = users
    .filter((user) => user.id !== currentUser.id)
    .slice(0, 3)
    .map((user) => ({ user, isFollowing: isFollowing(user.id) }));

  const renderCenterView = () => {
    const parts = pathname.split("/").filter(Boolean);

    if (pathname === "/" || pathname === "/home") {
      return <HomeView onNavigate={navigate} />;
    }
    if (parts[0] === "explore") {
      const initialQuery = searchParams.get("query") ?? "";
      return (
        <ExploreView
          key={searchParams.toString()}
          initialQuery={initialQuery}
          onNavigate={navigate}
        />
      );
    }
    if (parts[0] === "notifications") {
      return <NotificationsView onNavigate={navigate} />;
    }
    if (parts[0] === "messages") {
      return (
        <MessagesView
          conversationId={parts[1]}
          onNavigate={navigate}
        />
      );
    }
    if (parts[0] === "bookmarks") {
      return <BookmarksView onNavigate={navigate} />;
    }
    if (parts.length >= 3 && parts[1] === "status") {
      return (
        <TweetDetailView
          tweetId={parts[2] ?? ""}
          onNavigate={navigate}
          onBack={goBack}
        />
      );
    }
    if (parts[0] === "profile") {
      return (
        <ProfileView
          handle={currentUser.handle}
          onNavigate={navigate}
          onBack={goBack}
        />
      );
    }
    if (
      parts.length === 1 &&
      parts[0] &&
      !RESERVED_ROUTES.has(parts[0])
    ) {
      return (
        <ProfileView
          handle={parts[0]}
          onNavigate={navigate}
          onBack={goBack}
        />
      );
    }

    return (
      <UtilityView
        kind={(parts[0] as "grok" | "lists" | "premium" | "settings") || "settings"}
        onNavigate={navigate}
        onBack={goBack}
      />
    );
  };

  const handleComposerSubmit = async (draft: ComposerDraft) => {
    const media = toSessionMedia(draft.media);
    if (composeModal.replyToTweetId) {
      replyToTweet(composeModal.replyToTweetId, draft.text);
      return;
    }
    createTweet({ text: draft.text, media });
  };

  const replyTarget = composeModal.replyToTweetId
    ? getTweetById(composeModal.replyToTweetId)
    : undefined;
  const replyUser = replyTarget ? getUserById(replyTarget.userId) : undefined;
  const hideRightRail = pathname.startsWith("/messages");

  return (
    <div className="twitter-app-root">
      <MobileHeader
        currentUser={currentUser}
        onOpenProfile={() => setAccountOpen(true)}
        onLogoActivate={() => navigate("/")}
        actions={[
          {
            id: "theme",
            label: theme === "dark" ? "Use light theme" : "Use dark theme",
            icon: theme === "dark" ? Sun : Moon,
            onSelect: toggleTheme,
          },
        ]}
      />

      <div
        className={[
          "twitter-app-shell",
          hideRightRail ? "twitter-app-shell--wide-center" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Sidebar
          items={navItems}
          currentUser={currentUser}
          onPost={openComposeModal}
          onOpenProfile={() => navigate("/profile")}
          onOpenAccountMenu={() => setAccountOpen(true)}
          onLogoActivate={() => navigate("/")}
        />

        <main className="twitter-app-main" id="main-content">
          {renderCenterView()}
        </main>

        {!hideRightRail ? (
          <RightRail
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchSubmit={(query) =>
              navigate(
                query
                  ? `/explore?query=${encodeURIComponent(query)}`
                  : "/explore",
              )
            }
            trends={trends.slice(0, 4)}
            suggestions={suggestedUsers}
            onOpenTrend={(trend) => {
              setSearchValue(trend.title);
              navigate(`/explore?query=${encodeURIComponent(trend.title)}`);
            }}
            onOpenTrendMenu={() =>
              showToast("Trend options opened.")
            }
            onShowMoreTrends={() => navigate("/explore")}
            onOpenProfile={(user) => navigate(`/${user.handle}`)}
            onToggleFollow={(user) => toggleFollow(user.id)}
            onShowMoreSuggestions={() => navigate("/explore")}
            footerLinks={[
              { label: "Terms", href: "#terms" },
              { label: "Privacy", href: "#privacy" },
              { label: "Accessibility", href: "#accessibility" },
              { label: "About", href: "#about" },
            ]}
          />
        ) : null}
      </div>

      <BottomNav items={bottomNavItems} />
      <button
        type="button"
        className="twitter-app-floating-compose"
        aria-label="Create a post"
        onClick={openComposeModal}
      >
        <Feather size={23} aria-hidden="true" />
      </button>

      <Modal
        open={composeModal.open}
        title={replyTarget ? "Reply" : "Create a post"}
        onClose={closeComposeModal}
        size="md"
        className="tw-compose-modal"
      >
        {replyTarget ? (
          <div className="tw-compose-modal-context">
            <span className="tw-compose-modal-context-name">
              {replyUser?.name}
            </span>
            <p>{replyTarget.text}</p>
          </div>
        ) : null}
        <Composer
          currentUser={currentUser}
          replyTo={replyUser}
          autoFocus
          submitLabel={replyTarget ? "Reply" : "Post"}
          onSubmit={handleComposerSubmit}
          onAudienceClick={() =>
            showToast("This demo posts publicly to the local timeline.")
          }
          onGifClick={() => showToast("GIF picker opened.")}
          onPollClick={() => showToast("Poll composer opened.")}
          onEmojiClick={() => showToast("Emoji picker opened.")}
          onScheduleClick={() => showToast("Schedule options opened.")}
          onLocationClick={() => showToast("Location options opened.")}
        />
      </Modal>

      <Modal
        open={moreOpen}
        title="More"
        onClose={() => setMoreOpen(false)}
        size="sm"
      >
        <div className="tw-more-menu">
          <button
            type="button"
            onClick={() => {
              navigate("/settings");
              setMoreOpen(false);
            }}
          >
            <Settings size={20} aria-hidden="true" />
            Settings and privacy
          </button>
          <button type="button" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun size={20} aria-hidden="true" />
            ) : (
              <Moon size={20} aria-hidden="true" />
            )}
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </button>
        </div>
      </Modal>

      <Modal
        open={accountOpen}
        title="Your account"
        onClose={() => setAccountOpen(false)}
        size="sm"
      >
        <div className="tw-account-sheet">
          <strong>{currentUser.name}</strong>
          <span>@{currentUser.handle}</span>
          <button
            type="button"
            onClick={() => {
              navigate("/profile");
              setAccountOpen(false);
            }}
          >
            View profile
          </button>
          <p>
            Signed into an offline demo account. Nothing here is sent to
            Twitter or X.
          </p>
        </div>
      </Modal>

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export function TwitterApp() {
  return (
    <TwitterProvider>
      <TwitterShell />
    </TwitterProvider>
  );
}
