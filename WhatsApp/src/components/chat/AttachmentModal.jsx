import React, { useState } from "react";
import { X, Image as ImageIcon, Mic, Send } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";

export const AttachmentModal = ({ isOpen, onClose, chatId }) => {
  const { sendMessage } = useWhatsApp();
  const [selectedImage, setSelectedImage] = useState(
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
  );
  const [caption, setCaption] = useState("");

  if (!isOpen) return null;

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    sendMessage(chatId, {
      type: "image",
      image: selectedImage,
      caption
    });
    onClose();
  };

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
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "var(--wa-dark-panel)",
          borderRadius: 16,
          border: "1px solid var(--wa-border)",
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Send Image</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* Image Preview */}
        <div
          style={{
            width: "100%",
            height: 280,
            borderRadius: 12,
            backgroundColor: "#000",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16
          }}
        >
          <img src={selectedImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        {/* Change Image button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <label
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid var(--wa-border)",
              color: "white",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Choose another photo
            <input type="file" accept="image/*" onChange={handleImageFile} style={{ display: "none" }} />
          </label>
        </div>

        {/* Caption */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "var(--wa-dark-body)",
              border: "1px solid var(--wa-border)",
              borderRadius: 8,
              padding: "10px 14px",
              color: "white",
              outline: "none"
            }}
          />
          <button
            onClick={handleSend}
            style={{
              backgroundColor: "var(--wa-emerald)",
              color: "#111b21",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
