import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  MoreHorizontal,
  Check
} from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const VideoPlayer = ({ video }) => {
  const { toggleLikeVideo, toggleSubscribeChannel } = useYouTube();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* HTML5 Video Canvas */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          backgroundColor: "#000000",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
        }}
      >
        <video
          src={video.videoUrl}
          poster={video.thumbnail}
          controls
          autoPlay
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Video Title */}
      <h1 style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1.3 }}>
        {video.title}
      </h1>

      {/* Channel Header & Action Toolbar */}
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
              cursor: "pointer",
              marginLeft: 10
            }}
          >
            {video.channel.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Action Toolbar Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Like / Dislike Pill */}
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
          <span>{video.viewsCount.toLocaleString()} views</span>
          <span style={{ margin: "0 8px" }}>•</span>
          <span>{video.uploadedAt}</span>
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
