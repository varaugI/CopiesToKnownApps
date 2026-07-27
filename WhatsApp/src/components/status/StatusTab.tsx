import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useWhatsApp } from "../../context/WhatsAppContext";
import { StatusViewerModal } from "./StatusViewerModal";

export const StatusTab: React.FC = () => {
  const { statusStories, user, setActiveStatusGroup } = useWhatsApp();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Status</h2>

      {/* My Status Card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "8px 0",
          cursor: "pointer"
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "var(--wa-emerald)",
              color: "#111b21",
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--wa-dark-panel)"
            }}
          >
            <Plus size={14} strokeWidth={3} />
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>My Status</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Click to add status update
          </div>
        </div>
      </div>

      {/* Recent Updates Header */}
      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--wa-emerald)", textTransform: "uppercase" }}>
        Recent updates
      </div>

      {/* Stories List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {statusStories.map((group) => (
          <div
            key={group.id}
            onClick={() => {
              setActiveStatusGroup(group);
              navigate(`/status/${group.id}`);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer"
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                padding: 3,
                border: group.hasUnseen ? "2px solid var(--wa-emerald)" : "2px solid var(--wa-border)"
              }}
            >
              <img
                src={group.contact.avatar}
                alt={group.contact.name}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{group.contact.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {group.stories[0]?.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      <StatusViewerModal />
    </div>
  );
};
