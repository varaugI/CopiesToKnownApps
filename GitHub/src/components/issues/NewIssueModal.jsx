import React, { useState } from "react";
import { X, CircleDot } from "lucide-react";
import { useGitHub } from "../../context/GitHubContext";

export const NewIssueModal = ({ repoId }) => {
  const { isNewIssueModalOpen, setIsNewIssueModalOpen, createIssue } = useGitHub();
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("bug");

  if (!isNewIssueModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      createIssue(repoId, { title, labelName: label });
      setTitle("");
      setIsNewIssueModalOpen(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={() => setIsNewIssueModalOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          backgroundColor: "var(--gh-dark-panel)",
          borderRadius: 12,
          border: "1px solid var(--gh-border)",
          padding: 24
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CircleDot size={20} color="var(--gh-green)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Create New Issue</h3>
          </div>
          <button
            onClick={() => setIsNewIssueModalOpen(false)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, display: "block" }}>
              Title *
            </label>
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, display: "block" }}>
              Label
            </label>
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: "var(--gh-dark-body)",
                border: "1px solid var(--gh-border)",
                color: "white",
                outline: "none"
              }}
            >
              <option value="bug">bug</option>
              <option value="enhancement">enhancement</option>
              <option value="documentation">documentation</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
            <button
              type="submit"
              className="btn-gh-primary"
            >
              Submit new issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
