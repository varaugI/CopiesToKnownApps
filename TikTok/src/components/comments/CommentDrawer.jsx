import React, { useState } from "react";
import { X, Heart, Smile, Send } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const CommentDrawer = () => {
  const {
    activeCommentVideo,
    setActiveCommentVideoId,
    addCommentToVideo,
    toggleLikeComment
  } = useTikTok();
  const [commentText, setCommentText] = useState("");

  if (!activeCommentVideo) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addCommentToVideo(activeCommentVideo.id, commentText);
      setCommentText("");
    }
  };

  return (
    <div
      className="comment-drawer-overlay"
      onClick={() => setActiveCommentVideoId(null)}
    >
      <div className="comment-drawer-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ width: 24 }} />
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
            {activeCommentVideo.commentsCount.toLocaleString()} comments
          </h3>
          <button
            onClick={() => setActiveCommentVideoId(null)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </header>

        {/* Comment Stream */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {activeCommentVideo.comments.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: 40 }}>
              No comments yet. Be the first to comment!
            </p>
          ) : (
            activeCommentVideo.comments.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 20,
                  alignItems: "flex-start"
                }}
              >
                <img
                  src={c.user.avatar}
                  alt={c.user.username}
                  style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>
                    @{c.user.username}
                    {c.user.isVerified && (
                      <span style={{ color: "#25f4ee", marginLeft: 4 }}>✓</span>
                    )}
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", margin: "4px 0" }}>
                    {c.text}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: 4
                    }}
                  >
                    <span>{c.timestamp}</span>
                    <span style={{ cursor: "pointer", fontWeight: 600 }}>Reply</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <button
                    onClick={() => toggleLikeComment(activeCommentVideo.id, c.id)}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
                  >
                    <Heart
                      size={16}
                      fill={c.isLiked ? "var(--tiktok-magenta)" : "none"}
                      color={c.isLiked ? "var(--tiktok-magenta)" : "var(--text-muted)"}
                    />
                  </button>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {c.likes}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "8px 16px"
            }}
          >
            <Smile size={20} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Add comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "0.9rem"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!commentText.trim()}
            style={{
              background: "none",
              border: "none",
              color: commentText.trim() ? "var(--tiktok-magenta)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};
