import React from "react";
import { CircleDot, MessageSquare, Plus } from "lucide-react";
import { useGitHub } from "../../context/GitHubContext";
import { NewIssueModal } from "./NewIssueModal";

export const IssuesView = ({ repo }) => {
  const { setIsNewIssueModalOpen } = useGitHub();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16, fontSize: "0.9rem", fontWeight: 700 }}>
          <span style={{ color: "var(--text-bold)" }}>
            {repo.issues.filter((i) => i.status === "open").length} Open
          </span>
          <span style={{ color: "var(--text-secondary)" }}>
            {repo.issues.filter((i) => i.status === "closed").length} Closed
          </span>
        </div>

        <button className="btn-gh-primary" onClick={() => setIsNewIssueModalOpen(true)}>
          <Plus size={16} />
          <span>New issue</span>
        </button>
      </div>

      {/* Issues Table */}
      <div
        style={{
          border: "1px solid var(--gh-border)",
          borderRadius: 6,
          backgroundColor: "var(--gh-dark-panel)",
          overflow: "hidden"
        }}
      >
        {repo.issues.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
            No open issues found in this repository.
          </div>
        ) : (
          repo.issues.map((issue) => (
            <div
              key={issue.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid var(--gh-border-subtle)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CircleDot size={18} color="var(--gh-green)" />

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-bold)" }}>
                      {issue.title}
                    </span>
                    {issue.labels?.map((l, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          backgroundColor: "rgba(35, 134, 54, 0.2)",
                          color: "var(--gh-green)",
                          border: "1px solid var(--gh-green)",
                          borderRadius: 12,
                          padding: "1px 8px"
                        }}
                      >
                        {l.name}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    #{issue.number} opened {issue.createdAt} by {issue.author.login}
                  </div>
                </div>
              </div>

              {issue.commentsCount > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <MessageSquare size={14} />
                  <span>{issue.commentsCount}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <NewIssueModal repoId={repo.id} />
    </div>
  );
};
