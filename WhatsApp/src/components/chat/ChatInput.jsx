import React, { useState } from "react";
import { Smile, Paperclip, Mic, Send } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";
import { AttachmentModal } from "./AttachmentModal";

export const ChatInput = ({ chatId }) => {
  const { sendMessage } = useWhatsApp();
  const [text, setText] = useState("");
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(chatId, { text: text.trim(), type: "text" });
      setText("");
    }
  };

  const handleVoiceNote = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      sendMessage(chatId, { type: "audio", audioDuration: "0:42" });
      setIsRecordingVoice(false);
    }, 1500);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "12px 16px",
          backgroundColor: "var(--wa-dark-panel)",
          borderTop: "1px solid var(--wa-border)",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}
      >
        <button
          type="button"
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
        >
          <Smile size={24} />
        </button>

        <button
          type="button"
          onClick={() => setIsAttachmentOpen(true)}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          title="Attach"
        >
          <Paperclip size={22} />
        </button>

        <div
          style={{
            flex: 1,
            backgroundColor: "var(--wa-dark-body)",
            borderRadius: 8,
            padding: "9px 14px",
            display: "flex",
            alignItems: "center"
          }}
        >
          <input
            type="text"
            placeholder={isRecordingVoice ? "Recording voice note..." : "Type a message"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isRecordingVoice}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.92rem"
            }}
          />
        </div>

        {text.trim() ? (
          <button
            type="submit"
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
        ) : (
          <button
            type="button"
            onClick={handleVoiceNote}
            style={{
              backgroundColor: isRecordingVoice ? "var(--wa-emerald)" : "transparent",
              color: isRecordingVoice ? "#111b21" : "var(--text-secondary)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            title="Voice Note"
          >
            <Mic size={22} />
          </button>
        )}
      </form>

      <AttachmentModal
        isOpen={isAttachmentOpen}
        onClose={() => setIsAttachmentOpen(false)}
        chatId={chatId}
      />
    </>
  );
};
