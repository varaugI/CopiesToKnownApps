import React from "react";
import { Play } from "lucide-react";
import { usePrime } from "../context/PrimeContext";

export const ContentRows = () => {
  const { contentRows, playVideo } = usePrime();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "40px 60px" }}>
      {contentRows.map((row, rIdx) => (
        <div key={rIdx} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "white" }}>
            {row.categoryTitle}
          </h2>

          <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 10 }}>
            {row.items.map((item) => (
              <div
                key={item.id}
                onClick={() => playVideo(item)}
                style={{
                  minWidth: 240,
                  width: 240,
                  aspectRatio: "16 / 9",
                  borderRadius: 10,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  backgroundColor: "var(--prime-card)"
                }}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  <Play size={40} fill="white" color="white" />
                </div>

                {item.isPrime && (
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "rgba(0, 168, 225, 0.9)",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 900,
                      padding: "2px 6px",
                      borderRadius: 4
                    }}
                  >
                    PRIME
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
