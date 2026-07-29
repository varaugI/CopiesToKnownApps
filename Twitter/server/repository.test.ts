import { beforeEach, describe, expect, it } from "vitest";

import { CURRENT_USER_ID } from "@/data/mockData";
import { ApiError } from "@/server/errors";
import { MemoryRepository } from "@/server/repository";

describe("MemoryRepository", () => {
  let repository: MemoryRepository;

  beforeEach(() => {
    repository = new MemoryRepository();
  });

  it("provides a memory-only bootstrap payload compatible with the client", () => {
    const bootstrap = repository.bootstrap(CURRENT_USER_ID);

    expect(bootstrap).toMatchObject({
      storageMode: "memory",
      currentUser: { id: CURRENT_USER_ID },
      profile: { id: CURRENT_USER_ID },
    });
    expect(bootstrap.posts.length).toBeGreaterThan(0);
    expect(bootstrap.tweets).toEqual(bootstrap.posts);
    expect(bootstrap.interactions).toEqual({
      likedTweetIds: [],
      repostedTweetIds: [],
      bookmarkedTweetIds: [],
      followingUserIds: [],
    });
  });

  it("reconciles a client-generated post idempotently and rejects blob media", () => {
    const first = repository.createPost(CURRENT_USER_ID, {
      clientId: "tweet-client-123",
      text: "A locally optimistic post",
    });
    const retried = repository.createPost(CURRENT_USER_ID, {
      clientId: "tweet-client-123",
      text: "A duplicate retry",
    });

    expect(first.id).toBe("tweet-client-123");
    expect(retried.id).toBe(first.id);
    expect(
      repository.listPosts(CURRENT_USER_ID).items.filter(
        (post) => post.id === first.id,
      ),
    ).toHaveLength(1);

    expect(() =>
      repository.createPost(CURRENT_USER_ID, {
        text: "",
        media: ["blob:http://localhost/session-only"],
      }),
    ).toThrowError(
      expect.objectContaining({ code: "UNSUPPORTED_MEDIA_REFERENCE" }),
    );
  });

  it("creates replies with parentTweetId and updates the parent count", () => {
    const before = repository.getPost(CURRENT_USER_ID, "t-1");
    const reply = repository.createReply(
      CURRENT_USER_ID,
      "t-1",
      "A server-backed reply",
      "reply-client-123",
    );
    const after = repository.getPost(CURRENT_USER_ID, "t-1");

    expect(reply).toMatchObject({
      id: "reply-client-123",
      parentTweetId: "t-1",
      userId: CURRENT_USER_ID,
    });
    expect(after.replies).toBe(before.replies + 1);
    expect(repository.listReplies(CURRENT_USER_ID, "t-1")).toContainEqual(reply);
  });

  it("keeps interaction mutations idempotent and enforces post ownership", () => {
    const initialLikes = repository.getPost(CURRENT_USER_ID, "t-1").likes;
    repository.setLike(CURRENT_USER_ID, "t-1", true);
    const likedTwice = repository.setLike(CURRENT_USER_ID, "t-1", true);
    expect(likedTwice.likes).toBe(initialLikes + 1);
    expect(likedTwice.viewer.liked).toBe(true);

    const unlikedTwice = repository.setLike(CURRENT_USER_ID, "t-1", false);
    repository.setLike(CURRENT_USER_ID, "t-1", false);
    expect(unlikedTwice.likes).toBe(initialLikes);

    expect(() => repository.deletePost(CURRENT_USER_ID, "t-1")).toThrowError(
      expect.objectContaining({ status: 403, code: "FORBIDDEN" }),
    );
  });

  it("authorizes conversation access and persists sent messages in memory", () => {
    const conversation = repository.createConversation(CURRENT_USER_ID, [
      "u-aria",
    ], "conversation-client-123");
    const message = repository.sendMessage(
      CURRENT_USER_ID,
      conversation.id,
      "Hello from the API",
      "message-client-123",
    );
    const retriedMessage = repository.sendMessage(
      CURRENT_USER_ID,
      conversation.id,
      "A retry with the same id",
      "message-client-123",
    );

    expect(conversation.id).toBe("conversation-client-123");
    expect(retriedMessage).toEqual(message);
    expect(
      repository.getConversation(CURRENT_USER_ID, conversation.id).messages,
    ).toContainEqual(message);
    expect(() =>
      repository.getConversation("u-devon", conversation.id),
    ).toThrowError(ApiError);
  });
});
