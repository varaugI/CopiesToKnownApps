import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Smile
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const PostCard = ({ post }) => {
  const {
    toggleLikePost,
    toggleSavePost,
    addComment,
    toggleLikeComment,
    setActiveLikesModalPost,
    setActiveShareModalPost,
    setActiveDetailPost
  } = useApp();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        toggleLikePost(post.id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    } else {
      setLastTap(now);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim()) {
      addComment(post.id, commentInput);
      setCommentInput("");
    }
  };

  return (
    <article className="post-card">
      {/* Post Header */}
      <header className="post-header">
        <div className="post-user-info">
          <div className="post-user-avatar-ring">
            <img
              src={post.user.avatar}
              alt={post.user.username}
              className="post-user-avatar"
            />
          </div>
          <div>
            <div className="post-username">
              {post.user.username}
              {post.user.isVerified && (
                <span style={{ color: "#0095f6", fontSize: "0.8rem", marginLeft: 2 }}>✓</span>
              )}
            </div>
            {post.user.location && <div className="post-location">{post.user.location}</div>}
          </div>
        </div>
        <button className="action-btn">
          <MoreHorizontal size={20} />
        </button>
      </header>

      {/* Media Carousel */}
      <div className="post-media-container" onClick={handleDoubleTap}>
        <img
          src={post.images[currentImgIndex]}
          alt="Post media"
          className="post-media-img"
        />

        {/* Double-tap floating heart */}
        <div className={`floating-heart ${showHeartAnim ? "animate" : ""}`}>
          <Heart size={90} fill="#ffffff" />
        </div>

        {/* Carousel arrows */}
        {post.images.length > 1 && (
          <>
            {currentImgIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIndex((prev) => prev - 1);
                }}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  color: "white",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {currentImgIndex < post.images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIndex((prev) => prev + 1);
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  color: "white",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <ChevronRight size={18} />
              </button>
            )}

            {/* Dots */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "4px"
              }}
            >
              {post.images.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: i === currentImgIndex ? "#0095f6" : "rgba(255,255,255,0.6)"
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button
            className={`action-btn ${post.isLiked ? "liked" : ""}`}
            onClick={() => toggleLikePost(post.id)}
          >
            <Heart size={24} fill={post.isLiked ? "var(--accent-red)" : "none"} />
          </button>
          <button className="action-btn" onClick={() => setActiveDetailPost(post)}>
            <MessageCircle size={24} />
          </button>
          <button className="action-btn" onClick={() => setActiveShareModalPost(post)}>
            <Send size={24} />
          </button>
        </div>

        <button className="action-btn" onClick={() => toggleSavePost(post.id)}>
          <Bookmark size={24} fill={post.isSaved ? "var(--text-primary)" : "none"} />
        </button>
      </div>

      {/* Likes preview */}
      <div className="post-likes-info" onClick={() => setActiveLikesModalPost(post)}>
        {post.likesCount.toLocaleString()} likes
      </div>

      {/* Caption */}
      <div className="post-caption">
        <span className="caption-username">{post.user.username}</span>
        <span>{post.caption}</span>
      </div>

      {/* View all comments */}
      {post.comments.length > 0 && (
        <div
          style={{
            padding: "0 16px 4px 16px",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            cursor: "pointer"
          }}
          onClick={() => setActiveDetailPost(post)}
        >
          View all {post.comments.length} comments
        </div>
      )}

      {/* Recent Comments */}
      {post.comments.slice(-2).map((comment) => (
        <div
          key={comment.id}
          style={{
            padding: "2px 16px",
            fontSize: "0.85rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <strong style={{ marginRight: 6 }}>{comment.user.username}</strong>
            <span>{comment.text}</span>
          </div>
          <button
            className="action-btn"
            onClick={() => toggleLikeComment(post.id, comment.id)}
            style={{ padding: 2 }}
          >
            <Heart
              size={12}
              fill={comment.isLiked ? "var(--accent-red)" : "none"}
              color={comment.isLiked ? "var(--accent-red)" : "var(--text-muted)"}
            />
          </button>
        </div>
      ))}

      {/* Timestamp */}
      <div className="post-timestamp">{post.timestamp}</div>

      {/* Add Comment Bar */}
      <form className="post-add-comment" onSubmit={handleCommentSubmit}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <Smile size={20} color="var(--text-muted)" style={{ cursor: "pointer" }} />
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={`comment-post-btn ${commentInput.trim() ? "active" : ""}`}
          disabled={!commentInput.trim()}
        >
          Post
        </button>
      </form>
    </article>
  );
};
