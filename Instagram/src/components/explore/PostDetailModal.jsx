import React, { useState } from "react";
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Smile,
  MoreHorizontal
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const PostDetailModal = () => {
  const {
    activeDetailPost,
    setActiveDetailPost,
    toggleLikePost,
    toggleSavePost,
    addComment,
    toggleLikeComment
  } = useApp();
  const [commentText, setCommentText] = useState("");

  if (!activeDetailPost) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(activeDetailPost.id, commentText);
      setCommentText("");
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveDetailPost(null)}>
      <button
        onClick={() => setActiveDetailPost(null)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          zIndex: 2010
        }}
      >
        <X size={32} />
      </button>

      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 950,
          width: "90%",
          height: "85vh",
          display: "flex",
          flexDirection: "row",
          borderRadius: 12
        }}
      >
        {/* Left Side: Media */}
        <div
          style={{
            flex: 1.3,
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          <img
            src={activeDetailPost.images[0]}
            alt="Detail Post"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Right Side: Details & Comments */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--bg-primary)"
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid var(--border-color)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={activeDetailPost.user.avatar}
                alt={activeDetailPost.user.username}
                style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                {activeDetailPost.user.username}
              </span>
            </div>
            <button className="action-btn">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Comments List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {/* Caption */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <img
                src={activeDetailPost.user.avatar}
                alt={activeDetailPost.user.username}
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <span style={{ fontWeight: 700, marginRight: 6, fontSize: "0.9rem" }}>
                  {activeDetailPost.user.username}
                </span>
                <span style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                  {activeDetailPost.caption}
                </span>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                  {activeDetailPost.timestamp}
                </div>
              </div>
            </div>

            {/* Comment Items */}
            {activeDetailPost.comments?.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <img
                    src={c.user.avatar}
                    alt={c.user.username}
                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <span style={{ fontWeight: 700, marginRight: 6, fontSize: "0.88rem" }}>
                      {c.user.username}
                    </span>
                    <span style={{ fontSize: "0.88rem" }}>{c.text}</span>
                    <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      <span>{c.timestamp}</span>
                      {c.likes > 0 && <span>{c.likes} likes</span>}
                      <span style={{ cursor: "pointer" }}>Reply</span>
                    </div>
                  </div>
                </div>

                <button
                  className="action-btn"
                  onClick={() => toggleLikeComment(activeDetailPost.id, c.id)}
                >
                  <Heart
                    size={14}
                    fill={c.isLiked ? "var(--accent-red)" : "none"}
                    color={c.isLiked ? "var(--accent-red)" : "var(--text-muted)"}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div
            style={{
              padding: "12px 16px 8px 16px",
              borderTop: "1px solid var(--border-color)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <button
                  className={`action-btn ${activeDetailPost.isLiked ? "liked" : ""}`}
                  onClick={() => toggleLikePost(activeDetailPost.id)}
                >
                  <Heart size={24} fill={activeDetailPost.isLiked ? "var(--accent-red)" : "none"} />
                </button>
                <button className="action-btn">
                  <MessageCircle size={24} />
                </button>
                <button className="action-btn">
                  <Send size={24} />
                </button>
              </div>
              <button className="action-btn" onClick={() => toggleSavePost(activeDetailPost.id)}>
                <Bookmark size={24} fill={activeDetailPost.isSaved ? "var(--text-primary)" : "none"} />
              </button>
            </div>

            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
              {activeDetailPost.likesCount.toLocaleString()} likes
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>
              {activeDetailPost.timestamp}
            </div>
          </div>

          {/* Add Comment Form */}
          <form className="post-add-comment" onSubmit={handleSubmit}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <Smile size={20} color="var(--text-muted)" />
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`comment-post-btn ${commentText.trim() ? "active" : ""}`}
              disabled={!commentText.trim()}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
