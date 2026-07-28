"use client";

/* oxlint-disable react/only-export-components -- The provider and its guarded hook intentionally share this module. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  CURRENT_USER_ID,
  conversations as initialConversations,
  notifications,
  replyTweets as initialReplyTweets,
  trends,
  tweets as initialTweets,
  users as initialUsers,
} from "@/data/mockData";
import type {
  Conversation,
  Message,
  NotificationItem,
  Theme,
  ToastMessage,
  Trend,
  Tweet,
  User,
} from "@/types";

const STORAGE_PREFIX = "twitter-clone";
const CLOSED_COMPOSER: ComposeModalState = {
  open: false,
  replyToTweetId: null,
};
const INITIAL_CURRENT_USER =
  initialUsers.find((user) => user.id === CURRENT_USER_ID) ?? initialUsers[0]!;
const INITIAL_REPLY_IDS = new Set(initialReplyTweets.map((tweet) => tweet.id));

export interface AuthoredTweet extends Tweet {
  parentTweetId?: string;
}

export interface CreateTweetInput {
  text: string;
  media?: string[];
  mediaAlt?: string[];
  quotedTweetId?: string;
}

export interface ComposeModalState {
  open: boolean;
  replyToTweetId: string | null;
}

interface StoredStateCodec<T> {
  decode: (value: unknown, fallback: T) => T;
  encode?: (value: T) => unknown;
}

export interface TwitterContextValue {
  isHydrated: boolean;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: () => void;

  currentUser: User;
  profile: User;
  users: User[];
  updateProfile: (updates: Partial<User>) => void;
  editProfile: (updates: Partial<User>) => void;
  getUserById: (userId: string) => User;
  getUserByHandle: (handle: string) => User | undefined;

  authoredTweets: AuthoredTweet[];
  tweets: AuthoredTweet[];
  feedTweets: AuthoredTweet[];
  replies: AuthoredTweet[];
  allTweets: AuthoredTweet[];
  createTweet: (
    input: string | CreateTweetInput,
    media?: string[],
    mediaAlt?: string[],
  ) => AuthoredTweet | null;
  postTweet: TwitterContextValue["createTweet"];
  replyToTweet: (tweetId: string, text: string) => AuthoredTweet | null;
  sendReply: TwitterContextValue["replyToTweet"];
  deleteAuthoredTweet: (tweetId: string) => void;
  getTweetById: (tweetId: string) => AuthoredTweet | undefined;
  getRepliesForTweet: (tweetId: string) => AuthoredTweet[];

  likedTweetIds: ReadonlySet<string>;
  repostedTweetIds: ReadonlySet<string>;
  bookmarkedTweetIds: ReadonlySet<string>;
  followingUserIds: ReadonlySet<string>;
  likedTweets: ReadonlySet<string>;
  repostedTweets: ReadonlySet<string>;
  bookmarkedTweets: ReadonlySet<string>;
  following: ReadonlySet<string>;
  isTweetLiked: (tweetId: string) => boolean;
  isTweetReposted: (tweetId: string) => boolean;
  isTweetBookmarked: (tweetId: string) => boolean;
  isFollowing: (userId: string) => boolean;
  toggleLike: (tweetId: string) => void;
  toggleRepost: (tweetId: string) => void;
  toggleBookmark: (tweetId: string) => void;
  toggleFollow: (userId: string) => void;
  toggleLikeTweet: TwitterContextValue["toggleLike"];
  toggleRepostTweet: TwitterContextValue["toggleRepost"];
  toggleBookmarkTweet: TwitterContextValue["toggleBookmark"];
  toggleFollowUser: TwitterContextValue["toggleFollow"];

  conversations: Conversation[];
  startConversation: (userId: string) => Conversation;
  sendMessage: (conversationId: string, text: string) => Message | null;
  markConversationRead: (conversationId: string) => void;

  trends: Trend[];
  notifications: NotificationItem[];

  composeModal: ComposeModalState;
  isComposeModalOpen: boolean;
  isComposeOpen: boolean;
  replyToTweetId: string | null;
  openComposeModal: () => void;
  openReplyModal: (tweetId: string) => void;
  closeComposeModal: () => void;
  setIsComposeModalOpen: (open: boolean) => void;
  setComposeOpen: (open: boolean) => void;

  toast: ToastMessage | null;
  toasts: ToastMessage[];
  showToast: (message: string, durationMs?: number) => string;
  dismissToast: (toastId: string) => void;
  clearToast: () => void;
}

const TwitterContext = createContext<TwitterContextValue | undefined>(undefined);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredTweet(value: unknown): value is AuthoredTweet {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.userId === "string" &&
    typeof value.text === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.timeLabel === "string" &&
    typeof value.replies === "number" &&
    typeof value.reposts === "number" &&
    typeof value.likes === "number" &&
    typeof value.views === "number" &&
    (value.parentTweetId === undefined || typeof value.parentTweetId === "string")
  );
}

function isStoredMessage(value: unknown): value is Message {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.senderId === "string" &&
    typeof value.text === "string" &&
    typeof value.timestamp === "string"
  );
}

function isStoredConversation(value: unknown): value is Conversation {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    Array.isArray(value.participantIds) &&
    value.participantIds.every((participantId) => typeof participantId === "string") &&
    Array.isArray(value.messages) &&
    value.messages.every(isStoredMessage)
  );
}

const themeCodec: StoredStateCodec<Theme> = {
  decode: (value) => (value === "dark" ? "dark" : "light"),
};

const authoredTweetsCodec: StoredStateCodec<AuthoredTweet[]> = {
  decode: (value, fallback) =>
    Array.isArray(value) ? value.filter(isStoredTweet) : fallback,
};

const stringSetCodec: StoredStateCodec<Set<string>> = {
  decode: (value, fallback) =>
    Array.isArray(value)
      ? new Set(value.filter((item): item is string => typeof item === "string"))
      : fallback,
  encode: (value) => Array.from(value),
};

const currentUserCodec: StoredStateCodec<User> = {
  decode: (value, fallback) =>
    isRecord(value)
      ? {
          ...fallback,
          ...value,
          id: CURRENT_USER_ID,
        } as User
      : fallback,
};

const conversationsCodec: StoredStateCodec<Conversation[]> = {
  decode: (value, fallback) =>
    Array.isArray(value) && value.every(isStoredConversation) ? value : fallback,
};

function usePersistedState<T>(
  storageKey: string,
  initialValue: T,
  codec?: StoredStateCodec<T>,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const initialValueRef = useRef(initialValue);
  const codecRef = useRef(codec);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(storageKey);
      if (storedValue !== null) {
        const parsedValue: unknown = JSON.parse(storedValue);
        setValue(
          codecRef.current
            ? codecRef.current.decode(parsedValue, initialValueRef.current)
            : (parsedValue as T),
        );
      }
    } catch {
      setValue(initialValueRef.current);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      const persistableValue = codecRef.current?.encode
        ? codecRef.current.encode(value)
        : value;
      const serializedValue = JSON.stringify(persistableValue);
      if (serializedValue !== undefined) {
        window.localStorage.setItem(storageKey, serializedValue);
      }
    } catch {
      // The in-memory state remains usable when browser storage is unavailable.
    }
  }, [isHydrated, storageKey, value]);

  return [value, setValue, isHydrated];
}

function createClientId(prefix: string): string {
  const suffix =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}

function toggleSetItem(previous: Set<string>, itemId: string): Set<string> {
  const next = new Set(previous);
  if (next.has(itemId)) {
    next.delete(itemId);
  } else {
    next.add(itemId);
  }
  return next;
}

function initialsForName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function TwitterProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme, themeHydrated] = usePersistedState<Theme>(
    `${STORAGE_PREFIX}:theme`,
    "light",
    themeCodec,
  );
  const [storedCurrentUser, setStoredCurrentUser, profileHydrated] =
    usePersistedState<User>(
      `${STORAGE_PREFIX}:profile`,
      INITIAL_CURRENT_USER,
      currentUserCodec,
    );
  const [storedAuthoredTweets, setStoredAuthoredTweets, authoredTweetsHydrated] =
    usePersistedState<AuthoredTweet[]>(
      `${STORAGE_PREFIX}:authored-tweets`,
      [],
      authoredTweetsCodec,
    );
  const [likedTweetIds, setLikedTweetIds, likesHydrated] =
    usePersistedState<Set<string>>(
      `${STORAGE_PREFIX}:liked-tweets`,
      new Set<string>(),
      stringSetCodec,
    );
  const [repostedTweetIds, setRepostedTweetIds, repostsHydrated] =
    usePersistedState<Set<string>>(
      `${STORAGE_PREFIX}:reposted-tweets`,
      new Set<string>(),
      stringSetCodec,
    );
  const [bookmarkedTweetIds, setBookmarkedTweetIds, bookmarksHydrated] =
    usePersistedState<Set<string>>(
      `${STORAGE_PREFIX}:bookmarked-tweets`,
      new Set<string>(),
      stringSetCodec,
    );
  const [followingUserIds, setFollowingUserIds, followsHydrated] =
    usePersistedState<Set<string>>(
      `${STORAGE_PREFIX}:following-users`,
      new Set<string>(),
      stringSetCodec,
    );
  const [conversations, setConversations, conversationsHydrated] =
    usePersistedState<Conversation[]>(
      `${STORAGE_PREFIX}:conversations`,
      initialConversations,
      conversationsCodec,
    );

  const [composeModal, setComposeModal] =
    useState<ComposeModalState>(CLOSED_COMPOSER);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastTimers = useRef(
    new Map<string, ReturnType<typeof globalThis.setTimeout>>(),
  );

  const isHydrated =
    themeHydrated &&
    profileHydrated &&
    authoredTweetsHydrated &&
    likesHydrated &&
    repostsHydrated &&
    bookmarksHydrated &&
    followsHydrated &&
    conversationsHydrated;

  useEffect(() => {
    if (!themeHydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme, themeHydrated]);

  useEffect(
    () => () => {
      toastTimers.current.forEach((timer) => globalThis.clearTimeout(timer));
      toastTimers.current.clear();
    },
    [],
  );

  const dismissToast = useCallback((toastId: string) => {
    const timer = toastTimers.current.get(toastId);
    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
      toastTimers.current.delete(toastId);
    }
    setToasts((previous) => previous.filter((toast) => toast.id !== toastId));
  }, []);

  const showToast = useCallback(
    (message: string, durationMs = 2800): string => {
      const normalizedMessage = message.trim();
      if (!normalizedMessage) return "";

      const toastId = createClientId("toast");
      const nextToast: ToastMessage = {
        id: toastId,
        message: normalizedMessage,
      };

      setToasts((previous) => [...previous.slice(-2), nextToast]);
      const timer = globalThis.setTimeout(
        () => dismissToast(toastId),
        Math.max(0, durationMs),
      );
      toastTimers.current.set(toastId, timer);

      return toastId;
    },
    [dismissToast],
  );

  const clearToast = useCallback(() => {
    toastTimers.current.forEach((timer) => globalThis.clearTimeout(timer));
    toastTimers.current.clear();
    setToasts([]);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const currentUser = storedCurrentUser;
  const profile = currentUser;
  const users = useMemo(
    () =>
      initialUsers.map((user) =>
        user.id === CURRENT_USER_ID ? currentUser : user,
      ),
    [currentUser],
  );

  const getUserById = useCallback(
    (userId: string): User =>
      users.find((user) => user.id === userId) ?? users[0]!,
    [users],
  );

  const getUserByHandle = useCallback(
    (handle: string): User | undefined => {
      const normalizedHandle = handle.replace(/^@/, "").toLowerCase();
      return users.find(
        (user) => user.handle.toLowerCase() === normalizedHandle,
      );
    },
    [users],
  );

  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      setStoredCurrentUser((previous) => {
        const nextName =
          typeof updates.name === "string" && updates.name.trim()
            ? updates.name.trim()
            : previous.name;
        const nextHandle =
          typeof updates.handle === "string" && updates.handle.trim()
            ? updates.handle.trim().replace(/^@+/, "")
            : previous.handle;

        return {
          ...previous,
          ...updates,
          id: CURRENT_USER_ID,
          name: nextName,
          handle: nextHandle,
          initials:
            typeof updates.initials === "string" && updates.initials.trim()
              ? updates.initials.trim()
              : updates.name
                ? initialsForName(nextName)
                : previous.initials,
        };
      });
      showToast("Your profile was updated.");
    },
    [setStoredCurrentUser, showToast],
  );

  const localReplyCounts = useMemo(() => {
    const counts = new Map<string, number>();
    storedAuthoredTweets.forEach((tweet) => {
      if (!tweet.parentTweetId) return;
      counts.set(
        tweet.parentTweetId,
        (counts.get(tweet.parentTweetId) ?? 0) + 1,
      );
    });
    return counts;
  }, [storedAuthoredTweets]);

  const decorateTweet = useCallback(
    (tweet: AuthoredTweet): AuthoredTweet => ({
      ...tweet,
      replies: tweet.replies + (localReplyCounts.get(tweet.id) ?? 0),
      reposts: tweet.reposts + (repostedTweetIds.has(tweet.id) ? 1 : 0),
      likes: tweet.likes + (likedTweetIds.has(tweet.id) ? 1 : 0),
    }),
    [likedTweetIds, localReplyCounts, repostedTweetIds],
  );

  const authoredTweets = useMemo(
    () => storedAuthoredTweets.map(decorateTweet),
    [decorateTweet, storedAuthoredTweets],
  );
  const feedTweets = useMemo(
    () => [
      ...authoredTweets.filter((tweet) => !tweet.parentTweetId),
      ...initialTweets.map(decorateTweet),
    ],
    [authoredTweets, decorateTweet],
  );
  const replies = useMemo(
    () => [
      ...initialReplyTweets.map(decorateTweet),
      ...authoredTweets.filter((tweet) => Boolean(tweet.parentTweetId)),
    ],
    [authoredTweets, decorateTweet],
  );
  const allTweets = useMemo(
    () => [...feedTweets, ...replies],
    [feedTweets, replies],
  );

  const getTweetById = useCallback(
    (tweetId: string): AuthoredTweet | undefined =>
      allTweets.find((tweet) => tweet.id === tweetId),
    [allTweets],
  );

  const getRepliesForTweet = useCallback(
    (tweetId: string): AuthoredTweet[] => {
      const targetTweet = getTweetById(tweetId);
      if (!targetTweet) return [];
      const targetHandle = getUserById(targetTweet.userId).handle.toLowerCase();

      return replies.filter(
        (reply) =>
          reply.parentTweetId === tweetId ||
          (INITIAL_REPLY_IDS.has(reply.id) &&
            reply.replyingTo?.toLowerCase() === targetHandle),
      );
    },
    [getTweetById, getUserById, replies],
  );

  const openComposeModal = useCallback(() => {
    setComposeModal({ open: true, replyToTweetId: null });
  }, []);

  const openReplyModal = useCallback((tweetId: string) => {
    setComposeModal({ open: true, replyToTweetId: tweetId });
  }, []);

  const closeComposeModal = useCallback(() => {
    setComposeModal(CLOSED_COMPOSER);
  }, []);

  const setIsComposeModalOpen = useCallback((open: boolean) => {
    setComposeModal(open ? { open: true, replyToTweetId: null } : CLOSED_COMPOSER);
  }, []);

  const createTweet = useCallback(
    (
      input: string | CreateTweetInput,
      media: string[] = [],
      mediaAlt: string[] = [],
    ): AuthoredTweet | null => {
      const normalizedInput: CreateTweetInput =
        typeof input === "string"
          ? { text: input, media, mediaAlt }
          : input;
      const normalizedText = normalizedInput.text.trim();
      const normalizedMedia = (normalizedInput.media ?? []).filter(Boolean);

      if (!normalizedText && normalizedMedia.length === 0) return null;

      const now = new Date();
      const tweet: AuthoredTweet = {
        id: createClientId("tweet"),
        userId: CURRENT_USER_ID,
        text: normalizedText,
        createdAt: now.toISOString(),
        timeLabel: "now",
        replies: 0,
        reposts: 0,
        likes: 0,
        views: 0,
        media: normalizedMedia.length > 0 ? normalizedMedia : undefined,
        mediaAlt:
          normalizedMedia.length > 0
            ? normalizedInput.mediaAlt?.slice(0, normalizedMedia.length)
            : undefined,
        quotedTweetId: normalizedInput.quotedTweetId,
      };

      setStoredAuthoredTweets((previous) => [tweet, ...previous]);
      closeComposeModal();
      showToast("Your post was sent.");
      return tweet;
    },
    [closeComposeModal, setStoredAuthoredTweets, showToast],
  );

  const replyToTweet = useCallback(
    (tweetId: string, text: string): AuthoredTweet | null => {
      const normalizedText = text.trim();
      const targetTweet = getTweetById(tweetId);
      if (!normalizedText || !targetTweet) return null;

      const now = new Date();
      const reply: AuthoredTweet = {
        id: createClientId("reply"),
        userId: CURRENT_USER_ID,
        text: normalizedText,
        createdAt: now.toISOString(),
        timeLabel: "now",
        replies: 0,
        reposts: 0,
        likes: 0,
        views: 0,
        replyingTo: getUserById(targetTweet.userId).handle,
        parentTweetId: targetTweet.id,
      };

      setStoredAuthoredTweets((previous) => [reply, ...previous]);
      closeComposeModal();
      showToast("Your reply was sent.");
      return reply;
    },
    [
      closeComposeModal,
      getTweetById,
      getUserById,
      setStoredAuthoredTweets,
      showToast,
    ],
  );

  const deleteAuthoredTweet = useCallback(
    (tweetId: string) => {
      setStoredAuthoredTweets((previous) =>
        previous.filter((tweet) => tweet.id !== tweetId),
      );
      setLikedTweetIds((previous) => {
        const next = new Set(previous);
        next.delete(tweetId);
        return next;
      });
      setRepostedTweetIds((previous) => {
        const next = new Set(previous);
        next.delete(tweetId);
        return next;
      });
      setBookmarkedTweetIds((previous) => {
        const next = new Set(previous);
        next.delete(tweetId);
        return next;
      });
      showToast("Your post was deleted.");
    },
    [
      setBookmarkedTweetIds,
      setLikedTweetIds,
      setRepostedTweetIds,
      setStoredAuthoredTweets,
      showToast,
    ],
  );

  const toggleLike = useCallback(
    (tweetId: string) => {
      setLikedTweetIds((previous) => toggleSetItem(previous, tweetId));
    },
    [setLikedTweetIds],
  );

  const toggleRepost = useCallback(
    (tweetId: string) => {
      const willRepost = !repostedTweetIds.has(tweetId);
      setRepostedTweetIds((previous) => toggleSetItem(previous, tweetId));
      showToast(willRepost ? "Reposted." : "Repost removed.");
    },
    [repostedTweetIds, setRepostedTweetIds, showToast],
  );

  const toggleBookmark = useCallback(
    (tweetId: string) => {
      const willBookmark = !bookmarkedTweetIds.has(tweetId);
      setBookmarkedTweetIds((previous) => toggleSetItem(previous, tweetId));
      showToast(
        willBookmark
          ? "Post added to your Bookmarks."
          : "Post removed from your Bookmarks.",
      );
    },
    [bookmarkedTweetIds, setBookmarkedTweetIds, showToast],
  );

  const toggleFollow = useCallback(
    (userId: string) => {
      if (userId === CURRENT_USER_ID) return;
      setFollowingUserIds((previous) => toggleSetItem(previous, userId));
    },
    [setFollowingUserIds],
  );

  const isTweetLiked = useCallback(
    (tweetId: string) => likedTweetIds.has(tweetId),
    [likedTweetIds],
  );
  const isTweetReposted = useCallback(
    (tweetId: string) => repostedTweetIds.has(tweetId),
    [repostedTweetIds],
  );
  const isTweetBookmarked = useCallback(
    (tweetId: string) => bookmarkedTweetIds.has(tweetId),
    [bookmarkedTweetIds],
  );
  const isFollowing = useCallback(
    (userId: string) => followingUserIds.has(userId),
    [followingUserIds],
  );

  const startConversation = useCallback(
    (userId: string): Conversation => {
      const existingConversation = conversations.find(
        (conversation) =>
          conversation.participantIds.includes(CURRENT_USER_ID) &&
          conversation.participantIds.includes(userId),
      );
      if (existingConversation) return existingConversation;

      const conversation: Conversation = {
        id: createClientId("conversation"),
        participantIds: [CURRENT_USER_ID, userId],
        messages: [],
        unread: false,
      };
      setConversations((previous) => [conversation, ...previous]);
      return conversation;
    },
    [conversations, setConversations],
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string): Message | null => {
      const normalizedText = text.trim();
      if (
        !normalizedText ||
        !conversations.some((conversation) => conversation.id === conversationId)
      ) {
        return null;
      }

      const message: Message = {
        id: createClientId("message"),
        senderId: CURRENT_USER_ID,
        text: normalizedText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                unread: false,
                messages: [...conversation.messages, message],
              }
            : conversation,
        ),
      );
      return message;
    },
    [conversations, setConversations],
  );

  const markConversationRead = useCallback(
    (conversationId: string) => {
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, unread: false }
            : conversation,
        ),
      );
    },
    [setConversations],
  );

  const toast = toasts.at(-1) ?? null;
  const contextValue = useMemo<TwitterContextValue>(
    () => ({
      isHydrated,
      theme,
      setTheme,
      toggleTheme,
      currentUser,
      profile,
      users,
      updateProfile,
      editProfile: updateProfile,
      getUserById,
      getUserByHandle,
      authoredTweets,
      tweets: feedTweets,
      feedTweets,
      replies,
      allTweets,
      createTweet,
      postTweet: createTweet,
      replyToTweet,
      sendReply: replyToTweet,
      deleteAuthoredTweet,
      getTweetById,
      getRepliesForTweet,
      likedTweetIds,
      repostedTweetIds,
      bookmarkedTweetIds,
      followingUserIds,
      likedTweets: likedTweetIds,
      repostedTweets: repostedTweetIds,
      bookmarkedTweets: bookmarkedTweetIds,
      following: followingUserIds,
      isTweetLiked,
      isTweetReposted,
      isTweetBookmarked,
      isFollowing,
      toggleLike,
      toggleRepost,
      toggleBookmark,
      toggleFollow,
      toggleLikeTweet: toggleLike,
      toggleRepostTweet: toggleRepost,
      toggleBookmarkTweet: toggleBookmark,
      toggleFollowUser: toggleFollow,
      conversations,
      startConversation,
      sendMessage,
      markConversationRead,
      trends,
      notifications,
      composeModal,
      isComposeModalOpen: composeModal.open,
      isComposeOpen: composeModal.open,
      replyToTweetId: composeModal.replyToTweetId,
      openComposeModal,
      openReplyModal,
      closeComposeModal,
      setIsComposeModalOpen,
      setComposeOpen: setIsComposeModalOpen,
      toast,
      toasts,
      showToast,
      dismissToast,
      clearToast,
    }),
    [
      allTweets,
      authoredTweets,
      bookmarkedTweetIds,
      clearToast,
      closeComposeModal,
      composeModal,
      conversations,
      createTweet,
      currentUser,
      deleteAuthoredTweet,
      dismissToast,
      feedTweets,
      followingUserIds,
      getRepliesForTweet,
      getTweetById,
      getUserByHandle,
      getUserById,
      isFollowing,
      isHydrated,
      isTweetBookmarked,
      isTweetLiked,
      isTweetReposted,
      likedTweetIds,
      markConversationRead,
      openComposeModal,
      openReplyModal,
      profile,
      replies,
      replyToTweet,
      repostedTweetIds,
      sendMessage,
      setIsComposeModalOpen,
      setTheme,
      showToast,
      startConversation,
      theme,
      toast,
      toasts,
      toggleBookmark,
      toggleFollow,
      toggleLike,
      toggleRepost,
      toggleTheme,
      updateProfile,
      users,
    ],
  );

  return (
    <TwitterContext.Provider value={contextValue}>
      {children}
    </TwitterContext.Provider>
  );
}

export function useTwitter(): TwitterContextValue {
  const context = useContext(TwitterContext);
  if (!context) {
    throw new Error("useTwitter must be used within a TwitterProvider");
  }
  return context;
}
