import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  Check,
  Maximize2,
  Settings,
  Bell,
  Sparkles,
  Minimize2
} from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const VideoPlayer = ({ video }) => {
  const {
    toggleLikeVideo,
    toggleSubscribeChannel,
    isAmbientMode,
    setIsAmbientMode,
    isTheaterMode,
    setIsTheaterMode,
    setIsMiniplayerActive,
    openSaveToPlaylistModal
  } = useYouTube();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [quality, setQuality] = useState("1080p60 HD");
  const [playbackSpeed, setPlaybackSpeed] = useState("1x Normal");
  const [bellState, setBellState] = useState("all"); // 'all' | 'personalised' | 'none'
  const [isBellMenuOpen, setIsBellMenuOpen] = useState(false);

  // Keyboard Shortcuts Listener (Space/K, F, M, T, I)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing inside input/textarea
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

      if (e.key.toLowerCase() === "t") {
        setIsTheaterMode((prev) => !prev);
      } else if (e.key.toLowerCase() === "i") {
        setIsMiniplayerActive((prev) => !prev);
      } else if (e.key.toLowerCase() === "a") {
        setIsAmbientMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsAmbientMode, setIsMiniplayerActive, setIsTheaterMode]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Ambient Glow & Player Frame Container */}
      <div className="ambient-glow-container">
        {isAmbientMode && (
          <div
            className="ambient-glow-backdrop"
            style={{ backgroundColor: video.ambientColor || "rgba(255, 0, 0, 0.3)" }}
          />
        )}

        {/* HTML5 Video Canvas */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: isTheaterMode ? "21 / 9" : "16 / 9",
            backgroundColor: "#000000",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 14px 40px rgba(0,0,0,0.7)",
            zIndex: 1
          }}
        >
          <video
            src={video.videoUrl}
            poster={video.thumbnail}
            controls
            autoPlay
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />

          {/* Quick Settings & Mode Buttons Top Right Overlay */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 10
            }}
          >
            {/* Ambient Toggle */}
            <button
              onClick={() => setIsAmbientMode(!isAmbientMode)}
              style={{
                backgroundColor: isAmbientMode ? "rgba(255, 0, 0, 0.8)" : "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: 20,
                padding: "6px 12px",
                color: "white",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
              title="Toggle Ambient Glow (A)"
            >
              <Sparkles size={14} />
              <span>Glow</span>
            </button>

            {/* Theater Mode Toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer"
              }}
              title="Theater Mode (T)"
            >
              {isTheaterMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Settings Gear Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  cursor: "pointer"
                }}
                title="Settings"
              >
                <Settings size={16} />
              </button>

              {isSettingsOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 40,
                    right: 0,
                    backgroundColor: "rgba(15, 15, 15, 0.95)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid var(--yt-border)",
                    borderRadius: 12,
                    padding: 12,
                    width: 200,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                    zIndex: 100
                  }}
                >
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-secondary)", marginBottom: 8 }}>
                    Quality
                  </div>
                  {["1080p60 HD", "720p", "480p"].map((q) => (
                    <div
                      key={q}
                      onClick={() => {
                        setQuality(q);
                        setIsSettingsOpen(false);
                      }}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: quality === q ? 800 : 500,
                        color: quality === q ? "var(--yt-red)" : "white"
                      }}
                    >
                      {q}
                    </div>
                  ))}

                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-secondary)", margin: "8px 0" }}>
                    Playback Speed
                  </div>
                  {["0.5x", "1x Normal", "1.5x", "2x"].map((spd) => (
                    <div
                      key={spd}
                      onClick={() => {
                        setPlaybackSpeed(spd);
                        setIsSettingsOpen(false);
                      }}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: playbackSpeed === spd ? 800 : 500,
                        color: playbackSpeed === spd ? "var(--yt-red)" : "white"
                      }}
                    >
                      {spd}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Title */}
      <h1 style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1.3 }}>
        {video.title}
      </h1>

      {/* Creator Bar & Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}
      >
        {/* Creator Info & Subscribe Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src={video.channel.avatar}
            alt={video.channel.name}
            style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
          />

          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 4 }}>
              <span>{video.channel.name}</span>
              {video.channel.isVerified && (
                <span style={{ color: "#aaa", fontSize: "0.8rem" }}>✓</span>
              )}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {(video.channel.subscribersCount / 1000).toFixed(0)}k subscribers
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 10 }}>
            <button
              onClick={() => toggleSubscribeChannel(video.channel.id)}
              style={{
                backgroundColor: video.channel.isSubscribed ? "var(--yt-dark-card)" : "var(--text-primary)",
                color: video.channel.isSubscribed ? "var(--text-primary)" : "var(--yt-dark-body)",
                border: video.channel.isSubscribed ? "1px solid var(--yt-border)" : "none",
                borderRadius: 20,
                padding: "8px 18px",
                fontWeight: 800,
                fontSize: "0.88rem",
                cursor: "pointer"
              }}
            >
              {video.channel.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>

            {video.channel.isSubscribed && (
              <button
                onClick={() => setIsBellMenuOpen(!isBellMenuOpen)}
                style={{
                  backgroundColor: "var(--yt-dark-card)",
                  border: "1px solid var(--yt-border)",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  cursor: "pointer"
                }}
                title="Notifications"
              >
                <Bell size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Action Toolbar Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Like / Dislike Combined Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--yt-dark-card)",
              borderRadius: 20,
              overflow: "hidden"
            }}
          >
            <button
              onClick={() => toggleLikeVideo(video.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                padding: "8px 14px",
                color: video.isLiked ? "var(--yt-red)" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                borderRight: "1px solid var(--yt-border)"
              }}
            >
              <ThumbsUp size={18} fill={video.isLiked ? "var(--yt-red)" : "none"} />
              <span>{video.likesCount > 1000 ? `${(video.likesCount / 1000).toFixed(1)}k` : video.likesCount}</span>
            </button>

            <button
              style={{
                background: "none",
                border: "none",
                padding: "8px 14px",
                color: "var(--text-primary)",
                cursor: "pointer"
              }}
            >
              <ThumbsDown size={18} />
            </button>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "var(--yt-dark-card)",
              border: "none",
              borderRadius: 20,
              padding: "8px 14px",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            {isCopied ? <Check size={18} color="green" /> : <Share2 size={18} />}
            <span>{isCopied ? "Link Copied!" : "Share"}</span>
          </button>

          {/* Save to Playlist */}
          <button
            onClick={() => openSaveToPlaylistModal(video.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "var(--yt-dark-card)",
              border: "none",
              borderRadius: 20,
              padding: "8px 14px",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            <Bookmark size={18} />
            <span>Save</span>
          </button>

          {/* Download */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "var(--yt-dark-card)",
              border: "none",
              borderRadius: 20,
              padding: "8px 14px",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            <Download size={18} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Description Box */}
      <div
        style={{
          backgroundColor: "var(--yt-dark-card)",
          borderRadius: 12,
          padding: 16,
          cursor: "pointer"
        }}
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
      >
        <div style={{ fontWeight: 800, fontSize: "0.88rem", marginBottom: 8 }}>
          <span>{typeof video.viewsCount === 'number' ? video.viewsCount.toLocaleString() : video.viewsCount} views</span>
          <span style={{ margin: "0 8px" }}>•</span>
          <span>{video.uploadedAt}</span>
          <span style={{ margin: "0 8px" }}>•</span>
          <span style={{ color: "var(--yt-red)", fontWeight: 700 }}>{quality}</span>
        </div>

        <p
          style={{
            fontSize: "0.9rem",
            lineHeight: 1.5,
            whiteSpace: isDescriptionExpanded ? "pre-line" : "nowrap",
            overflow: isDescriptionExpanded ? "visible" : "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {video.description}
        </p>

        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-secondary)", marginTop: 8, display: "inline-block" }}>
          {isDescriptionExpanded ? "Show less" : "Show more"}
        </span>
      </div>
    </div>
  );
};
