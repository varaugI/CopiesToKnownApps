import React from "react";
import { Search, Plus, RotateCcw, Filter } from "lucide-react";
import { useMongo } from "../../context/MongoContext";

export const QueryBar = () => {
  const {
    queryFilter,
    setQueryFilter,
    activeColl,
    setIsEditModalOpen,
    setEditingDoc
  } = useMongo();

  const handleReset = () => {
    setQueryFilter("{}");
  };

  const handleOpenInsert = () => {
    setEditingDoc(null);
    setIsEditModalOpen(true);
  };

  return (
    <div
      style={{
        backgroundColor: "var(--mg-panel)",
        border: "1px solid var(--mg-border)",
        borderRadius: 8,
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
        <Filter size={16} color="var(--mg-green)" />
        <span>FILTER</span>
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: "var(--mg-canvas)",
          border: "1px solid var(--mg-border)",
          borderRadius: 6,
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          fontFamily: "'Fira Code', monospace"
        }}
      >
        <input
          type="text"
          value={queryFilter}
          onChange={(e) => setQueryFilter(e.target.value)}
          placeholder='{ "status": "active" }'
          style={{
            width: "100%",
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--mg-green)",
            fontSize: "0.9rem"
          }}
        />
      </div>

      <button className="btn-mg-green" onClick={() => {}}>
        <Search size={16} />
        <span>FIND</span>
      </button>

      <button className="btn-mg-secondary" onClick={handleReset}>
        <RotateCcw size={16} />
        <span>Reset</span>
      </button>

      <button className="btn-mg-green" onClick={handleOpenInsert} style={{ marginLeft: 10 }}>
        <Plus size={16} />
        <span>Insert Document</span>
      </button>
    </div>
  );
};
