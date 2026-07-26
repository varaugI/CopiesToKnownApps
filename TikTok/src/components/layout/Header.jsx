import React from "react";
import { Search, Radio } from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";

export const Header = () => {
  const { activeView, setActiveView } = useTikTok();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        zIndex: 90,
        background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)"
      }}
    >
      <div onClick={() => setActiveView("live")} style={{ cursor: "pointer", color: "white" }}>
        <Radio size={24} color="var(--tiktok-magenta)" />
      </div>

      {/* Top Feed Switcher */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span
          onClick={() => setActiveView("following")}
          style={{
            fontSize: "1.05rem",
            fontWeight: activeView === "following" ? 800 : 600,
            color: activeView === "following" ? "white" : "rgba(255,255,255,0.6)",
            cursor: "pointer"
          }}
        >
          Following
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
        <span
          onClick={() => setActiveView("foryou")}
          style={{
            fontSize: "1.05rem",
            fontWeight: activeView === "foryou" ? 800 : 600,
            color: activeView === "foryou" ? "white" : "rgba(255,255,255,0.6)",
            cursor: "pointer"
          }}
        >
          For You
        </span>
      </div>

      <div onClick={() => setActiveView("search")} style={{ cursor: "pointer", color: "white" }}>
        <Search size={24} />
      </div>
    </header>
  );
};
