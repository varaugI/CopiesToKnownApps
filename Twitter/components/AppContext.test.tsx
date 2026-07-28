import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { TwitterProvider, useTwitter } from "@/components/AppContext";

function ContextHarness() {
  const {
    bookmarkedTweetIds,
    conversations,
    createTweet,
    currentUser,
    feedTweets,
    followingUserIds,
    likedTweetIds,
    sendMessage,
    toggleBookmark,
    toggleFollow,
    toggleLike,
  } = useTwitter();
  const firstTweet = feedTweets.find((tweet) => tweet.id === "t-1")!;
  const firstConversation = conversations[0]!;

  return (
    <div>
      <span data-testid="tweet-count">{feedTweets.length}</span>
      <span data-testid="latest-text">{feedTweets[0]?.text}</span>
      <span data-testid="liked">{String(likedTweetIds.has(firstTweet.id))}</span>
      <span data-testid="bookmarked">
        {String(bookmarkedTweetIds.has(firstTweet.id))}
      </span>
      <span data-testid="following">
        {String(followingUserIds.has("u-aria"))}
      </span>
      <span data-testid="message-count">
        {firstConversation.messages.length}
      </span>
      <button type="button" onClick={() => toggleLike(firstTweet.id)}>
        Like
      </button>
      <button type="button" onClick={() => toggleBookmark(firstTweet.id)}>
        Bookmark
      </button>
      <button type="button" onClick={() => toggleFollow("u-aria")}>
        Follow
      </button>
      <button
        type="button"
        onClick={() => createTweet("A new local post")}
      >
        Create
      </button>
      <button
        type="button"
        onClick={() => sendMessage(firstConversation.id, "Hello from test")}
      >
        Send
      </button>
      <span>{currentUser.name}</span>
    </div>
  );
}

describe("TwitterProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("updates core social interactions optimistically", async () => {
    const user = userEvent.setup();
    render(
      <TwitterProvider>
        <ContextHarness />
      </TwitterProvider>,
    );

    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(screen.getByTestId("liked")).toHaveTextContent("false");

    await user.click(screen.getByRole("button", { name: "Like" }));
    await user.click(screen.getByRole("button", { name: "Bookmark" }));
    await user.click(screen.getByRole("button", { name: "Follow" }));

    expect(screen.getByTestId("liked")).toHaveTextContent("true");
    expect(screen.getByTestId("bookmarked")).toHaveTextContent("true");
    expect(screen.getByTestId("following")).toHaveTextContent("true");
  });

  it("creates timeline posts and sends messages", async () => {
    const user = userEvent.setup();
    render(
      <TwitterProvider>
        <ContextHarness />
      </TwitterProvider>,
    );

    const initialTweets = Number(screen.getByTestId("tweet-count").textContent);
    const initialMessages = Number(
      screen.getByTestId("message-count").textContent,
    );

    await user.click(screen.getByRole("button", { name: "Create" }));
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByTestId("tweet-count")).toHaveTextContent(
      String(initialTweets + 1),
    );
    expect(screen.getByTestId("latest-text")).toHaveTextContent(
      "A new local post",
    );
    expect(screen.getByTestId("message-count")).toHaveTextContent(
      String(initialMessages + 1),
    );
  });

  it("restores persisted state without crashing on malformed storage", async () => {
    window.localStorage.setItem("twitter-clone:liked-tweets", "{not-json");

    await act(async () => {
      render(
        <TwitterProvider>
          <ContextHarness />
        </TwitterProvider>,
      );
    });

    expect(screen.getByTestId("liked")).toHaveTextContent("false");
  });
});
