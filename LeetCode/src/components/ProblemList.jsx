import React from "react";
import { CheckCircle2, Search, Filter } from "lucide-react";
import { useLeetCode } from "../context/LeetCodeContext";

export const ProblemList = () => {
  const {
    problems,
    openWorkspace,
    difficultyFilter,
    setDifficultyFilter,
    searchQuery,
    setSearchQuery
  } = useLeetCode();

  const filteredProblems = problems.filter((p) => {
    const matchesDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiff && matchesQuery;
  });

  return (
    <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "30px 20px" }}>
      {/* Header Title */}
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 20 }}>Problemset</h1>

      {/* Filter Toolbar */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "var(--lc-card)",
            border: "1px solid var(--lc-border)",
            borderRadius: 8,
            padding: "8px 14px",
            flex: 1,
            maxWidth: 400
          }}
        >
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "0.9rem"
            }}
          />
        </div>

        {/* Difficulty Pills */}
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              style={{
                backgroundColor: difficultyFilter === d ? "var(--lc-orange)" : "var(--lc-card)",
                color: difficultyFilter === d ? "black" : "white",
                border: "1px solid var(--lc-border)",
                borderRadius: 8,
                padding: "6px 14px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Problemset Table */}
      <div
        style={{
          backgroundColor: "var(--lc-card)",
          borderRadius: 12,
          border: "1px solid var(--lc-border)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50px 1fr 120px 120px",
            padding: "12px 20px",
            borderBottom: "1px solid var(--lc-border)",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--text-secondary)"
          }}
        >
          <span>Status</span>
          <span>Title</span>
          <span>Acceptance</span>
          <span>Difficulty</span>
        </div>

        {filteredProblems.map((p) => (
          <div
            key={p.id}
            onClick={() => openWorkspace(p.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "50px 1fr 120px 120px",
              padding: "16px 20px",
              borderBottom: "1px solid var(--lc-border)",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.2s ease"
            }}
          >
            <div>
              {p.status === "Solved" ? (
                <CheckCircle2 size={18} color="var(--lc-green)" />
              ) : (
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>-</span>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "white", marginBottom: 4 }}>
                {p.title}
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.companyTags?.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.72rem",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      color: "var(--text-secondary)",
                      borderRadius: 10,
                      padding: "1px 8px"
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>{p.acceptance}</span>

            <div>
              <span
                className={
                  p.difficulty === "Easy"
                    ? "badge-easy"
                    : p.difficulty === "Medium"
                    ? "badge-medium"
                    : "badge-hard"
                }
              >
                {p.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
