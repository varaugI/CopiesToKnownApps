import React from "react";
import { StoriesBar } from "../stories/StoriesBar";
import { PostCard } from "./PostCard";
import { useApp } from "../../context/AppContext";

export const Feed = () => {
  const { posts, user, setActiveView } = useApp();

  const suggestions = [
    {
      username: "creative_daily",
      name: "Daily Visuals",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      reason: "Suggested for you"
    },
    {
      username: "cyber_beats",
      name: "Synthwave Music",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      reason: "Followed by elena_sunset + 4 more"
    },
    {
      username: "street_art_daily",
      name: "NYC Graffiti",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      reason: "New to Instagram"
    }
  ];

  return (
    <div className="feed-layout">
      {/* Main Feed Column */}
      <main className="feed-main">
        <StoriesBar />

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      {/* Right Sidebar Suggestions */}
      <aside className="feed-sidebar-right">
        {/* User Card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
            onClick={() => setActiveView("profile")}
          >
            <img
              src={user.avatar}
              alt={user.username}
              style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user.username}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{user.name}</div>
            </div>
          </div>
          <button
            onClick={() => setActiveView("profile")}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-blue)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >
            Switch
          </button>
        </div>

        {/* Suggestions Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Suggested for you
          </span>
          <span style={{ fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>See All</span>
        </div>

        {/* Suggestions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {suggestions.map((s, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={s.avatar}
                  alt={s.username}
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{s.username}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.reason}</div>
                </div>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-blue)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer style={{ marginTop: 24, fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          <p>About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language</p>
          <p style={{ marginTop: 12, textTransform: "uppercase" }}>© 2026 INSTAGRAM CLONE FROM GOOGLE DEEPMIND</p>
        </footer>
      </aside>
    </div>
  );
};
