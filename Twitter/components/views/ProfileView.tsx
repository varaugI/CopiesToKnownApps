"use client";

import {
  useId,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  BadgeCheck,
  CalendarDays,
  Link as LinkIcon,
  Mail,
  MapPin,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import { TweetCard } from "@/components/feed/TweetCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import type { Tweet, User } from "@/types";

type ProfileTab = "posts" | "replies" | "media" | "likes";

export interface ProfileViewProps {
  handle: string;
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

interface ProfileDraft {
  name: string;
  handle: string;
  bio: string;
  location: string;
  website: string;
}

const numberFormatter = new Intl.NumberFormat("en-US");

function profileDraft(user: User): ProfileDraft {
  return {
    name: user.name,
    handle: user.handle,
    bio: user.bio,
    location: user.location ?? "",
    website: user.website ?? "",
  };
}

function profilePath(user: User): string {
  return `/${encodeURIComponent(user.handle)}`;
}

function tweetPath(tweet: Tweet, author: User): string {
  return `${profilePath(author)}/status/${encodeURIComponent(tweet.id)}`;
}

function websiteHref(website: string): string {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

export function ProfileView({
  handle,
  onNavigate,
  onBack,
}: ProfileViewProps) {
  const {
    currentUser,
    allTweets,
    likedTweetIds,
    repostedTweetIds,
    bookmarkedTweetIds,
    followingUserIds,
    getUserById,
    getUserByHandle,
    getTweetById,
    updateProfile,
    toggleLike,
    toggleRepost,
    toggleBookmark,
    toggleFollow,
    startConversation,
    openReplyModal,
    showToast,
  } = useTwitter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>(() =>
    profileDraft(currentUser),
  );
  const formId = useId();

  const normalizedHandle = handle.replace(/^@/, "");
  const user =
    getUserByHandle(normalizedHandle) ??
    (normalizedHandle.toLowerCase() === currentUser.handle.toLowerCase()
      ? currentUser
      : undefined);
  const isCurrentUser = user?.id === currentUser.id;

  const userTweets = useMemo(
    () => allTweets.filter((tweet) => tweet.userId === user?.id),
    [allTweets, user?.id],
  );
  const visibleTweets = useMemo(() => {
    if (!user) return [];

    switch (activeTab) {
      case "replies":
        return userTweets.filter(
          (tweet) => Boolean(tweet.parentTweetId) || Boolean(tweet.replyingTo),
        );
      case "media":
        return userTweets.filter((tweet) => Boolean(tweet.media?.length));
      case "likes":
        return isCurrentUser
          ? allTweets.filter((tweet) => likedTweetIds.has(tweet.id))
          : [];
      case "posts":
      default:
        return userTweets.filter(
          (tweet) => !tweet.parentTweetId && !tweet.replyingTo,
        );
    }
  }, [activeTab, allTweets, isCurrentUser, likedTweetIds, user, userTweets]);

  if (!user) {
    return (
      <section className="tw-view-page tw-view-profile">
        <PageHeader title="Profile" onBack={onBack} />
        <EmptyState
          className="tw-profile-empty"
          icon={UserPlus}
          title="This account doesn’t exist"
          description={`Try searching for another account instead of @${normalizedHandle}.`}
          actionLabel="Go home"
          onAction={() => onNavigate("/")}
        />
      </section>
    );
  }

  const handleEditProfile = () => {
    setDraft(profileDraft(currentUser));
    setIsEditProfileOpen(true);
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    const nextHandle = draft.handle.trim().replace(/^@+/, "");
    if (!name || !nextHandle) return;

    updateProfile({
      name,
      handle: nextHandle,
      bio: draft.bio.trim(),
      location: draft.location.trim(),
      website: draft.website.trim(),
    });
    setIsEditProfileOpen(false);
    if (nextHandle !== currentUser.handle) {
      onNavigate(`/${encodeURIComponent(nextHandle)}`);
    }
  };

  const handleMessage = () => {
    const conversation = startConversation(user.id);
    onNavigate(`/messages/${encodeURIComponent(conversation.id)}`);
  };

  const handleTweetNavigate = (tweet: Tweet) => {
    const author = getUserById(tweet.userId);
    onNavigate(tweetPath(tweet, author));
  };

  const handleAuthorNavigate = (author: User) => {
    onNavigate(profilePath(author));
  };

  const handleShare = (tweet: Tweet) => {
    const author = getUserById(tweet.userId);
    const path = tweetPath(tweet, author);

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof window !== "undefined"
    ) {
      void navigator.clipboard
        .writeText(`${window.location.origin}${path}`)
        .catch(() => undefined);
    }
    showToast("Link copied to clipboard.");
  };

  const profilePostCount = userTweets.filter(
    (tweet) => !tweet.parentTweetId && !tweet.replyingTo,
  ).length;
  const isFollowed = followingUserIds.has(user.id);
  const tabs: Array<{ id: ProfileTab; label: string }> = [
    { id: "posts", label: "Posts" },
    { id: "replies", label: "Replies" },
    { id: "media", label: "Media" },
    { id: "likes", label: "Likes" },
  ];
  const emptyCopy: Record<ProfileTab, { title: string; description: string }> = {
    posts: {
      title: isCurrentUser ? "You haven’t posted yet" : `@${user.handle} hasn’t posted`,
      description: isCurrentUser
        ? "When you send a post, it will show up here."
        : "When they post, it will show up here.",
    },
    replies: {
      title: "No replies yet",
      description: isCurrentUser
        ? "Replies you send will show up here."
        : `Replies from @${user.handle} will show up here.`,
    },
    media: {
      title: "Lights, camera… attachments!",
      description: `Posts from @${user.handle} with photos or video will show up here.`,
    },
    likes: {
      title: isCurrentUser ? "You don’t have any likes yet" : "Likes are private",
      description: isCurrentUser
        ? "Tap the heart on any post to show it some love."
        : "Only the account owner can see their liked posts in this demo.",
    },
  };

  return (
    <section className="tw-view-page tw-view-profile">
      <PageHeader
        title={user.name}
        subtitle={`${numberFormatter.format(profilePostCount)} ${
          profilePostCount === 1 ? "post" : "posts"
        }`}
        onBack={onBack}
      />

      <div className="tw-profile-banner" aria-label={`${user.name} profile banner`}>
        <span className={`tw-profile-banner-art ${user.avatarClass}`} aria-hidden="true" />
      </div>

      <div className="tw-profile-summary">
        <div className="tw-profile-summary-top">
          <Avatar
            user={user}
            size="xl"
            className="tw-profile-avatar"
            ariaLabel={`${user.name}'s profile picture`}
          />

          <div className="tw-profile-actions">
            {isCurrentUser ? (
              <button
                type="button"
                className="tw-profile-secondary-button"
                onClick={handleEditProfile}
              >
                Edit profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="tw-profile-icon-button"
                  aria-label={`More actions for ${user.name}`}
                  title="More"
                  onClick={() => showToast("More profile actions are coming soon.")}
                >
                  <MoreHorizontal size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="tw-profile-icon-button"
                  aria-label={`Message ${user.name}`}
                  title={`Message ${user.name}`}
                  onClick={handleMessage}
                >
                  <Mail size={19} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={[
                    "tw-profile-follow-button",
                    isFollowed ? "is-following" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={isFollowed}
                  onClick={() => toggleFollow(user.id)}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="tw-profile-identity">
          <div className="tw-profile-name-row">
            <h1>{user.name}</h1>
            {user.verified ? (
              <BadgeCheck
                className="tw-profile-verified"
                size={19}
                strokeWidth={2.3}
                aria-label="Verified account"
              />
            ) : null}
          </div>
          <p className="tw-profile-handle">@{user.handle}</p>
        </div>

        <p className="tw-profile-bio">{user.bio}</p>

        <div className="tw-profile-meta" aria-label="Profile details">
          {user.location ? (
            <span>
              <MapPin size={17} aria-hidden="true" />
              {user.location}
            </span>
          ) : null}
          {user.website ? (
            <a href={websiteHref(user.website)} target="_blank" rel="noreferrer">
              <LinkIcon size={17} aria-hidden="true" />
              {user.website.replace(/^https?:\/\//i, "")}
            </a>
          ) : null}
          {user.joined ? (
            <span>
              <CalendarDays size={17} aria-hidden="true" />
              {user.joined}
            </span>
          ) : null}
        </div>

        <div className="tw-profile-counts">
          <button
            type="button"
            onClick={() => showToast("Following list opened.")}
          >
            <strong>{numberFormatter.format(user.following)}</strong>
            <span>Following</span>
          </button>
          <button
            type="button"
            onClick={() => showToast("Followers list opened.")}
          >
            <strong>{numberFormatter.format(user.followers)}</strong>
            <span>Followers</span>
          </button>
          {user.followedBy?.length ? (
            <span className="tw-profile-followed-by">
              Followed by {user.followedBy.join(", ")}
            </span>
          ) : null}
        </div>
      </div>

      <div
        className="tw-profile-tabs"
        role="tablist"
        aria-label={`${user.name}'s profile`}
      >
        {tabs.map((tab) => (
          <button
            type="button"
            id={`tw-profile-tab-${tab.id}`}
            className={[
              "tw-profile-tab",
              activeTab === tab.id ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="tw-profile-tabpanel"
            onClick={() => setActiveTab(tab.id)}
            key={tab.id}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div
        id="tw-profile-tabpanel"
        className="tw-profile-timeline"
        role="tabpanel"
        aria-labelledby={`tw-profile-tab-${activeTab}`}
      >
        {visibleTweets.length > 0 ? (
          visibleTweets.map((tweet) => {
            const author = getUserById(tweet.userId);
            const quotedTweet = tweet.quotedTweetId
              ? getTweetById(tweet.quotedTweetId)
              : undefined;
            const quotedAuthor = quotedTweet
              ? getUserById(quotedTweet.userId)
              : undefined;

            return (
              <TweetCard
                tweet={tweet}
                author={author}
                quotedTweet={quotedTweet}
                quotedAuthor={quotedAuthor}
                liked={likedTweetIds.has(tweet.id)}
                reposted={repostedTweetIds.has(tweet.id)}
                bookmarked={bookmarkedTweetIds.has(tweet.id)}
                onNavigate={handleTweetNavigate}
                onAuthorNavigate={handleAuthorNavigate}
                onQuotedTweetNavigate={handleTweetNavigate}
                onReply={(selectedTweet) => openReplyModal(selectedTweet.id)}
                onLike={(selectedTweet) => toggleLike(selectedTweet.id)}
                onRepost={(selectedTweet) => toggleRepost(selectedTweet.id)}
                onBookmark={(selectedTweet) => toggleBookmark(selectedTweet.id)}
                onShare={handleShare}
                onMore={() => showToast("More post actions are coming soon.")}
                key={tweet.id}
              />
            );
          })
        ) : (
          <EmptyState
            className="tw-profile-empty"
            title={emptyCopy[activeTab].title}
            description={emptyCopy[activeTab].description}
          />
        )}
      </div>

      <Modal
        open={isEditProfileOpen}
        title="Edit profile"
        description="Update the details people see on your profile."
        size="md"
        onClose={() => setIsEditProfileOpen(false)}
        className="tw-profile-edit-modal"
        footer={
          <>
            <button
              type="button"
              className="tw-profile-modal-cancel"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formId}
              className="tw-profile-modal-save"
            >
              Save
            </button>
          </>
        }
      >
        <form
          id={formId}
          className="tw-profile-edit-form"
          onSubmit={handleProfileSubmit}
        >
          <label className="tw-profile-field">
            <span>Name</span>
            <input
              type="text"
              value={draft.name}
              maxLength={50}
              required
              autoComplete="name"
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <label className="tw-profile-field">
            <span>Username</span>
            <span className="tw-profile-handle-input">
              <span aria-hidden="true">@</span>
              <input
                type="text"
                value={draft.handle}
                maxLength={30}
                required
                autoComplete="username"
                pattern="[A-Za-z0-9_]+"
                title="Use only letters, numbers, and underscores"
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    handle: event.target.value.replace(/\s/g, ""),
                  }))
                }
              />
            </span>
          </label>
          <label className="tw-profile-field">
            <span>Bio</span>
            <textarea
              value={draft.bio}
              maxLength={160}
              rows={3}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  bio: event.target.value,
                }))
              }
            />
          </label>
          <label className="tw-profile-field">
            <span>Location</span>
            <input
              type="text"
              value={draft.location}
              maxLength={30}
              autoComplete="address-level2"
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  location: event.target.value,
                }))
              }
            />
          </label>
          <label className="tw-profile-field">
            <span>Website</span>
            <input
              type="text"
              value={draft.website}
              maxLength={100}
              inputMode="url"
              autoComplete="url"
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  website: event.target.value,
                }))
              }
            />
          </label>
        </form>
      </Modal>
    </section>
  );
}

export default ProfileView;
