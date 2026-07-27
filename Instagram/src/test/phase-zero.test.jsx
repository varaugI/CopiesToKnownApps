import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

describe("PhotoFlow preserved Phase 0 browser behavior", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("opens, navigates, and closes StoryViewer through its URL route", async () => {
    const user = userEvent.setup();
    render(<App initialEntries={["/"]} />);

    await user.click(await screen.findByRole("button", { name: "elena_sunset" }));

    expect(await screen.findByRole("dialog", { name: "Story viewer" })).toBeInTheDocument();
    expect(screen.getByText(/Golden hour in Santorini/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next story" }));
    expect(await screen.findByText(/Never leaving this view/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close story viewer" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Story viewer" })).not.toBeInTheDocument();
    });
  });

  it("updates and persists post-like state locally", async () => {
    const user = userEvent.setup();
    render(<App initialEntries={["/"]} />);

    await user.click(await screen.findByRole("button", { name: "Like post by elena_sunset" }));

    expect(screen.getByRole("button", { name: "Unlike post by elena_sunset" })).toBeInTheDocument();
    expect(screen.getByText("3,843 likes")).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("insta_posts"))[0].isLiked).toBe(true);
    });
  });

  it("creates and persists a local comment", async () => {
    const user = userEvent.setup();
    render(<App initialEntries={["/"]} />);
    const firstPost = (await screen.findAllByRole("article"))[0];

    await user.type(within(firstPost).getByPlaceholderText("Add a comment..."), "Phase zero comment");
    await user.click(within(firstPost).getByRole("button", { name: "Post" }));

    expect(within(firstPost).getByText("Phase zero comment")).toBeInTheDocument();
    await waitFor(() => {
      const persistedPosts = JSON.parse(localStorage.getItem("insta_posts"));
      expect(persistedPosts[0].comments.at(-1).text).toBe("Phase zero comment");
    });
  });

  it("sends and persists a local direct message", async () => {
    const user = userEvent.setup();
    render(<App initialEntries={["/direct/chat_1"]} />);

    await user.type(await screen.findByPlaceholderText("Message..."), "Local message from the test");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("Local message from the test")).toBeInTheDocument();
    await waitFor(() => {
      const persistedChats = JSON.parse(localStorage.getItem("insta_chats"));
      expect(persistedChats[0].messages.at(-1).text).toBe("Local message from the test");
    });
  });

  it("keeps the feed, Explore, Reels, messages, profile, and create UI reachable", async () => {
    const user = userEvent.setup();
    const { container } = render(<App initialEntries={["/"]} />);

    expect((await screen.findAllByRole("article")).length).toBeGreaterThan(0);

    await user.click(screen.getAllByRole("link", { name: "Explore" })[0]);
    await waitFor(() => expect(container.querySelectorAll(".explore-item").length).toBeGreaterThan(0));

    await user.click(screen.getAllByRole("link", { name: "Reels" })[0]);
    await waitFor(() => expect(container.querySelectorAll("video.reel-video").length).toBeGreaterThan(0));

    await user.click(screen.getByRole("link", { name: "Messages" }));
    expect(await screen.findByPlaceholderText("Message...")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Profile" }));
    expect(await screen.findByRole("button", { name: "Edit profile" })).toBeInTheDocument();

    const createButton = screen.getByRole("button", { name: "Create" });
    await user.click(createButton);
    expect(screen.getByRole("dialog", { name: "Create new post" })).toBeInTheDocument();
    expect(screen.getByText("Drag photos and videos here")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Create new post" })).not.toBeInTheDocument();
    expect(createButton).toHaveFocus();
  });
});
