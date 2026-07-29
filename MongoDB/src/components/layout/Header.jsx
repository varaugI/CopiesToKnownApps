import React from "react";
import { Server, Database, Activity, CheckCircle, User } from "lucide-react";
import { useMongo } from "../../context/MongoContext";
import { MongoLogo } from "../common/MongoLogo";

export const Header = () => {
  const { setActiveView } = useMongo();

  return (
    <header className="mg-header">
      {/* Left Logo & Cluster Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div onClick={() => setActiveView("documents")}>
          <MongoLogo size={28} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "var(--mg-card)",
            border: "1px solid var(--mg-border)",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: "0.82rem",
            fontWeight: 700
          }}
        >
          <Server size={14} color="var(--mg-green)" />
          <span>Cluster0-Production</span>
        </div>
      </div>

      {/* Right Connection Status & User Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(0, 237, 100, 0.15)",
            color: "var(--mg-green)",
            padding: "4px 12px",
            borderRadius: 16,
            fontSize: "0.8rem",
            fontWeight: 800
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--mg-green)" }} />
          <span>Connected</span>
        </div>

        <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", cursor: "pointer" }}>
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
