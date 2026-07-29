import { beforeEach, describe, expect, it } from "vitest";

import { dispatchApiRequest } from "@/server/api-router";
import { resetRateLimitsForTests } from "@/server/rate-limit";
import { resetRepositoryForTests } from "@/server/repository";

interface SuccessEnvelope<T> {
  data: T;
  meta: {
    requestId: string;
    storageMode?: "memory";
  };
}

interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

function apiRequest(
  path: string,
  init: RequestInit = {},
  userId?: string,
): Request {
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (userId) headers.set("X-Chirp-User", userId);
  return new Request(`https://chirp.example${path}`, { ...init, headers });
}

async function json<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe("catch-all Chirp API dispatcher", () => {
  beforeEach(() => {
    resetRepositoryForTests();
    resetRateLimitsForTests();
  });

  it("returns health and bootstrap envelopes with explicit memory semantics", async () => {
    const healthResponse = await dispatchApiRequest(
      apiRequest("/api/health"),
      "GET",
    );
    const health = await json<
      SuccessEnvelope<{
        status: string;
        storageMode: string;
        durability: string;
      }>
    >(healthResponse);

    expect(healthResponse.status).toBe(200);
    expect(healthResponse.headers.get("cache-control")).toContain("no-store");
    expect(healthResponse.headers.get("x-content-type-options")).toBe("nosniff");
    expect(health.data).toMatchObject({
      status: "ok",
      storageMode: "memory",
      durability: "process-local",
    });

    const bootstrapResponse = await dispatchApiRequest(
      apiRequest("/api/bootstrap"),
      "GET",
    );
    const bootstrap = await json<
      SuccessEnvelope<{
        currentUser: { id: string };
        posts: unknown[];
        interactions: { likedTweetIds: string[] };
      }>
    >(bootstrapResponse);
    expect(bootstrap.data.currentUser.id).toBe("u-me");
    expect(bootstrap.data.posts.length).toBeGreaterThan(0);
    expect(bootstrap.data.interactions.likedTweetIds).toEqual([]);
    expect(bootstrapResponse.headers.get("set-cookie")).toContain("HttpOnly");
    expect(bootstrapResponse.headers.get("set-cookie")).toContain("Secure");
  });

  it("creates a media-only post and supports idempotent PUT/DELETE actions", async () => {
    const createResponse = await dispatchApiRequest(
      apiRequest(
        "/api/posts",
        {
          method: "POST",
          body: JSON.stringify({
            clientId: "tweet-api-client-1",
            text: "",
            media: ["/media/rainy-city.jpg"],
          }),
        },
        "u-me",
      ),
      "POST",
    );
    const created = await json<
      SuccessEnvelope<{ post: { id: string; text: string } }>
    >(createResponse);
    expect(createResponse.status).toBe(201);
    expect(created.data.post.id).toBe("tweet-api-client-1");

    const likeResponse = await dispatchApiRequest(
      apiRequest("/api/posts/tweet-api-client-1/like", { method: "PUT" }, "u-me"),
      "PUT",
    );
    const liked = await json<
      SuccessEnvelope<{ active: boolean; post: { viewer: { liked: boolean } } }>
    >(likeResponse);
    expect(liked.data.active).toBe(true);
    expect(liked.data.post.viewer.liked).toBe(true);

    const unlikeResponse = await dispatchApiRequest(
      apiRequest(
        "/api/posts/tweet-api-client-1/like",
        { method: "DELETE" },
        "u-me",
      ),
      "DELETE",
    );
    const unliked = await json<SuccessEnvelope<{ active: boolean }>>(
      unlikeResponse,
    );
    expect(unliked.data.active).toBe(false);
  });

  it("returns structured validation and authorization failures", async () => {
    const invalidMediaResponse = await dispatchApiRequest(
      apiRequest(
        "/api/posts",
        {
          method: "POST",
          body: JSON.stringify({
            text: "",
            media: ["blob:https://chirp.example/session"],
          }),
        },
        "u-me",
      ),
      "POST",
    );
    const invalidMedia = await json<ErrorEnvelope>(invalidMediaResponse);
    expect(invalidMediaResponse.status).toBe(400);
    expect(invalidMedia.error.code).toBe("UNSUPPORTED_MEDIA_REFERENCE");

    const forbiddenResponse = await dispatchApiRequest(
      apiRequest("/api/posts/t-1", { method: "DELETE" }, "u-me"),
      "DELETE",
    );
    const forbidden = await json<ErrorEnvelope>(forbiddenResponse);
    expect(forbiddenResponse.status).toBe(403);
    expect(forbidden.error).toMatchObject({
      code: "FORBIDDEN",
      message: expect.any(String),
    });
  });

  it("supports demo session, profile alias, and conversation/message aliases", async () => {
    const sessionResponse = await dispatchApiRequest(
      apiRequest("/api/auth/demo", {
        method: "POST",
        body: JSON.stringify({ userId: "u-me" }),
      }),
      "POST",
    );
    expect(sessionResponse.headers.get("set-cookie")).toContain(
      "chirp_demo_user=u-me",
    );

    const profileResponse = await dispatchApiRequest(
      apiRequest(
        "/api/users/me",
        {
          method: "PATCH",
          body: JSON.stringify({ bio: "Updated through the API" }),
        },
        "u-me",
      ),
      "PATCH",
    );
    const profile = await json<
      SuccessEnvelope<{ profile: { bio: string } }>
    >(profileResponse);
    expect(profile.data.profile.bio).toBe("Updated through the API");

    const conversationResponse = await dispatchApiRequest(
      apiRequest(
        "/api/conversations",
        {
          method: "POST",
          body: JSON.stringify({
            userId: "u-aria",
            clientId: "conversation-api-client-1",
          }),
        },
        "u-me",
      ),
      "POST",
    );
    const conversation = await json<
      SuccessEnvelope<{ conversation: { id: string } }>
    >(conversationResponse);

    const messageResponse = await dispatchApiRequest(
      apiRequest(
        `/api/conversations/${conversation.data.conversation.id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            text: "A persisted demo message",
            clientId: "message-api-client-1",
          }),
        },
        "u-me",
      ),
      "POST",
    );
    const message = await json<
      SuccessEnvelope<{ message: { text: string } }>
    >(messageResponse);
    expect(message.data.message.text).toBe("A persisted demo message");

    const readResponse = await dispatchApiRequest(
      apiRequest(
        `/api/conversations/${conversation.data.conversation.id}/read`,
        { method: "PATCH", body: JSON.stringify({}) },
        "u-me",
      ),
      "PATCH",
    );
    expect(readResponse.status).toBe(200);
  });
});
