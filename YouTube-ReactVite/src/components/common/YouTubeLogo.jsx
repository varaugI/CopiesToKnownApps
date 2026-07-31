import React from "react";

export const YouTubeLogo = ({ size = 24 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
    <svg width={size * 1.4} height={size} viewBox="0 0 90 20" fill="none">
      <path
        d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12324 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12324 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.57 14.6496 28.57 10 28.57 10C28.57 10 28.57 5.35042 27.9727 3.12324Z"
        fill="#FF0000"
      />
      <path d="M11.4285 14.2857L18.8571 10L11.4285 5.71429V14.2857Z" fill="WHITE" />
    </svg>
    <span
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "1.25rem",
        fontWeight: 800,
        letterSpacing: "-0.8px",
        color: "var(--text-primary)"
      }}
    >
      YouTube
    </span>
  </div>
);
