import React, { useState } from "react";
import { Grid, Bookmark, Film, UserCheck, Settings, Heart, MessageCircle } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePosts } from "../../context/posts-context";
import { useProfile } from "../../context/profile-context";
import { useReels } from "../../context/reels-context";

export const Profile = () => {
  const { user } = useProfile();
  const { posts } = usePosts();
  const { reels } = useReels();
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' | 'reels' | 'saved' | 'tagged'

  // Filter posts created by current user or all feed posts for demo display
  const userPosts = posts;
  const savedPosts = posts.filter((p) => p.isSaved);
  const userReels = reels;

  const displayItems =
    activeTab === "saved"
      ? savedPosts
      : activeTab === "reels"
      ? userReels.map((r) => ({
          id: r.id,
          images: [r.poster],
          likesCount: r.likesCount,
          commentsCount: r.commentsCount,
          isReel: true
        }))
      : userPosts;

  if (username && username !== user.username) {
    return (
      <section className="route-state-page">
        <h1>Profile unavailable</h1>
        <p>The Phase 1 mock dataset only exposes the current PhotoFlow profile.</p>
      </section>
    );
  }

  const openPost = (postId) => {
    if (!postId) return;
    navigate(`/p/${postId}`, { state: { backgroundPath: location.pathname } });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="profile-container">
        {/* Profile Header Info */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img src={user.avatar} alt={user.username} className="profile-avatar-img" />
          </div>

          <div className="profile-info">
            <div className="profile-username-row">
              <h2 className="profile-username">{user.username}</h2>
              {user.isVerified && (
                <span style={{ color: "#0095f6", fontSize: "1.2rem" }}>✓</span>
              )}

              <button
                className="btn-secondary"
                onClick={() =>
                  navigate("/accounts/edit", { state: { backgroundPath: location.pathname } })
                }
              >
                Edit profile
              </button>

              <button className="action-btn">
                <Settings size={22} />
              </button>
            </div>

            <div className="profile-stats">
              <div>
                <strong>{posts.length}</strong> posts
              </div>
              <div>
                <strong>{(user.followersCount / 1000).toFixed(1)}k</strong> followers
              </div>
              <div>
                <strong>{user.followingCount}</strong> following
              </div>
            </div>

            <div className="profile-bio">
              <div style={{ fontWeight: 700 }}>{user.name}</div>
              <div>{user.bio}</div>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--accent-blue)", fontWeight: 600, textDecoration: "none" }}
                >
                  🔗 {user.website.replace("https://", "")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Highlights */}
        {user.highlights && user.highlights.length > 0 && (
          <div style={{ display: "flex", gap: 24, margin: "10px 0" }}>
            {user.highlights.map((h) => (
              <div key={h.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    padding: 3,
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-secondary)"
                  }}
                >
                  <img
                    src={h.cover}
                    alt={h.title}
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{h.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Profile Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 60,
            borderTop: "1px solid var(--border-color)",
            marginTop: 10
          }}
        >
          <div
            onClick={() => setActiveTab("posts")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "16px 0",
              borderTop: activeTab === "posts" ? "2px solid var(--text-primary)" : "2px solid transparent",
              color: activeTab === "posts" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: 1,
              cursor: "pointer",
              textTransform: "uppercase"
            }}
          >
            <Grid size={16} />
            <span>Posts</span>
          </div>

          <div
            onClick={() => setActiveTab("reels")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "16px 0",
              borderTop: activeTab === "reels" ? "2px solid var(--text-primary)" : "2px solid transparent",
              color: activeTab === "reels" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: 1,
              cursor: "pointer",
              textTransform: "uppercase"
            }}
          >
            <Film size={16} />
            <span>Reels</span>
          </div>

          <div
            onClick={() => setActiveTab("saved")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "16px 0",
              borderTop: activeTab === "saved" ? "2px solid var(--text-primary)" : "2px solid transparent",
              color: activeTab === "saved" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: 1,
              cursor: "pointer",
              textTransform: "uppercase"
            }}
          >
            <Bookmark size={16} />
            <span>Saved</span>
          </div>

          <div
            onClick={() => setActiveTab("tagged")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "16px 0",
              borderTop: activeTab === "tagged" ? "2px solid var(--text-primary)" : "2px solid transparent",
              color: activeTab === "tagged" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: 1,
              cursor: "pointer",
              textTransform: "uppercase"
            }}
          >
            <UserCheck size={16} />
            <span>Tagged</span>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="explore-grid" style={{ padding: 0 }}>
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="explore-item"
              role="link"
              tabIndex={0}
              onClick={() => openPost(item.isReel ? posts[0]?.id : item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openPost(item.isReel ? posts[0]?.id : item.id);
                }
              }}
            >
              <img
                src={item.images ? item.images[0] : item.poster}
                alt="Profile post"
                className="explore-media"
              />

              <div className="explore-overlay">
                <div className="explore-stat">
                  <Heart size={20} fill="white" />
                  <span>{item.likesCount}</span>
                </div>
                <div className="explore-stat">
                  <MessageCircle size={20} fill="white" />
                  <span>{item.comments ? item.comments.length : item.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
