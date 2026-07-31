import React from "react";
import { useYouTube } from "../../context/YouTubeContext";

export const VideoCard = ({ video }) => {
  const { openWatchView } = useYouTube();

  return (
    <div className="video-card-item" onClick={() => openWatchView(video.id)}>
      {/* Thumbnail */}
      <div className="thumbnail-container">
        <img src={video.thumbnail} alt={video.title} className="thumbnail-img" />
        <span className="video-duration-badge">{video.duration}</span>
      </div>

      {/* Details */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <img
          src={video.channel.avatar}
          alt={video.channel.name}
          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
        />

        <div style={{ flex: 1, overflow: "hidden" }}>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: 4
            }}
          >
            {video.title}
          </h3>

          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
            <span>{video.channel.name}</span>
            {video.channel.isVerified && (
              <span style={{ color: "#aaa", fontSize: "0.75rem" }}>✓</span>
            )}
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
            <span>{video.viewsCount > 1000 ? `${(video.viewsCount / 1000).toFixed(0)}k views` : `${video.viewsCount} views`}</span>
            <span style={{ margin: "0 4px" }}>•</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
