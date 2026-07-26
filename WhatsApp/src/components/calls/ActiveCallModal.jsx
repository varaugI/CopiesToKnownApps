import React, { useState, useEffect } from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";

export const ActiveCallModal = () => {
  const { activeCall, endCall } = useWhatsApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!activeCall) {
      setSeconds(0);
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [activeCall]);

  if (!activeCall) return null;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="call-modal-overlay">
      {/* Top Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--wa-emerald)", fontWeight: 700, textTransform: "uppercase" }}>
          WhatsApp {activeCall.type === "video" ? "Video Call" : "Voice Call"}
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: 4 }}>{activeCall.contact.name}</h2>
        <div style={{ fontSize: "1rem", color: "var(--text-secondary)", marginTop: 4 }}>
          {formatTimer(seconds)}
        </div>
      </div>

      {/* Center Media / Avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {activeCall.type === "video" && isVideoOn ? (
          <div
            style={{
              width: 280,
              height: 380,
              borderRadius: 20,
              backgroundColor: "#000",
              overflow: "hidden",
              border: "2px solid var(--wa-border)"
            }}
          >
            <img
              src={activeCall.contact.avatar}
              alt="Video Feed"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid var(--wa-emerald)",
              boxShadow: "0 0 30px rgba(0, 168, 132, 0.4)"
            }}
          >
            <img
              src={activeCall.contact.avatar}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            backgroundColor: isMuted ? "#ff3040" : "rgba(255,255,255,0.15)",
            border: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {activeCall.type === "video" && (
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              backgroundColor: !isVideoOn ? "#ff3040" : "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            {!isVideoOn ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
        )}

        <button
          onClick={endCall}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#ff3040",
            border: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(255, 48, 64, 0.5)"
          }}
          title="End Call"
        >
          <PhoneOff size={28} />
        </button>
      </div>
    </div>
  );
};
