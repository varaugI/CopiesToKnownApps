import React from "react";

export const MongoLogo = ({ size = 28 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L4 7v10l8 5 8-5V7l-8-5z"
        fill="#112733"
        stroke="#00ed64"
        strokeWidth="2"
      />
      <path
        d="M12 4v16M12 4c-2 4-2 8 0 16M12 4c2 4 2 8 0 16"
        stroke="#00ed64"
        strokeWidth="1.5"
      />
    </svg>
    <span style={{ fontWeight: 900, fontSize: "1.25rem", color: "white", letterSpacing: "-0.5px" }}>
      MongoDB <span style={{ color: "var(--mg-green)", fontWeight: 700, fontSize: "0.85rem" }}>Atlas</span>
    </span>
  </div>
);
