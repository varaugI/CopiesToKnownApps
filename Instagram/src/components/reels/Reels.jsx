import React, { useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreVertical,
  Volume2,
  VolumeX,
  Music,
  Check
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Reels = () => {
  const { reels, toggleLikeReel, toggleSaveReel, setActiveShareModalPost } = useApp();
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="reels-container">
        {reels.map((reel) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleLike={() => toggleLikeReel(reel.id)}
            onToggleSave={() => toggleSaveReel(reel.id)}
            onShare={() =>
              setActiveShareModalPost({
                id: reel.id,
                caption: reel.caption,
                images: [reel.poster]
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

const ReelCard = ({
  reel,
  isMuted,
  onToggleMute,
  onToggleLike,
  onToggleSave,
  onShare
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="reel-card">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.poster}
        className="reel-video"
        loop
        autoPlay
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />

      {/* Mute Button Top Right */}
      <button
        onClick={onToggleMute}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0,0,0,0.5)",
          border: "none",
          color: "white",
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10
        }}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Content Overlay Left */}
      <div className="reel-overlay-content">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <img
            src={reel.user.avatar}
            alt={reel.user.username}
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
          />
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{reel.user.username}</span>
          <button
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "4px 12px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Follow
          </button>
        </div>

        <p style={{ fontSize: "0.88rem", marginBottom: 12, lineHeight: 1.4 }}>{reel.caption}</p>

        {/* Audio Track */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", opacity: 0.9 }}>
          <Music size={14} />
          <span>{reel.audioTrack}</span>
        </div>
      </div>

      {/* Action Buttons Right */}
      <div className="reel-actions-sidebar">
        <button className="reel-action-btn" onClick={onToggleLike}>
          <Heart size={28} fill={reel.isLiked ? "#ff3040" : "none"} color={reel.isLiked ? "#ff3040" : "white"} />
          <span>{reel.likesCount.toLocaleString()}</span>
        </button>

        <button className="reel-action-btn">
          <MessageCircle size={28} />
          <span>{reel.commentsCount}</span>
        </button>

        <button className="reel-action-btn" onClick={onShare}>
          <Send size={26} />
        </button>

        <button className="reel-action-btn" onClick={onToggleSave}>
          <Bookmark size={26} fill={reel.isSaved ? "white" : "none"} />
        </button>

        <button className="reel-action-btn">
          <MoreVertical size={24} />
        </button>

        {/* Rotating Sound Disc */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "2px solid white",
            overflow: "hidden",
            marginTop: 8,
            animation: "spin 4s linear infinite"
          }}
        >
          <img src={reel.user.avatar} alt="Disc" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </div>
  );
};
