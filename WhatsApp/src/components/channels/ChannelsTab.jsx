import React from "react";
import { Compass, Check } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";

export const ChannelsTab = () => {
  const { channels, toggleFollowChannel } = useWhatsApp();

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Channels</h2>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: -12 }}>
        Stay updated on topics you care about. Find channels to follow below.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {channels.map((ch) => (
          <div
            key={ch.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              padding: "12px",
              backgroundColor: "var(--wa-dark-body)",
              borderRadius: 12,
              border: "1px solid var(--wa-border)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
              <img
                src={ch.avatar}
                alt={ch.name}
                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
              />

              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{ch.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--wa-emerald)", margin: "2px 0" }}>
                  {ch.subscribers}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {ch.description}
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleFollowChannel(ch.id)}
              style={{
                backgroundColor: ch.isFollowing ? "rgba(255,255,255,0.1)" : "var(--wa-emerald)",
                color: ch.isFollowing ? "white" : "#111b21",
                border: "none",
                borderRadius: 20,
                padding: "6px 16px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {ch.isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
