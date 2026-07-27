import React from "react";
import { X } from "lucide-react";
import { useNotifications } from "../../context/notifications-context";
import { useUi } from "../../context/ui-context";

export const NotificationsDrawer = () => {
  const { isNotificationsDrawerOpen, setIsNotificationsDrawerOpen } = useUi();
  const { notifications, markAllNotificationsRead } = useNotifications();

  if (!isNotificationsDrawerOpen) return null;

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
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Notifications</h2>
        <button
          onClick={() => {
            markAllNotificationsRead();
            setIsNotificationsDrawerOpen(false);
          }}
          style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", height: "calc(100vh - 100px)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Today</div>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "6px 0"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
              <img
                src={n.user.avatar}
                alt={n.user.username}
                style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ fontSize: "0.85rem", lineHeight: 1.3 }}>
                <strong style={{ marginRight: 4 }}>{n.user.username}</strong>
                <span>{n.content}</span>
                <span style={{ color: "var(--text-muted)", marginLeft: 6, fontSize: "0.75rem" }}>
                  {n.timestamp}
                </span>
              </div>
            </div>

            {n.type === "follow" ? (
              <button
                style={{
                  backgroundColor: n.isFollowing ? "var(--bg-elevated)" : "var(--accent-blue)",
                  color: n.isFollowing ? "var(--text-primary)" : "white",
                  border: n.isFollowing ? "1px solid var(--border-color)" : "none",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                {n.isFollowing ? "Following" : "Follow"}
              </button>
            ) : n.postPreview ? (
              <img
                src={n.postPreview}
                alt="Post preview"
                style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
