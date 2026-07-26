import React, { useState } from "react";
import { UploadCloud, Music, Lock, Globe, Users, Check } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const UploadStudio = () => {
  const { uploadVideo, user } = useTikTok();

  const [selectedVideo, setSelectedVideo] = useState(
    "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4"
  );
  const [caption, setCaption] = useState("");
  const [sound, setSound] = useState(`Original Sound - ${user.username} 🎵`);
  const [privacy, setPrivacy] = useState("public");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedVideo(url);
    }
  };

  const handlePost = () => {
    uploadVideo({
      videoUrl: selectedVideo,
      caption,
      sound
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "30px 20px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          backgroundColor: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--border-color)",
          padding: 30,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>Upload video</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 24 }}>
          Post a video to your TikTok account
        </p>

        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {/* Left Drag & Drop / Video Preview */}
          <div
            style={{
              flex: 1,
              minWidth: 280,
              height: 440,
              border: "2px dashed var(--border-hover)",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: 20,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "black"
            }}
          >
            {selectedVideo ? (
              <video
                src={selectedVideo}
                controls
                autoPlay
                loop
                muted
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <>
                <UploadCloud size={48} color="var(--tiktok-magenta)" />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>Select video to upload</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                    Or drag and drop a file
                  </div>
                </div>

                <label className="tiktok-btn-primary" style={{ cursor: "pointer" }}>
                  Select file
                  <input type="file" accept="video/*" onChange={handleFileUpload} style={{ display: "none" }} />
                </label>
              </>
            )}
          </div>

          {/* Right Form Fields */}
          <div style={{ flex: 1.2, minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 8, display: "block" }}>
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption with #hashtags and @mentions..."
                style={{
                  width: "100%",
                  height: 100,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  padding: 12,
                  color: "white",
                  outline: "none",
                  resize: "none",
                  fontSize: "0.9rem"
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 8, display: "block" }}>
                Audio Track
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  padding: "10px 14px"
                }}
              >
                <Music size={18} color="var(--tiktok-cyan)" />
                <input
                  type="text"
                  value={sound}
                  onChange={(e) => setSound(e.target.value)}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "white",
                    width: "100%",
                    fontSize: "0.9rem"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 8, display: "block" }}>
                Who can watch this video
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { id: "public", label: "Public", icon: <Globe size={16} /> },
                  { id: "friends", label: "Friends", icon: <Users size={16} /> },
                  { id: "private", label: "Private", icon: <Lock size={16} /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPrivacy(item.id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "8px 0",
                      backgroundColor: privacy === item.id ? "rgba(254, 44, 85, 0.2)" : "rgba(255,255,255,0.06)",
                      border: privacy === item.id ? "1px solid var(--tiktok-magenta)" : "1px solid var(--border-color)",
                      borderRadius: 8,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              <button
                className="tiktok-btn-primary"
                onClick={handlePost}
                style={{ flex: 1, padding: "12px 0", justifyContent: "center" }}
              >
                Post Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
