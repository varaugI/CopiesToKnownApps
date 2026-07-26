import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";

export const StatusViewerModal = () => {
  const { activeStatusGroup, setActiveStatusGroup } = useWhatsApp();
  const [replyText, setReplyText] = useState("");

  if (!activeStatusGroup) return null;

  const currentStory = activeStatusGroup.stories[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setActiveStatusGroup(null)}
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
        style={{
          width: "100%",
          maxWidth: 420,
          height: "85vh",
          backgroundColor: "#111b21",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
        {/* Progress bar */}
        <div style={{ padding: "12px 16px", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div style={{ width: "100%", height: 3, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", backgroundColor: "var(--wa-emerald)" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            <img
              src={activeStatusGroup.contact.avatar}
              alt={activeStatusGroup.contact.name}
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "white" }}>
                {activeStatusGroup.contact.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                {currentStory?.timestamp}
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div style={{ flex: 1, backgroundColor: "#000", position: "relative" }}>
          <img src={currentStory?.media} alt="Status" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          {currentStory?.caption && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 16,
                right: 16,
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: "10px 16px",
                borderRadius: 8,
                color: "white",
                textAlign: "center",
                fontSize: "0.95rem"
              }}
            >
              {currentStory.caption}
            </div>
          )}
        </div>

        {/* Reply Bar */}
        <div style={{ padding: "14px 16px", backgroundColor: "#111b21", display: "flex", gap: 10 }}>
          <input
            type="text"
            placeholder="Reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid var(--wa-border)",
              borderRadius: 24,
              padding: "10px 16px",
              color: "white",
              outline: "none"
            }}
          />
          <button
            onClick={() => setActiveStatusGroup(null)}
            style={{
              backgroundColor: "var(--wa-emerald)",
              color: "#111b21",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
