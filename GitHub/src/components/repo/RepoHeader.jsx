import React from "react";
import {
  BookOpen,
  Star,
  GitFork,
  Eye,
  Code,
  CircleDot,
  GitPullRequest,
  PlayCircle,
  Settings
} from "lucide-react";
import { useGitHub } from "../../context/GitHubContext";

export const RepoHeader = ({ repo }) => {
  const { activeRepoTab, setActiveRepoTab, toggleStarRepo } = useGitHub();

  return (
    <div style={{ backgroundColor: "var(--gh-dark-panel)", borderBottom: "1px solid var(--gh-border)", paddingTop: 16 }}>
      {/* Upper Meta Bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px 16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <BookOpen size={20} color="var(--text-secondary)" />
          <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>
            <span style={{ color: "var(--gh-blue)", cursor: "pointer" }}>{repo.owner.login}</span>
            <span style={{ color: "var(--text-secondary)", margin: "0 4px" }}>/</span>
            <span style={{ color: "var(--gh-blue)", cursor: "pointer" }}>{repo.name}</span>
          </h1>

          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              border: "1px solid var(--gh-border)",
              borderRadius: 12,
              padding: "2px 8px"
            }}
          >
            {repo.isPrivate ? "Private" : "Public"}
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-gh-secondary">
            <Eye size={16} />
            <span>Watch {repo.watchersCount}</span>
          </button>

          <button className="btn-gh-secondary">
            <GitFork size={16} />
            <span>Fork {repo.forksCount}</span>
          </button>

          <button className="btn-gh-secondary" onClick={() => toggleStarRepo(repo.id)}>
            <Star size={16} fill={repo.isStarred ? "#e3b341" : "none"} color={repo.isStarred ? "#e3b341" : "currentColor"} />
            <span>{repo.isStarred ? "Starred" : "Star"} {repo.starsCount}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="gh-tab-bar">
        <div
          className={`gh-tab-item ${activeRepoTab === "code" ? "active" : ""}`}
          onClick={() => setActiveRepoTab("code")}
        >
          <Code size={18} />
          <span>Code</span>
        </div>

        <div
          className={`gh-tab-item ${activeRepoTab === "issues" ? "active" : ""}`}
          onClick={() => setActiveRepoTab("issues")}
        >
          <CircleDot size={18} />
          <span>Issues</span>
          <span style={{ backgroundColor: "var(--gh-dark-card)", padding: "1px 6px", borderRadius: 10, fontSize: "0.75rem" }}>
            {repo.issues.filter((i) => i.status === "open").length}
          </span>
        </div>

        <div
          className={`gh-tab-item ${activeRepoTab === "pulls" ? "active" : ""}`}
          onClick={() => setActiveRepoTab("pulls")}
        >
          <GitPullRequest size={18} />
          <span>Pull requests</span>
          <span style={{ backgroundColor: "var(--gh-dark-card)", padding: "1px 6px", borderRadius: 10, fontSize: "0.75rem" }}>
            {repo.pullRequests.filter((p) => p.status === "open").length}
          </span>
        </div>

        <div
          className={`gh-tab-item ${activeRepoTab === "actions" ? "active" : ""}`}
          onClick={() => setActiveRepoTab("actions")}
        >
          <PlayCircle size={18} />
          <span>Actions</span>
        </div>

        <div
          className={`gh-tab-item ${activeRepoTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveRepoTab("settings")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};
