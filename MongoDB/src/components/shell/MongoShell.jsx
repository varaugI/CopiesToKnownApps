import React, { useState } from "react";
import { Terminal, CornerDownLeft } from "lucide-react";
import { useMongo } from "../../context/MongoContext";

export const MongoShell = () => {
  const { databases, activeDb, activeColl } = useMongo();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([
    { cmd: "show dbs", output: "production_db   14.2 MB\nanalytics_db    48.6 MB" },
    { cmd: "use production_db", output: "switched to db production_db" },
    { cmd: "db.users.find()", output: JSON.stringify(activeColl.documents, null, 2) }
  ]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim();
    let out = "";

    if (cmd === "show dbs") {
      out = databases.map((d) => `${d.name}   ${d.size}`).join("\n");
    } else if (cmd === "show collections") {
      out = activeDb.collections.map((c) => c.name).join("\n");
    } else if (cmd.includes("find()")) {
      out = JSON.stringify(activeColl.documents, null, 2);
    } else if (cmd === "clear") {
      setHistory([]);
      setCommand("");
      return;
    } else {
      out = `[{ _id: ObjectId("${activeColl.documents[0]?._id}"), name: "${activeColl.documents[0]?.name}" }]`;
    }

    setHistory((prev) => [...prev, { cmd, output: out }]);
    setCommand("");
  };

  return (
    <div
      style={{
        backgroundColor: "#001219",
        border: "1px solid var(--mg-border)",
        borderRadius: 12,
        padding: 20,
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--mg-border)", paddingBottom: 12 }}>
        <Terminal size={20} color="var(--mg-green)" />
        <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>MongoDB Shell (mongosh v2.2.0)</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, fontFamily: "'Fira Code', monospace", fontSize: "0.9rem" }}>
        {history.map((h, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 8, color: "var(--mg-green)", fontWeight: 700 }}>
              <span>{activeDb.name}&gt;</span>
              <span style={{ color: "white" }}>{h.cmd}</span>
            </div>
            <pre style={{ color: "#9fb1ad", paddingLeft: 16, whiteSpace: "pre-wrap" }}>{h.output}</pre>
          </div>
        ))}
      </div>

      {/* Input prompt */}
      <form onSubmit={handleCommandSubmit} style={{ display: "flex", gap: 8, alignItems: "center", borderTop: "1px solid var(--mg-border)", paddingTop: 12 }}>
        <span style={{ color: "var(--mg-green)", fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>
          {activeDb.name}&gt;
        </span>
        <input
          type="text"
          className="mongosh-input"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type db.users.find() or show dbs..."
          style={{
            flex: 1,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "0.9rem"
          }}
        />
        <button type="submit" style={{ background: "none", border: "none", color: "var(--mg-green)", cursor: "pointer" }}>
          <CornerDownLeft size={18} />
        </button>
      </form>
    </div>
  );
};
