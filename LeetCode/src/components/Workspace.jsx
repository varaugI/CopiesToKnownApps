import React from "react";
import { Play, Send, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useLeetCode } from "../context/LeetCodeContext";

export const Workspace = () => {
  const {
    activeProblem,
    openWorkspace,
    setActiveView,
    selectedLanguage,
    setSelectedLanguage,
    userCode,
    setUserCode,
    submissionResult,
    runCode,
    submitSolution
  } = useLeetCode();

  if (!activeProblem) return null;

  return (
    <div className="workspace-layout">
      {/* Left Problem Description Panel */}
      <div className="workspace-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => setActiveView("problemset")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            <ArrowLeft size={16} />
            <span>Problem List</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>{activeProblem.title}</h2>
          <span
            className={
              activeProblem.difficulty === "Easy"
                ? "badge-easy"
                : activeProblem.difficulty === "Medium"
                ? "badge-medium"
                : "badge-hard"
            }
          >
            {activeProblem.difficulty}
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {activeProblem.tags?.map((t) => (
            <span
              key={t}
              style={{
                fontSize: "0.75rem",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                padding: "2px 8px",
                borderRadius: 10,
                color: "var(--text-secondary)"
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Description */}
        <div style={{ fontSize: "0.92rem", lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: 24 }}>
          {activeProblem.description}
        </div>

        {/* Examples */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Examples</h3>

          {activeProblem.examples?.map((ex, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderRadius: 8,
                padding: 14,
                border: "1px solid var(--lc-border)",
                fontSize: "0.85rem",
                fontFamily: "'Fira Code', monospace"
              }}
            >
              <div style={{ color: "var(--text-secondary)", marginBottom: 4 }}>
                <strong>Input:</strong> {ex.input}
              </div>
              <div style={{ color: "var(--text-secondary)", marginBottom: 4 }}>
                <strong>Output:</strong> {ex.output}
              </div>
              {ex.explanation && (
                <div style={{ color: "var(--text-secondary)" }}>
                  <strong>Explanation:</strong> {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Code Editor & Runner Panel */}
      <div className="workspace-panel" style={{ borderRight: "none", padding: 0 }}>
        {/* Editor Bar */}
        <div
          style={{
            height: 44,
            backgroundColor: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid var(--lc-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px"
          }}
        >
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              if (activeProblem.starterCode[e.target.value]) {
                setUserCode(activeProblem.starterCode[e.target.value]);
              }
            }}
            style={{
              backgroundColor: "var(--lc-card)",
              color: "white",
              border: "1px solid var(--lc-border)",
              borderRadius: 6,
              padding: "4px 10px",
              fontWeight: 600,
              outline: "none"
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
          </select>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={runCode}
              style={{
                backgroundColor: "var(--lc-card)",
                color: "white",
                border: "1px solid var(--lc-border)",
                borderRadius: 6,
                padding: "6px 14px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <Play size={14} fill="white" />
              <span>Run</span>
            </button>

            <button className="btn-lc-primary" onClick={submitSolution} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Send size={14} />
              <span>Submit</span>
            </button>
          </div>
        </div>

        {/* Code Input Textarea */}
        <div style={{ flex: 1, position: "relative", backgroundColor: "#1e1e1e" }}>
          <textarea
            className="code-input"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              border: "none",
              color: "#d4d4d4",
              fontSize: "0.92rem",
              lineHeight: 1.5,
              padding: 16,
              outline: "none",
              resize: "none"
            }}
          />
        </div>

        {/* Submission Output Console */}
        {submissionResult && (
          <div
            style={{
              borderTop: "1px solid var(--lc-border)",
              backgroundColor: "var(--lc-card)",
              padding: 16,
              animation: "fadeIn 0.3s ease"
            }}
          >
            {submissionResult.loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--lc-orange)", fontWeight: 700 }}>
                <RefreshCw size={18} className="spin" />
                <span>Executing test cases...</span>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <CheckCircle size={22} color="var(--lc-green)" />
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--lc-green)" }}>
                    {submissionResult.status}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 24, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                  <div>
                    Runtime: <strong style={{ color: "white" }}>{submissionResult.runtime}</strong> (Beats {submissionResult.beats})
                  </div>
                  <div>
                    Memory: <strong style={{ color: "white" }}>{submissionResult.memory}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
