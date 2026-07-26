import React, { useState } from "react";
import { MessageSquare, Bell, Heart, UserPlus, ArrowRight } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const Inbox = () => {
  const { inboxNotifications } = useTikTok();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "20px 0" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          backgroundColor: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--border-color)",
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 16 }}>Inbox Activity</h2>

        {/* Tab Filters */}
        <div style={{ display: "flex", gap: 12, borderBottom: "1px solid var(--border-color)", pb: 12, marginBottom: 20 }}>
          {["All activity", "Likes", "Comments", "Followers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().split(" ")[0])}
              style={{
                background: "none",
                border: "none",
                color: activeTab === tab.toLowerCase().split(" ")[0] ? "white" : "var(--text-muted)",
                fontWeight: activeTab === tab.toLowerCase().split(" ")[0] ? 700 : 500,
                fontSize: "0.9rem",
                paddingBottom: 8,
                borderBottom: activeTab === tab.toLowerCase().split(" ")[0] ? "2px solid var(--tiktok-magenta)" : "none",
                cursor: "pointer"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {inboxNotifications.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                padding: "8px 0"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                <img
                  src={item.user.avatar}
                  alt={item.user.username}
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                />

                <div style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                  <strong style={{ marginRight: 6 }}>@{item.user.username}</strong>
                  <span>{item.text}</span>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {item.timestamp}
                  </div>
                </div>
              </div>

              {item.videoThumbnail ? (
                <img
                  src={item.videoThumbnail}
                  alt="Thumb"
                  style={{ width: 42, height: 42, borderRadius: 6, objectFit: "cover" }}
                />
              ) : item.type === "follow" ? (
                <button
                  style={{
                    backgroundColor: "var(--tiktok-magenta)",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  Follow back
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
