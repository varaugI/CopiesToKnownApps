import React from "react";
import { FileText, Folder, GitBranch, History } from "lucide-react";
import { useGitHub } from "../../context/GitHubContext";

export const FileExplorer = ({ repo }) => {
  const { setActiveFilePath } = useGitHub();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Branch selector & Latest Commit Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="btn-gh-secondary" style={{ gap: 8 }}>
          <GitBranch size={16} />
          <span>{repo.defaultBranch}</span>
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
          <History size={16} />
          <span>Latest commit <strong>{repo.latestCommit?.hash}</strong></span>
        </div>
      </div>

      {/* Commit Banner Card */}
      <div
        style={{
          backgroundColor: "var(--gh-dark-panel)",
          border: "1px solid var(--gh-border)",
          borderRadius: 6,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={repo.latestCommit?.avatar}
            alt="Commit author"
            style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }}
          />
          <strong style={{ fontSize: "0.88rem" }}>{repo.latestCommit?.author}</strong>
          <span style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>{repo.latestCommit?.message}</span>
        </div>

        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          {repo.latestCommit?.timestamp}
        </span>
      </div>

      {/* File Explorer Table */}
      <div className="file-explorer-table">
        {repo.files.map((file) => (
          <div
            key={file.path}
            className="file-row"
            onClick={() => setActiveFilePath(file.path)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {file.type === "dir" ? (
                <Folder size={18} color="#54aef7" />
              ) : (
                <FileText size={18} color="var(--text-secondary)" />
              )}
              <span style={{ fontWeight: 600, color: "var(--gh-blue)" }}>{file.name}</span>
            </div>

            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              {repo.latestCommit?.message}
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {repo.latestCommit?.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
