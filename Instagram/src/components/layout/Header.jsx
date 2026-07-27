import React from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../context/notifications-context";
import { useUi } from "../../context/ui-context";
import { PhotoFlowLogo } from "../common/PhotoFlowLogo";

export const Header = () => {
  const { unreadNotificationsCount } = useNotifications();
  const { setIsNotificationsDrawerOpen } = useUi();

  return (
    <header className="mobile-header">
      <Link className="sidebar-logo" to="/" style={{ padding: 0, margin: 0 }}>
        <PhotoFlowLogo size={24} />
        <span className="logo-text" style={{ fontSize: "1.8rem" }}>PhotoFlow</span>
      </Link>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <button
          type="button"
          aria-label="Open notifications"
          className="action-btn"
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setIsNotificationsDrawerOpen(true)}
        >
          <Heart size={24} />
          {unreadNotificationsCount > 0 && (
            <span className="nav-badge" style={{ top: "-4px", right: "-6px", left: "auto" }}>
              {unreadNotificationsCount}
            </span>
          )}
        </button>
        <Link aria-label="Open messages" className="action-btn" to="/direct">
          <MessageCircle size={24} />
        </Link>
      </div>
    </header>
  );
};
