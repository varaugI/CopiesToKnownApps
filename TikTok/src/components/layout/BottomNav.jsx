import React from "react";
import { Home, Users, Plus, MessageSquare, User } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const BottomNav = () => {
  const { activeView, setActiveView } = useTikTok();

  return (
    <nav className="tiktok-mobile-bottom-nav">
      <div
        onClick={() => setActiveView("foryou")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          color: activeView === "foryou" ? "white" : "rgba(255,255,255,0.6)",
          cursor: "pointer"
        }}
      >
        <Home size={22} />
        <span style={{ fontSize: "0.65rem", fontWeight: 600 }}>Home</span>
      </div>

      <div
        onClick={() => setActiveView("following")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          color: activeView === "following" ? "white" : "rgba(255,255,255,0.6)",
          cursor: "pointer"
        }}
      >
        <Users size={22} />
        <span style={{ fontSize: "0.65rem", fontWeight: 600 }}>Friends</span>
      </div>

      {/* Create Button (+) */}
      <div
        onClick={() => setActiveView("upload")}
        className="create-btn-wrapper"
        style={{ cursor: "pointer" }}
      >
        <div className="create-btn-inner">
          <Plus size={18} strokeWidth={3} />
        </div>
      </div>

      <div
        onClick={() => setActiveView("inbox")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          color: activeView === "inbox" ? "white" : "rgba(255,255,255,0.6)",
          cursor: "pointer"
        }}
      >
        <MessageSquare size={22} />
        <span style={{ fontSize: "0.65rem", fontWeight: 600 }}>Inbox</span>
      </div>

      <div
        onClick={() => setActiveView("profile")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          color: activeView === "profile" ? "white" : "rgba(255,255,255,0.6)",
          cursor: "pointer"
        }}
      >
        <User size={22} />
        <span style={{ fontSize: "0.65rem", fontWeight: 600 }}>Profile</span>
      </div>
    </nav>
  );
};
