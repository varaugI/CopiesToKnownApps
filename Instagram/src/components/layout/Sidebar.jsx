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
  Moon
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useNotifications } from "../../context/notifications-context";
import { useProfile } from "../../context/profile-context";
import { useUi } from "../../context/ui-context";
import { PhotoFlowLogo } from "../common/PhotoFlowLogo";

export const Sidebar = () => {
  const {
    theme,
    toggleTheme,
    setIsCreateModalOpen,
    isSearchDrawerOpen,
    setIsSearchDrawerOpen,
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen
  } = useUi();
  const { user } = useProfile();
  const { unreadNotificationsCount } = useNotifications();

  const closeDrawers = () => {
    setIsSearchDrawerOpen(false);
    setIsNotificationsDrawerOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchDrawerOpen(!isSearchDrawerOpen);
    setIsNotificationsDrawerOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsDrawerOpen(!isNotificationsDrawerOpen);
    setIsSearchDrawerOpen(false);
  };

  return (
    <aside className="sidebar">
      <div>
        <Link className="sidebar-logo" to="/" onClick={closeDrawers}>
          <PhotoFlowLogo size={28} />
          <span className="logo-text">PhotoFlow</span>
        </Link>

        <nav className="nav-list" aria-label="Primary navigation">
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/"
            end
            onClick={closeDrawers}
          >
            <Home size={24} />
            <span className="nav-text">Home</span>
          </NavLink>

          <button
            type="button"
            className={`nav-item ${isSearchDrawerOpen ? "active" : ""}`}
            onClick={toggleSearch}
          >
            <Search size={24} />
            <span className="nav-text">Search</span>
          </button>

          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/explore"
            onClick={closeDrawers}
          >
            <Compass size={24} />
            <span className="nav-text">Explore</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/reels"
            onClick={closeDrawers}
          >
            <Film size={24} />
            <span className="nav-text">Reels</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/direct"
            onClick={closeDrawers}
          >
            <MessageCircle size={24} />
            <span className="nav-text">Messages</span>
          </NavLink>

          <button
            type="button"
            className={`nav-item ${isNotificationsDrawerOpen ? "active" : ""}`}
            onClick={toggleNotifications}
          >
            <Heart size={24} />
            {unreadNotificationsCount > 0 && (
              <span className="nav-badge">{unreadNotificationsCount}</span>
            )}
            <span className="nav-text">Notifications</span>
          </button>

          <button type="button" className="nav-item" onClick={() => setIsCreateModalOpen(true)}>
            <PlusSquare size={24} />
            <span className="nav-text">Create</span>
          </button>

          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to={`/${user.username}`}
            onClick={closeDrawers}
          >
            <img src={user.avatar} alt="" className="nav-avatar" />
            <span className="nav-text">Profile</span>
          </NavLink>
        </nav>
      </div>

      <div className="nav-list">
        <button type="button" className="nav-item" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          <span className="more-text">Switch Mode</span>
        </button>
      </div>
    </aside>
  );
};
