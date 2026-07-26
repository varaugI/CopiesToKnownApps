import React from "react";

export const ContributionHeatmap = () => {
  // Generate 52 weeks x 7 days of realistic contribution activity
  const weeks = 52;
  const daysPerWeek = 7;

  const getHeatLevel = (w, d) => {
    // Generate deterministic green activity levels (0 to 4)
    const val = (w * 3 + d * 7) % 11;
    if (val > 8) return "level-4";
    if (val > 6) return "level-3";
    if (val > 4) return "level-2";
    if (val > 2) return "level-1";
    return "";
  };

  return (
    <div
      style={{
        border: "1px solid var(--gh-border)",
        borderRadius: 6,
        backgroundColor: "var(--gh-dark-panel)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>
          1,842 contributions in the last year
        </h4>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          <span>Less</span>
          <div className="heatmap-cell" />
          <div className="heatmap-cell level-1" />
          <div className="heatmap-cell level-2" />
          <div className="heatmap-cell level-3" />
          <div className="heatmap-cell level-4" />
          <span>More</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="heatmap-container">
        {Array.from({ length: weeks }).map((_, wIdx) =>
          Array.from({ length: daysPerWeek }).map((_, dIdx) => (
            <div
              key={`${wIdx}-${dIdx}`}
              className={`heatmap-cell ${getHeatLevel(wIdx, dIdx)}`}
              title={`Contribution on week ${wIdx + 1}, day ${dIdx + 1}`}
            />
          ))
        )}
      </div>
    </div>
  );
};
