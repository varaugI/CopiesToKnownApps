import React, { useState } from "react";
import { VideoCard } from "../feed/VideoCard";
import { useYouTube } from "../../context/YouTubeContext";

export const ChannelView = () => {
  const { user, videos } = useYouTube();
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' | 'shorts' | 'about'

  const channelVideos = videos;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      {/* Banner */}
      <div
        style={{
          width: "100%",
          height: 180,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#272727"
        }}
      >
        <img src={user.banner} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Header Info */}
      <div style={{ display: "flex", gap: 24, alignItems: "center", padding: "0 10px" }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
        />

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{user.name}</h1>
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: "4px 0" }}>
            <span>{user.handle}</span>
            <span style={{ margin: "0 6px" }}>•</span>
            <span>{(user.subscribersCount / 1000).toFixed(1)}k subscribers</span>
            <span style={{ margin: "0 6px" }}>•</span>
            <span>{videos.length} videos</span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: 4 }}>
            Digital Creator & Software Engineer 🚀 Sharing modern Web Development courses and coding tutorials.
          </p>
        </div>

        <button
          style={{
            backgroundColor: "var(--text-primary)",
            color: "var(--yt-dark-body)",
            border: "none",
            borderRadius: 20,
            padding: "10px 24px",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer"
          }}
        >
          Customize channel
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 32,
          borderBottom: "1px solid var(--yt-border)",
          padding: "0 10px"
        }}
      >
        {["Videos", "Shorts", "Playlists", "About"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{
              background: "none",
              border: "none",
              color: activeTab === tab.toLowerCase() ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: activeTab === tab.toLowerCase() ? 800 : 600,
              fontSize: "0.95rem",
              padding: "12px 0",
              borderBottom: activeTab === tab.toLowerCase() ? "2px solid var(--text-primary)" : "none",
              cursor: "pointer"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="video-grid" style={{ padding: "0 10px" }}>
        {channelVideos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
};
