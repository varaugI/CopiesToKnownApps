import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import App from "../App";

describe("Phase 1 — Chat Search Filtering", () => {
  test("filters chat list based on search query", () => {
    const { container } = render(<App />);

    // Search input
    const searchInput = screen.getByPlaceholderText(/Search or start new chat/i);
    const chatListPanel = container.querySelector(".wa-chat-list-view");
    expect(chatListPanel?.textContent).toContain("Sarah Jenkins");
    expect(chatListPanel?.textContent).toContain("David Miller");

    // Filter for David
    fireEvent.change(searchInput, { target: { value: "David" } });

    expect(chatListPanel?.textContent).toContain("David Miller");
    expect(chatListPanel?.textContent).not.toContain("Sarah Jenkins");
  });
});
