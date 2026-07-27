import { render, screen, fireEvent, renderHook, act } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import App from "../App";
import { useCallStore } from "../store/useCallStore";
import { useComposerStore } from "../store/useComposerStore";
import { enqueueOutboundMessage, getOutboundQueue } from "../lib/db/indexedDB";

describe("Phase 1 Architecture — Router, Stores, & IndexedDB", () => {
  test("navigates to Linked Devices route when clicked in sidebar", () => {
    render(<App />);

    const devicesBtn = screen.getByTitle("Linked Devices");
    fireEvent.click(devicesBtn);

    expect(screen.getByRole("heading", { name: "Linked Devices" })).toBeInTheDocument();
    expect(screen.getByText("Windows PC (Current Device)")).toBeInTheDocument();
  });

  test("manages transient call state in useCallStore", () => {
    const { result } = renderHook(() => useCallStore());

    expect(result.current.activeCall).toBeNull();

    act(() => {
      result.current.startCall({ id: "c1", name: "Test Contact", avatar: "", phone: "", statusText: "", isOnline: true }, "voice");
    });

    expect(result.current.activeCall?.contact.name).toBe("Test Contact");
    expect(result.current.isMuted).toBe(false);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(true);
  });

  test("enqueues and retrieves outbound messages in IndexedDB", async () => {
    const mockMsg = {
      id: "msg_test_idb",
      senderId: "user_me",
      text: "IndexedDB test message",
      timestamp: "12:00 PM",
      status: "PENDING_LOCAL" as const,
      type: "text" as const
    };

    await enqueueOutboundMessage("client_msg_100", "chat_1", mockMsg);
    const queue = await getOutboundQueue();

    expect(queue.length).toBeGreaterThan(0);
    expect(queue.some((q) => q.clientMessageId === "client_msg_100")).toBe(true);
  });
});
