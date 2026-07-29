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
  notifications as initialNotifications,
  replyTweets as initialReplyTweets,
  trends as initialTrends,
  tweets as initialTweets,
  users as initialUsers,
} from "@/data/mockData";
import { chirpApi, type ApiBootstrap } from "@/lib/api";
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

function isStoredUser(value: unknown): value is User {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.handle === "string" &&
    typeof value.initials === "string" &&
    typeof value.avatarClass === "string" &&
    typeof value.bio === "string" &&
    typeof value.followers === "number" &&
    typeof value.following === "number"
  );
}

function isStoredNotification(value: unknown): value is NotificationItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    ["like", "repost", "follow", "mention", "post"].includes(
      String(value.kind),
    ) &&
    Array.isArray(value.userIds) &&
    value.userIds.every((userId) => typeof userId === "string") &&
    typeof value.text === "string" &&
    typeof value.timestamp === "string"
  );
}

function isStoredTrend(value: unknown): value is Trend {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.eyebrow === "string" &&
    typeof value.title === "string" &&
    typeof value.posts === "string"
  );
}

function toStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : undefined;
}

function normalizeBootstrap(value: unknown): ApiBootstrap | null {
  if (!isRecord(value)) return null;

  const interactions = isRecord(value.interactions)
    ? {
        likedTweetIds: toStringArray(value.interactions.likedTweetIds),
        repostedTweetIds: toStringArray(value.interactions.repostedTweetIds),
        bookmarkedTweetIds: toStringArray(
          value.interactions.bookmarkedTweetIds,
        ),
        followingUserIds: toStringArray(value.interactions.followingUserIds),
      }
    : undefined;

  return {
    currentUser: isStoredUser(value.currentUser)
      ? value.currentUser
      : undefined,
    profile: isStoredUser(value.profile) ? value.profile : undefined,
    users: Array.isArray(value.users)
      ? value.users.filter(isStoredUser)
      : undefined,
    posts: Array.isArray(value.posts)
      ? value.posts.filter(isStoredTweet)
      : undefined,
    tweets: Array.isArray(value.tweets)
      ? value.tweets.filter(isStoredTweet)
      : undefined,
    replies: Array.isArray(value.replies)
      ? value.replies.filter(isStoredTweet)
      : undefined,
    conversations: Array.isArray(value.conversations)
      ? value.conversations.filter(isStoredConversation)
      : undefined,
    notifications: Array.isArray(value.notifications)
      ? value.notifications.filter(isStoredNotification)
      : undefined,
    trends: Array.isArray(value.trends)
      ? value.trends.filter(isStoredTrend)
      : undefined,
    likedTweetIds: toStringArray(value.likedTweetIds),
    repostedTweetIds: toStringArray(value.repostedTweetIds),
    bookmarkedTweetIds: toStringArray(value.bookmarkedTweetIds),
    followingUserIds: toStringArray(value.followingUserIds),
    interactions,
  };
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

const stringRecordCodec: StoredStateCodec<Record<string, string>> = {
  decode: (value, fallback) => {
    if (!isRecord(value)) return fallback;
    return Object.fromEntries(
      Object.entries(value).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  },
};

function usePersistedState<T>(
  storageKey: string,
  initialValue: T,
  codec?: StoredStateCodec<T>,
): [T, Dispatch<SetStateAction<T>>, boolean, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hadStoredValue, setHadStoredValue] = useState(false);
  const initialValueRef = useRef(initialValue);
  const codecRef = useRef(codec);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(storageKey);
      if (storedValue !== null) {
        const parsedValue: unknown = JSON.parse(storedValue);
        setHadStoredValue(true);
        setValue(
          codecRef.current
            ? codecRef.current.decode(parsedValue, initialValueRef.current)
            : (parsedValue as T),
        );
      }
    } catch {
      setHadStoredValue(false);
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

  return [value, setValue, isHydrated, hadStoredValue];
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

function mergeById<T extends { id: string }>(
  preferred: readonly T[],
  fallback: readonly T[],
): T[] {
  const seen = new Set<string>();
  return [...preferred, ...fallback].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function mergeConversations(
  preferred: readonly Conversation[],
  fallback: readonly Conversation[],
): Conversation[] {
  const fallbackById = new Map(
    fallback.map((conversation) => [conversation.id, conversation]),
  );
  const mergedPreferred = preferred.map((conversation) => {
    const fallbackConversation = fallbackById.get(conversation.id);
    if (!fallbackConversation) return conversation;
    return {
      ...fallbackConversation,
      ...conversation,
      messages: mergeById(
        conversation.messages,
        fallbackConversation.messages,
      ),
    };
  });

  return mergeById(mergedPreferred, fallback);
}

function inverseAliases(
  aliases: Readonly<Record<string, string>>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(aliases).map(([localId, remoteId]) => [remoteId, localId]),
  );
}

function localizeTweetIds(
  tweet: AuthoredTweet,
  inversePostIds: Readonly<Record<string, string>>,
): AuthoredTweet {
  return {
    ...tweet,
    id: inversePostIds[tweet.id] ?? tweet.id,
    parentTweetId: tweet.parentTweetId
      ? (inversePostIds[tweet.parentTweetId] ?? tweet.parentTweetId)
      : undefined,
    quotedTweetId: tweet.quotedTweetId
      ? (inversePostIds[tweet.quotedTweetId] ?? tweet.quotedTweetId)
      : undefined,
  };
}

function localizeConversationIds(
  conversation: Conversation,
  inverseConversationIds: Readonly<Record<string, string>>,
  inverseMessageIds: Readonly<Record<string, string>>,
): Conversation {
  return {
    ...conversation,
    id:
      inverseConversationIds[conversation.id] ??
      conversation.id,
    messages: conversation.messages.map((message) => ({
      ...message,
      id: inverseMessageIds[message.id] ?? message.id,
    })),
  };
}

function syncInBackground(task: Promise<unknown>): void {
  void task.catch(() => {
    // Network failures deliberately preserve the already-applied local update.
  });
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
  const [
    storedCurrentUser,
    setStoredCurrentUser,
    profileHydrated,
    profileWasStored,
  ] =
    usePersistedState<User>(
      `${STORAGE_PREFIX}:profile`,
      INITIAL_CURRENT_USER,
      currentUserCodec,
    );
  const [
    storedAuthoredTweets,
    setStoredAuthoredTweets,
    authoredTweetsHydrated,
  ] = usePersistedState<AuthoredTweet[]>(
      `${STORAGE_PREFIX}:authored-tweets`,
      [],
      authoredTweetsCodec,
    );
  const [
    likedTweetIds,
    setLikedTweetIds,
    likesHydrated,
    likesWereStored,
  ] =
    usePersistedState<Set<string>>(
      `${STORAGE_PREFIX}:liked-tweets`,
      new Set<string>(),
      stringSetCodec,
    );
  const [
    repostedTweetIds,
    setRepostedTweetIds,
    repostsHydrated,
    repostsWereStored,
  ] =
    usePersistedState<Set<string>>(
      `${STORAGE_PREFIX}:reposted-tweets`,
      new Set<string>(),
      stringSetCodec,
    );
  const [
    bookmarkedTweetIds,
    setBookmarkedTweetIds,
    bookmarksHydrated,
    bookmarksWereStored,
  ] =
    usePersistedState<Set<string>>(
      `${STORAGE_PREFIX}:bookmarked-tweets`,
      new Set<string>(),
      stringSetCodec,
    );
  const [
    followingUserIds,
    setFollowingUserIds,
    followsHydrated,
    followsWereStored,
  ] =
    usePersistedState<Set<string>>(
      `${STORAGE_PREFIX}:following-users`,
      new Set<string>(),
      stringSetCodec,
    );
  const [
    conversations,
    setConversations,
    conversationsHydrated,
    conversationsWereStored,
  ] = usePersistedState<Conversation[]>(
      `${STORAGE_PREFIX}:conversations`,
      initialConversations,
      conversationsCodec,
    );
  const [postIdAliases, setPostIdAliases, postIdAliasesHydrated] =
    usePersistedState<Record<string, string>>(
      `${STORAGE_PREFIX}:remote-post-ids`,
      {},
      stringRecordCodec,
    );
  const [
    conversationIdAliases,
    setConversationIdAliases,
    conversationIdAliasesHydrated,
  ] = usePersistedState<Record<string, string>>(
    `${STORAGE_PREFIX}:remote-conversation-ids`,
    {},
    stringRecordCodec,
  );
  const [messageIdAliases, setMessageIdAliases, messageIdAliasesHydrated] =
    usePersistedState<Record<string, string>>(
      `${STORAGE_PREFIX}:remote-message-ids`,
      {},
      stringRecordCodec,
    );
  const [remoteBootstrap, setRemoteBootstrap] =
    useState<ApiBootstrap | null>(null);
  const postIdAliasesRef = useRef(postIdAliases);
  const conversationIdAliasesRef = useRef(conversationIdAliases);
  const messageIdAliasesRef = useRef(messageIdAliases);
  const pendingPostCreates = useRef(new Map<string, Promise<string>>());
  const pendingConversationCreates = useRef(
    new Map<string, Promise<string>>(),
  );
  const dirtyState = useRef({
    profile: false,
    likes: false,
    reposts: false,
    bookmarks: false,
    follows: false,
    conversations: false,
  });

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
    conversationsHydrated &&
    postIdAliasesHydrated &&
    conversationIdAliasesHydrated &&
    messageIdAliasesHydrated;

  useEffect(() => {
    if (!themeHydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme, themeHydrated]);

  useEffect(() => {
    postIdAliasesRef.current = postIdAliases;
  }, [postIdAliases]);

  useEffect(() => {
    conversationIdAliasesRef.current = conversationIdAliases;
  }, [conversationIdAliases]);

  useEffect(() => {
    messageIdAliasesRef.current = messageIdAliases;
  }, [messageIdAliases]);

  useEffect(() => {
    if (!isHydrated) return;

    let isActive = true;
    syncInBackground(
      chirpApi.bootstrap().then((response) => {
        if (!isActive) return;
        const bootstrap = normalizeBootstrap(response);
        if (!bootstrap) return;

        setRemoteBootstrap(bootstrap);
        const inversePostIds = inverseAliases(postIdAliasesRef.current);
        const inverseConversationIds = inverseAliases(
          conversationIdAliasesRef.current,
        );
        const inverseMessageIds = inverseAliases(messageIdAliasesRef.current);

        const remoteProfile = bootstrap.currentUser ?? bootstrap.profile;
        if (
          !profileWasStored &&
          !dirtyState.current.profile &&
          remoteProfile
        ) {
          setStoredCurrentUser({
            ...remoteProfile,
            id: CURRENT_USER_ID,
          });
        }

        const remoteLikedTweetIds =
          bootstrap.likedTweetIds ?? bootstrap.interactions?.likedTweetIds;
        if (
          !likesWereStored &&
          !dirtyState.current.likes &&
          remoteLikedTweetIds
        ) {
          setLikedTweetIds(
            new Set(
              remoteLikedTweetIds.map(
                (tweetId) => inversePostIds[tweetId] ?? tweetId,
              ),
            ),
          );
        }

        const remoteRepostedTweetIds =
          bootstrap.repostedTweetIds ??
          bootstrap.interactions?.repostedTweetIds;
        if (
          !repostsWereStored &&
          !dirtyState.current.reposts &&
          remoteRepostedTweetIds
        ) {
          setRepostedTweetIds(
            new Set(
              remoteRepostedTweetIds.map(
                (tweetId) => inversePostIds[tweetId] ?? tweetId,
              ),
            ),
          );
        }

        const remoteBookmarkedTweetIds =
          bootstrap.bookmarkedTweetIds ??
          bootstrap.interactions?.bookmarkedTweetIds;
        if (
          !bookmarksWereStored &&
          !dirtyState.current.bookmarks &&
          remoteBookmarkedTweetIds
        ) {
          setBookmarkedTweetIds(
            new Set(
              remoteBookmarkedTweetIds.map(
                (tweetId) => inversePostIds[tweetId] ?? tweetId,
              ),
            ),
          );
        }

        const remoteFollowingUserIds =
          bootstrap.followingUserIds ??
          bootstrap.interactions?.followingUserIds;
        if (
          !followsWereStored &&
          !dirtyState.current.follows &&
          remoteFollowingUserIds
        ) {
          setFollowingUserIds(new Set(remoteFollowingUserIds));
        }

        if (bootstrap.conversations) {
          const localizedConversations = bootstrap.conversations.map(
            (conversation) =>
              localizeConversationIds(
                conversation,
                inverseConversationIds,
                inverseMessageIds,
              ),
          );
          setConversations((previous) =>
            conversationsWereStored || dirtyState.current.conversations
              ? mergeConversations(previous, localizedConversations)
              : mergeConversations(localizedConversations, previous),
          );
        }
      }),
    );

    return () => {
      isActive = false;
    };
  }, [
    bookmarksWereStored,
    conversationsWereStored,
    followsWereStored,
    isHydrated,
    likesWereStored,
    profileWasStored,
    repostsWereStored,
    setBookmarkedTweetIds,
    setConversations,
    setFollowingUserIds,
    setLikedTweetIds,
    setRepostedTweetIds,
    setStoredCurrentUser,
  ]);

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
    () => {
      const remoteAndFallbackUsers = mergeById(
        remoteBootstrap?.users ?? [],
        initialUsers,
      );
      return mergeById([currentUser], remoteAndFallbackUsers);
    },
    [currentUser, remoteBootstrap?.users],
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

  const resolvePostApiId = useCallback(async (tweetId: string) => {
    const pendingCreate = pendingPostCreates.current.get(tweetId);
    if (pendingCreate) return pendingCreate;
    return postIdAliasesRef.current[tweetId] ?? tweetId;
  }, []);

  const resolveConversationApiId = useCallback(
    async (conversationId: string) => {
      const pendingCreate =
        pendingConversationCreates.current.get(conversationId);
      if (pendingCreate) return pendingCreate;
      return (
        conversationIdAliasesRef.current[conversationId] ?? conversationId
      );
    },
    [],
  );

  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      dirtyState.current.profile = true;
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
      syncInBackground(chirpApi.updateProfile(updates));
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
  const inversePostIdMap = useMemo(
    () => inverseAliases(postIdAliases),
    [postIdAliases],
  );
  const remotePosts = useMemo(
    () =>
      (remoteBootstrap?.posts ?? remoteBootstrap?.tweets ?? [])
        .map((tweet) => localizeTweetIds(tweet, inversePostIdMap))
        .filter((tweet) => !tweet.parentTweetId),
    [
      inversePostIdMap,
      remoteBootstrap?.posts,
      remoteBootstrap?.tweets,
    ],
  );
  const remoteReplies = useMemo(
    () =>
      (remoteBootstrap?.replies ?? []).map((tweet) =>
        localizeTweetIds(tweet, inversePostIdMap),
      ),
    [inversePostIdMap, remoteBootstrap?.replies],
  );
  const feedTweets = useMemo(
    () =>
      mergeById(
        authoredTweets.filter((tweet) => !tweet.parentTweetId),
        mergeById(remotePosts, initialTweets).map(decorateTweet),
      ),
    [authoredTweets, decorateTweet, remotePosts],
  );
  const replies = useMemo(
    () => [
      ...mergeById(remoteReplies, initialReplyTweets).map(decorateTweet),
      ...authoredTweets.filter((tweet) => Boolean(tweet.parentTweetId)),
    ],
    [authoredTweets, decorateTweet, remoteReplies],
  );
  const allTweets = useMemo(
    () => [...feedTweets, ...replies],
    [feedTweets, replies],
  );
  const availableTrends = useMemo(
    () => mergeById(remoteBootstrap?.trends ?? [], initialTrends),
    [remoteBootstrap?.trends],
  );
  const availableNotifications = useMemo(
    () =>
      mergeById(
        (remoteBootstrap?.notifications ?? []).map((notification) => ({
          ...notification,
          tweetId: notification.tweetId
            ? (inversePostIdMap[notification.tweetId] ??
              notification.tweetId)
            : undefined,
        })),
        initialNotifications,
      ),
    [inversePostIdMap, remoteBootstrap?.notifications],
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
      const persistableMediaIndexes = (tweet.media ?? [])
        .map((mediaUrl, index) => ({ mediaUrl, index }))
        .filter(({ mediaUrl }) => !mediaUrl.startsWith("blob:"));
      const createRequest = (async (): Promise<string> => {
        try {
          const remoteTweet = await chirpApi.createPost({
            text: normalizedText,
            clientId: tweet.id,
            media:
              persistableMediaIndexes.length > 0
                ? persistableMediaIndexes.map(({ mediaUrl }) => mediaUrl)
                : undefined,
            mediaAlt:
              persistableMediaIndexes.length > 0 && tweet.mediaAlt
                ? persistableMediaIndexes.map(
                    ({ index }) => tweet.mediaAlt?.[index] ?? "",
                  )
                : undefined,
            quotedTweetId: normalizedInput.quotedTweetId
              ? await resolvePostApiId(normalizedInput.quotedTweetId)
              : undefined,
          });
          if (!remoteTweet) return tweet.id;
          if (remoteTweet.id !== tweet.id) {
            setPostIdAliases((previous) => {
              const next = {
                ...previous,
                [tweet.id]: remoteTweet.id,
              };
              postIdAliasesRef.current = next;
              return next;
            });
          }
          setStoredAuthoredTweets((previous) =>
            previous.map((candidate) =>
              candidate.id === tweet.id
                ? { ...candidate, ...remoteTweet, id: tweet.id }
                : candidate,
            ),
          );
          return remoteTweet.id;
        } catch {
          return tweet.id;
        } finally {
          pendingPostCreates.current.delete(tweet.id);
        }
      })();
      pendingPostCreates.current.set(tweet.id, createRequest);
      closeComposeModal();
      showToast("Your post was sent.");
      return tweet;
    },
    [
      closeComposeModal,
      resolvePostApiId,
      setPostIdAliases,
      setStoredAuthoredTweets,
      showToast,
    ],
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
      const createRequest = (async (): Promise<string> => {
        try {
          const targetApiId = await resolvePostApiId(tweetId);
          const remoteReply = await chirpApi.createReply(targetApiId, {
            text: normalizedText,
            clientId: reply.id,
          });
          if (!remoteReply) return reply.id;
          if (remoteReply.id !== reply.id) {
            setPostIdAliases((previous) => {
              const next = {
                ...previous,
                [reply.id]: remoteReply.id,
              };
              postIdAliasesRef.current = next;
              return next;
            });
          }
          setStoredAuthoredTweets((previous) =>
            previous.map((candidate) =>
              candidate.id === reply.id
                ? {
                    ...candidate,
                    ...remoteReply,
                    id: reply.id,
                    parentTweetId: reply.parentTweetId,
                  }
                : candidate,
            ),
          );
          return remoteReply.id;
        } catch {
          return reply.id;
        } finally {
          pendingPostCreates.current.delete(reply.id);
        }
      })();
      pendingPostCreates.current.set(reply.id, createRequest);
      closeComposeModal();
      showToast("Your reply was sent.");
      return reply;
    },
    [
      closeComposeModal,
      getTweetById,
      getUserById,
      resolvePostApiId,
      setPostIdAliases,
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
      syncInBackground(
        resolvePostApiId(tweetId).then((apiPostId) =>
          chirpApi.deletePost(apiPostId),
        ),
      );
      showToast("Your post was deleted.");
    },
    [
      resolvePostApiId,
      setBookmarkedTweetIds,
      setLikedTweetIds,
      setRepostedTweetIds,
      setStoredAuthoredTweets,
      showToast,
    ],
  );

  const toggleLike = useCallback(
    (tweetId: string) => {
      dirtyState.current.likes = true;
      const willLike = !likedTweetIds.has(tweetId);
      setLikedTweetIds((previous) => toggleSetItem(previous, tweetId));
      syncInBackground(
        resolvePostApiId(tweetId).then((apiPostId) =>
          chirpApi.setLike(apiPostId, willLike),
        ),
      );
    },
    [likedTweetIds, resolvePostApiId, setLikedTweetIds],
  );

  const toggleRepost = useCallback(
    (tweetId: string) => {
      dirtyState.current.reposts = true;
      const willRepost = !repostedTweetIds.has(tweetId);
      setRepostedTweetIds((previous) => toggleSetItem(previous, tweetId));
      syncInBackground(
        resolvePostApiId(tweetId).then((apiPostId) =>
          chirpApi.setRepost(apiPostId, willRepost),
        ),
      );
      showToast(willRepost ? "Reposted." : "Repost removed.");
    },
    [
      repostedTweetIds,
      resolvePostApiId,
      setRepostedTweetIds,
      showToast,
    ],
  );

  const toggleBookmark = useCallback(
    (tweetId: string) => {
      dirtyState.current.bookmarks = true;
      const willBookmark = !bookmarkedTweetIds.has(tweetId);
      setBookmarkedTweetIds((previous) => toggleSetItem(previous, tweetId));
      syncInBackground(
        resolvePostApiId(tweetId).then((apiPostId) =>
          chirpApi.setBookmark(apiPostId, willBookmark),
        ),
      );
      showToast(
        willBookmark
          ? "Post added to your Bookmarks."
          : "Post removed from your Bookmarks.",
      );
    },
    [
      bookmarkedTweetIds,
      resolvePostApiId,
      setBookmarkedTweetIds,
      showToast,
    ],
  );

  const toggleFollow = useCallback(
    (userId: string) => {
      if (userId === CURRENT_USER_ID) return;
      dirtyState.current.follows = true;
      const willFollow = !followingUserIds.has(userId);
      setFollowingUserIds((previous) => toggleSetItem(previous, userId));
      syncInBackground(chirpApi.setFollow(userId, willFollow));
    },
    [followingUserIds, setFollowingUserIds],
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
      dirtyState.current.conversations = true;
      setConversations((previous) => [conversation, ...previous]);
      const createRequest = (async (): Promise<string> => {
        try {
          const remoteConversation =
            await chirpApi.createConversation(userId);
          if (!remoteConversation) return conversation.id;
          if (remoteConversation.id !== conversation.id) {
            setConversationIdAliases((previous) => {
              const next = {
                ...previous,
                [conversation.id]: remoteConversation.id,
              };
              conversationIdAliasesRef.current = next;
              return next;
            });
          }
          setConversations((previous) =>
            previous.map((candidate) =>
              candidate.id === conversation.id
                ? {
                    ...remoteConversation,
                    ...candidate,
                    id: conversation.id,
                    messages: mergeById(
                      candidate.messages,
                      remoteConversation.messages,
                    ),
                  }
                : candidate,
            ),
          );
          return remoteConversation.id;
        } catch {
          return conversation.id;
        } finally {
          pendingConversationCreates.current.delete(conversation.id);
        }
      })();
      pendingConversationCreates.current.set(conversation.id, createRequest);
      return conversation;
    },
    [conversations, setConversationIdAliases, setConversations],
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

      dirtyState.current.conversations = true;
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
      syncInBackground(
        resolveConversationApiId(conversationId).then(
          async (apiConversationId) => {
            const remoteMessage = await chirpApi.sendMessage(
              apiConversationId,
              normalizedText,
            );
            if (!remoteMessage) return;
            if (remoteMessage.id !== message.id) {
              setMessageIdAliases((previous) => {
                const next = {
                  ...previous,
                  [message.id]: remoteMessage.id,
                };
                messageIdAliasesRef.current = next;
                return next;
              });
            }
            setConversations((previous) =>
              previous.map((conversation) =>
                conversation.id === conversationId
                  ? {
                      ...conversation,
                      messages: conversation.messages.map((candidate) =>
                        candidate.id === message.id
                          ? {
                              ...candidate,
                              ...remoteMessage,
                              id: message.id,
                            }
                          : candidate,
                      ),
                    }
                : conversation,
              ),
            );
          },
        ),
      );
      return message;
    },
    [
      conversations,
      resolveConversationApiId,
      setConversations,
      setMessageIdAliases,
    ],
  );

  const markConversationRead = useCallback(
    (conversationId: string) => {
      dirtyState.current.conversations = true;
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, unread: false }
          : conversation,
        ),
      );
      syncInBackground(
        resolveConversationApiId(conversationId).then((apiConversationId) =>
          chirpApi.markConversationRead(apiConversationId),
        ),
      );
    },
    [resolveConversationApiId, setConversations],
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
      trends: availableTrends,
      notifications: availableNotifications,
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
      availableNotifications,
      availableTrends,
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
