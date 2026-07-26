import React, { useRef, useEffect } from "react";
import { Phone, Video, Search, MoreVertical, ChevronLeft } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

export const ChatArea = () => {
  const { activeChat, setActiveChatId, startCall } = useWhatsApp();
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  if (!activeChat) return null;

  return (
    <div className="wa-chat-panel">
      {/* Chat Header */}
      <header
        style={{
          padding: "10px 16px",
          backgroundColor: "var(--wa-dark-panel)",
          borderBottom: "1px solid var(--wa-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Mobile Back Button */}
          <button
            onClick={() => setActiveChatId(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "none"
            }}
            className="mobile-back-btn"
          >
            <ChevronLeft size={24} />
          </button>

          <img
            src={activeChat.contact.avatar}
            alt={activeChat.contact.name}
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
          />

          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{activeChat.contact.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--wa-emerald)" }}>
              {activeChat.contact.statusText}
            </div>
          </div>
        </div>

        {/* Action Controls Header Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button
            onClick={() => startCall(activeChat.contact, "video")}
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            title="Video call"
          >
            <Video size={20} />
          </button>

          <button
            onClick={() => startCall(activeChat.contact, "voice")}
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            title="Voice call"
          >
            <Phone size={20} />
          </button>

          <div style={{ width: 1, height: 20, backgroundColor: "var(--wa-border)" }} />

          <button
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            title="Search"
          >
            <Search size={20} />
          </button>

          <button
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            title="More options"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Canvas */}
      <div className="chat-canvas">
        {/* Encryption Banner */}
        <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 20px 0" }}>
          <div
            style={{
              backgroundColor: "rgba(255, 230, 0, 0.1)",
              color: "#ffd500",
              fontSize: "0.75rem",
              padding: "6px 14px",
              borderRadius: 8,
              textAlign: "center",
              maxWidth: 400
            }}
          >
            🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
          </div>
        </div>

        {activeChat.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.senderId === "user_me"}
          />
        ))}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <ChatInput chatId={activeChat.id} />
    </div>
  );
};
