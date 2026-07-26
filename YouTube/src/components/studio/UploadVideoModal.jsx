import React, { useState } from "react";
import { X, Upload, Video as VideoIcon } from "lucide-react";
import { useYouTube } from "../../context/YouTubeContext";

export const UploadVideoModal = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, createVideo, categories } = useYouTube();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Coding");
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"
  );
  const [videoUrl, setVideoUrl] = useState(
    "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4"
  );

  if (!isUploadModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      createVideo({
        title,
        description,
        videoUrl,
        thumbnail,
        category
      });
      setIsUploadModalOpen(false);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={() => setIsUploadModalOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 650,
          backgroundColor: "var(--yt-dark-card)",
          borderRadius: 16,
          border: "1px solid var(--yt-border)",
          padding: 24,
          boxShadow: "0 20px 50px rgba(0,0,0,0.7)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <VideoIcon size={24} color="var(--yt-red)" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>YouTube Studio - Upload Video</h3>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 6, display: "block" }}>
              Video Title *
            </label>
            <input
              type="text"
              placeholder="Add a title that describes your video..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "var(--yt-dark-body)",
                border: "1px solid var(--yt-border)",
                color: "white",
                outline: "none",
                fontSize: "0.92rem"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 6, display: "block" }}>
              Description
            </label>
            <textarea
              placeholder="Tell viewers about your video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                height: 90,
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "var(--yt-dark-body)",
                border: "1px solid var(--yt-border)",
                color: "white",
                outline: "none",
                resize: "none",
                fontSize: "0.9rem"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 6, display: "block" }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "var(--yt-dark-body)",
                border: "1px solid var(--yt-border)",
                color: "white",
                outline: "none",
                fontSize: "0.9rem"
              }}
            >
              {categories.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat} style={{ backgroundColor: "#111" }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                padding: "10px 20px",
                fontWeight: 700,
                cursor: "pointer"
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
                padding: "10px 24px",
                fontWeight: 800,
                fontSize: "0.92rem",
                cursor: "pointer"
              }}
            >
              Publish Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
