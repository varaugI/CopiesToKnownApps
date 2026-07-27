import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import App from "../App";

describe("Phase 1 — Security & Encryption Claims Check", () => {
  test("confirms misleading end-to-end encryption claims are removed and replaced with simulation disclaimer", () => {
    render(<App />);

    // Verify false E2EE claim is NOT present
    expect(
      screen.queryByText(/Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them./i)
    ).toBeNull();

    // Verify explicit simulation disclaimer is displayed
    expect(
      screen.getByText(/SIMULATION ONLY: End-to-end encryption is not yet implemented/i)
    ).toBeInTheDocument();
  });
});
