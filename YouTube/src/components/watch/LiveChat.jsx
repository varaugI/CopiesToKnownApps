import React, { useState } from "react";
import { Send, DollarSign, Heart, Sparkles } from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const LiveChat = ({ video }) => {
  const { user } = useYouTube();
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "m1", user: "CyberDev", text: "Awesome live presentation! 🔥", isMod: true },
    { id: "m2", user: "TechGirl", text: "Is the source code on GitHub?" },
    { id: "m3", user: "MarcoB", text: "Greetings from Italy 🇮🇹" },
    { id: "m4", user: "Alex_R", text: "Super excited for 2026 AI features!" }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: "m_" + Date.now(), user: user.name, text: chatMessage.trim() }
      ]);
      setChatMessage("");
    }
  };

  return (
    <div
      style={{
        border: "1px solid var(--yt-border)",
        borderRadius: 12,
        backgroundColor: "var(--yt-dark-card)",
        display: "flex",
        flexDirection: "column",
        height: 480
      }}
    >
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--yt-border)", fontWeight: 800, fontSize: "0.95rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Top Chat</span>
        <Sparkles size={16} color="var(--yt-red)" />
      </div>

      {/* Super Chats Pinned Bar */}
      {video.superChats && video.superChats.length > 0 && (
        <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--yt-border)", display: "flex", gap: 8, overflowX: "auto" }}>
          {video.superChats.map((sc) => (
            <div key={sc.id} className="super-chat-card" style={{ backgroundColor: sc.color, minWidth: 140 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span>{sc.user}</span>
                <span>{sc.amount}</span>
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>{sc.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Messages Stream */}
      <div style={{ flex: 1, padding: 12, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ fontSize: "0.85rem", lineHeight: 1.3 }}>
            <span style={{ fontWeight: 700, color: m.isMod ? "#26a641" : "var(--text-secondary)", marginRight: 8 }}>
              {m.user}:
            </span>
            <span style={{ color: "var(--text-primary)" }}>{m.text}</span>
          </div>
        ))}
      </div>

      {/* Footer Chat Input */}
      <form onSubmit={handleSend} style={{ padding: 12, borderTop: "1px solid var(--yt-border)", display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Chat..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: "var(--yt-dark-body)",
            border: "1px solid var(--yt-border)",
            borderRadius: 20,
            padding: "8px 14px",
            color: "white",
            fontSize: "0.85rem",
            outline: "none"
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "var(--yt-red)",
            border: "none",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer"
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
