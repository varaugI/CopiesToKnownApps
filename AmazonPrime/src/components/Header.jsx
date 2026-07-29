import React from "react";
import { Search, User, Bookmark } from "lucide-react";
import { usePrime } from "../context/PrimeContext";

export const Header = () => {
  const { activeView, setActiveView } = usePrime();

  return (
    <header className="prime-header">
      {/* Logo & Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div
          onClick={() => setActiveView("home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "white" }}>
            prime video
          </span>
        </div>

        <nav style={{ display: "flex", gap: 24, fontSize: "0.95rem", fontWeight: 700 }}>
          {["home", "movies", "tv"].map((v) => (
            <span
              key={v}
              onClick={() => setActiveView(v)}
              style={{
                cursor: "pointer",
                color: activeView === v ? "white" : "var(--text-secondary)",
                textTransform: "capitalize",
                borderBottom: activeView === v ? "2px solid var(--prime-blue)" : "none",
                paddingBottom: 4
              }}
            >
              {v === "tv" ? "TV Shows" : v}
            </span>
          ))}

          <span
            onClick={() => setActiveView("mystuff")}
            style={{
              cursor: "pointer",
              color: activeView === "mystuff" ? "white" : "var(--text-secondary)",
              borderBottom: activeView === "mystuff" ? "2px solid var(--prime-blue)" : "none",
              paddingBottom: 4
            }}
          >
            My Stuff
          </span>
        </nav>
      </div>

      {/* Search & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: 20,
            padding: "6px 14px"
          }}
        >
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search Prime Video"
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "0.85rem",
              width: 140
            }}
          />
        </div>

        <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", cursor: "pointer" }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
            alt="User"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </header>
  );
};
