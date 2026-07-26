import React, { useState } from "react";
import { X, Search, Link as LinkIcon, Check, Send } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ShareModal = () => {
  const { activeShareModalPost, setActiveShareModalPost, chats, sendChatMessage } = useApp();
  const [copied, setCopied] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);

  if (!activeShareModalPost) return null;

  const toggleSelect = (chatId) => {
    if (selectedChats.includes(chatId)) {
      setSelectedChats(selectedChats.filter((id) => id !== chatId));
    } else {
      setSelectedChats([...selectedChats, chatId]);
    }
  };

  const handleSend = () => {
    selectedChats.forEach((chatId) => {
      sendChatMessage(chatId, `Shared a post: ${activeShareModalPost.caption.slice(0, 40)}...`);
    });
    setActiveShareModalPost(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveShareModalPost(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-color)"
          }}
        >
          <div style={{ width: 24 }} />
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Share</h3>
          <button
            onClick={() => setActiveShareModalPost(null)}
            style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </header>

        {/* Recipients */}
        <div style={{ padding: "12px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "8px",
              padding: "8px 12px",
              marginBottom: 12
            }}
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search people..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                width: "100%"
              }}
            />
          </div>

          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {chats.map((c) => {
              const isSelected = selectedChats.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => toggleSelect(c.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 4px",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={c.user.avatar}
                      alt={c.user.username}
                      style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.user.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {c.user.username}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: isSelected ? "none" : "2px solid var(--border-color)",
                      backgroundColor: isSelected ? "var(--accent-blue)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Copy Link & Send Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <button
            onClick={handleCopyLink}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer"
            }}
          >
            {copied ? <Check size={18} color="green" /> : <LinkIcon size={18} />}
            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
          </button>

          {selectedChats.length > 0 && (
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 20px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
