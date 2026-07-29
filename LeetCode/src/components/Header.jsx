import React from "react";
import { Code2, Flame, User, Play, CheckCircle2 } from "lucide-react";
import { useLeetCode } from "../context/LeetCodeContext";

export const Header = () => {
  const { activeView, setActiveView, user } = useLeetCode();

  return (
    <header className="lc-header">
      {/* Left Logo & Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          onClick={() => setActiveView("problemset")}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        >
          <Code2 size={26} color="var(--lc-orange)" />
          <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
            LeetCode
          </span>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: "0.9rem", fontWeight: 600 }}>
          <span
            onClick={() => setActiveView("problemset")}
            style={{
              cursor: "pointer",
              color: activeView === "problemset" ? "white" : "var(--text-secondary)",
              fontWeight: activeView === "problemset" ? 800 : 600
            }}
          >
            Problems
          </span>
        </div>
      </div>

      {/* Right User Stats & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Streak Counter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            backgroundColor: "rgba(255, 161, 22, 0.15)",
            padding: "4px 10px",
            borderRadius: 16,
            color: "var(--lc-orange)",
            fontWeight: 800,
            fontSize: "0.85rem"
          }}
        >
          <Flame size={16} fill="var(--lc-orange)" />
          <span>{user.streakDays}</span>
        </div>

        {/* User Avatar */}
        <div
          onClick={() => setActiveView("profile")}
          style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", cursor: "pointer" }}
        >
          <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </header>
  );
};
