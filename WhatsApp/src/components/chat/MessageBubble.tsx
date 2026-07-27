import React, { useState } from "react";
import { CheckCheck, Check, Clock, Play, Pause } from "lucide-react";
import { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const renderStatusIcon = () => {
    if (!isMe) return null;
    if (message.status === "read" || message.status === "READ") {
      return (
        <span title="Read">
          <CheckCheck size={16} className="blue-ticks" />
        </span>
      );
    }
    if (message.status === "delivered" || message.status === "DELIVERED") {
      return (
        <span title="Delivered">
          <CheckCheck size={16} style={{ color: "var(--text-secondary)" }} />
        </span>
      );
    }
    if (message.status === "sent" || message.status === "SENT" || message.status === "ACCEPTED") {
      return (
        <span title="Sent to server">
          <Check size={16} style={{ color: "var(--text-secondary)" }} />
        </span>
      );
    }
    return (
      <span title="Local simulation (Pending server receipt)">
        <Clock size={14} style={{ color: "var(--text-secondary)", marginLeft: 2 }} />
      </span>
    );
  };

  return (
    <div className={`msg-bubble ${isMe ? "sent" : "received"}`}>
      {/* Sender Name in Group Chat */}
      {!isMe && message.senderName && (
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--wa-emerald)", marginBottom: 4 }}>
          {message.senderName}
        </div>
      )}

      {/* Image Message */}
      {message.type === "image" && message.image && (
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
        {renderStatusIcon()}
      </span>
    </div>
  );
};
