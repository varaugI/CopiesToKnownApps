import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  CircleDashed,
  Compass,
  Phone,
  Settings,
  Sun,
  Moon,
  Laptop
} from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";
import { WhatsAppLogo } from "../common/WhatsAppLogo";

export const SidebarNav: React.FC = () => {
  const { user, chats, statusStories, theme, toggleTheme } = useWhatsApp();
  const navigate = useNavigate();

  const totalUnread = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const hasUnseenStatus = statusStories.some((s) => s.hasUnseen);

  return (
    <div className="wa-nav-icon-bar">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <div style={{ padding: "4px 0", cursor: "pointer" }} onClick={() => navigate("/chats")}>
          <WhatsAppLogo size={28} />
        </div>

        {/* Navigation Links */}
        <NavLink
          to="/chats"
          className={({ isActive }) => `wa-nav-btn ${isActive ? "active" : ""}`}
          title="Chats"
        >
          <MessageSquare size={22} />
          {totalUnread > 0 && <span className="wa-nav-badge">{totalUnread}</span>}
        </NavLink>

        <NavLink
          to="/status"
          className={({ isActive }) => `wa-nav-btn ${isActive ? "active" : ""}`}
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
        </NavLink>

        <NavLink
          to="/channels"
          className={({ isActive }) => `wa-nav-btn ${isActive ? "active" : ""}`}
          title="Channels"
        >
          <Compass size={22} />
        </NavLink>

        <NavLink
          to="/calls"
          className={({ isActive }) => `wa-nav-btn ${isActive ? "active" : ""}`}
          title="Calls"
        >
          <Phone size={22} />
        </NavLink>

        <NavLink
          to="/devices"
          className={({ isActive }) => `wa-nav-btn ${isActive ? "active" : ""}`}
          title="Linked Devices"
        >
          <Laptop size={22} />
        </NavLink>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <button className="wa-nav-btn" onClick={toggleTheme} title="Switch Theme">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <NavLink
          to="/settings"
          className={({ isActive }) => `wa-nav-btn ${isActive ? "active" : ""}`}
          title="Settings"
        >
          <Settings size={22} />
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `wa-nav-btn ${isActive ? "active" : ""}`}
          title="Profile"
          style={{ padding: 0 }}
        >
          {({ isActive }) => (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                border: isActive ? "2px solid var(--wa-emerald)" : "none"
              }}
              title="Profile"
            >
              <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
};
