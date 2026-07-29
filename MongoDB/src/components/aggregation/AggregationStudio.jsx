import React, { useState } from "react";
import { Layers, Plus, Play, ArrowRight } from "lucide-react";
import { useMongo } from "../../context/MongoContext";

export const AggregationStudio = () => {
  const { activeColl } = useMongo();

  const [stages, setStages] = useState([
    { id: "st_1", operator: "$match", value: '{ "status": "active" }' },
    { id: "st_2", operator: "$sort", value: '{ "age": -1 }' }
  ]);

  const addStage = () => {
    setStages((prev) => [
      ...prev,
      { id: "st_" + Date.now(), operator: "$limit", value: "5" }
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      <div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
          Aggregation Pipeline Studio
        </h1>
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: 4 }}>
          Build multi-stage data processing pipelines for collection: <strong style={{ color: "var(--mg-green)" }}>{activeColl.name}</strong>
        </p>
      </div>

      {/* Stages Pipeline List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {stages.map((st, idx) => (
          <div
            key={st.id}
            style={{
              backgroundColor: "var(--mg-panel)",
              border: "1px solid var(--mg-border)",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 16
            }}
          >
            <div style={{ fontWeight: 800, color: "var(--mg-green)", fontSize: "0.9rem" }}>
              Stage {idx + 1}
            </div>

            <select
              value={st.operator}
              onChange={(e) => {
                const val = e.target.value;
                setStages((prev) =>
                  prev.map((s) => (s.id === st.id ? { ...s, operator: val } : s))
                );
              }}
              style={{
                backgroundColor: "var(--mg-card)",
                color: "white",
                border: "1px solid var(--mg-border)",
                borderRadius: 6,
                padding: "6px 12px",
                fontWeight: 700,
                outline: "none"
              }}
            >
              <option value="$match">$match</option>
              <option value="$group">$group</option>
              <option value="$sort">$sort</option>
              <option value="$project">$project</option>
              <option value="$limit">$limit</option>
            </select>

            <input
              type="text"
              className="mongosh-input"
              value={st.value}
              onChange={(e) => {
                const val = e.target.value;
                setStages((prev) =>
                  prev.map((s) => (s.id === st.id ? { ...s, value: val } : s))
                );
              }}
              style={{
                flex: 1,
                backgroundColor: "var(--mg-canvas)",
                border: "1px solid var(--mg-border)",
                borderRadius: 6,
                padding: "6px 12px",
                color: "var(--mg-green)",
                fontSize: "0.9rem"
              }}
            />
          </div>
        ))}

        <button className="btn-mg-secondary" onClick={addStage} style={{ alignSelf: "flex-start" }}>
          <Plus size={16} />
          <span>Add Stage</span>
        </button>
      </div>

      {/* Output Results */}
      <div style={{ marginTop: 10 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 12 }}>Pipeline Output Preview</h3>
        <div className="bson-card">
          <pre style={{ color: "#00ed64" }}>
            {JSON.stringify(activeColl.documents, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
