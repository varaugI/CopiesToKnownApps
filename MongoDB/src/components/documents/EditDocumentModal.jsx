import React, { useState, useEffect } from "react";
import { X, FileText, Check } from "lucide-react";
import { useMongo } from "../../context/MongoContext";

export const EditDocumentModal = () => {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    editingDoc,
    insertDocument,
    activeColl
  } = useMongo();

  const [jsonText, setJsonText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingDoc) {
      setJsonText(JSON.stringify(editingDoc, null, 2));
    } else {
      setJsonText(
        JSON.stringify(
          activeColl?.name === "users"
            ? { name: "New User", email: "user@example.com", role: "user", status: "active" }
            : { name: "New Product", price: 99.99, category: "Electronics", inStock: true },
          null,
          2
        )
      );
    }
  }, [editingDoc, activeColl]);

  if (!isEditModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const parsed = JSON.parse(jsonText);
      insertDocument(parsed);
      setIsEditModalOpen(false);
    } catch (err) {
      setErrorMsg("Invalid JSON syntax: " + err.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={() => setIsEditModalOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          backgroundColor: "var(--mg-panel)",
          borderRadius: 12,
          border: "1px solid var(--mg-border)",
          padding: 24,
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={20} color="var(--mg-green)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
              {editingDoc ? "Edit Document" : "Insert Document"}
            </h3>
          </div>
          <button
            onClick={() => setIsEditModalOpen(false)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {errorMsg && (
            <div style={{ backgroundColor: "rgba(255, 45, 85, 0.2)", color: "#ff2d55", border: "1px solid #ff2d55", padding: "8px 12px", borderRadius: 6, fontSize: "0.85rem" }}>
              {errorMsg}
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, display: "block" }}>
              BSON Document JSON *
            </label>
            <textarea
              className="mongosh-input"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              style={{
                width: "100%",
                height: 220,
                backgroundColor: "var(--mg-canvas)",
                border: "1px solid var(--mg-border)",
                borderRadius: 8,
                padding: 12,
                color: "var(--mg-green)",
                fontSize: "0.9rem",
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              style={{ background: "none", border: "none", color: "white", fontWeight: 700, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-mg-green">
              <span>Insert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
