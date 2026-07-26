import React from "react";
import { BookOpen } from "lucide-react";

export const ReadmeRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div
      style={{
        border: "1px solid var(--gh-border)",
        borderRadius: 6,
        backgroundColor: "var(--gh-dark-panel)",
        marginTop: 20
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--gh-border)",
          fontSize: "0.85rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        <BookOpen size={16} color="var(--text-secondary)" />
        <span>README.md</span>
      </div>

      <div
        style={{
          padding: 24,
          fontSize: "0.95rem",
          lineHeight: 1.6,
          color: "var(--text-primary)",
          whiteSpace: "pre-line"
        }}
      >
        {content}
      </div>
    </div>
  );
};
