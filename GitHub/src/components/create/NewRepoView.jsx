import React, { useState } from "react";
import { BookOpen, Lock, Globe } from "lucide-react";
import { useGitHub } from "../../context/GitHubContext";

export const NewRepoView = () => {
  const { user, createRepository, setActiveView } = useGitHub();

  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [addReadme, setAddReadme] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoName.trim()) {
      createRepository({
        name: repoName.trim(),
        description,
        isPrivate,
        addReadme
      });
    }
  };

  return (
    <div className="gh-content-wrapper" style={{ maxWidth: 800 }}>
      <div style={{ borderBottom: "1px solid var(--gh-border)", paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Create a new repository</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 4 }}>
          A repository contains all project files, including the revision history.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Owner & Name input */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 4, display: "block" }}>Owner</label>
            <div
              style={{
                backgroundColor: "var(--gh-dark-panel)",
                border: "1px solid var(--gh-border)",
                borderRadius: 6,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 700
              }}
            >
              <img src={user.avatar} alt="Owner" style={{ width: 20, height: 20, borderRadius: "50%" }} />
              <span>{user.username}</span>
            </div>
          </div>

          <span style={{ marginTop: 20, fontSize: "1.2rem", color: "var(--text-secondary)" }}>/</span>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 4, display: "block" }}>
              Repository name *
            </label>
            <input
              type="text"
              placeholder="e.g. my-awesome-project"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: "var(--gh-dark-body)",
                border: "1px solid var(--gh-border)",
                color: "white",
                outline: "none"
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 4, display: "block" }}>
            Description (optional)
          </label>
          <input
            type="text"
            placeholder="Short description of your project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              backgroundColor: "var(--gh-dark-body)",
              border: "1px solid var(--gh-border)",
              color: "white",
              outline: "none"
            }}
          />
        </div>

        {/* Privacy Selector */}
        <div style={{ borderTop: "1px solid var(--gh-border)", borderBottom: "1px solid var(--gh-border)", padding: "16px 0", display: "flex", flexDirection: "column", gap: 14 }}>
          <label
            style={{ display: "flex", gap: 12, cursor: "pointer", alignItems: "flex-start" }}
            onClick={() => setIsPrivate(false)}
          >
            <input type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} style={{ marginTop: 4 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 6 }}>
                <Globe size={16} />
                <span>Public</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Anyone on the internet can see this repository. You choose who can commit.
              </div>
            </div>
          </label>

          <label
            style={{ display: "flex", gap: 12, cursor: "pointer", alignItems: "flex-start" }}
            onClick={() => setIsPrivate(true)}
          >
            <input type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} style={{ marginTop: 4 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 6 }}>
                <Lock size={16} />
                <span>Private</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                You choose who can see and commit to this repository.
              </div>
            </div>
          </label>
        </div>

        {/* Add Readme checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={addReadme}
            onChange={(e) => setAddReadme(e.target.checked)}
          />
          <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Add a README file</span>
        </label>

        {/* Submit */}
        <div style={{ marginTop: 10 }}>
          <button type="submit" className="btn-gh-primary" style={{ padding: "10px 24px" }}>
            Create repository
          </button>
        </div>
      </form>
    </div>
  );
};
