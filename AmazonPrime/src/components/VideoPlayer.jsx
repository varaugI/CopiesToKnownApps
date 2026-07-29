import React, { useState } from "react";
import { ArrowLeft, Film, Music, User } from "lucide-react";
import { usePrime } from "../context/PrimeContext";

export const VideoPlayer = () => {
  const { activePlayingVideo, setActiveView } = usePrime();
  const [showXRay, setShowXRay] = useState(true);

  if (!activePlayingVideo) return null;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#000", zIndex: 1000 }}>
      {/* HTML5 Video Canvas */}
      <video
        src={activePlayingVideo.videoUrl}
        controls
        autoPlay
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />

      {/* Back Button */}
      <button
        onClick={() => setActiveView("home")}
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          backgroundColor: "rgba(0,0,0,0.7)",
          border: "1px solid var(--prime-border)",
          borderRadius: 20,
          padding: "8px 16px",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 700,
          zIndex: 1100
        }}
      >
        <ArrowLeft size={18} />
        <span>Back to Prime Video</span>
      </button>

      {/* X-Ray Vision Overlay */}
      {showXRay && activePlayingVideo.xrayCast && (
        <div className="xray-overlay">
          <div style={{ fontSize: "0.78rem", fontWeight: 900, color: "var(--prime-blue)", marginBottom: 8, letterSpacing: "1px" }}>
            X-RAY VISION
          </div>

          <div style={{ fontSize: "0.85rem", fontWeight: 800, marginBottom: 8 }}>In This Scene</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.82rem" }}>
            {activePlayingVideo.xrayCast?.map((cast, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <User size={14} color="var(--text-secondary)" />
                <span style={{ fontWeight: 700 }}>{cast.name}</span>
                <span style={{ color: "var(--text-secondary)" }}>as {cast.role}</span>
              </div>
            ))}
          </div>

          {activePlayingVideo.xrayMusic && (
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--prime-border)", fontSize: "0.82rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--prime-blue)" }}>
                <Music size={14} />
                <span>{activePlayingVideo.xrayMusic[0].track} - {activePlayingVideo.xrayMusic[0].artist}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
