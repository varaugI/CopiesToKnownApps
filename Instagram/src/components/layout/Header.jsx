import React from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { InstagramLogo } from "../common/InstagramLogo";

export const Header = () => {
  const { setActiveView, unreadNotificationsCount, setIsNotificationsDrawerOpen } = useApp();

  return (
    <header className="mobile-header">
      <div className="sidebar-logo" onClick={() => setActiveView("home")} style={{ padding: 0, margin: 0 }}>
        <InstagramLogo size={24} />
        <span className="logo-text" style={{ fontSize: "1.8rem" }}>Instagram</span>
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setIsNotificationsDrawerOpen(true)}
        >
          <Heart size={24} />
          {unreadNotificationsCount > 0 && (
            <span className="nav-badge" style={{ top: "-4px", right: "-6px", left: "auto" }}>
              {unreadNotificationsCount}
            </span>
          )}
        </div>
        <div style={{ cursor: "pointer" }} onClick={() => setActiveView("messages")}>
          <MessageCircle size={24} />
        </div>
      </div>
    </header>
  );
};
