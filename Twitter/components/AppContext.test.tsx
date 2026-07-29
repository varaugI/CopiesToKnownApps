import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { TwitterProvider, useTwitter } from "@/components/AppContext";
import {
  users as mockUsers,
  tweets as mockTweets,
} from "@/data/mockData";

function apiResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({ data }),
  } as Response;
}

function ContextHarness() {
  const {
    bookmarkedTweetIds,
    conversations,
    createTweet,
    currentUser,
    feedTweets,
    followingUserIds,
    likedTweetIds,
    markConversationRead,
    sendMessage,
    startConversation,
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
      <button
        type="button"
        onClick={() => {
          const tweet = createTweet({
            text: "A queued post",
            media: ["blob:local-preview", "/images/persistable.jpg"],
            mediaAlt: ["Local preview", "Persistable image"],
          });
          if (tweet) toggleLike(tweet.id);
        }}
      >
        Create and like
      </button>
      <button type="button" onClick={() => startConversation("u-aria")}>
        Start Aria
      </button>
      <button
        type="button"
        onClick={() => {
          const conversation = conversations.find((candidate) =>
            candidate.participantIds.includes("u-aria"),
          );
          if (conversation) {
            sendMessage(conversation.id, "Queued hello");
          }
        }}
      >
        Send Aria
      </button>
      <button
        type="button"
        onClick={() => {
          const conversation = conversations.find((candidate) =>
            candidate.participantIds.includes("u-aria"),
          );
          if (conversation) markConversationRead(conversation.id);
        }}
      >
        Read Aria
      </button>
      <span>{currentUser.name}</span>
    </div>
  );
}

describe("TwitterProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Offline in unit test")),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it("merges bootstrap data without replacing explicit local state", async () => {
    window.localStorage.setItem(
      "twitter-clone:profile",
      JSON.stringify({ name: "Local Maya" }),
    );
    window.localStorage.setItem(
      "twitter-clone:liked-tweets",
      JSON.stringify([]),
    );

    const remoteUser = { ...mockUsers[0]!, name: "Remote Maya" };
    const remotePost = {
      ...mockTweets[0]!,
      id: "remote-post",
      text: "A post loaded from the API",
    };
    const fetchMock = vi.fn(
      async (
        input: RequestInfo | URL,
        _init?: RequestInit,
      ): Promise<Response> => {
        if (String(input) === "/api/bootstrap") {
          return apiResponse({
            currentUser: remoteUser,
            profile: remoteUser,
            users: [remoteUser],
            posts: [remotePost],
            likedTweetIds: ["t-1"],
          });
        }
        return apiResponse(null);
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    render(
      <TwitterProvider>
        <ContextHarness />
      </TwitterProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("latest-text")).toHaveTextContent(
        "A post loaded from the API",
      ),
    );
    expect(screen.getByText("Local Maya")).toBeInTheDocument();
    expect(screen.getByTestId("liked")).toHaveTextContent("false");

    const bootstrapCall = fetchMock.mock.calls.find(
      ([input]) => String(input) === "/api/bootstrap",
    );
    const headers = new Headers(bootstrapCall?.[1]?.headers);
    expect(headers.get("X-Chirp-User")).toBe("u-me");
  });

  it("chains post mutations behind canonical IDs and omits blob media", async () => {
    let resolveCreate!: (response: Response) => void;
    const pendingCreate = new Promise<Response>((resolve) => {
      resolveCreate = resolve;
    });
    const fetchMock = vi.fn(
      (
        input: RequestInfo | URL,
        init?: RequestInit,
      ): Promise<Response> => {
        const url = String(input);
        if (url === "/api/bootstrap") return Promise.resolve(apiResponse({}));
        if (url === "/api/posts" && init?.method === "POST") {
          return pendingCreate;
        }
        return Promise.resolve(apiResponse(null));
      },
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(
      <TwitterProvider>
        <ContextHarness />
      </TwitterProvider>,
    );
    await user.click(
      screen.getByRole("button", { name: "Create and like" }),
    );

    const createCall = await waitFor(() => {
      const call = fetchMock.mock.calls.find(
        ([input, init]) =>
          String(input) === "/api/posts" && init?.method === "POST",
      );
      expect(call).toBeDefined();
      return call!;
    });
    const requestBody = JSON.parse(String(createCall[1]?.body)) as {
      media?: string[];
      mediaAlt?: string[];
    };
    expect(requestBody.media).toEqual(["/images/persistable.jpg"]);
    expect(requestBody.mediaAlt).toEqual(["Persistable image"]);
    expect(
      fetchMock.mock.calls.some(([input]) =>
        String(input).endsWith("/like"),
      ),
    ).toBe(false);

    await act(async () => {
      resolveCreate(
        apiResponse({
          post: {
            ...mockTweets[0]!,
            id: "server-post",
            userId: "u-me",
            text: "A queued post",
          },
        }),
      );
      await pendingCreate;
    });

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(
          ([input, init]) =>
            String(input) === "/api/posts/server-post/like" &&
            init?.method === "PUT",
        ),
      ).toBe(true),
    );
  });

  it("chains conversation work behind the canonical conversation ID", async () => {
    let resolveConversation!: (response: Response) => void;
    const pendingConversation = new Promise<Response>((resolve) => {
      resolveConversation = resolve;
    });
    const fetchMock = vi.fn(
      (
        input: RequestInfo | URL,
        init?: RequestInit,
      ): Promise<Response> => {
        const url = String(input);
        if (url === "/api/bootstrap") return Promise.resolve(apiResponse({}));
        if (url === "/api/conversations" && init?.method === "POST") {
          return pendingConversation;
        }
        return Promise.resolve(apiResponse(null));
      },
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(
      <TwitterProvider>
        <ContextHarness />
      </TwitterProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Start Aria" }));
    await user.click(screen.getByRole("button", { name: "Send Aria" }));
    await user.click(screen.getByRole("button", { name: "Read Aria" }));

    expect(
      fetchMock.mock.calls.some(([input]) =>
        String(input).includes("/messages"),
      ),
    ).toBe(false);
    expect(
      fetchMock.mock.calls.some(([input]) => String(input).endsWith("/read")),
    ).toBe(false);

    await act(async () => {
      resolveConversation(
        apiResponse({
          conversation: {
            id: "server-conversation",
            participantIds: ["u-me", "u-aria"],
            messages: [],
            unread: false,
          },
        }),
      );
      await pendingConversation;
    });

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some(
          ([input, init]) =>
            String(input) ===
              "/api/conversations/server-conversation/messages" &&
            init?.method === "POST",
        ),
      ).toBe(true);
      expect(
        fetchMock.mock.calls.some(
          ([input, init]) =>
            String(input) === "/api/conversations/server-conversation/read" &&
            init?.method === "PATCH",
        ),
      ).toBe(true);
    });
  });

  it("keeps a local interaction made while bootstrap is pending", async () => {
    let resolveBootstrap!: (response: Response) => void;
    const pendingBootstrap = new Promise<Response>((resolve) => {
      resolveBootstrap = resolve;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL): Promise<Response> => {
        if (String(input) === "/api/bootstrap") return pendingBootstrap;
        return Promise.resolve(apiResponse(null));
      }),
    );
    const user = userEvent.setup();

    render(
      <TwitterProvider>
        <ContextHarness />
      </TwitterProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Like" }));
    expect(screen.getByTestId("liked")).toHaveTextContent("true");

    await act(async () => {
      resolveBootstrap(apiResponse({ likedTweetIds: [] }));
      await pendingBootstrap;
    });

    expect(screen.getByTestId("liked")).toHaveTextContent("true");
  });
});
