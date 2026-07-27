import React from "react";
import { Home, Search, PlusSquare, Film } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useProfile } from "../../context/profile-context";
import { useUi } from "../../context/ui-context";

export const BottomNav = () => {
  const { user } = useProfile();
  const { setIsCreateModalOpen } = useUi();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <NavLink
        aria-label="Home"
        className={({ isActive }) => `action-btn ${isActive ? "active" : ""}`}
        to="/"
        end
      >
        <Home size={26} />
      </NavLink>

      <NavLink
        aria-label="Explore"
        className={({ isActive }) => `action-btn ${isActive ? "active" : ""}`}
        to="/explore"
      >
        <Search size={26} />
      </NavLink>

      <button
        type="button"
        aria-label="Create post"
        className="action-btn"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <PlusSquare size={26} />
      </button>

      <NavLink
        aria-label="Reels"
        className={({ isActive }) => `action-btn ${isActive ? "active" : ""}`}
        to="/reels"
      >
        <Film size={26} />
      </NavLink>

      <NavLink
        aria-label="Profile"
        className={({ isActive }) => `action-btn ${isActive ? "active" : ""}`}
        to={`/${user.username}`}
      >
        <img
          src={user.avatar}
          alt={user.username}
          style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }}
        />
      </NavLink>
    </nav>
  );
};
