import React from "react";
import { Key, Plus, ShieldCheck } from "lucide-react";
import { useMongo } from "../../context/MongoContext";

export const IndexManager = () => {
  const { activeColl } = useMongo();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
            Index Manager - {activeColl.name}
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: 4 }}>
            Indexes improve the speed of document search and query execution.
          </p>
        </div>

        <button className="btn-mg-green">
          <Plus size={16} />
          <span>Create Index</span>
        </button>
      </div>

      {/* Indexes Table */}
      <div
        style={{
          border: "1px solid var(--mg-border)",
          borderRadius: 8,
          backgroundColor: "var(--mg-panel)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 100px 100px",
            padding: "12px 20px",
            borderBottom: "1px solid var(--mg-border)",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--text-secondary)"
          }}
        >
          <span>Index Name</span>
          <span>Fields Spec</span>
          <span>Unique</span>
          <span>Type</span>
        </div>

        {activeColl.indexes?.map((idx) => (
          <div
            key={idx.name}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 100px 100px",
              padding: "16px 20px",
              borderBottom: "1px solid var(--mg-border)",
              alignItems: "center",
              fontSize: "0.9rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--mg-green)" }}>
              <Key size={16} />
              <span>{idx.name}</span>
            </div>

            <code style={{ color: "#9fb1ad" }}>{idx.fields}</code>

            <span>{idx.unique ? "Yes" : "No"}</span>

            <span style={{ fontSize: "0.8rem", backgroundColor: "var(--mg-card)", padding: "2px 8px", borderRadius: 4, width: "fit-content" }}>
              {idx.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
