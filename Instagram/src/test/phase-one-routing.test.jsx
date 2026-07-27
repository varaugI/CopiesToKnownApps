import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

describe("PhotoFlow Phase 1 routing", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it.each([
    ["/explore", ".explore-item"],
    ["/reels", "video.reel-video"],
    ["/direct/chat_2", "input[placeholder='Message...']"],
    ["/alex_designs", ".profile-container"],
  ])("deep-links %s to the expected view", async (path, selector) => {
    const { container } = render(<App initialEntries={[path]} />);
    await screen.findByRole("navigation", { name: "Primary navigation" });
    await waitFor(() => expect(container.querySelector(selector)).toBeTruthy());
  });

  it("opens a post-detail deep link and returns to its background route", async () => {
    const user = userEvent.setup();
    render(<App initialEntries={["/p/post_1"]} />);

    expect(await screen.findByRole("dialog", { name: "Post by elena_sunset" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close post" }));
    expect(await screen.findAllByRole("article")).not.toHaveLength(0);
  });

  it("reserves login and register URLs without pretending authentication exists", async () => {
    const { unmount } = render(<App initialEntries={["/login"]} />);
    expect(await screen.findByRole("heading", { name: "Log in to PhotoFlow" })).toBeInTheDocument();
    expect(screen.getByText(/introduced in Phase 3/)).toBeInTheDocument();
    unmount();

    render(<App initialEntries={["/register"]} />);
    expect(await screen.findByRole("heading", { name: "Create a PhotoFlow account" })).toBeInTheDocument();
  });

  it("updates browser history and restores route views with Back and Forward", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await screen.findAllByRole("article");

    await user.click(screen.getAllByRole("link", { name: "Explore" })[0]);
    await waitFor(() => expect(window.location.pathname).toBe("/explore"));
    expect(container.querySelector(".explore-item")).toBeTruthy();

    await user.click(screen.getAllByRole("link", { name: "Reels" })[0]);
    await waitFor(() => expect(window.location.pathname).toBe("/reels"));

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe("/explore"));
    expect(container.querySelector(".explore-item")).toBeTruthy();

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe("/reels"));
    expect(container.querySelector("video.reel-video")).toBeTruthy();
  });
});
