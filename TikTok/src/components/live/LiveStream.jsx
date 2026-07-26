import React, { useState, useEffect } from "react";
import { Users, Gift, Heart, Send, Radio } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const LiveStream = () => {
  const { liveStream } = useTikTok();
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "music_fan_99", text: "Drop the bass bro!! 🔥🔥" },
    { id: 2, user: "sarah_vibe", text: "Greetings from Brazil! 🇧🇷✨" },
    { id: 3, user: "tech_guru", text: "What DJ controller are you using?" }
  ]);
  const [activeGiftAnim, setActiveGiftAnim] = useState(null);
  const [inputText, setInputText] = useState("");

  // Simulate auto-incoming live chat messages
  useEffect(() => {
    const sampleChats = [
      "Incredible live stream! 🎧✨",
      "Sent a Rose! 🌹",
      "Who's watching in 2026? 👋",
      "Best beats on TikTok LIVE 🔥🔥",
      "Love this track name please! 🎵"
    ];

    const interval = setInterval(() => {
      const randomText = sampleChats[Math.floor(Math.random() * sampleChats.length)];
      const randomUser = "user_" + Math.floor(Math.random() * 900 + 100);
      setChatMessages((prev) => [
        ...prev.slice(-15),
        { id: Date.now(), user: randomUser, text: randomText }
      ]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const triggerGift = (gift) => {
    setActiveGiftAnim(gift);
    setTimeout(() => setActiveGiftAnim(null), 1800);
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You", text: `sent a ${gift.name}! ${gift.icon}` }
    ]);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now(), user: "You", text: inputText.trim() }
      ]);
      setInputText("");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "20px 0" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 950,
          height: "85vh",
          backgroundColor: "#000000",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          border: "1px solid var(--border-color)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)"
        }}
      >
        {/* Left Live Video Screen */}
        <div style={{ flex: 1.5, position: "relative", backgroundColor: "#111" }}>
          <video
            src={liveStream.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Header Badge */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: 24,
              color: "white"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Radio size={16} color="var(--tiktok-magenta)" />
              <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--tiktok-magenta)" }}>LIVE</span>
            </div>
            <img
              src={liveStream.creator.avatar}
              alt="Creator"
              style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
            />
            <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{liveStream.creator.username}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4, opacity: 0.8, fontSize: "0.75rem" }}>
              <Users size={14} />
              <span>{(liveStream.creator.viewersCount / 1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* Flying Gift Animation Overlay */}
          {activeGiftAnim && (
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "40%",
                fontSize: "4rem",
                animation: "giftFloatUp 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                pointerEvents: "none",
                zIndex: 30
              }}
            >
              {activeGiftAnim.icon}
            </div>
          )}
        </div>

        {/* Right Live Chat & Gift Panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--bg-dark)",
            borderLeft: "1px solid var(--border-color)"
          }}
        >
          {/* Header */}
          <header style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-color)", fontWeight: 700 }}>
            Live Stream Chat
          </header>

          {/* Chat Stream */}
          <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {chatMessages.map((m) => (
              <div key={m.id} style={{ fontSize: "0.88rem", lineHeight: 1.4 }}>
                <strong style={{ color: m.user === "You" ? "var(--tiktok-cyan)" : "var(--tiktok-magenta)", marginRight: 6 }}>
                  {m.user}:
                </strong>
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          {/* Gifts Bar */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
              SEND LIVE GIFTS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {liveStream.topGifts.map((g, i) => (
                <button
                  key={i}
                  onClick={() => triggerGift(g)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    padding: 8,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 8,
                    color: "white",
                    cursor: "pointer",
                    transition: "var(--transition-fast)"
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>{g.icon}</span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} style={{ padding: 12, borderTop: "1px solid var(--border-color)", display: "flex", gap: 10 }}>
            <input
              type="text"
              placeholder="Send a comment..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: 20,
                padding: "8px 14px",
                color: "white",
                outline: "none",
                fontSize: "0.85rem"
              }}
            />
            <button
              type="submit"
              style={{ background: "none", border: "none", color: "var(--tiktok-magenta)", cursor: "pointer" }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
