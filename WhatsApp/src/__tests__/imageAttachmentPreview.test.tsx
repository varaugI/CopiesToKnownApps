import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import React from "react";
import { AttachmentModal } from "../components/chat/AttachmentModal";
import { WhatsAppProvider } from "../context/WhatsAppContext";

describe("Phase 1 — Image Attachment Preview", () => {
  test("renders attachment modal with image preview and send button", () => {
    const handleClose = vi.fn();

    render(
      <WhatsAppProvider>
        <AttachmentModal isOpen={true} onClose={handleClose} chatId="chat_1" />
      </WhatsAppProvider>
    );

    expect(screen.getByText("Send Image")).toBeInTheDocument();
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add a caption...")).toBeInTheDocument();
  });
});
