import React from "react";
import { BookOpen, Star, GitFork, Plus, Search, Flame } from "lucide-react";
import { useGitHub } from "../../context/GitHubContext";

export const Dashboard = () => {
  const { repos, openRepo, toggleStarRepo, setActiveView, user } = useGitHub();

  return (
    <div className="gh-content-wrapper" style={{ display: "flex", gap: 32 }}>
      {/* Left Sidebar: Recent Repositories */}
      <aside style={{ width: 320, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Top Repositories</h3>
          <button
            className="btn-gh-primary"
            style={{ fontSize: "0.78rem", padding: "4px 10px" }}
            onClick={() => setActiveView("newrepo")}
          >
            <Plus size={14} />
            <span>New</span>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {repos.map((r) => (
            <div
              key={r.id}
              onClick={() => openRepo(r.id, "code")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 6,
                cursor: "pointer",
                backgroundColor: "var(--gh-dark-panel)"
              }}
            >
              <img
                src={r.owner.avatar}
                alt={r.name}
                style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--gh-blue)" }}>
                {r.owner.login}/{r.name}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Column: Activity Stream & Trending */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Home Activity</h2>
        </div>

        {/* Repos Cards Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {repos.map((r) => (
            <div
              key={r.id}
              style={{
                backgroundColor: "var(--gh-dark-panel)",
                border: "1px solid var(--gh-border)",
                borderRadius: 8,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <BookOpen size={18} color="var(--text-secondary)" />
                    <span
                      onClick={() => openRepo(r.id, "code")}
                      style={{
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: "var(--gh-blue)",
                        cursor: "pointer"
                      }}
                    >
                      {r.owner.login}/{r.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--gh-border)",
                        borderRadius: 12,
                        padding: "1px 8px"
                      }}
                    >
                      Public
                    </span>
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {r.description}
                  </p>
                </div>

                <button
                  className="btn-gh-secondary"
                  onClick={() => toggleStarRepo(r.id)}
                >
                  <Star size={16} fill={r.isStarred ? "#e3b341" : "none"} color={r.isStarred ? "#e3b341" : "currentColor"} />
                  <span>{r.isStarred ? "Starred" : "Star"}</span>
                </button>
              </div>

              {/* Languages & Metrics Footer */}
              <div style={{ display: "flex", gap: 20, fontSize: "0.8rem", color: "var(--text-secondary)", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: r.languageColor
                    }}
                  />
                  <span>{r.primaryLanguage}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={14} />
                  <span>{r.starsCount}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <GitFork size={14} />
                  <span>{r.forksCount}</span>
                </div>

                <span>Updated {r.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
