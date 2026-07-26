import React from "react";
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  Sun,
  Moon,
  Menu
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { InstagramLogo } from "../common/InstagramLogo";

export const Sidebar = () => {
  const {
    activeView,
    setActiveView,
    user,
    theme,
    toggleTheme,
    unreadNotificationsCount,
    setIsCreateModalOpen,
    isSearchDrawerOpen,
    setIsSearchDrawerOpen,
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen
  } = useApp();

  const handleNavClick = (viewName) => {
    if (viewName === "search") {
      setIsSearchDrawerOpen(!isSearchDrawerOpen);
      setIsNotificationsDrawerOpen(false);
      return;
    }
    if (viewName === "notifications") {
      setIsNotificationsDrawerOpen(!isNotificationsDrawerOpen);
      setIsSearchDrawerOpen(false);
      return;
    }
    if (viewName === "create") {
      setIsCreateModalOpen(true);
      return;
    }

    setIsSearchDrawerOpen(false);
    setIsNotificationsDrawerOpen(false);
    setActiveView(viewName);
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo" onClick={() => handleNavClick("home")}>
          <InstagramLogo size={28} />
          <span className="logo-text">Instagram</span>
        </div>

        <nav className="nav-list">
          <div
            className={`nav-item ${activeView === "home" ? "active" : ""}`}
            onClick={() => handleNavClick("home")}
          >
            <Home size={24} />
            <span className="nav-text">Home</span>
          </div>

          <div
            className={`nav-item ${isSearchDrawerOpen ? "active" : ""}`}
            onClick={() => handleNavClick("search")}
          >
            <Search size={24} />
            <span className="nav-text">Search</span>
          </div>

          <div
            className={`nav-item ${activeView === "explore" ? "active" : ""}`}
            onClick={() => handleNavClick("explore")}
          >
            <Compass size={24} />
            <span className="nav-text">Explore</span>
          </div>

          <div
            className={`nav-item ${activeView === "reels" ? "active" : ""}`}
            onClick={() => handleNavClick("reels")}
          >
            <Film size={24} />
            <span className="nav-text">Reels</span>
          </div>

          <div
            className={`nav-item ${activeView === "messages" ? "active" : ""}`}
            onClick={() => handleNavClick("messages")}
          >
            <MessageCircle size={24} />
            <span className="nav-text">Messages</span>
          </div>

          <div
            className={`nav-item ${isNotificationsDrawerOpen ? "active" : ""}`}
            onClick={() => handleNavClick("notifications")}
          >
            <Heart size={24} />
            {unreadNotificationsCount > 0 && (
              <span className="nav-badge">{unreadNotificationsCount}</span>
            )}
            <span className="nav-text">Notifications</span>
          </div>

          <div className="nav-item" onClick={() => handleNavClick("create")}>
            <PlusSquare size={24} />
            <span className="nav-text">Create</span>
          </div>

          <div
            className={`nav-item ${activeView === "profile" ? "active" : ""}`}
            onClick={() => handleNavClick("profile")}
          >
            <img src={user.avatar} alt={user.username} className="nav-avatar" />
            <span className="nav-text">Profile</span>
          </div>
        </nav>
      </div>

      <div className="nav-list">
        <div className="nav-item" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          <span className="more-text">Switch Mode</span>
        </div>
      </div>
    </aside>
  );
};
