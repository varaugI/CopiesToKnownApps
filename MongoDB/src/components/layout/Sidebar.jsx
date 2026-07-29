import React from "react";
import { Database, Folder, FileText, Layers, Terminal, Key } from "lucide-react";
import { useMongo } from "../../context/MongoContext";

export const Sidebar = () => {
  const {
    activeView,
    setActiveView,
    databases,
    activeDb,
    activeColl,
    openCollection
  } = useMongo();

  return (
    <aside className="mg-sidebar">
      {/* Primary Navigation Shortcuts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16, borderBottom: "1px solid var(--mg-border)", paddingBottom: 12 }}>
        <div
          onClick={() => setActiveView("documents")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.88rem",
            backgroundColor: activeView === "documents" ? "var(--mg-card)" : "transparent",
            color: activeView === "documents" ? "var(--mg-green)" : "white"
          }}
        >
          <FileText size={18} />
          <span>Documents Explorer</span>
        </div>

        <div
          onClick={() => setActiveView("aggregation")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.88rem",
            backgroundColor: activeView === "aggregation" ? "var(--mg-card)" : "transparent",
            color: activeView === "aggregation" ? "var(--mg-green)" : "white"
          }}
        >
          <Layers size={18} />
          <span>Aggregation Studio</span>
        </div>

        <div
          onClick={() => setActiveView("shell")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.88rem",
            backgroundColor: activeView === "shell" ? "var(--mg-card)" : "transparent",
            color: activeView === "shell" ? "var(--mg-green)" : "white"
          }}
        >
          <Terminal size={18} />
          <span>Mongo Shell (mongosh)</span>
        </div>

        <div
          onClick={() => setActiveView("indexes")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.88rem",
            backgroundColor: activeView === "indexes" ? "var(--mg-card)" : "transparent",
            color: activeView === "indexes" ? "var(--mg-green)" : "white"
          }}
        >
          <Key size={18} />
          <span>Indexes Manager</span>
        </div>
      </div>

      {/* Databases & Collections Tree */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-secondary)", padding: "0 8px" }}>
          DATABASES & COLLECTIONS
        </div>

        {databases.map((db) => (
          <div key={db.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", fontSize: "0.88rem", fontWeight: 700, color: "white" }}>
              <Database size={16} color="var(--mg-green)" />
              <span>{db.name}</span>
            </div>

            <div style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 2 }}>
              {db.collections.map((coll) => (
                <div
                  key={coll.id}
                  onClick={() => openCollection(db.id, coll.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 8px",
                    borderRadius: 6,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    backgroundColor: activeColl?.id === coll.id ? "rgba(0,237,100,0.15)" : "transparent",
                    color: activeColl?.id === coll.id ? "var(--mg-green)" : "var(--text-secondary)",
                    fontWeight: activeColl?.id === coll.id ? 800 : 500
                  }}
                >
                  <Folder size={14} />
                  <span>{coll.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.72rem", opacity: 0.7 }}>
                    ({coll.documentsCount})
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
