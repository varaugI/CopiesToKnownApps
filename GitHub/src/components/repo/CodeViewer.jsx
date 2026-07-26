import React, { useState } from "react";
import { ArrowLeft, Copy, Check, FileText } from "lucide-react";
import { useGitHub } from "../../context/GitHubContext";

export const CodeViewer = ({ file }) => {
  const { setActiveFilePath } = useGitHub();
  const [copied, setCopied] = useState(false);

  const lines = (file.content || "").split("\n");

  const handleCopy = () => {
    navigator.clipboard?.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* File Header Bar */}
      <div className="code-header" style={{ borderRadius: "6px 6px 0 0", border: "1px solid var(--gh-border)", borderBottom: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setActiveFilePath(null)}
            style={{ background: "none", border: "none", color: "var(--gh-blue)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}
          >
            <ArrowLeft size={16} />
            <span>Back to repo</span>
          </button>
          <span style={{ color: "var(--text-secondary)" }}>|</span>
          <FileText size={16} color="var(--text-secondary)" />
          <span style={{ fontWeight: 700, color: "var(--text-bold)" }}>{file.path}</span>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            ({lines.length} lines)
          </span>
        </div>

        <button className="btn-gh-secondary" onClick={handleCopy}>
          {copied ? <Check size={14} color="green" /> : <Copy size={14} />}
          <span>{copied ? "Copied" : "Copy raw"}</span>
        </button>
      </div>

      {/* Code Viewer Body */}
      <div className="code-viewer-container" style={{ borderRadius: "0 0 6px 6px" }}>
        <pre className="code-pre-block">
          <code>
            {lines.map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <span style={{ userSelect: "none", color: "var(--text-muted)", width: 30, textAlign: "right" }}>
                  {i + 1}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
