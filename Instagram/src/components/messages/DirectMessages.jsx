import React, { useState } from "react";
import {
  Edit,
  Send,
  Image as ImageIcon,
  Heart,
  Smile,
  Info,
  Phone,
  Video
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMessaging } from "../../context/messaging-context";
import { useProfile } from "../../context/profile-context";

export const DirectMessages = () => {
  const { chats, sendChatMessage } = useMessaging();
  const { user } = useProfile();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("primary");

  const activeChatId = conversationId || chats[0]?.id;
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendChatMessage(activeChat.id, inputText);
      setInputText("");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="messages-container">
        {/* Left Inbox List */}
        <div className={`messages-list-panel ${activeChatId ? "hidden-mobile" : ""}`}>
          <header
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border-color)"
            }}
          >
            <div style={{ fontWeight: 800, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{user.username}</span>
            </div>
            <button style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>
              <Edit size={22} />
            </button>
          </header>

          {/* Inbox Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)" }}>
            {["Primary", "General", "Requests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.toLowerCase() ? "2px solid var(--text-primary)" : "none",
                  color: activeTab === tab.toLowerCase() ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: activeTab === tab.toLowerCase() ? 700 : 500,
                  fontSize: "0.88rem",
                  cursor: "pointer"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {chats.map((c) => {
              const lastMsg = c.messages[c.messages.length - 1];
              const isSelected = c.id === activeChat.id;
              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/direct/${c.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 20px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "var(--bg-secondary)" : "transparent"
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={c.user.avatar}
                      alt={c.user.username}
                      style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
                    />
                    {c.user.isOnline && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 2,
                          right: 2,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          border: "2px solid var(--bg-primary)"
                        }}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{c.user.name}</div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {lastMsg ? `${lastMsg.senderId === "user_me" ? "You: " : ""}${lastMsg.text}` : "No messages"}
                      <span style={{ margin: "0 4px" }}>·</span>
                      <span>{lastMsg?.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Panel */}
        <div className={`messages-chat-panel ${!activeChatId ? "hidden-mobile" : ""}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <header
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border-color)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={activeChat.user.avatar}
                    alt={activeChat.user.username}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{activeChat.user.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {activeChat.user.lastSeen}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <Phone size={22} style={{ cursor: "pointer" }} />
                  <Video size={24} style={{ cursor: "pointer" }} />
                  <Info size={22} style={{ cursor: "pointer" }} />
                </div>
              </header>

              {/* Chat Messages Body */}
              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Profile intro card in chat */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0 40px 0" }}>
                  <img
                    src={activeChat.user.avatar}
                    alt={activeChat.user.username}
                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}
                  />
                  <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{activeChat.user.name}</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{activeChat.user.username} · PhotoFlow</span>
                  <button
                    className="btn-secondary"
                    style={{ marginTop: 12 }}
                  >
                    View profile
                  </button>
                </div>

                {/* Messages */}
                {activeChat.messages.map((m) => {
                  const isMe = m.senderId === "user_me";
                  return (
                    <div key={m.id} className={`chat-bubble ${isMe ? "sent" : "received"}`}>
                      {m.text}
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                style={{
                  padding: "16px 20px",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "24px",
                    padding: "8px 16px"
                  }}
                >
                  <Smile size={22} color="var(--text-muted)" style={{ cursor: "pointer" }} />
                  <input
                    type="text"
                    placeholder="Message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem"
                    }}
                  />
                  <ImageIcon size={22} color="var(--text-muted)" style={{ cursor: "pointer" }} />
                  <Heart size={22} color="var(--text-muted)" style={{ cursor: "pointer" }} />
                </div>

                {inputText.trim() && (
                  <button
                    type="submit"
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent-blue)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      cursor: "pointer"
                    }}
                  >
                    Send
                  </button>
                )}
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <Send size={60} strokeWidth={1} color="var(--text-muted)" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Your Messages</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Send private photos and messages to a friend or group.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
