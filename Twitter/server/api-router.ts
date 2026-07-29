import { CURRENT_USER_ID } from "@/data/mockData";
import {
  DEMO_USER_COOKIE,
  demoSessionCookie,
  resolveDemoSession,
} from "@/server/auth";
import { ApiError, badRequest, notFound } from "@/server/errors";
import {
  apiJson,
  handleApiRequest,
  readJsonObject,
  stringArrayField,
  stringField,
} from "@/server/http";
import { enforceRateLimit } from "@/server/rate-limit";
import {
  getRepository,
  type ChirpRepository,
  type UpdateProfileInput,
} from "@/server/repository";

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function pathSegments(request: Request): string[] {
  const pathname = new URL(request.url).pathname;
  const apiIndex = pathname.indexOf("/api");
  const apiPath = apiIndex >= 0 ? pathname.slice(apiIndex + 4) : pathname;
  return apiPath
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        throw badRequest("INVALID_PATH", "The request path is invalid.");
      }
    });
}

function boundedInteger(
  url: URL,
  key: string,
  fallback: number,
  maximum: number,
): number {
  const raw = url.searchParams.get(key);
  if (raw === null) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) {
    throw badRequest(
      "VALIDATION_ERROR",
      `'${key}' must be a positive integer.`,
      { field: key },
    );
  }
  return Math.min(value, maximum);
}

function sessionHeaders(
  request: Request,
  source: "header" | "cookie" | "fallback",
  userId: string,
): HeadersInit | undefined {
  if (source !== "fallback") return undefined;
  return { "set-cookie": demoSessionCookie(userId, request) };
}

function actionName(segment: string | undefined): string | undefined {
  if (segment === "like" || segment === "likes") return "like";
  if (segment === "repost" || segment === "reposts") return "repost";
  if (segment === "bookmark" || segment === "bookmarks") return "bookmark";
  return undefined;
}

function assertMutationLimit(
  request: Request,
  actorId: string,
  scope: string,
  limit: number,
): void {
  enforceRateLimit(request, { actorId, scope, limit });
}

async function getRoute(
  request: Request,
  repository: ChirpRepository,
  segments: string[],
): Promise<Response> {
  const url = new URL(request.url);

  if (segments.length === 1 && segments[0] === "health") {
    return apiJson(
      request,
      {
        status: "ok",
        service: "chirp-api",
        storageMode: repository.storageMode,
        durability: "process-local",
        rateLimitMode: "best-effort-process-local",
        timestamp: new Date().toISOString(),
      },
      { meta: { storageMode: repository.storageMode } },
    );
  }

  const session = resolveDemoSession(request, repository);
  const headers = sessionHeaders(
    request,
    session.source,
    session.user.id,
  );

  if (segments[0] === "auth" && segments[1] === "session" && segments.length === 2) {
    return apiJson(
      request,
      {
        authenticated: true,
        authMode: "demo",
        identitySource: session.source,
        user: session.user,
      },
      {
        headers,
        meta: { storageMode: repository.storageMode },
      },
    );
  }

  if (segments.length === 1 && segments[0] === "bootstrap") {
    return apiJson(request, repository.bootstrap(session.user.id), {
      headers,
      meta: { storageMode: repository.storageMode },
    });
  }

  if (segments.length === 1 && segments[0] === "posts") {
    const page = repository.listPosts(session.user.id, {
      authorId: url.searchParams.get("authorId") ?? undefined,
      includeReplies: url.searchParams.get("includeReplies") === "true",
      cursor: url.searchParams.get("cursor") ?? undefined,
      limit: boundedInteger(url, "limit", 50, 100),
    });
    return apiJson(
      request,
      { posts: page.items },
      {
        headers,
        meta: {
          storageMode: repository.storageMode,
          ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
        },
      },
    );
  }

  if (segments[0] === "posts" && segments[1] && segments.length === 2) {
    return apiJson(
      request,
      { post: repository.getPost(session.user.id, segments[1]) },
      { headers, meta: { storageMode: repository.storageMode } },
    );
  }

  if (
    segments[0] === "posts" &&
    segments[1] &&
    segments[2] === "replies" &&
    segments.length === 3
  ) {
    return apiJson(
      request,
      { replies: repository.listReplies(session.user.id, segments[1]) },
      { headers, meta: { storageMode: repository.storageMode } },
    );
  }

  if (segments[0] === "users" && segments[1] && segments.length === 2) {
    const user =
      repository.findUser(segments[1]) ??
      repository.findUserByHandle(segments[1]);
    if (!user) throw notFound("user", segments[1]);
    return apiJson(request, { user }, { headers });
  }

  if (segments.length === 1 && segments[0] === "notifications") {
    const filter = url.searchParams.get("filter") ?? "all";
    if (!["all", "verified", "mentions"].includes(filter)) {
      throw badRequest(
        "VALIDATION_ERROR",
        "'filter' must be all, verified, or mentions.",
        { field: "filter" },
      );
    }
    return apiJson(request, {
      notifications: repository.listNotifications(
        session.user.id,
        filter as "all" | "verified" | "mentions",
      ),
    }, { headers });
  }

  if (segments.length === 1 && segments[0] === "search") {
    const query = url.searchParams.get("q") ?? "";
    const limit = boundedInteger(url, "limit", 20, 50);
    return apiJson(
      request,
      repository.search(session.user.id, query, limit),
      { headers },
    );
  }

  if (segments.length === 1 && segments[0] === "conversations") {
    return apiJson(
      request,
      { conversations: repository.listConversations(session.user.id) },
      { headers, meta: { storageMode: repository.storageMode } },
    );
  }

  if (
    segments[0] === "conversations" &&
    segments[1] &&
    segments.length === 2
  ) {
    return apiJson(
      request,
      {
        conversation: repository.getConversation(
          session.user.id,
          segments[1],
        ),
      },
      { headers, meta: { storageMode: repository.storageMode } },
    );
  }

  if (
    segments[0] === "conversations" &&
    segments[1] &&
    segments[2] === "messages" &&
    segments.length === 3
  ) {
    const conversation = repository.getConversation(
      session.user.id,
      segments[1],
    );
    return apiJson(
      request,
      { conversation, messages: conversation.messages },
      { headers, meta: { storageMode: repository.storageMode } },
    );
  }

  throw notFound("route", new URL(request.url).pathname);
}

async function postRoute(
  request: Request,
  repository: ChirpRepository,
  segments: string[],
): Promise<Response> {
  if (segments[0] === "auth" && segments[1] === "demo" && segments.length === 2) {
    const body = await readJsonObject(request);
    const userId =
      stringField(body, "userId", { maxLength: 100 }) ?? CURRENT_USER_ID;
    const user = repository.findUser(userId);
    if (!user) throw notFound("user", userId);
    assertMutationLimit(request, user.id, "demo-session", 20);
    return apiJson(
      request,
      {
        authenticated: true,
        authMode: "demo",
        user,
      },
      {
        headers: { "set-cookie": demoSessionCookie(user.id, request) },
        meta: { storageMode: repository.storageMode },
      },
    );
  }

  const session = resolveDemoSession(request, repository);
  const actorId = session.user.id;
  const body = await readJsonObject(request);

  if (segments.length === 1 && segments[0] === "posts") {
    assertMutationLimit(request, actorId, "create-post", 10);
    const text = stringField(body, "text", {
      allowEmpty: true,
      maxLength: 280,
    }) ?? "";
    const media = stringArrayField(body, "media", {
      maxItems: 4,
      maxItemLength: 2_048,
    });
    const mediaAlt = stringArrayField(body, "mediaAlt", {
      maxItems: 4,
      maxItemLength: 1_000,
    });
    const quotedTweetId = stringField(body, "quotedTweetId", {
      maxLength: 128,
    });
    const clientId = stringField(body, "clientId", { maxLength: 128 });
    const post = repository.createPost(actorId, {
      text,
      media,
      mediaAlt,
      quotedTweetId,
      clientId,
    });
    return apiJson(
      request,
      { post },
      {
        status: 201,
        meta: { storageMode: repository.storageMode },
      },
    );
  }

  if (
    segments[0] === "posts" &&
    segments[1] &&
    segments[2] === "replies" &&
    segments.length === 3
  ) {
    assertMutationLimit(request, actorId, "create-reply", 20);
    const text = stringField(body, "text", {
      required: true,
      maxLength: 280,
    })!;
    const clientId = stringField(body, "clientId", { maxLength: 128 });
    const reply = repository.createReply(
      actorId,
      segments[1],
      text,
      clientId,
    );
    return apiJson(
      request,
      { reply, post: reply },
      {
        status: 201,
        meta: { storageMode: repository.storageMode },
      },
    );
  }

  if (segments.length === 1 && segments[0] === "conversations") {
    assertMutationLimit(request, actorId, "create-conversation", 15);
    const participantIds = stringArrayField(body, "participantIds", {
      maxItems: 7,
      maxItemLength: 100,
    }) ?? [];
    const participantId = stringField(body, "participantId", {
      maxLength: 100,
    });
    const userId = stringField(body, "userId", { maxLength: 100 });
    const clientId = stringField(body, "clientId", { maxLength: 128 });
    const conversation = repository.createConversation(actorId, [
      ...participantIds,
      ...(participantId ? [participantId] : []),
      ...(userId ? [userId] : []),
    ], clientId);
    return apiJson(
      request,
      { conversation },
      {
        status: 201,
        meta: { storageMode: repository.storageMode },
      },
    );
  }

  if (
    segments[0] === "conversations" &&
    segments[1] &&
    segments[2] === "messages" &&
    segments.length === 3
  ) {
    assertMutationLimit(request, actorId, "send-message", 60);
    const text = stringField(body, "text", {
      required: true,
      maxLength: 1_000,
    })!;
    const clientId = stringField(body, "clientId", { maxLength: 128 });
    const message = repository.sendMessage(
      actorId,
      segments[1],
      text,
      clientId,
    );
    return apiJson(
      request,
      { message },
      {
        status: 201,
        meta: { storageMode: repository.storageMode },
      },
    );
  }

  throw notFound("route", new URL(request.url).pathname);
}

async function putRoute(
  request: Request,
  repository: ChirpRepository,
  segments: string[],
): Promise<Response> {
  const session = resolveDemoSession(request, repository);
  const actorId = session.user.id;
  const action = actionName(segments[2]);

  if (segments[0] === "posts" && segments[1] && action && segments.length === 3) {
    assertMutationLimit(request, actorId, `post-${action}`, 100);
    const post =
      action === "like"
        ? repository.setLike(actorId, segments[1], true)
        : action === "repost"
          ? repository.setRepost(actorId, segments[1], true)
          : repository.setBookmark(actorId, segments[1], true);
    return apiJson(request, { post, active: true });
  }

  if (
    segments[0] === "users" &&
    segments[1] &&
    (segments[2] === "follow" || segments[2] === "following") &&
    segments.length === 3
  ) {
    assertMutationLimit(request, actorId, "follow", 50);
    const user = repository.setFollow(actorId, segments[1], true);
    return apiJson(request, { user, active: true });
  }

  if (
    segments[0] === "conversations" &&
    segments[1] &&
    segments[2] === "read" &&
    segments.length === 3
  ) {
    const conversation = repository.markConversationRead(actorId, segments[1]);
    return apiJson(request, { conversation });
  }

  throw notFound("route", new URL(request.url).pathname);
}

async function deleteRoute(
  request: Request,
  repository: ChirpRepository,
  segments: string[],
): Promise<Response> {
  const session = resolveDemoSession(request, repository);
  const actorId = session.user.id;
  const action = actionName(segments[2]);

  if (segments[0] === "posts" && segments[1] && segments.length === 2) {
    assertMutationLimit(request, actorId, "delete-post", 20);
    repository.deletePost(actorId, segments[1]);
    return apiJson(request, { deleted: true, postId: segments[1] });
  }

  if (segments[0] === "posts" && segments[1] && action && segments.length === 3) {
    assertMutationLimit(request, actorId, `post-${action}`, 100);
    const post =
      action === "like"
        ? repository.setLike(actorId, segments[1], false)
        : action === "repost"
          ? repository.setRepost(actorId, segments[1], false)
          : repository.setBookmark(actorId, segments[1], false);
    return apiJson(request, { post, active: false });
  }

  if (
    segments[0] === "users" &&
    segments[1] &&
    (segments[2] === "follow" || segments[2] === "following") &&
    segments.length === 3
  ) {
    assertMutationLimit(request, actorId, "follow", 50);
    const user = repository.setFollow(actorId, segments[1], false);
    return apiJson(request, { user, active: false });
  }

  throw notFound("route", new URL(request.url).pathname);
}

async function patchRoute(
  request: Request,
  repository: ChirpRepository,
  segments: string[],
): Promise<Response> {
  const session = resolveDemoSession(request, repository);
  const actorId = session.user.id;

  if (
    (segments.length === 1 && segments[0] === "profile") ||
    (segments.length === 2 &&
      segments[0] === "users" &&
      segments[1] === "me")
  ) {
    assertMutationLimit(request, actorId, "update-profile", 15);
    const body = await readJsonObject(request);
    const updates: UpdateProfileInput = {
      name: stringField(body, "name", { maxLength: 50 }),
      handle: stringField(body, "handle", { maxLength: 30 }),
      bio: stringField(body, "bio", { allowEmpty: true, maxLength: 160 }),
      location: stringField(body, "location", {
        allowEmpty: true,
        maxLength: 30,
      }),
      website: stringField(body, "website", {
        allowEmpty: true,
        maxLength: 100,
      }),
      initials: stringField(body, "initials", {
        allowEmpty: true,
        maxLength: 4,
      }),
      avatarClass: stringField(body, "avatarClass", { maxLength: 60 }),
    };
    if (Object.values(updates).every((value) => value === undefined)) {
      throw badRequest(
        "EMPTY_UPDATE",
        "At least one supported profile field is required.",
      );
    }
    const profile = repository.updateProfile(actorId, updates);
    return apiJson(request, { profile, currentUser: profile });
  }

  if (
    segments[0] === "conversations" &&
    segments[1] &&
    (segments.length === 2 ||
      (segments.length === 3 && segments[2] === "read"))
  ) {
    const conversation = repository.markConversationRead(actorId, segments[1]);
    return apiJson(request, { conversation });
  }

  throw notFound("route", new URL(request.url).pathname);
}

export async function dispatchApiRequest(
  request: Request,
  method: ApiMethod = request.method.toUpperCase() as ApiMethod,
): Promise<Response> {
  return handleApiRequest(request, async () => {
    const repository = getRepository();
    const segments = pathSegments(request);
    if (method === "GET") return getRoute(request, repository, segments);
    if (method === "POST") return postRoute(request, repository, segments);
    if (method === "PUT") return putRoute(request, repository, segments);
    if (method === "DELETE") return deleteRoute(request, repository, segments);
    if (method === "PATCH") return patchRoute(request, repository, segments);
    throw new ApiError({
      status: 405,
      code: "METHOD_NOT_ALLOWED",
      message: `Method '${method}' is not supported.`,
    });
  });
}

export { DEMO_USER_COOKIE };
