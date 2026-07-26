import React, { useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Plus,
  Music,
  Volume2,
  VolumeX,
  Play
} from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const VideoCard = ({ video }) => {
  const {
    toggleLikeVideo,
    toggleBookmarkVideo,
    toggleFollowUser,
    setActiveCommentVideoId,
    setActiveShareVideo
  } = useTikTok();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (!video.isLiked) {
        toggleLikeVideo(video.id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 850);
    } else {
      // Single tap toggle play/pause
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
    setLastTapTime(now);
  };

  return (
    <div className="video-card">
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.poster}
        className="video-element"
        loop
        autoPlay
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
      />

      {/* Play/Pause Overlay Indicator */}
      {!isPlaying && (
        <div
          onClick={handleVideoClick}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 10,
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
          >
            <Play size={36} fill="white" style={{ marginLeft: 4 }} />
          </div>
        </div>
      )}

      {/* Double Tap Floating Heart */}
      <div className={`tiktok-floating-heart ${showHeartAnim ? "pop" : ""}`}>
        <Heart size={100} fill="var(--tiktok-magenta)" color="var(--tiktok-magenta)" />
      </div>

      {/* Mute Button Top Right */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0,0,0,0.5)",
          border: "none",
          color: "white",
          borderRadius: "50%",
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 15
        }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Overlay Bottom Left Info */}
      <div className="video-overlay-info">
        <div className="creator-handle">
          <span>@{video.user.username}</span>
          {video.user.isVerified && (
            <span style={{ color: "#25f4ee", fontSize: "0.85rem" }}>✓</span>
          )}
        </div>

        <p className="video-caption-text">{video.caption}</p>

        {/* Music Track Marquee */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", opacity: 0.9 }}>
          <Music size={16} />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>
            {video.sound}
          </span>
        </div>
      </div>

      {/* Floating Action Column Right */}
      <div className="video-actions-sidebar">
        {/* Creator Avatar & Follow button */}
        <div style={{ position: "relative", marginBottom: 6 }}>
          <img
            src={video.user.avatar}
            alt={video.user.username}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white"
            }}
          />
          {!video.user.isFollowing && (
            <div
              onClick={() => toggleFollowUser(video.user.username)}
              style={{
                position: "absolute",
                bottom: -6,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--tiktok-magenta)",
                color: "white",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.5)"
              }}
            >
              <Plus size={16} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Like */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button className="action-btn-circle" onClick={() => toggleLikeVideo(video.id)}>
            <Heart
              size={26}
              fill={video.isLiked ? "var(--tiktok-magenta)" : "none"}
              color={video.isLiked ? "var(--tiktok-magenta)" : "white"}
            />
          </button>
          <span className="action-label">
            {video.likesCount > 1000 ? `${(video.likesCount / 1000).toFixed(1)}k` : video.likesCount}
          </span>
        </div>

        {/* Comment */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button
            className="action-btn-circle"
            onClick={() => setActiveCommentVideoId(video.id)}
          >
            <MessageCircle size={26} fill="white" />
          </button>
          <span className="action-label">
            {video.commentsCount > 1000 ? `${(video.commentsCount / 1000).toFixed(1)}k` : video.commentsCount}
          </span>
        </div>

        {/* Bookmark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button className="action-btn-circle" onClick={() => toggleBookmarkVideo(video.id)}>
            <Bookmark
              size={26}
              fill={video.isBookmarked ? "#FACD34" : "none"}
              color={video.isBookmarked ? "#FACD34" : "white"}
            />
          </button>
          <span className="action-label">
            {video.bookmarksCount > 1000 ? `${(video.bookmarksCount / 1000).toFixed(1)}k` : video.bookmarksCount}
          </span>
        </div>

        {/* Share */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button className="action-btn-circle" onClick={() => setActiveShareVideo(video)}>
            <Share2 size={26} fill="white" />
          </button>
          <span className="action-label">
            {video.sharesCount > 1000 ? `${(video.sharesCount / 1000).toFixed(1)}k` : video.sharesCount}
          </span>
        </div>

        {/* Spinning Vinyl Disc */}
        <div className="spinning-disc-container">
          <img src={video.user.avatar} alt="Record" className="spinning-disc-img" />
        </div>
      </div>
    </div>
  );
};
