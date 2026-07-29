import {
  CURRENT_USER_ID,
  conversations as seedConversations,
  notifications as seedNotifications,
  replyTweets as seedReplyTweets,
  trends as seedTrends,
  tweets as seedTweets,
  users as seedUsers,
} from "@/data/mockData";
import { badRequest, conflict, forbidden, notFound } from "@/server/errors";
import type {
  Conversation,
  Message,
  NotificationItem,
  Trend,
  Tweet,
  User,
} from "@/types";

export type StorageMode = "memory";

export interface PostRecord extends Tweet {
  parentTweetId?: string;
}

export interface PostViewerState {
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
}

export interface PostView extends PostRecord {
  viewer: PostViewerState;
}

export interface CreatePostInput {
  text: string;
  media?: string[];
  mediaAlt?: string[];
  quotedTweetId?: string;
  clientId?: string;
}

export interface UpdateProfileInput {
  name?: string;
  handle?: string;
  bio?: string;
  location?: string;
  website?: string;
  initials?: string;
  avatarClass?: string;
}

export interface InteractionState {
  likedTweetIds: string[];
  repostedTweetIds: string[];
  bookmarkedTweetIds: string[];
  followingUserIds: string[];
}

export interface BootstrapData extends InteractionState {
  storageMode: StorageMode;
  currentUser: User;
  profile: User;
  users: User[];
  posts: PostView[];
  tweets: PostView[];
  replies: PostView[];
  conversations: Conversation[];
  notifications: NotificationItem[];
  trends: Trend[];
  interactions: InteractionState;
}

export interface PostPage {
  items: PostView[];
  nextCursor?: string;
}

export interface SearchResults {
  query: string;
  users: User[];
  posts: PostView[];
  trends: Trend[];
}

export interface ChirpRepository {
  readonly storageMode: StorageMode;
  findUser(userId: string): User | undefined;
  findUserByHandle(handle: string): User | undefined;
  getUser(userId: string): User;
  bootstrap(viewerId: string): BootstrapData;
  listPosts(
    viewerId: string,
    options?: {
      authorId?: string;
      includeReplies?: boolean;
      limit?: number;
      cursor?: string;
    },
  ): PostPage;
  getPost(viewerId: string, postId: string): PostView;
  listReplies(viewerId: string, postId: string): PostView[];
  createPost(actorId: string, input: CreatePostInput): PostView;
  createReply(
    actorId: string,
    postId: string,
    text: string,
    clientId?: string,
  ): PostView;
  deletePost(actorId: string, postId: string): void;
  setLike(actorId: string, postId: string, active: boolean): PostView;
  setRepost(actorId: string, postId: string, active: boolean): PostView;
  setBookmark(actorId: string, postId: string, active: boolean): PostView;
  setFollow(actorId: string, userId: string, active: boolean): User;
  updateProfile(actorId: string, updates: UpdateProfileInput): User;
  listNotifications(
    actorId: string,
    filter?: "all" | "verified" | "mentions",
  ): NotificationItem[];
  search(actorId: string, query: string, limit?: number): SearchResults;
  listConversations(actorId: string): Conversation[];
  getConversation(actorId: string, conversationId: string): Conversation;
  createConversation(
    actorId: string,
    participantIds: string[],
    clientId?: string,
  ): Conversation;
  sendMessage(
    actorId: string,
    conversationId: string,
    text: string,
    clientId?: string,
  ): Message;
  markConversationRead(actorId: string, conversationId: string): Conversation;
}

interface StoredNotification extends NotificationItem {
  recipientId: string;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function clientId(prefix: string): string {
  const suffix =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}

function interactionSet(
  map: Map<string, Set<string>>,
  actorId: string,
): Set<string> {
  const existing = map.get(actorId);
  if (existing) return existing;
  const created = new Set<string>();
  map.set(actorId, created);
  return created;
}

function updateSet(set: Set<string>, value: string, active: boolean): boolean {
  const wasActive = set.has(value);
  if (active) set.add(value);
  else set.delete(value);
  return wasActive !== active;
}

function inferSeedReplyParent(reply: Tweet): string | undefined {
  const replyingTo = reply.replyingTo?.toLowerCase();
  if (!replyingTo) return undefined;
  const targetUser = seedUsers.find(
    (user) => user.handle.toLowerCase() === replyingTo,
  );
  return seedTweets.find((tweet) => tweet.userId === targetUser?.id)?.id;
}

function isSupportedMediaReference(value: string): boolean {
  return /^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value);
}

function normalizeHandle(handle: string): string {
  return handle.trim().replace(/^@+/, "");
}

function validateClientPostId(clientId: string): string {
  const normalized = clientId.trim();
  if (
    normalized.length > 128 ||
    !/^(?:post|tweet|reply)[-_][A-Za-z0-9-]{1,110}$/.test(normalized)
  ) {
    throw badRequest(
      "INVALID_CLIENT_ID",
      "Client IDs must use a post-, tweet-, or reply- prefix and contain at most 128 safe characters.",
      { field: "clientId" },
    );
  }
  return normalized;
}

function validateClientEntityId(
  clientId: string,
  prefix: "conversation" | "message",
): string {
  const normalized = clientId.trim();
  const pattern =
    prefix === "conversation"
      ? /^conversation-[A-Za-z0-9-]{1,110}$/
      : /^message-[A-Za-z0-9-]{1,115}$/;
  if (normalized.length > 128 || !pattern.test(normalized)) {
    throw badRequest(
      "INVALID_CLIENT_ID",
      `Client IDs for ${prefix}s must use the '${prefix}-' prefix and contain at most 128 safe characters.`,
      { field: "clientId" },
    );
  }
  return normalized;
}

function initialsForName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export class MemoryRepository implements ChirpRepository {
  readonly storageMode = "memory" as const;

  private readonly users = new Map<string, User>();
  private readonly posts = new Map<string, PostRecord>();
  private readonly postOrder: string[] = [];
  private readonly likedByUser = new Map<string, Set<string>>();
  private readonly repostedByUser = new Map<string, Set<string>>();
  private readonly bookmarkedByUser = new Map<string, Set<string>>();
  private readonly followingByUser = new Map<string, Set<string>>();
  private readonly conversations = new Map<string, Conversation>();
  private readonly notifications: StoredNotification[] = [];

  constructor() {
    seedUsers.forEach((user) => this.users.set(user.id, clone(user)));

    seedTweets.forEach((post) => {
      this.posts.set(post.id, clone(post));
      this.postOrder.push(post.id);
    });
    seedReplyTweets.forEach((reply) => {
      const storedReply: PostRecord = {
        ...clone(reply),
        parentTweetId: inferSeedReplyParent(reply),
      };
      this.posts.set(storedReply.id, storedReply);
      this.postOrder.push(storedReply.id);
    });

    seedConversations.forEach((conversation) =>
      this.conversations.set(conversation.id, clone(conversation)),
    );
    seedNotifications.forEach((notification) =>
      this.notifications.push({
        ...clone(notification),
        recipientId: CURRENT_USER_ID,
      }),
    );
  }

  findUser(userId: string): User | undefined {
    const user = this.users.get(userId);
    return user ? clone(user) : undefined;
  }

  findUserByHandle(handle: string): User | undefined {
    const normalized = normalizeHandle(handle).toLowerCase();
    const user = Array.from(this.users.values()).find(
      (candidate) => candidate.handle.toLowerCase() === normalized,
    );
    return user ? clone(user) : undefined;
  }

  getUser(userId: string): User {
    return clone(this.requireUser(userId));
  }

  bootstrap(viewerId: string): BootstrapData {
    const currentUser = this.getUser(viewerId);
    const posts = this.listPosts(viewerId, { includeReplies: false }).items;
    const replies = this.postOrder
      .map((postId) => this.posts.get(postId))
      .filter((post): post is PostRecord => Boolean(post?.parentTweetId))
      .map((post) => this.postView(post, viewerId));
    const interactions = this.interactionsFor(viewerId);

    return {
      storageMode: this.storageMode,
      currentUser,
      profile: clone(currentUser),
      users: Array.from(this.users.values()).map(clone),
      posts,
      tweets: clone(posts),
      replies,
      conversations: this.listConversations(viewerId),
      notifications: this.listNotifications(viewerId),
      trends: clone(seedTrends),
      ...interactions,
      interactions: clone(interactions),
    };
  }

  listPosts(
    viewerId: string,
    options: {
      authorId?: string;
      includeReplies?: boolean;
      limit?: number;
      cursor?: string;
    } = {},
  ): PostPage {
    this.requireUser(viewerId);
    if (options.authorId) this.requireUser(options.authorId);

    const limit = Math.max(1, Math.min(options.limit ?? 50, 100));
    const filteredIds = this.postOrder.filter((postId) => {
      const post = this.posts.get(postId);
      if (!post) return false;
      if (!options.includeReplies && post.parentTweetId) return false;
      return !options.authorId || post.userId === options.authorId;
    });
    const cursorIndex = options.cursor
      ? filteredIds.indexOf(options.cursor)
      : -1;
    const start = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const pageIds = filteredIds.slice(start, start + limit);
    const items = pageIds.map((postId) =>
      this.postView(this.requirePost(postId), viewerId),
    );
    const nextCursor =
      start + limit < filteredIds.length ? pageIds.at(-1) : undefined;
    return { items, ...(nextCursor ? { nextCursor } : {}) };
  }

  getPost(viewerId: string, postId: string): PostView {
    this.requireUser(viewerId);
    return this.postView(this.requirePost(postId), viewerId);
  }

  listReplies(viewerId: string, postId: string): PostView[] {
    this.requireUser(viewerId);
    this.requirePost(postId);
    return this.postOrder
      .map((candidateId) => this.posts.get(candidateId))
      .filter(
        (candidate): candidate is PostRecord =>
          candidate?.parentTweetId === postId,
      )
      .map((reply) => this.postView(reply, viewerId));
  }

  createPost(actorId: string, input: CreatePostInput): PostView {
    this.requireUser(actorId);
    const text = input.text.trim();
    const media = (input.media ?? []).map((item) => item.trim()).filter(Boolean);
    if (!text && media.length === 0) {
      throw badRequest(
        "EMPTY_POST",
        "A post must contain text or supported media.",
      );
    }
    if (text.length > 280) {
      throw badRequest("POST_TOO_LONG", "Posts are limited to 280 characters.", {
        maxLength: 280,
      });
    }
    if (media.length > 4) {
      throw badRequest("TOO_MANY_MEDIA_ITEMS", "A post can include up to 4 media items.");
    }
    const unsupportedMedia = media.find(
      (item) => !isSupportedMediaReference(item),
    );
    if (unsupportedMedia) {
      throw badRequest(
        "UNSUPPORTED_MEDIA_REFERENCE",
        "Media must use an http(s) URL or a root-relative application URL. blob: URLs are session-only and cannot be stored by this demo API.",
        { media: unsupportedMedia },
      );
    }
    if (input.quotedTweetId) this.requirePost(input.quotedTweetId);
    const requestedId = input.clientId
      ? validateClientPostId(input.clientId)
      : undefined;
    if (requestedId) {
      const existing = this.posts.get(requestedId);
      if (existing) {
        if (existing.userId !== actorId) {
          throw conflict(
            "CLIENT_ID_CONFLICT",
            "That client-generated post ID belongs to another user.",
          );
        }
        return this.postView(existing, actorId);
      }
    }

    const now = new Date();
    const post: PostRecord = {
      id: requestedId ?? clientId("post"),
      userId: actorId,
      text,
      createdAt: now.toISOString(),
      timeLabel: "now",
      replies: 0,
      reposts: 0,
      likes: 0,
      views: 0,
      ...(media.length ? { media } : {}),
      ...(input.mediaAlt?.length
        ? { mediaAlt: input.mediaAlt.slice(0, media.length) }
        : {}),
      ...(input.quotedTweetId
        ? { quotedTweetId: input.quotedTweetId }
        : {}),
    };
    this.posts.set(post.id, post);
    this.postOrder.unshift(post.id);
    return this.postView(post, actorId);
  }

  createReply(
    actorId: string,
    postId: string,
    text: string,
    clientGeneratedId?: string,
  ): PostView {
    this.requireUser(actorId);
    const parent = this.requirePost(postId);
    const normalizedText = text.trim();
    if (!normalizedText) {
      throw badRequest("EMPTY_REPLY", "A reply cannot be empty.");
    }
    if (normalizedText.length > 280) {
      throw badRequest("REPLY_TOO_LONG", "Replies are limited to 280 characters.", {
        maxLength: 280,
      });
    }
    const requestedId = clientGeneratedId
      ? validateClientPostId(clientGeneratedId)
      : undefined;
    if (requestedId) {
      const existing = this.posts.get(requestedId);
      if (existing) {
        if (existing.userId !== actorId) {
          throw conflict(
            "CLIENT_ID_CONFLICT",
            "That client-generated reply ID belongs to another user.",
          );
        }
        return this.postView(existing, actorId);
      }
    }

    const targetUser = this.requireUser(parent.userId);
    const now = new Date();
    const reply: PostRecord = {
      id: requestedId ?? clientId("reply"),
      userId: actorId,
      text: normalizedText,
      createdAt: now.toISOString(),
      timeLabel: "now",
      replies: 0,
      reposts: 0,
      likes: 0,
      views: 0,
      replyingTo: targetUser.handle,
      parentTweetId: parent.id,
    };
    this.posts.set(reply.id, reply);
    const parentIndex = this.postOrder.indexOf(parent.id);
    this.postOrder.splice(Math.max(parentIndex + 1, 0), 0, reply.id);
    parent.replies += 1;
    this.addNotification(parent.userId, actorId, {
      kind: "mention",
      text: `@${this.requireUser(actorId).handle} replied to your post`,
      tweetId: parent.id,
    });
    return this.postView(reply, actorId);
  }

  deletePost(actorId: string, postId: string): void {
    this.requireUser(actorId);
    const post = this.requirePost(postId);
    if (post.userId !== actorId) {
      throw forbidden("Only the post owner can delete this post.");
    }

    if (post.parentTweetId) {
      const parent = this.posts.get(post.parentTweetId);
      if (parent) parent.replies = Math.max(0, parent.replies - 1);
    }
    const deletedIds = new Set<string>([postId]);
    this.posts.forEach((candidate) => {
      if (candidate.parentTweetId === postId) deletedIds.add(candidate.id);
    });
    deletedIds.forEach((deletedId) => this.posts.delete(deletedId));
    for (let index = this.postOrder.length - 1; index >= 0; index -= 1) {
      if (deletedIds.has(this.postOrder[index]!)) this.postOrder.splice(index, 1);
    }
    [
      this.likedByUser,
      this.repostedByUser,
      this.bookmarkedByUser,
    ].forEach((map) =>
      map.forEach((set) => deletedIds.forEach((deletedId) => set.delete(deletedId))),
    );
    for (let index = this.notifications.length - 1; index >= 0; index -= 1) {
      const tweetId = this.notifications[index]?.tweetId;
      if (tweetId && deletedIds.has(tweetId)) this.notifications.splice(index, 1);
    }
  }

  setLike(actorId: string, postId: string, active: boolean): PostView {
    this.requireUser(actorId);
    const post = this.requirePost(postId);
    const changed = updateSet(
      interactionSet(this.likedByUser, actorId),
      postId,
      active,
    );
    if (changed) post.likes = Math.max(0, post.likes + (active ? 1 : -1));
    if (changed && active) {
      this.addNotification(post.userId, actorId, {
        kind: "like",
        text: "liked your post",
        tweetId: post.id,
      });
    }
    return this.postView(post, actorId);
  }

  setRepost(actorId: string, postId: string, active: boolean): PostView {
    this.requireUser(actorId);
    const post = this.requirePost(postId);
    const changed = updateSet(
      interactionSet(this.repostedByUser, actorId),
      postId,
      active,
    );
    if (changed) post.reposts = Math.max(0, post.reposts + (active ? 1 : -1));
    if (changed && active) {
      this.addNotification(post.userId, actorId, {
        kind: "repost",
        text: "reposted your post",
        tweetId: post.id,
      });
    }
    return this.postView(post, actorId);
  }

  setBookmark(actorId: string, postId: string, active: boolean): PostView {
    this.requireUser(actorId);
    const post = this.requirePost(postId);
    updateSet(
      interactionSet(this.bookmarkedByUser, actorId),
      postId,
      active,
    );
    return this.postView(post, actorId);
  }

  setFollow(actorId: string, userId: string, active: boolean): User {
    const actor = this.requireUser(actorId);
    const target = this.requireUser(userId);
    if (actorId === userId) {
      throw badRequest("SELF_FOLLOW", "You cannot follow your own account.");
    }
    const changed = updateSet(
      interactionSet(this.followingByUser, actorId),
      userId,
      active,
    );
    if (changed) {
      actor.following = Math.max(0, actor.following + (active ? 1 : -1));
      target.followers = Math.max(0, target.followers + (active ? 1 : -1));
    }
    if (changed && active) {
      this.addNotification(userId, actorId, {
        kind: "follow",
        text: "followed you",
      });
    }
    return clone(target);
  }

  updateProfile(actorId: string, updates: UpdateProfileInput): User {
    const user = this.requireUser(actorId);
    if (updates.handle !== undefined) {
      const handle = normalizeHandle(updates.handle);
      if (!/^[A-Za-z0-9_]{1,30}$/.test(handle)) {
        throw badRequest(
          "INVALID_HANDLE",
          "Handles must contain 1-30 letters, numbers, or underscores.",
        );
      }
      const conflictUser = Array.from(this.users.values()).find(
        (candidate) =>
          candidate.id !== actorId &&
          candidate.handle.toLowerCase() === handle.toLowerCase(),
      );
      if (conflictUser) {
        throw conflict("HANDLE_TAKEN", "That handle is already in use.");
      }
      user.handle = handle;
    }
    if (updates.name !== undefined) {
      const name = updates.name.trim();
      if (!name || name.length > 50) {
        throw badRequest("INVALID_NAME", "Names must contain 1-50 characters.");
      }
      user.name = name;
      user.initials = updates.initials?.trim() || initialsForName(name);
    } else if (updates.initials?.trim()) {
      user.initials = updates.initials.trim().slice(0, 4);
    }
    if (updates.bio !== undefined) {
      if (updates.bio.length > 160) {
        throw badRequest("BIO_TOO_LONG", "Bios are limited to 160 characters.");
      }
      user.bio = updates.bio.trim();
    }
    if (updates.location !== undefined) {
      if (updates.location.length > 30) {
        throw badRequest(
          "LOCATION_TOO_LONG",
          "Locations are limited to 30 characters.",
        );
      }
      user.location = updates.location.trim();
    }
    if (updates.website !== undefined) {
      if (updates.website.length > 100) {
        throw badRequest(
          "WEBSITE_TOO_LONG",
          "Website values are limited to 100 characters.",
        );
      }
      user.website = updates.website.trim();
    }
    if (updates.avatarClass?.trim()) {
      user.avatarClass = updates.avatarClass.trim().slice(0, 60);
    }
    return clone(user);
  }

  listNotifications(
    actorId: string,
    filter: "all" | "verified" | "mentions" = "all",
  ): NotificationItem[] {
    this.requireUser(actorId);
    return this.notifications
      .filter((notification) => notification.recipientId === actorId)
      .filter((notification) => {
        if (filter === "verified") return Boolean(notification.verified);
        if (filter === "mentions") return notification.kind === "mention";
        return true;
      })
      .map((notification) => {
        const item: NotificationItem = {
          id: notification.id,
          kind: notification.kind,
          userIds: clone(notification.userIds),
          text: notification.text,
          timestamp: notification.timestamp,
          ...(notification.tweetId ? { tweetId: notification.tweetId } : {}),
          ...(notification.verified !== undefined
            ? { verified: notification.verified }
            : {}),
          ...(notification.unread !== undefined
            ? { unread: notification.unread }
            : {}),
        };
        return item;
      });
  }

  search(actorId: string, query: string, limit = 20): SearchResults {
    this.requireUser(actorId);
    const normalized = query.trim().toLowerCase().replace(/^@/, "");
    const boundedLimit = Math.max(1, Math.min(limit, 50));
    if (!normalized) {
      return {
        query: "",
        users: [],
        posts: [],
        trends: clone(seedTrends.slice(0, boundedLimit)),
      };
    }

    const matchingUsers = Array.from(this.users.values())
      .filter((user) =>
        [user.name, user.handle, user.bio]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, boundedLimit)
      .map(clone);
    const matchingPosts = this.postOrder
      .map((postId) => this.posts.get(postId))
      .filter(
        (post): post is PostRecord =>
          post !== undefined && post.text.toLowerCase().includes(normalized),
      )
      .slice(0, boundedLimit)
      .map((post) => this.postView(post, actorId));
    const matchingTrends = seedTrends
      .filter((trend) =>
        [trend.title, trend.eyebrow, trend.summary ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, boundedLimit)
      .map(clone);
    return {
      query: query.trim(),
      users: matchingUsers,
      posts: matchingPosts,
      trends: matchingTrends,
    };
  }

  listConversations(actorId: string): Conversation[] {
    this.requireUser(actorId);
    return Array.from(this.conversations.values())
      .filter((conversation) => conversation.participantIds.includes(actorId))
      .map(clone);
  }

  getConversation(actorId: string, conversationId: string): Conversation {
    this.requireUser(actorId);
    const conversation = this.requireConversation(conversationId);
    this.assertConversationParticipant(actorId, conversation);
    return clone(conversation);
  }

  createConversation(
    actorId: string,
    participantIds: string[],
    clientGeneratedId?: string,
  ): Conversation {
    this.requireUser(actorId);
    const uniqueParticipantIds = Array.from(
      new Set(
        participantIds
          .map((participantId) => participantId.trim())
          .filter((participantId) => participantId && participantId !== actorId),
      ),
    );
    if (uniqueParticipantIds.length === 0) {
      throw badRequest(
        "MISSING_PARTICIPANT",
        "At least one other participant is required.",
      );
    }
    if (uniqueParticipantIds.length > 7) {
      throw badRequest(
        "TOO_MANY_PARTICIPANTS",
        "Demo conversations support at most 8 participants.",
      );
    }
    uniqueParticipantIds.forEach((participantId) =>
      this.requireUser(participantId),
    );
    const allParticipantIds = [actorId, ...uniqueParticipantIds].sort();
    const requestedId = clientGeneratedId
      ? validateClientEntityId(clientGeneratedId, "conversation")
      : undefined;
    if (requestedId) {
      const existingById = this.conversations.get(requestedId);
      if (existingById) {
        this.assertConversationParticipant(actorId, existingById);
        if (
          [...existingById.participantIds].sort().join("|") !==
          allParticipantIds.join("|")
        ) {
          throw conflict(
            "CLIENT_ID_CONFLICT",
            "That client-generated conversation ID is already used for different participants.",
          );
        }
        return clone(existingById);
      }
    }
    const existing = Array.from(this.conversations.values()).find(
      (conversation) =>
        [...conversation.participantIds].sort().join("|") ===
        allParticipantIds.join("|"),
    );
    if (existing) return clone(existing);

    const conversation: Conversation = {
      id: requestedId ?? clientId("conversation"),
      participantIds: allParticipantIds,
      messages: [],
      unread: false,
    };
    this.conversations.set(conversation.id, conversation);
    return clone(conversation);
  }

  sendMessage(
    actorId: string,
    conversationId: string,
    text: string,
    clientGeneratedId?: string,
  ): Message {
    this.requireUser(actorId);
    const conversation = this.requireConversation(conversationId);
    this.assertConversationParticipant(actorId, conversation);
    const normalizedText = text.trim();
    if (!normalizedText) {
      throw badRequest("EMPTY_MESSAGE", "A message cannot be empty.");
    }
    if (normalizedText.length > 1000) {
      throw badRequest(
        "MESSAGE_TOO_LONG",
        "Messages are limited to 1000 characters.",
      );
    }
    const requestedId = clientGeneratedId
      ? validateClientEntityId(clientGeneratedId, "message")
      : undefined;
    if (requestedId) {
      for (const candidateConversation of this.conversations.values()) {
        const existingMessage = candidateConversation.messages.find(
          (message) => message.id === requestedId,
        );
        if (!existingMessage) continue;
        if (
          candidateConversation.id !== conversationId ||
          existingMessage.senderId !== actorId
        ) {
          throw conflict(
            "CLIENT_ID_CONFLICT",
            "That client-generated message ID is already in use.",
          );
        }
        return clone(existingMessage);
      }
    }

    const message: Message = {
      id: requestedId ?? clientId("message"),
      senderId: actorId,
      text: normalizedText,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    conversation.messages.push(message);
    conversation.unread = false;
    return clone(message);
  }

  markConversationRead(
    actorId: string,
    conversationId: string,
  ): Conversation {
    this.requireUser(actorId);
    const conversation = this.requireConversation(conversationId);
    this.assertConversationParticipant(actorId, conversation);
    conversation.unread = false;
    return clone(conversation);
  }

  private requireUser(userId: string): User {
    const user = this.users.get(userId);
    if (!user) throw notFound("user", userId);
    return user;
  }

  private requirePost(postId: string): PostRecord {
    const post = this.posts.get(postId);
    if (!post) throw notFound("post", postId);
    return post;
  }

  private requireConversation(conversationId: string): Conversation {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw notFound("conversation", conversationId);
    return conversation;
  }

  private assertConversationParticipant(
    actorId: string,
    conversation: Conversation,
  ): void {
    if (!conversation.participantIds.includes(actorId)) {
      throw forbidden("Only conversation participants can access these messages.");
    }
  }

  private postView(post: PostRecord, viewerId: string): PostView {
    return {
      ...clone(post),
      viewer: {
        liked: interactionSet(this.likedByUser, viewerId).has(post.id),
        reposted: interactionSet(this.repostedByUser, viewerId).has(post.id),
        bookmarked: interactionSet(this.bookmarkedByUser, viewerId).has(post.id),
      },
    };
  }

  private interactionsFor(actorId: string): InteractionState {
    return {
      likedTweetIds: Array.from(interactionSet(this.likedByUser, actorId)),
      repostedTweetIds: Array.from(interactionSet(this.repostedByUser, actorId)),
      bookmarkedTweetIds: Array.from(
        interactionSet(this.bookmarkedByUser, actorId),
      ),
      followingUserIds: Array.from(
        interactionSet(this.followingByUser, actorId),
      ),
    };
  }

  private addNotification(
    recipientId: string,
    actorId: string,
    input: Pick<NotificationItem, "kind" | "text" | "tweetId">,
  ): void {
    if (recipientId === actorId) return;
    const actor = this.requireUser(actorId);
    this.notifications.unshift({
      id: clientId("notification"),
      recipientId,
      kind: input.kind,
      userIds: [actorId],
      text: input.text,
      ...(input.tweetId ? { tweetId: input.tweetId } : {}),
      timestamp: "now",
      verified: Boolean(actor.verified),
      unread: true,
    });
  }
}

let sharedRepository: ChirpRepository | undefined;

export function getRepository(): ChirpRepository {
  sharedRepository ??= new MemoryRepository();
  return sharedRepository;
}

export function resetRepositoryForTests(): ChirpRepository {
  sharedRepository = new MemoryRepository();
  return sharedRepository;
}
