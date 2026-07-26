import React from "react";
import {
  MessageSquare,
  CircleDashed,
  Compass,
  Phone,
  Settings,
  User,
  Sun,
  Moon
} from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";
import { WhatsAppLogo } from "../common/WhatsAppLogo";

export const SidebarNav = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    chats,
    statusStories,
    theme,
    toggleTheme
  } = useWhatsApp();

  const totalUnread = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const hasUnseenStatus = statusStories.some((s) => s.hasUnseen);

  return (
    <div className="wa-nav-icon-bar">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <div style={{ padding: "4px 0", cursor: "pointer" }} onClick={() => setActiveTab("chats")}>
          <WhatsAppLogo size={28} />
        </div>

        {/* Navigation Icons */}
        <button
          className={`wa-nav-btn ${activeTab === "chats" ? "active" : ""}`}
          onClick={() => setActiveTab("chats")}
          title="Chats"
        >
          <MessageSquare size={22} />
          {totalUnread > 0 && <span className="wa-nav-badge">{totalUnread}</span>}
        </button>

        <button
          className={`wa-nav-btn ${activeTab === "status" ? "active" : ""}`}
          onClick={() => setActiveTab("status")}
          title="Status"
        >
          <CircleDashed size={22} />
          {hasUnseenStatus && (
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--wa-emerald)"
              }}
            />
          )}
        </button>

        <button
          className={`wa-nav-btn ${activeTab === "channels" ? "active" : ""}`}
          onClick={() => setActiveTab("channels")}
          title="Channels"
        >
          <Compass size={22} />
        </button>

        <button
          className={`wa-nav-btn ${activeTab === "calls" ? "active" : ""}`}
          onClick={() => setActiveTab("calls")}
          title="Calls"
        >
          <Phone size={22} />
        </button>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <button className="wa-nav-btn" onClick={toggleTheme} title="Switch Theme">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className={`wa-nav-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
          title="Settings"
        >
          <Settings size={22} />
        </button>

        <div
          onClick={() => setActiveTab("profile")}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            overflow: "hidden",
            cursor: "pointer",
            border: activeTab === "profile" ? "2px solid var(--wa-emerald)" : "none"
          }}
          title="Profile"
        >
          <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </div>
  );
};
