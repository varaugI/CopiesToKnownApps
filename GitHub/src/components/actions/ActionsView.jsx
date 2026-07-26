import React from "react";
import { CheckCircle2, PlayCircle, Clock } from "lucide-react";

export const ActionsView = ({ repo }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>GitHub Actions Workflows</h3>

      <div
        style={{
          border: "1px solid var(--gh-border)",
          borderRadius: 6,
          backgroundColor: "var(--gh-dark-panel)",
          overflow: "hidden"
        }}
      >
        {repo.actions.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
            No workflow runs recorded yet.
          </div>
        ) : (
          repo.actions.map((act) => (
            <div
              key={act.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: "1px solid var(--gh-border-subtle)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={20} color="var(--gh-green)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-bold)" }}>
                    {act.name}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    branch {act.branch} • commit {act.commit}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={14} />
                  <span>{act.duration}</span>
                </div>
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
