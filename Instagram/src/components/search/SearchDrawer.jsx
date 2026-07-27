import React, { useState } from "react";
import { X, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMessaging } from "../../context/messaging-context";
import { useUi } from "../../context/ui-context";

export const SearchDrawer = () => {
  const { isSearchDrawerOpen, setIsSearchDrawerOpen } = useUi();
  const { chats } = useMessaging();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isSearchDrawerOpen) return null;

  const users = chats.map((chat) => ({ ...chat.user, conversationId: chat.id }));
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: "var(--sidebar-width)",
        bottom: 0,
        width: 380,
        backgroundColor: "var(--bg-primary)",
        borderRight: "1px solid var(--border-color)",
        zIndex: 90,
        padding: "24px 16px",
        boxShadow: "var(--shadow-lg)",
        animation: "fadeIn 0.2s ease-out"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Search</h2>
        <button
          onClick={() => setIsSearchDrawerOpen(false)}
          style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "8px",
          padding: "10px 14px",
          marginBottom: 20
        }}
      >
        <SearchIcon size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            width: "100%",
            fontSize: "0.9rem"
          }}
        />
        {searchQuery && (
          <X
            size={16}
            color="var(--text-muted)"
            style={{ cursor: "pointer" }}
            onClick={() => setSearchQuery("")}
          />
        )}
      </div>

      {/* Results / History */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Recent</span>
          {searchQuery === "" && (
            <span style={{ fontSize: "0.8rem", color: "var(--accent-blue)", cursor: "pointer", fontWeight: 600 }}>
              Clear all
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setIsSearchDrawerOpen(false);
                navigate(`/direct/${u.conversationId}`);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px"
              }}
            >
              <img
                src={u.avatar}
                alt={u.username}
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{u.username}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{u.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
