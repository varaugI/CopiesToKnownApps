import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, SortDesc } from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const CommentsSection = ({ video }) => {
  const { user, addCommentToVideo } = useYouTube();
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addCommentToVideo(video.id, commentText);
      setCommentText("");
    }
  };

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Comments Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
          {video.comments.length} Comments
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 }}>
          <SortDesc size={18} />
          <span>Sort by</span>
        </div>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              borderBottom: "1px solid var(--yt-border)",
              padding: "8px 0",
              color: "var(--text-primary)",
              outline: "none",
              fontSize: "0.92rem"
            }}
          />

          {commentText.trim() && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setCommentText("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  padding: "8px 16px"
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  backgroundColor: "var(--yt-red)",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "8px 18px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
        {video.comments.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <img
              src={c.user.avatar}
              alt={c.user.name}
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{c.user.name}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.timestamp}</span>
              </div>

              <p style={{ fontSize: "0.9rem", lineHeight: 1.4, marginBottom: 8 }}>{c.text}</p>

              <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <ThumbsUp size={14} />
                  <span>{c.likesCount || ""}</span>
                </div>
                <ThumbsDown size={14} style={{ cursor: "pointer" }} />
                <span style={{ cursor: "pointer", fontWeight: 700 }}>Reply</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
