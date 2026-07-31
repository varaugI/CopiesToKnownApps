import React from "react";
import { Maximize2, X, Play, Pause } from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const Miniplayer = () => {
  const {
    isMiniplayerActive,
    setIsMiniplayerActive,
    activeWatchVideo,
    openWatchView,
    activeView
  } = useYouTube();

  if (!isMiniplayerActive || activeView === "watch" || !activeWatchVideo) return null;

  return (
    <div className="yt-miniplayer">
      {/* Video Container */}
      <div style={{ flex: 1, position: "relative", backgroundColor: "#000" }}>
        <video
          src={activeWatchVideo.videoUrl}
          poster={activeWatchVideo.thumbnail}
          autoPlay
          controls
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Top Control Overlay */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 8,
            zIndex: 10
          }}
        >
          <button
            onClick={() => openWatchView(activeWatchVideo.id)}
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer"
            }}
            title="Expand to Full Player"
          >
            <Maximize2 size={14} />
          </button>

          <button
            onClick={() => setIsMiniplayerActive(false)}
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer"
            }}
            title="Close Miniplayer"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Title Bar */}
      <div style={{ padding: "8px 12px", backgroundColor: "var(--yt-dark-card)", display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "white",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {activeWatchVideo.title}
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
          {activeWatchVideo.channel.name}
        </span>
      </div>
    </div>
  );
};
