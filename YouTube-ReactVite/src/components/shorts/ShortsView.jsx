import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Music, Volume2, VolumeX } from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const ShortsView = () => {
  const { shorts } = useYouTube();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      {shorts.map((short) => (
        <ShortCard key={short.id} short={short} />
      ))}
    </div>
  );
};

const ShortCard = ({ short }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(short.likesCount);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div
      style={{
        width: 380,
        height: 680,
        backgroundColor: "#000",
        borderRadius: 16,
        position: "relative",
        overflow: "hidden",
        marginBottom: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
      }}
    >
      <video
        src={short.videoUrl}
        poster={short.poster}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Overlay Info Left */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 16,
          right: 70,
          color: "white",
          zIndex: 10,
          textShadow: "0 1px 4px rgba(0,0,0,0.8)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <img
            src={short.channel.avatar}
            alt={short.channel.name}
            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
          />
          <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>{short.channel.name}</span>
          <button
            style={{
              backgroundColor: "white",
              color: "black",
              border: "none",
              borderRadius: 20,
              padding: "4px 12px",
              fontWeight: 800,
              fontSize: "0.78rem",
              cursor: "pointer"
            }}
          >
            Subscribe
          </button>
        </div>

        <p style={{ fontSize: "0.88rem", lineHeight: 1.3, marginBottom: 10 }}>{short.title}</p>
      </div>

      {/* Action Column Right */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          zIndex: 10
        }}
      >
        <button
          onClick={toggleLike}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4
            }}
          >
            <ThumbsUp size={22} fill={isLiked ? "var(--yt-red)" : "none"} color={isLiked ? "var(--yt-red)" : "white"} />
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{(likes / 1000).toFixed(1)}k</span>
        </button>

        <button
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4
            }}
          >
            <MessageSquare size={22} />
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{short.commentsCount}</span>
        </button>

        <button
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Share2 size={22} />
          </div>
        </button>
      </div>
    </div>
  );
};
