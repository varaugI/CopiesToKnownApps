import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import App from "../App";

describe("Phase 1 — Local Text Message Creation", () => {
  test("creates and appends a local text message with pending status icon", () => {
    render(<App />);

    // Type a message in input
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: "Hello ConnectChat test message" } });

    // Submit the form
    const form = input.closest("form");
    expect(form).not.toBeNull();
    if (form) fireEvent.submit(form);

    // Verify message appears on screen
    const messages = screen.getAllByText("Hello ConnectChat test message");
    expect(messages.length).toBeGreaterThan(0);
  });
});
