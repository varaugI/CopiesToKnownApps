import React from "react";
import { useYouTube } from "../../context/YouTubeContext";

export const RecommendedSidebar = () => {
  const { videos, activeWatchVideo, openWatchView } = useYouTube();

  const recommended = videos.filter((v) => v.id !== activeWatchVideo?.id);

  return (
    <aside className="watch-sidebar-right">
      <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 8 }}>
        Up next
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {recommended.map((video) => (
          <div
            key={video.id}
            onClick={() => openWatchView(video.id)}
            style={{
              display: "flex",
              gap: 10,
              cursor: "pointer"
            }}
          >
            {/* Small Thumbnail */}
            <div
              style={{
                position: "relative",
                width: 160,
                aspectRatio: "16 / 9",
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: "#000",
                minWidth: 160
              }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="video-duration-badge" style={{ fontSize: "0.68rem" }}>
                {video.duration}
              </span>
            </div>

            {/* Video Meta */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <h4
                style={{
                  fontSize: "0.85rem",
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
              </h4>

              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                {video.channel.name}
              </div>

              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                <span>{video.viewsCount > 1000 ? `${(video.viewsCount / 1000).toFixed(0)}k views` : `${video.viewsCount} views`}</span>
                <span style={{ margin: "0 4px" }}>•</span>
                <span>{video.uploadedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
