import React from "react";
import { GitPullRequest, GitMerge } from "lucide-react";

export const PullRequestsView = ({ repo }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16, fontSize: "0.9rem", fontWeight: 700 }}>
        <span style={{ color: "var(--text-bold)" }}>
          {repo.pullRequests.filter((p) => p.status === "open").length} Open
        </span>
        <span style={{ color: "var(--text-secondary)" }}>
          {repo.pullRequests.filter((p) => p.status === "merged").length} Merged
        </span>
      </div>

      <div
        style={{
          border: "1px solid var(--gh-border)",
          borderRadius: 6,
          backgroundColor: "var(--gh-dark-panel)",
          overflow: "hidden"
        }}
      >
        {repo.pullRequests.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
            No pull requests in this repository.
          </div>
        ) : (
          repo.pullRequests.map((pr) => (
            <div
              key={pr.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid var(--gh-border-subtle)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {pr.status === "merged" ? (
                  <GitMerge size={18} color="var(--gh-purple)" />
                ) : (
                  <GitPullRequest size={18} color="var(--gh-green)" />
                )}

                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-bold)" }}>
                    {pr.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    #{pr.number} opened {pr.createdAt} by {pr.author.login} • branch {pr.branch}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: "0.8rem", color: "var(--gh-green)", fontWeight: 700 }}>
                {pr.changes}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
