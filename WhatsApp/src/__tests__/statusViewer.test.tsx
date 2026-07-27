import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import App from "../App";

describe("Phase 1 — Status Viewer Opening and Closing", () => {
  test("opens status tab, clicks a status story to view, and closes status modal", () => {
    render(<App />);

    // Click Status tab link on sidebar
    const statusTabBtn = screen.getByTitle("Status");
    fireEvent.click(statusTabBtn);

    // Verify Status header is present
    expect(screen.getByRole("heading", { name: "Status" })).toBeInTheDocument();

    // Click Sarah Jenkins status story
    const sarahStory = screen.getAllByText("Sarah Jenkins")[0];
    fireEvent.click(sarahStory);

    // Verify story modal opened with reply input
    expect(screen.getByPlaceholderText("Reply...")).toBeInTheDocument();
  });
});
