import type {
  Conversation,
  Message,
  NotificationItem,
  Trend,
  Tweet,
  User,
} from "@/types";

export const API_CURRENT_USER_ID = "u-me";

export interface ApiTweet extends Tweet {
  parentTweetId?: string;
}

export interface ApiInteractions {
  likedTweetIds?: string[];
  repostedTweetIds?: string[];
  bookmarkedTweetIds?: string[];
  followingUserIds?: string[];
}

export interface ApiBootstrap extends ApiInteractions {
  currentUser?: User;
  profile?: User;
  users?: User[];
  posts?: ApiTweet[];
  tweets?: ApiTweet[];
  replies?: ApiTweet[];
  conversations?: Conversation[];
  notifications?: NotificationItem[];
  trends?: Trend[];
  interactions?: ApiInteractions;
}

export interface CreatePostRequest {
  text: string;
  media?: string[];
  mediaAlt?: string[];
  quotedTweetId?: string;
  clientId?: string;
}

export interface CreateReplyRequest {
  text: string;
  clientId?: string;
}

export interface ApiSession {
  user: User | null;
  authenticated: boolean;
}

interface ApiSuccessEnvelope<T> {
  data: T;
  meta?: unknown;
}

interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options: { status: number; code?: string; details?: unknown },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code ?? "REQUEST_FAILED";
    this.details = options.details;
  }
}

type FetchImplementation = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSuccessEnvelope<T>(value: unknown): value is ApiSuccessEnvelope<T> {
  return isRecord(value) && "data" in value;
}

function isErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (!isRecord(value) || !isRecord(value.error)) return false;
  return (
    typeof value.error.code === "string" &&
    typeof value.error.message === "string"
  );
}

function entityFromPayload<T>(
  payload: unknown,
  keys: readonly string[],
): T {
  if (isRecord(payload)) {
    for (const key of keys) {
      if (key in payload) return payload[key] as T;
    }
    if (typeof payload.id === "string") return payload as T;
  }

  throw new ApiError("The API returned an unexpected response.", {
    status: 200,
    code: "INVALID_RESPONSE",
    details: payload,
  });
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

/**
 * A small same-origin REST client. Fetch is resolved at request time so tests,
 * service workers, and browser polyfills can replace it after module loading.
 */
export class ChirpApiClient {
  constructor(
    private readonly fetchImplementation?: FetchImplementation,
    private readonly currentUserId = API_CURRENT_USER_ID,
  ) {}

  private async request<T>(
    path: `/${string}`,
    init: RequestInit = {},
  ): Promise<T> {
    const requestFetch = this.fetchImplementation ?? globalThis.fetch;
    if (typeof requestFetch !== "function") {
      throw new ApiError("The network API is unavailable.", {
        status: 0,
        code: "NETWORK_UNAVAILABLE",
      });
    }

    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    headers.set("X-Chirp-User", this.currentUserId);
    if (init.body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    let response: Response;
    try {
      response = await requestFetch(path, {
        ...init,
        credentials: "same-origin",
        headers,
      });
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : "The network request failed.",
        { status: 0, code: "NETWORK_ERROR", details: error },
      );
    }

    const payload = await readJson(response);
    if (!response.ok) {
      if (isErrorEnvelope(payload)) {
        throw new ApiError(payload.error.message, {
          status: response.status,
          code: payload.error.code,
          details: payload.error.details,
        });
      }

      throw new ApiError(`Request failed with status ${response.status}.`, {
        status: response.status,
      });
    }

    if (isSuccessEnvelope<T>(payload)) return payload.data;
    return payload as T;
  }

  bootstrap(): Promise<ApiBootstrap> {
    return this.request<ApiBootstrap>("/api/bootstrap");
  }

  getSession(): Promise<ApiSession> {
    return this.request<ApiSession>("/api/auth/session");
  }

  startDemoSession(): Promise<ApiSession> {
    return this.request<ApiSession>("/api/auth/demo", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  async createPost(input: CreatePostRequest): Promise<ApiTweet> {
    const payload = await this.request<unknown>("/api/posts", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return entityFromPayload<ApiTweet>(payload, ["post"]);
  }

  deletePost(postId: string): Promise<void> {
    return this.request<void>(`/api/posts/${encodeURIComponent(postId)}`, {
      method: "DELETE",
    });
  }

  async createReply(
    postId: string,
    input: CreateReplyRequest,
  ): Promise<ApiTweet> {
    const payload = await this.request<unknown>(
      `/api/posts/${encodeURIComponent(postId)}/replies`,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    return entityFromPayload<ApiTweet>(payload, ["reply", "post"]);
  }

  setLike(postId: string, active: boolean): Promise<void> {
    return this.setPostRelationship(postId, "like", active);
  }

  setRepost(postId: string, active: boolean): Promise<void> {
    return this.setPostRelationship(postId, "repost", active);
  }

  setBookmark(postId: string, active: boolean): Promise<void> {
    return this.setPostRelationship(postId, "bookmark", active);
  }

  private setPostRelationship(
    postId: string,
    relationship: "like" | "repost" | "bookmark",
    active: boolean,
  ): Promise<void> {
    return this.request<void>(
      `/api/posts/${encodeURIComponent(postId)}/${relationship}`,
      { method: active ? "PUT" : "DELETE" },
    );
  }

  setFollow(userId: string, active: boolean): Promise<void> {
    return this.request<void>(
      `/api/users/${encodeURIComponent(userId)}/follow`,
      { method: active ? "PUT" : "DELETE" },
    );
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const payload = await this.request<unknown>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return entityFromPayload<User>(payload, ["profile", "currentUser", "user"]);
  }

  async createConversation(userId: string): Promise<Conversation> {
    const payload = await this.request<unknown>("/api/conversations", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    return entityFromPayload<Conversation>(payload, ["conversation"]);
  }

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const payload = await this.request<unknown>(
      `/api/conversations/${encodeURIComponent(conversationId)}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ text }),
      },
    );
    return entityFromPayload<Message>(payload, ["message"]);
  }

  markConversationRead(conversationId: string): Promise<void> {
    return this.request<void>(
      `/api/conversations/${encodeURIComponent(conversationId)}/read`,
      { method: "PATCH" },
    );
  }
}

export const chirpApi = new ChirpApiClient();
