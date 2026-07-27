import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { ApiClient, ApiClientError } from "../api/api-client";
import { ErrorBoundary } from "../components/common/ErrorBoundary";

describe("PhotoFlow Phase 1 foundations", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/");
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("validates profile edits with React Hook Form and Zod", async () => {
    const user = userEvent.setup();
    render(<App initialEntries={["/accounts/edit"]} />);

    await screen.findByRole("dialog", { name: "Edit profile" });
    const name = screen.getByLabelText("Name");
    await user.clear(name);
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("submits a valid typed profile edit and reconciles browser persistence", async () => {
    const user = userEvent.setup();
    render(<App initialEntries={["/accounts/edit"]} />);

    const dialog = await screen.findByRole("dialog", { name: "Edit profile" });
    const name = screen.getByLabelText("Name");
    const username = screen.getByLabelText("Username");
    await user.clear(name);
    await user.type(name, "Alex Updated");
    await user.clear(username);
    await user.type(username, "alex_updated");
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(await screen.findByText("alex_updated")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("insta_user")).name).toBe("Alex Updated");
  });

  it("keeps API access tokens in memory and maps rate-limit responses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "profile_1" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Slow down" }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient("http://localhost:3000/api/v1");
    client.setAccessToken("memory-only-token");

    await expect(client.request("/profiles/me")).resolves.toEqual({ id: "profile_1" });
    const requestOptions = fetchMock.mock.calls[0][1];
    expect(requestOptions.headers.get("Authorization")).toBe("Bearer memory-only-token");
    expect(requestOptions.credentials).toBe("include");
    expect(localStorage.length).toBe(0);

    let caughtError;
    try {
      await client.request("/limited");
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toBeInstanceOf(ApiClientError);
    expect(caughtError).toMatchObject({
      code: "RATE_LIMITED",
      status: 429,
      message: "Slow down",
    });
  });

  it("renders a recoverable top-level error state without exposing the error message", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const Broken = () => {
      throw new Error("private message content");
    };

    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("PhotoFlow hit an unexpected problem");
    expect(screen.queryByText("private message content")).not.toBeInTheDocument();
  });
});
