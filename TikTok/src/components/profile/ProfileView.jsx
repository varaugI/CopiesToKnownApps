import React, { useState } from "react";
import { Grid, Heart, Bookmark, Edit, Share2, Play, Lock } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";
import { EditProfileModal } from "./EditProfileModal";

export const ProfileView = () => {
  const { user, videos, setIsEditProfileOpen } = useTikTok();
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' | 'liked' | 'saved'

  const userVideos = videos;
  const likedVideos = videos.filter((v) => v.isLiked);
  const savedVideos = videos.filter((v) => v.isBookmarked);

  const displayVideos =
    activeTab === "liked"
      ? likedVideos
      : activeTab === "saved"
      ? savedVideos
      : userVideos;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "20px 0" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "0 16px"
        }}
      >
        {/* Profile Header Info */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textCenter: "center" }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid var(--border-color)",
              marginBottom: 12
            }}
          >
            <img src={user.avatar} alt={user.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>@{user.username}</h2>
          <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: 2 }}>{user.name}</div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid var(--border-color)",
                color: "white",
                padding: "8px 24px",
                borderRadius: 4,
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              Edit profile
            </button>
            <button
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid var(--border-color)",
                color: "white",
                padding: "8px 12px",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{ display: "flex", gap: 28, margin: "20px 0 10px 0" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>{user.followingCount}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 6 }}>Following</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>{(user.followersCount / 1000).toFixed(1)}k</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 6 }}>Followers</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>{(user.likesCount / 1000000).toFixed(1)}M</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 6 }}>Likes</span>
            </div>
          </div>

          {/* Bio Text */}
          <p style={{ fontSize: "0.9rem", whiteSpace: "pre-line", textAlign: "center", color: "var(--text-secondary)" }}>
            {user.bio}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid var(--border-color)"
          }}
        >
          <div
            onClick={() => setActiveTab("videos")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 0",
              borderBottom: activeTab === "videos" ? "2px solid white" : "none",
              color: activeTab === "videos" ? "white" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            <Grid size={18} />
            <span>Videos</span>
          </div>

          <div
            onClick={() => setActiveTab("liked")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 0",
              borderBottom: activeTab === "liked" ? "2px solid white" : "none",
              color: activeTab === "liked" ? "white" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            <Heart size={18} />
            <span>Liked</span>
          </div>

          <div
            onClick={() => setActiveTab("saved")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 0",
              borderBottom: activeTab === "saved" ? "2px solid white" : "none",
              color: activeTab === "saved" ? "white" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            <Bookmark size={18} />
            <span>Favorites</span>
          </div>
        </div>

        {/* Video Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12
          }}
        >
          {displayVideos.map((v) => (
            <div
              key={v.id}
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                backgroundColor: "#000",
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer"
              }}
            >
              <img src={v.poster} alt="Video thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

              {/* Views Count Overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)"
                }}
              >
                <Play size={14} fill="white" />
                <span>{v.likesCount > 1000 ? `${(v.likesCount / 1000).toFixed(1)}k` : v.likesCount}</span>
              </div>
            </div>
          ))}
        </div>

        <EditProfileModal />
      </div>
    </div>
  );
};
