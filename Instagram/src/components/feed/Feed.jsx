import React from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../../context/posts-context";
import { useProfile } from "../../context/profile-context";
import { StoriesBar } from "../stories/StoriesBar";
import { PostCard } from "./PostCard";

const suggestions = [
  {
    username: "creative_daily",
    name: "Daily Visuals",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    reason: "Suggested for you"
  },
  {
    username: "cyber_beats",
    name: "Synthwave Music",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    reason: "Followed by elena_sunset + 4 more"
  },
  {
    username: "street_art_daily",
    name: "NYC Graffiti",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    reason: "New to PhotoFlow"
  }
];

export const Feed = () => {
  const { posts } = usePosts();
  const { user } = useProfile();

  return (
    <div className="feed-layout">
      <section className="feed-main" aria-label="Home feed">
        <StoriesBar />
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <aside className="feed-sidebar-right" aria-label="Profile and suggestions">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            to={`/${user.username}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "inherit",
              textDecoration: "none"
            }}
          >
            <img
              src={user.avatar}
              alt=""
              style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
            />
            <span>
              <span style={{ display: "block", fontWeight: 700, fontSize: "0.9rem" }}>
                {user.username}
              </span>
              <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {user.name}
              </span>
            </span>
          </Link>
          <Link to={`/${user.username}`} style={{ color: "var(--accent-blue)", fontWeight: 700 }}>
            Switch
          </Link>
        </div>

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
          <button type="button" className="action-btn" style={{ fontSize: "0.8rem" }}>
            See All
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.username}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={suggestion.avatar}
                  alt=""
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{suggestion.username}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {suggestion.reason}
                  </div>
                </div>
              </div>
              <button type="button" className="action-btn" style={{ color: "var(--accent-blue)" }}>
                Follow
              </button>
            </div>
          ))}
        </div>

        <footer
          style={{ marginTop: 24, fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}
        >
          <p>About · Help · API · Privacy · Terms · Accessibility</p>
          <p style={{ marginTop: 12, textTransform: "uppercase" }}>
            © 2026 PhotoFlow learning project
          </p>
        </footer>
      </aside>
    </div>
  );
};
