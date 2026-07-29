import React from "react";
import { Trash2, Edit3, Database, Code, FileText } from "lucide-react";
import { useMongo } from "../../context/MongoContext";
import { QueryBar } from "./QueryBar";

export const DocumentViewer = () => {
  const {
    activeDb,
    activeColl,
    queryFilter,
    deleteDocument,
    setIsEditModalOpen,
    setEditingDoc
  } = useMongo();

  if (!activeColl) return null;

  // Simple MQL query filter evaluator
  const filteredDocuments = activeColl.documents.filter((doc) => {
    if (!queryFilter || queryFilter.trim() === "{}") return true;
    try {
      const filterObj = JSON.parse(queryFilter);
      return Object.keys(filterObj).every((key) => {
        return doc[key] === filterObj[key];
      });
    } catch (e) {
      return true;
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
            {activeDb.name} <span style={{ color: "var(--text-secondary)" }}>/</span> {activeColl.name}
          </h1>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Showing {filteredDocuments.length} of {activeColl.documentsCount} documents ({activeColl.size})
          </div>
        </div>
      </div>

      <QueryBar />

      {/* BSON Documents List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filteredDocuments.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", backgroundColor: "var(--mg-panel)", borderRadius: 8, border: "1px solid var(--mg-border)", color: "var(--text-secondary)" }}>
            No documents match the specified query filter.
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div key={doc._id} className="bson-card">
              {/* Document Header Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--mg-border)" }}>
                <span style={{ color: "var(--mg-green)", fontWeight: 700, fontSize: "0.85rem" }}>
                  _id: ObjectId("{doc._id}")
                </span>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      setEditingDoc(doc);
                      setIsEditModalOpen(true);
                    }}
                    style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                    title="Edit document"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    onClick={() => deleteDocument(doc._id)}
                    style={{ background: "none", border: "none", color: "#ff2d55", cursor: "pointer" }}
                    title="Delete document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* JSON/BSON Field Keys & Values */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Object.entries(doc).map(([key, val]) => (
                  <div key={key} style={{ display: "flex", gap: 10, fontSize: "0.88rem" }}>
                    <span style={{ color: "#9fb1ad", width: 120 }}>{key}:</span>
                    <span style={{ color: typeof val === "string" ? "#00ed64" : typeof val === "number" ? "#00c49f" : "#ff8042" }}>
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
