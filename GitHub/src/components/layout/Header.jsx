import React from "react";
import { Search, Plus, Bell, GitPullRequest, CircleDot, Inbox } from "lucide-react";
import { useGitHub } from "../../context/GitHubContext";
import { GitHubLogo } from "../common/GitHubLogo";

export const Header = () => {
  const { setActiveView, searchQuery, setSearchQuery, user } = useGitHub();

  return (
    <header className="gh-header">
      {/* Left: Octocat & Search Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
        <div onClick={() => setActiveView("dashboard")}>
          <GitHubLogo size={32} />
        </div>

        {/* Global Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            backgroundColor: "var(--gh-dark-body)",
            border: "1px solid var(--gh-border)",
            borderRadius: 6,
            padding: "5px 12px",
            width: 320
          }}
        >
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Type / to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.85rem"
            }}
          />
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              backgroundColor: "var(--gh-dark-card)",
              border: "1px solid var(--gh-border)",
              borderRadius: 4,
              padding: "1px 5px",
              color: "var(--text-secondary)"
            }}
          >
            /
          </span>
        </div>

        {/* Nav Shortcuts */}
        <div style={{ display: "flex", gap: 16, fontSize: "0.88rem", fontWeight: 600 }}>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setActiveView("profile")}
          >
            Profile
          </span>
        </div>
      </div>

      {/* Right: + New Repo, Notifications, Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          className="btn-gh-primary"
          onClick={() => setActiveView("newrepo")}
          title="Create New Repository"
        >
          <Plus size={16} strokeWidth={3} />
          <span>New</span>
        </button>

        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={18} color="var(--text-primary)" />
          <span
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              backgroundColor: "var(--gh-blue)",
              borderRadius: "50%",
              width: 8,
              height: 8
            }}
          />
        </div>

        <div
          onClick={() => setActiveView("profile")}
          style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", cursor: "pointer" }}
        >
          <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </header>
  );
};
