import React from "react";
import { Home, Search, PlusSquare, Film } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const BottomNav = () => {
  const { activeView, setActiveView, user, setIsCreateModalOpen } = useApp();

  return (
    <nav className="mobile-bottom-nav">
      <div
        className={`action-btn ${activeView === "home" ? "active" : ""}`}
        onClick={() => setActiveView("home")}
      >
        <Home size={26} />
      </div>

      <div
        className={`action-btn ${activeView === "explore" ? "active" : ""}`}
        onClick={() => setActiveView("explore")}
      >
        <Search size={26} />
      </div>

      <div className="action-btn" onClick={() => setIsCreateModalOpen(true)}>
        <PlusSquare size={26} />
      </div>

      <div
        className={`action-btn ${activeView === "reels" ? "active" : ""}`}
        onClick={() => setActiveView("reels")}
      >
        <Film size={26} />
      </div>

      <div
        className={`action-btn ${activeView === "profile" ? "active" : ""}`}
        onClick={() => setActiveView("profile")}
      >
        <img
          src={user.avatar}
          alt={user.username}
          style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }}
        />
      </div>
    </nav>
  );
};
