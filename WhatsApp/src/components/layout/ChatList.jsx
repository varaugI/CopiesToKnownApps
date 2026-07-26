import React, { useState } from "react";
import { Search, Filter, Pin, CheckCheck, Image as ImageIcon, Mic } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";

export const ChatList = () => {
  const { chats, activeChatId, setActiveChatId, markChatAsRead } = useWhatsApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);

  const filteredChats = chats.filter((c) => {
    const matchesSearch =
      c.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesUnread = filterUnread ? c.unreadCount > 0 : true;
    return matchesSearch && matchesUnread;
  });

  return (
    <div className="wa-chat-list-view">
      {/* Header */}
      <div
        style={{
          padding: "16px 20px 12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Chats</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            style={{
              background: filterUnread ? "rgba(0, 168, 132, 0.2)" : "none",
              border: "none",
              color: filterUnread ? "var(--wa-emerald)" : "var(--text-secondary)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            title="Filter Unread"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ padding: "0 16px 12px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            backgroundColor: "var(--wa-dark-body)",
            borderRadius: 8,
            padding: "8px 12px"
          }}
        >
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              width: "100%",
              fontSize: "0.88rem"
            }}
          />
        </div>
      </div>

      {/* Chat Items List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredChats.map((c) => {
          const lastMsg = c.messages[c.messages.length - 1];
          const isActive = c.id === activeChatId;

          return (
            <div
              key={c.id}
              className={`wa-chat-item ${isActive ? "active" : ""}`}
              onClick={() => {
                setActiveChatId(c.id);
                markChatAsRead(c.id);
              }}
            >
              {/* Contact Avatar */}
              <div style={{ position: "relative" }}>
                <img
                  src={c.contact.avatar}
                  alt={c.contact.name}
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                />
                {c.contact.isOnline && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "var(--wa-emerald)",
                      border: "2px solid var(--wa-dark-panel)"
                    }}
                  />
                )}
              </div>

              {/* Chat Info */}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{c.contact.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {lastMsg?.timestamp}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    {lastMsg?.senderId === "user_me" && (
                      <CheckCheck size={16} className="blue-ticks" />
                    )}
                    {lastMsg?.type === "image" ? (
                      <>
                        <ImageIcon size={14} />
                        <span>Photo</span>
                      </>
                    ) : lastMsg?.type === "audio" ? (
                      <>
                        <Mic size={14} color="var(--wa-emerald)" />
                        <span>Voice message ({lastMsg.audioDuration})</span>
                      </>
                    ) : (
                      <span>{lastMsg?.text}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {c.isPinned && <Pin size={14} color="var(--text-secondary)" />}
                    {c.unreadCount > 0 && (
                      <span
                        style={{
                          backgroundColor: "var(--wa-emerald)",
                          color: "#111b21",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
