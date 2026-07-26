import React, { useState } from "react";
import { X, Link as LinkIcon, Check, Send, Code, Repeat, MessageCircle } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const ShareModal = () => {
  const { activeShareVideo, setActiveShareVideo } = useTikTok();
  const [copied, setCopied] = useState(false);

  if (!activeShareVideo) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: "Repost", icon: <Repeat size={24} color="#25F4EE" />, bg: "rgba(37, 244, 238, 0.15)" },
    { name: "Direct Message", icon: <Send size={24} color="#FE2C55" />, bg: "rgba(254, 44, 85, 0.15)" },
    { name: "Copy Link", icon: copied ? <Check size={24} color="green" /> : <LinkIcon size={24} color="#FACD34" />, bg: "rgba(250, 205, 52, 0.15)", action: handleCopy },
    { name: "Embed", icon: <Code size={24} color="#a8a8a8" />, bg: "rgba(255, 255, 255, 0.1)" }
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={() => setActiveShareVideo(null)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--border-color)",
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Share to</h3>
          <button
            onClick={() => setActiveShareVideo(null)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center" }}>
          {shareOptions.map((opt, i) => (
            <div
              key={i}
              onClick={opt.action ? opt.action : () => setActiveShareVideo(null)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                cursor: "pointer"
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: opt.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {opt.icon}
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                {opt.name === "Copy Link" && copied ? "Copied!" : opt.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
