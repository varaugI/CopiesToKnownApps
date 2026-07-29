import React from "react";
import { Flame, Trophy, CheckCircle, Code } from "lucide-react";
import { useLeetCode } from "../context/LeetCodeContext";

export const Profile = () => {
  const { user, problems, openWorkspace } = useLeetCode();

  const solvedProblems = problems.filter((p) => p.status === "Solved");

  return (
    <div style={{ maxWidth: 1000, width: "100%", margin: "0 auto", padding: "30px 20px" }}>
      {/* Profile Header */}
      <div
        style={{
          backgroundColor: "var(--lc-card)",
          borderRadius: 16,
          border: "1px solid var(--lc-border)",
          padding: 24,
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 24
        }}
      >
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
        />

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{user.name}</h1>
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 2 }}>
            @{user.username} • Global Rank ~{user.rank.toLocaleString()}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, backgroundColor: "rgba(255,161,22,0.15)", padding: "8px 16px", borderRadius: 20, color: "var(--lc-orange)", fontWeight: 800 }}>
          <Flame size={20} fill="var(--lc-orange)" />
          <span>{user.streakDays} Day Streak</span>
        </div>
      </div>

      {/* Solved Problems Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ backgroundColor: "var(--lc-card)", borderRadius: 12, border: "1px solid var(--lc-border)", padding: 20 }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--lc-green)", marginBottom: 8 }}>EASY</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{user.solvedEasy} <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>/ {user.totalEasy}</span></div>
        </div>

        <div style={{ backgroundColor: "var(--lc-card)", borderRadius: 12, border: "1px solid var(--lc-border)", padding: 20 }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--lc-yellow)", marginBottom: 8 }}>MEDIUM</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{user.solvedMedium} <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>/ {user.totalMedium}</span></div>
        </div>

        <div style={{ backgroundColor: "var(--lc-card)", borderRadius: 12, border: "1px solid var(--lc-border)", padding: 20 }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--lc-red)", marginBottom: 8 }}>HARD</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{user.solvedHard} <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>/ {user.totalHard}</span></div>
        </div>
      </div>
    </div>
  );
};
