import React, { useState } from "react";
import { CheckCheck, Play, Pause, Mic, Image as ImageIcon } from "lucide-react";

export const MessageBubble = ({ message, isMe }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className={`msg-bubble ${isMe ? "sent" : "received"}`}>
      {/* Sender Name in Group Chat */}
      {!isMe && message.senderName && (
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--wa-emerald)", marginBottom: 4 }}>
          {message.senderName}
        </div>
      )}

      {/* Image Message */}
      {message.type === "image" && (
        <div style={{ marginBottom: 6, borderRadius: 6, overflow: "hidden" }}>
          <img
            src={message.image}
            alt="Attachment"
            style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 6, cursor: "pointer" }}
          />
          {message.caption && (
            <p style={{ marginTop: 6, fontSize: "0.9rem" }}>{message.caption}</p>
          )}
        </div>
      )}

      {/* Audio Voice Note Message */}
      {message.type === "audio" && (
        <div className="voice-note-bar">
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              backgroundColor: isMe ? "rgba(255,255,255,0.2)" : "var(--wa-emerald)",
              border: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            {isPlayingAudio ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{ marginLeft: 2 }} />}
          </button>

          <div style={{ flex: 1 }}>
            {/* Waveform Lines */}
            <div className="waveform-lines">
              {[12, 24, 18, 30, 16, 28, 20, 14, 26, 18, 22, 16, 28, 12].map((height, idx) => (
                <div
                  key={idx}
                  className="waveform-line"
                  style={{
                    height: isPlayingAudio ? `${Math.floor(Math.random() * 20 + 10)}px` : `${height}px`,
                    backgroundColor: isPlayingAudio && idx < 6 ? "var(--wa-emerald-light)" : "var(--text-secondary)"
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: 4 }}>
              {message.audioDuration || "0:38"}
            </div>
          </div>
        </div>
      )}

      {/* Text Message */}
      {message.type === "text" && <span>{message.text}</span>}

      {/* Message Metadata (Timestamp & Read Ticks) */}
      <span className="msg-meta">
        <span>{message.timestamp}</span>
        {isMe && <CheckCheck size={16} className="blue-ticks" />}
      </span>
    </div>
  );
};
