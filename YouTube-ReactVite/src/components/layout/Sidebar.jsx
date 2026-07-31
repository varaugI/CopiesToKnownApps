import React from "react";
import {
  Home,
  Film,
  Users,
  History,
  Clock,
  ThumbsUp,
  FolderHeart,
  Flame,
  Music,
  Gamepad2,
  Code
} from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const Sidebar = () => {
  const { activeView, setActiveView, videos } = useYouTube();

  const subscribedChannels = videos
    .filter((v) => v.channel.isSubscribed)
    .map((v) => v.channel);

  // Remove duplicates
  const uniqueChannels = Array.from(new Set(subscribedChannels.map((c) => c.id))).map(
    (id) => subscribedChannels.find((c) => c.id === id)
  );

  return (
    <aside className="yt-sidebar">
      {/* Primary Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 12, borderBottom: "1px solid var(--yt-border)" }}>
        <div
          className={`yt-sidebar-item ${activeView === "home" ? "active" : ""}`}
          onClick={() => setActiveView("home")}
        >
          <Home size={22} />
          <span className="nav-text">Home</span>
        </div>

        <div
          className={`yt-sidebar-item ${activeView === "shorts" ? "active" : ""}`}
          onClick={() => setActiveView("shorts")}
        >
          <Film size={22} color="var(--yt-red)" />
          <span className="nav-text">Shorts</span>
        </div>

        <div
          className={`yt-sidebar-item ${activeView === "subscriptions" ? "active" : ""}`}
          onClick={() => setActiveView("subscriptions")}
        >
          <Users size={22} />
          <span className="nav-text">Subscriptions</span>
        </div>
      </div>

      {/* You / Library Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 0", borderBottom: "1px solid var(--yt-border)" }}>
        <div className="sidebar-section-title" style={{ padding: "0 14px", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-secondary)", marginBottom: 4 }}>
          You
        </div>

        <div
          className={`yt-sidebar-item ${activeView === "library" ? "active" : ""}`}
          onClick={() => setActiveView("library")}
        >
          <History size={22} />
          <span className="nav-text">History</span>
        </div>

        <div className="yt-sidebar-item" onClick={() => setActiveView("library")}>
          <Clock size={22} />
          <span className="nav-text">Watch Later</span>
        </div>

        <div className="yt-sidebar-item" onClick={() => setActiveView("library")}>
          <ThumbsUp size={22} />
          <span className="nav-text">Liked videos</span>
        </div>
      </div>

      {/* Subscriptions Channels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 0" }}>
        <div className="sidebar-section-title" style={{ padding: "0 14px", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-secondary)", marginBottom: 4 }}>
          Subscriptions
        </div>

        {uniqueChannels.map((ch) => (
          <div
            key={ch.id}
            className="yt-sidebar-item"
            onClick={() => setActiveView("channel")}
            style={{ gap: 14 }}
          >
            <img
              src={ch.avatar}
              alt={ch.name}
              style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }}
            />
            <span className="nav-text" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {ch.name}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};
