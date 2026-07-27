import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import App from "../App";

describe("Phase 1 — Channel Follow Toggling", () => {
  test("navigates to Channels tab and toggles follow state", () => {
    render(<App />);

    // Navigate to Channels tab
    const channelsTabBtn = screen.getByTitle("Channels");
    fireEvent.click(channelsTabBtn);

    expect(screen.getByRole("heading", { name: "Channels" })).toBeInTheDocument();
    expect(screen.getByText("TechCrunch Updates")).toBeInTheDocument();

    // Find follow button for TechCrunch Updates
    const followButtons = screen.getAllByRole("button", { name: /Follow/i });
    const techCrunchBtn = followButtons.find((btn) => btn.textContent === "Follow");
    expect(techCrunchBtn).toBeDefined();

    if (techCrunchBtn) {
      fireEvent.click(techCrunchBtn);
      expect(techCrunchBtn.textContent).toBe("Following");
    }
  });
});
