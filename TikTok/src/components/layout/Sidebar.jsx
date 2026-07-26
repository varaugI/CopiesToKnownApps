import React from "react";
import {
  Home,
  Users,
  UserCheck,
  Radio,
  MessageSquare,
  Search,
  Plus,
  Compass
} from "lucide-react";
import { useTikTok } from "../../context/TikTokContext";
import { TikTokLogo } from "../common/TikTokLogo";

export const Sidebar = () => {
  const { activeView, setActiveView, user } = useTikTok();

  return (
    <aside className="tiktok-sidebar">
      <div>
        {/* Logo */}
        <div
          onClick={() => setActiveView("foryou")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            marginBottom: 20,
            cursor: "pointer"
          }}
        >
          <TikTokLogo size={32} />
          <span
            className="tiktok-logo-text"
            style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.5px" }}
          >
            TikTok
          </span>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            className={`tiktok-nav-item ${activeView === "foryou" ? "active" : ""}`}
            onClick={() => setActiveView("foryou")}
          >
            <Home size={26} />
            <span className="nav-text">For You</span>
          </div>

          <div
            className={`tiktok-nav-item ${activeView === "following" ? "active" : ""}`}
            onClick={() => setActiveView("following")}
          >
            <Users size={26} />
            <span className="nav-text">Following</span>
          </div>

          <div
            className={`tiktok-nav-item ${activeView === "search" ? "active" : ""}`}
            onClick={() => setActiveView("search")}
          >
            <Compass size={26} />
            <span className="nav-text">Explore</span>
          </div>

          <div
            className={`tiktok-nav-item ${activeView === "live" ? "active" : ""}`}
            onClick={() => setActiveView("live")}
          >
            <Radio size={26} color="var(--tiktok-magenta)" />
            <span className="nav-text" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              LIVE
              <span
                style={{
                  backgroundColor: "var(--tiktok-magenta)",
                  color: "white",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "1px 5px",
                  borderRadius: 4
                }}
              >
                HOT
              </span>
            </span>
          </div>

          <div
            className={`tiktok-nav-item ${activeView === "inbox" ? "active" : ""}`}
            onClick={() => setActiveView("inbox")}
          >
            <MessageSquare size={26} />
            <span className="nav-text">Inbox</span>
          </div>

          <div
            className={`tiktok-nav-item ${activeView === "profile" ? "active" : ""}`}
            onClick={() => setActiveView("profile")}
          >
            <img
              src={user.avatar}
              alt={user.username}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                objectFit: "cover",
                border: activeView === "profile" ? "2px solid var(--tiktok-magenta)" : "none"
              }}
            />
            <span className="nav-text">Profile</span>
          </div>
        </nav>
      </div>

      {/* Bottom Upload Button */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button className="tiktok-btn-primary" onClick={() => setActiveView("upload")}>
          <Plus size={20} strokeWidth={3} />
          <span className="nav-text">Upload</span>
        </button>

        <footer
          className="nav-text"
          style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}
        >
          <p>Company · Program · Terms · Privacy</p>
          <p>© 2026 TikTok Clone</p>
        </footer>
      </div>
    </aside>
  );
};
