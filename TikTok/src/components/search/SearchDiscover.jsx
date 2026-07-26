import React, { useState } from "react";
import { Search, Flame, ChevronRight, Music } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const SearchDiscover = () => {
  const { trendingTags, videos } = useTikTok();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = videos.filter((v) =>
    v.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "20px 0" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "0 16px"
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid var(--border-color)",
            borderRadius: 24,
            padding: "10px 18px"
          }}
        >
          <Search size={20} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search accounts, videos, or sound tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "0.95rem"
            }}
          />
        </div>

        {/* Trending Hashtags */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Flame size={22} color="var(--tiktok-magenta)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Trending Topics</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trendingTags.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      backgroundColor: "rgba(254, 44, 85, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem"
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{item.tag}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.views}</div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
