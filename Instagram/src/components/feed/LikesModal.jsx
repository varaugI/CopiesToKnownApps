import React from "react";
import { X } from "lucide-react";
import { useUi } from "../../context/ui-context";

export const LikesModal = () => {
  const { activeLikesModalPost, setActiveLikesModalPost } = useUi();

  if (!activeLikesModalPost) return null;

  const usersList = activeLikesModalPost.likesPreview || [];

  return (
    <div className="modal-overlay" onClick={() => setActiveLikesModalPost(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-color)"
          }}
        >
          <div style={{ width: 24 }} />
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Likes</h3>
          <button
            onClick={() => setActiveLikesModalPost(null)}
            style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </header>

        <div style={{ maxHeight: 350, overflowY: "auto", padding: "8px 16px" }}>
          {usersList.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 20 }}>
              No likes yet
            </p>
          ) : (
            usersList.map((usr, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={usr.avatar}
                    alt={usr.username}
                    style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{usr.username}</div>
                  </div>
                </div>

                <button
                  style={{
                    backgroundColor: "var(--accent-blue)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Follow
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
